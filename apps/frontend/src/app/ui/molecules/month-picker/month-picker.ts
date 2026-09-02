import { Component, computed, input, output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { Button } from '../../atoms/button/button';
import { Icon } from '../../atoms/icon/icon';
import { TextTile } from '../../layout/text-tile/text-tile';

@Component({
  selector: 'app-month-picker',
  imports: [Button, Icon, TextTile, MatMenuModule],
  templateUrl: './month-picker.html',
  styleUrl: './month-picker.scss',
})
export class MonthPicker {
  readonly date = input.required<Date>();
  readonly earliest = input.required<Date>();
  readonly latest = input.required<Date>();
  readonly dateChange = output<Date>();

  protected readonly label = computed(() => this.formatMonth(this.date()));

  protected readonly isAtEarliest = computed(() => this.isSameMonth(this.date(), this.earliest()));
  protected readonly isAtLatest = computed(() => this.isSameMonth(this.date(), this.latest()));

  protected readonly monthOptions = computed(() => {
    const earliest = this.earliest();
    const latest = this.latest();
    const options: { value: Date; label: string }[] = [];

    let year = earliest.getFullYear();
    let month = earliest.getMonth();
    const endYear = latest.getFullYear();
    const endMonth = latest.getMonth();

    while (year < endYear || (year === endYear && month <= endMonth)) {
      const value = new Date(year, month, 1);
      options.push({ value, label: this.formatMonth(value) });

      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }

    return options.reverse();
  });

  protected previousMonth(): void {
    this.dateChange.emit(this.shiftMonth(-1));
  }

  protected nextMonth(): void {
    this.dateChange.emit(this.shiftMonth(1));
  }

  protected selectMonth(date: Date): void {
    this.dateChange.emit(date);
  }

  private shiftMonth(delta: number): Date {
    const current = this.date();
    return new Date(current.getFullYear(), current.getMonth() + delta, 1);
  }

  private isSameMonth(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
  }

  private formatMonth(date: Date): string {
    return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
  }
}
