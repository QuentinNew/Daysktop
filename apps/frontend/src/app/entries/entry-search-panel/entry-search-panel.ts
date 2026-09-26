import { Component, computed, inject, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Params, Router } from '@angular/router';
import { ActivitiesService } from '../../activities/activities.service';
import { resolveActivityIcon } from '../../activities/daylio-icon-map';
import { ActivityPicker, ActivityPickerGroup } from '../../ui/organisms/activity-picker/activity-picker';
import { SearchBar } from '../../ui/atoms/search-bar/search-bar';
import { Button } from '../../ui/atoms/button/button';
import { Icon } from '../../ui/atoms/icon/icon';

export function toSearchQueryParams(keyword: string, activityIds: number[]): Params {
  return {
    keyword: keyword.trim() || undefined,
    activities: activityIds.join(',') || undefined,
  };
}

@Component({
  selector: 'app-entry-search-panel',
  imports: [ActivityPicker, SearchBar, Button, Icon],
  templateUrl: './entry-search-panel.html',
  styleUrl: './entry-search-panel.scss',
})
export class EntrySearchPanel {
  private readonly router = inject(Router);
  private readonly activitiesService = inject(ActivitiesService);

  readonly keyword = model('');
  readonly activityIds = model<number[]>([]);

  private readonly activities = toSignal(this.activitiesService.list(), { initialValue: [] });

  protected readonly activityGroups = computed<ActivityPickerGroup[]>(() => {
    const groups: ActivityPickerGroup[] = [];
    const groupsById = new Map<number, ActivityPickerGroup>();

    for (const activity of this.activities()) {
      let group = groupsById.get(activity.group.id);
      if (!group) {
        group = { name: activity.group.name, activities: [] };
        groupsById.set(activity.group.id, group);
        groups.push(group);
      }
      group.activities.push({ id: activity.id, name: activity.name, icon: resolveActivityIcon(activity.icon) });
    }

    return groups;
  });

  protected toggleActivity(activityId: number): void {
    this.activityIds.update((ids) =>
      ids.includes(activityId) ? ids.filter((id) => id !== activityId) : [...ids, activityId],
    );
  }

  protected search(): void {
    this.router.navigate(['/search'], { queryParams: toSearchQueryParams(this.keyword(), this.activityIds()) });
  }
}
