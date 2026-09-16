import { Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { Activity } from '../../molecules/activity/activity';
import { ScrollBar } from '../../atoms/scroll-bar/scroll-bar';
import { ActivityIconName } from '../../atoms/icon/icon';

export interface ActivityPickerActivity {
  id: number;
  name: string;
  icon: ActivityIconName;
}

export interface ActivityPickerGroup {
  name: string;
  activities: ActivityPickerActivity[];
}

@Component({
  selector: 'app-activity-picker',
  imports: [Activity, ScrollBar],
  templateUrl: './activity-picker.html',
  styleUrl: './activity-picker.scss',
})
export class ActivityPicker {
  readonly groups = input.required<ActivityPickerGroup[]>();
  readonly selected = input<number[]>([]);
  readonly multiple = input(false);
  readonly maxHeight = input('calc(100vh - 240px)');

  readonly toggle = output<number>();

  protected readonly selectedIds = computed(() => new Set(this.selected()));

  protected readonly scrollProgress = signal(0);
  private readonly container = viewChild<ElementRef<HTMLDivElement>>('container');

  protected isSelected(activityId: number): boolean {
    return this.selectedIds().has(activityId);
  }

  protected onScroll(event: Event): void {
    const el = event.target as HTMLDivElement;
    const maxScroll = el.scrollHeight - el.clientHeight;
    this.scrollProgress.set(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
  }

  protected onScrollBarChange(progress: number): void {
    const el = this.container()?.nativeElement;
    if (!el) {
      return;
    }
    el.scrollTop = progress * (el.scrollHeight - el.clientHeight);
    this.scrollProgress.set(progress);
  }
}
