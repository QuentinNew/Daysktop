import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntriesService } from '../entries.service';

@Component({
  selector: 'app-entries-list',
  imports: [DatePipe],
  templateUrl: './entries-list.html',
  styleUrl: './entries-list.scss',
})
export class EntriesList {
  private readonly entriesService = inject(EntriesService);

  protected readonly entries = toSignal(this.entriesService.list(), { initialValue: [] });
}
