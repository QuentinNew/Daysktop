import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MoodsService } from '../../moods/moods.service';
import { Mood } from '../../entries/entry.model';
import { MOOD_GROUP_FACES } from '../../entries/entry-view-model';
import { MoodFace, Mood as MoodAtom } from '../../ui/atoms/mood/mood';
import { Tile } from '../../ui/layout/tile/tile';
import { TileWithTitle } from '../../ui/layout/tile-with-title/tile-with-title';
import { TextField } from '../../ui/atoms/text-field/text-field';
import { ColorPicker } from '../../ui/atoms/color-picker/color-picker';
import { Button } from '../../ui/atoms/button/button';
import { PageMenubar } from '../../shared/page-menubar/page-menubar';

@Component({
  selector: 'app-activities-page',
  imports: [PageMenubar, TileWithTitle, Tile, MoodAtom, TextField, ColorPicker, Button],
  templateUrl: './activities-page.html',
  styleUrl: './activities-page.scss',
})
export class ActivitiesPage {
  private readonly moodsService = inject(MoodsService);

  protected readonly moods = toSignal(this.moodsService.list(), { initialValue: [] });

  private readonly selectedMoodId = signal<number | null>(null);
  private readonly editedColor = signal<string | null>(null);
  private readonly savedColors = signal<ReadonlyMap<number, string>>(new Map());

  protected readonly isSaving = signal(false);

  protected readonly selectedMood = computed<Mood | null>(() => {
    const moods = this.moods();
    const id = this.selectedMoodId();
    return moods.find((mood) => mood.id === id) ?? moods[0] ?? null;
  });

  protected readonly selectedMoodColor = computed(() => {
    const mood = this.selectedMood();
    if (!mood) {
      return '#000000';
    }
    return this.editedColor() ?? this.savedColors().get(mood.id) ?? mood.color ?? '#000000';
  });

  protected moodFace(mood: Mood): MoodFace {
    return MOOD_GROUP_FACES[mood.moodGroupId];
  }

  protected moodColor(mood: Mood): string {
    return this.savedColors().get(mood.id) ?? mood.color ?? 'var(--mat-sys-primary)';
  }

  protected selectMood(mood: Mood): void {
    this.selectedMoodId.set(mood.id);
    this.editedColor.set(null);
  }

  protected onColorChange(color: string): void {
    this.editedColor.set(color);
  }

  protected resetEdits(): void {
    this.editedColor.set(null);
  }

  protected save(): void {
    const mood = this.selectedMood();
    const color = this.editedColor();
    if (!mood || color === null) {
      return;
    }

    this.isSaving.set(true);
    this.moodsService.update(mood.id, { color }).subscribe({
      next: () => {
        this.savedColors.update((map) => new Map(map).set(mood.id, color));
        this.editedColor.set(null);
        this.isSaving.set(false);
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }
}
