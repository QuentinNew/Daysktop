import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EntriesService } from '../../entries/entries.service';
import { toEntryViewModel } from '../../entries/entry-view-model';
import { Entry as EntryOrganism } from '../../ui/organisms/entry/entry';
import { Calendar, CalendarEntry } from '../../ui/organisms/calendar/calendar';
import { PageMenubar } from '../../shared/page-menubar/page-menubar';

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

@Component({
  selector: 'app-calendar-page',
  imports: [EntryOrganism, Calendar, PageMenubar],
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.scss',
})
export class CalendarPage {
  private readonly entriesService = inject(EntriesService);

  private readonly entries = toSignal(this.entriesService.list(), { initialValue: [] });

  protected readonly calendarEntries = computed<CalendarEntry[]>(() =>
    this.entries()
      .filter((entry) => entry.mood !== null)
      .map(toEntryViewModel)
      .map((viewModel) => ({
        date: viewModel.date,
        moodFace: viewModel.moodFace,
        moodColor: viewModel.moodColor,
      })),
  );

  private readonly latestEntryWithMood = computed(() => {
    const withMood = this.entries().filter((entry) => entry.mood !== null);
    if (withMood.length === 0) {
      return null;
    }
    return withMood.reduce((latest, entry) => (entry.localDate > latest.localDate ? entry : latest));
  });

  private readonly selectedDate = signal<Date | null>(null);

  protected readonly selectedEntry = computed(() => {
    const explicitDate = this.selectedDate();
    if (explicitDate) {
      const entry = this.entries().find(
        (entry) => entry.mood !== null && isSameDay(toEntryViewModel(entry).date, explicitDate),
      );
      return entry ? toEntryViewModel(entry) : null;
    }

    const latest = this.latestEntryWithMood();
    return latest ? toEntryViewModel(latest) : null;
  });

  private readonly displayedMonth = signal<Date | null>(null);

  protected readonly calendarDate = computed(
    () => this.displayedMonth() ?? this.selectedEntry()?.date ?? new Date(),
  );

  protected readonly earliest = computed(() => {
    const dates = this.calendarEntries().map((entry) => entry.date);
    return dates.length === 0 ? new Date() : dates.reduce((min, date) => (date < min ? date : min));
  });

  protected readonly latest = computed(() => {
    const dates = this.calendarEntries().map((entry) => entry.date);
    return dates.length === 0 ? new Date() : dates.reduce((max, date) => (date > max ? date : max));
  });

  protected selectDay(date: Date): void {
    this.selectedDate.set(date);
  }

  protected changeMonth(date: Date): void {
    this.displayedMonth.set(date);
  }
}
