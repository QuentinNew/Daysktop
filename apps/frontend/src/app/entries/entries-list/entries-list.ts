import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntriesService } from '../entries.service';
import { Entry as EntryOrganism } from '../../ui/organisms/entry/entry';
import { toEntryViewModel } from '../entry-view-model';

@Component({
  selector: 'app-entries-list',
  imports: [EntryOrganism],
  templateUrl: './entries-list.html',
  styleUrl: './entries-list.scss',
})
export class EntriesList {
  private readonly entriesService = inject(EntriesService);

  protected readonly entries = toSignal(this.entriesService.list(), { initialValue: [] });
  protected readonly entryViewModels = computed(() => this.entries().map(toEntryViewModel));
}
