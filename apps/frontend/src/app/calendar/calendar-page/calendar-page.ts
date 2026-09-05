import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Subject, startWith, switchMap } from 'rxjs';
import { EntriesService } from '../../entries/entries.service';
import { toEntryViewModel } from '../../entries/entry-view-model';
import { Entry as EntryOrganism } from '../../ui/organisms/entry/entry';
import { Calendar, CalendarEntry } from '../../ui/organisms/calendar/calendar';
import { PageMenubar } from '../../shared/page-menubar/page-menubar';
import { SearchBar } from '../../ui/atoms/search-bar/search-bar';
import { TextTile } from '../../ui/layout/text-tile/text-tile';
import { MediaCard } from '../../ui/atoms/media-card/media-card';
import { Tabs } from '../../ui/atoms/tabs/tabs';
import { Button } from '../../ui/atoms/button/button';
import { Icon } from '../../ui/atoms/icon/icon';
import { MediaService } from '../../media/media.service';
import { Media } from '../../media/media.model';
import { MediaPickerDialog } from '../../media/media-picker-dialog/media-picker-dialog';

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

@Component({
  selector: 'app-calendar-page',
  imports: [EntryOrganism, Calendar, PageMenubar, SearchBar, TextTile, MediaCard, Tabs, Button, Icon],
  templateUrl: './calendar-page.html',
  styleUrl: './calendar-page.scss',
})
export class CalendarPage {
  protected readonly mediaTabs = ['Medias', 'Search', 'ChatAI'];
  protected readonly selectedMediaTab = signal(0);

  private readonly dialog = inject(MatDialog);
  private readonly mediaService = inject(MediaService);
  private readonly mediaRefresh$ = new Subject<void>();
  private readonly media = toSignal(
    this.mediaRefresh$.pipe(
      startWith(undefined),
      switchMap(() => this.mediaService.list()),
    ),
    { initialValue: [] },
  );

  protected readonly mediaGridItems = computed(() => {
    const date = this.calendarDate();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return this.media().filter((item) => item.months.some((m) => m.year === year && m.month === month));
  });

  protected readonly mediaEditMode = signal(false);

  protected toggleMediaEditMode(): void {
    this.mediaEditMode.update((editMode) => !editMode);
  }

  protected removeMediaFromMonth(media: Media): void {
    const date = this.calendarDate();
    this.mediaService
      .unassignMonth(media.id, date.getFullYear(), date.getMonth() + 1)
      .subscribe(() => this.mediaRefresh$.next());
  }

  protected openMediaPicker(): void {
    const date = this.calendarDate();
    const dialogRef = this.dialog.open(MediaPickerDialog, {
      data: { year: date.getFullYear(), month: date.getMonth() + 1 },
      panelClass: 'media-picker-dialog-panel',
      width: '1000px',
      maxWidth: '95vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.mediaRefresh$.next();
      }
    });
  }

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
    return withMood.reduce((latest, entry) =>
      entry.localDate > latest.localDate ? entry : latest,
    );
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
