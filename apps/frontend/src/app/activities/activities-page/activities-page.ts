import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
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
import { Activity } from '../../ui/molecules/activity/activity';
import { ScrollBar } from '../../ui/atoms/scroll-bar/scroll-bar';
import { ActivitiesService, ActivityWithGroup } from '../activities.service';
import { ACTIVITY_ICON_NAMES, ActivityIconName, Icon } from '../../ui/atoms/icon/icon';
import { resolveActivityIcon } from '../daylio-icon-map';
import { Notification, NotificationVariant } from '../../ui/organisms/notification/notification';

interface ActivityGroupViewModel {
  name: string;
  activities: { id: number; name: string; icon: string | null }[];
}

interface EditNotification {
  variant: NotificationVariant;
  title: string;
}

@Component({
  selector: 'app-activities-page',
  imports: [
    PageMenubar,
    TileWithTitle,
    Tile,
    MoodAtom,
    TextField,
    ColorPicker,
    Button,
    Activity,
    ScrollBar,
    Icon,
    Notification,
  ],
  templateUrl: './activities-page.html',
  styleUrl: './activities-page.scss',
})
export class ActivitiesPage {
  private readonly moodsService = inject(MoodsService);
  private readonly activitiesService = inject(ActivitiesService);

  protected readonly activitiesScrollProgress = signal(0);
  private readonly activitiesContainer = viewChild<ElementRef<HTMLDivElement>>('activitiesContainer');

  protected readonly activityIconsScrollProgress = signal(0);
  private readonly activityIconsContainer = viewChild<ElementRef<HTMLDivElement>>('activityIconsContainer');

  protected readonly moods = toSignal(this.moodsService.list(), { initialValue: [] });

  private readonly activities = toSignal(this.activitiesService.list(), { initialValue: [] });

  protected readonly activityGroups = computed<ActivityGroupViewModel[]>(() => {
    const groups: ActivityGroupViewModel[] = [];
    const groupsById = new Map<number, ActivityGroupViewModel>();

    for (const activity of this.activities()) {
      let group = groupsById.get(activity.group.id);
      if (!group) {
        group = { name: activity.group.name, activities: [] };
        groupsById.set(activity.group.id, group);
        groups.push(group);
      }
      group.activities.push({ id: activity.id, name: activity.name, icon: activity.icon });
    }

    return groups;
  });

  private readonly selectedMoodId = signal<number | null>(null);
  private readonly editedColor = signal<string | null>(null);
  private readonly savedColors = signal<ReadonlyMap<number, string>>(new Map());
  private readonly editedMoodName = signal<string | null>(null);
  private readonly savedMoodNames = signal<ReadonlyMap<number, string>>(new Map());

  private readonly selectedActivityId = signal<number | null>(null);
  private readonly editedIcon = signal<ActivityIconName | null>(null);
  private readonly savedIcons = signal<ReadonlyMap<number, ActivityIconName>>(new Map());
  private readonly editedName = signal<string | null>(null);
  private readonly savedNames = signal<ReadonlyMap<number, string>>(new Map());

  protected readonly isSaving = signal(false);
  protected readonly isSavingActivity = signal(false);
  protected readonly editNotification = signal<EditNotification | null>(null);

  protected readonly activityIconChoices = ACTIVITY_ICON_NAMES;

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

  protected readonly selectedMoodName = computed(() => {
    const mood = this.selectedMood();
    if (!mood) {
      return '';
    }
    return this.editedMoodName() ?? this.savedMoodNames().get(mood.id) ?? mood.name;
  });

  protected readonly selectedActivity = computed<ActivityWithGroup | null>(() => {
    const activities = this.activities();
    const id = this.selectedActivityId();
    return activities.find((activity) => activity.id === id) ?? null;
  });

  protected readonly selectedActivityIcon = computed<ActivityIconName>(() => {
    const activity = this.selectedActivity();
    if (!activity) {
      return this.activityIconChoices[0];
    }
    return (
      this.editedIcon() ??
      this.savedIcons().get(activity.id) ??
      resolveActivityIcon(activity.icon)
    );
  });

  protected readonly selectedActivityName = computed(() => {
    const activity = this.selectedActivity();
    if (!activity) {
      return '';
    }
    return this.editedName() ?? this.savedNames().get(activity.id) ?? activity.name;
  });

  protected readonly hasActivityEdits = computed(() => this.editedIcon() !== null || this.editedName() !== null);

  protected onActivitiesScroll(event: Event): void {
    const el = event.target as HTMLDivElement;
    const maxScroll = el.scrollHeight - el.clientHeight;
    this.activitiesScrollProgress.set(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
  }

  protected onActivitiesScrollBarChange(progress: number): void {
    const el = this.activitiesContainer()?.nativeElement;
    if (!el) {
      return;
    }
    el.scrollTop = progress * (el.scrollHeight - el.clientHeight);
    this.activitiesScrollProgress.set(progress);
  }

  protected onActivityIconsScroll(event: Event): void {
    const el = event.target as HTMLDivElement;
    const maxScroll = el.scrollHeight - el.clientHeight;
    this.activityIconsScrollProgress.set(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
  }

  protected onActivityIconsScrollBarChange(progress: number): void {
    const el = this.activityIconsContainer()?.nativeElement;
    if (!el) {
      return;
    }
    el.scrollTop = progress * (el.scrollHeight - el.clientHeight);
    this.activityIconsScrollProgress.set(progress);
  }

  protected moodFace(mood: Mood): MoodFace {
    return MOOD_GROUP_FACES[mood.moodGroupId];
  }

  protected moodColor(mood: Mood): string {
    return this.savedColors().get(mood.id) ?? mood.color ?? 'var(--mat-sys-primary)';
  }

  protected selectMood(mood: Mood): void {
    this.selectedMoodId.set(mood.id);
    this.editedColor.set(null);
    this.editedMoodName.set(null);
  }

  protected onColorChange(color: string): void {
    this.editedColor.set(color);
  }

  protected onMoodNameChange(name: string): void {
    this.editedMoodName.set(name);
  }

  protected resetEdits(): void {
    this.editedColor.set(null);
    this.editedMoodName.set(null);
  }

  protected save(): void {
    const mood = this.selectedMood();
    const color = this.editedColor();
    const name = this.editedMoodName();
    if (!mood || (color === null && name === null)) {
      return;
    }

    this.isSaving.set(true);
    this.moodsService
      .update(mood.id, {
        ...(color !== null && { color }),
        ...(name !== null && { name }),
      })
      .subscribe({
        next: () => {
          if (color !== null) {
            this.savedColors.update((map) => new Map(map).set(mood.id, color));
          }
          if (name !== null) {
            this.savedMoodNames.update((map) => new Map(map).set(mood.id, name));
          }
          this.editedColor.set(null);
          this.editedMoodName.set(null);
          this.isSaving.set(false);
          this.editNotification.set({ variant: 'success', title: 'Mood updated' });
        },
        error: () => {
          this.isSaving.set(false);
          this.editNotification.set({ variant: 'error', title: 'Failed to update mood' });
        },
      });
  }

  protected activityIcon(activity: { id: number; icon: string | null }): ActivityIconName {
    return this.savedIcons().get(activity.id) ?? resolveActivityIcon(activity.icon);
  }

  protected activityName(activity: { id: number; name: string }): string {
    return this.savedNames().get(activity.id) ?? activity.name;
  }

  protected selectActivity(activityId: number): void {
    this.selectedActivityId.set(activityId);
    this.editedIcon.set(null);
    this.editedName.set(null);
  }

  protected onActivityIconChange(icon: ActivityIconName): void {
    this.editedIcon.set(icon);
  }

  protected onActivityNameChange(name: string): void {
    this.editedName.set(name);
  }

  protected resetActivityEdits(): void {
    this.editedIcon.set(null);
    this.editedName.set(null);
  }

  protected saveActivity(): void {
    const activity = this.selectedActivity();
    const icon = this.editedIcon();
    const name = this.editedName();
    if (!activity || (icon === null && name === null)) {
      return;
    }

    this.isSavingActivity.set(true);
    this.activitiesService
      .update(activity.id, {
        ...(icon !== null && { icon }),
        ...(name !== null && { name }),
      })
      .subscribe({
        next: () => {
          if (icon !== null) {
            this.savedIcons.update((map) => new Map(map).set(activity.id, icon));
          }
          if (name !== null) {
            this.savedNames.update((map) => new Map(map).set(activity.id, name));
          }
          this.editedIcon.set(null);
          this.editedName.set(null);
          this.isSavingActivity.set(false);
          this.editNotification.set({ variant: 'success', title: 'Activity updated' });
        },
        error: () => {
          this.isSavingActivity.set(false);
          this.editNotification.set({ variant: 'error', title: 'Failed to update activity' });
        },
      });
  }
}
