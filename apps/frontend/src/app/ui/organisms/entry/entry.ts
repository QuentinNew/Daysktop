import { Component, ElementRef, computed, effect, input, signal, viewChild } from '@angular/core';
import { TextTile } from '../../layout/text-tile/text-tile';
import { Mood, MoodFace } from '../../atoms/mood/mood';
import { ActivityIconName } from '../../atoms/icon/icon';
import { ActivityLabel } from '../../molecules/activity-label/activity-label';
import { ScrollBar } from '../../atoms/scroll-bar/scroll-bar';

export interface EntryActivity {
  label: string;
  icon: ActivityIconName;
}

@Component({
  selector: 'app-entry',
  imports: [TextTile, Mood, ActivityLabel, ScrollBar],
  templateUrl: './entry.html',
  styleUrl: './entry.scss',
})
export class Entry {
  readonly date = input.required<Date>();
  readonly width = input(320);
  readonly moodFace = input.required<MoodFace>();
  readonly moodColor = input('var(--mat-sys-primary)');
  readonly moodName = input.required<string>();
  readonly activities = input<EntryActivity[]>([]);
  readonly note = input('');

  protected readonly formattedDate = computed(() =>
    new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(
      this.date(),
    ),
  );

  protected readonly noteScrollProgress = signal(0);
  protected readonly noteOverflows = signal(false);
  private readonly noteContainer = viewChild<ElementRef<HTMLElement>>('noteContainer');

  constructor() {
    effect((onCleanup) => {
      this.note();
      const el = this.noteContainer()?.nativeElement;
      if (!el) {
        this.noteOverflows.set(false);
        return;
      }

      const update = () => this.noteOverflows.set(el.scrollHeight > el.clientHeight);
      update();

      const observer = new ResizeObserver(update);
      observer.observe(el);
      onCleanup(() => observer.disconnect());
    });
  }

  protected onNoteScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const maxScroll = el.scrollHeight - el.clientHeight;
    this.noteScrollProgress.set(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
  }

  protected onNoteScrollBarChange(progress: number): void {
    const el = this.noteContainer()?.nativeElement;
    if (!el) {
      return;
    }
    el.scrollTop = progress * (el.scrollHeight - el.clientHeight);
    this.noteScrollProgress.set(progress);
  }
}
