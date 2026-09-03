import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntriesService } from '../entries.service';
import { Entry as EntryOrganism } from '../../ui/organisms/entry/entry';
import { toEntryViewModel } from '../entry-view-model';
import { PageMenubar } from '../../shared/page-menubar/page-menubar';

const BATCH_SIZE = 20;

@Component({
  selector: 'app-entries-list',
  imports: [EntryOrganism, PageMenubar],
  templateUrl: './entries-list.html',
  styleUrl: './entries-list.scss',
})
export class EntriesList {
  private readonly entriesService = inject(EntriesService);

  protected readonly entries = toSignal(this.entriesService.list(), { initialValue: [] });
  protected readonly entryViewModels = computed(() => this.entries().map(toEntryViewModel));

  private readonly visibleCount = signal(BATCH_SIZE);
  protected readonly visibleEntries = computed(() => this.entryViewModels().slice(0, this.visibleCount()));

  private readonly sentinel = viewChild<ElementRef<HTMLElement>>('sentinel');

  constructor() {
    effect((onCleanup) => {
      const element = this.sentinel()?.nativeElement;
      if (!element) {
        return;
      }

      const observer = new IntersectionObserver((observerEntries) => {
        if (observerEntries[0]?.isIntersecting && this.visibleCount() < this.entryViewModels().length) {
          this.visibleCount.update((count) => count + BATCH_SIZE);
        }
      });
      observer.observe(element);
      onCleanup(() => observer.disconnect());
    });
  }
}
