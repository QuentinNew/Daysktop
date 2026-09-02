import { Component, computed, input, output } from '@angular/core';
import { MonthPicker } from '../../molecules/month-picker/month-picker';
import { MoodButton } from '../../molecules/mood-button/mood-button';
import { TextTile } from '../../layout/text-tile/text-tile';
import { MoodFace } from '../../atoms/mood/mood';

export interface CalendarEntry {
  date: Date;
  moodFace: MoodFace;
  moodColor: string;
}

interface DayCell {
  date: Date;
  day: number;
  entry: CalendarEntry | null;
}

const DAYS_PER_WEEK = 7;
const WEEKS_PER_GRID = 6;

@Component({
  selector: 'app-calendar',
  imports: [MonthPicker, MoodButton, TextTile],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  readonly date = input.required<Date>();
  readonly earliest = input.required<Date>();
  readonly latest = input.required<Date>();
  readonly entries = input<CalendarEntry[]>([]);
  readonly width = input(420);

  readonly dateChange = output<Date>();
  readonly daySelect = output<Date>();

  protected readonly weekdayLabels = computed(() => {
    const monday = new Date(2024, 0, 1);
    const formatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });

    return Array.from({ length: DAYS_PER_WEEK }, (_, i) => {
      const day = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
      const label = formatter.format(day);
      return label.charAt(0).toUpperCase() + label.slice(1);
    });
  });

  protected readonly weeks = computed(() => {
    const current = this.date();
    const year = current.getFullYear();
    const month = current.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7;

    const cells: (DayCell | null)[] = Array(leadingBlanks).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(year, month, day);
      const entry = this.entries().find((e) => this.isSameDay(e.date, cellDate)) ?? null;
      cells.push({ date: cellDate, day, entry });
    }

    while (cells.length < DAYS_PER_WEEK * WEEKS_PER_GRID) {
      cells.push(null);
    }

    const weeks: (DayCell | null)[][] = [];
    for (let i = 0; i < WEEKS_PER_GRID; i++) {
      weeks.push(cells.slice(i * DAYS_PER_WEEK, (i + 1) * DAYS_PER_WEEK));
    }

    return weeks;
  });

  protected selectDay(date: Date): void {
    this.daySelect.emit(date);
  }

  private isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
}
