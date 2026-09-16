import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { EntriesService } from '../entries.service';
import { Entry as EntryOrganism } from '../../ui/organisms/entry/entry';
import { toEntryViewModel } from '../entry-view-model';

const BATCH_SIZE = 20;

@Component({
  selector: 'app-entries-list',
  imports: [EntryOrganism],
  templateUrl: './entries-list.html',
  styleUrl: './entries-list.scss',
})
export class EntriesList {
  private readonly entriesService = inject(EntriesService);
  private readonly route = inject(ActivatedRoute);

  protected readonly entries = toSignal(
    this.route.queryParamMap.pipe(
      switchMap((params) => {
        const keyword = params.get('keyword') ?? undefined;
        const activitiesParam = params.get('activities');
        const activityIds = activitiesParam
          ? activitiesParam.split(',').map((id) => Number(id))
          : undefined;
        return keyword || activityIds ? this.entriesService.search({ keyword, activityIds }) : this.entriesService.list();
      }),
    ),
    { initialValue: [] },
  );
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
