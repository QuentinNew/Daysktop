import { Component, input } from '@angular/core';
import { ActivityIconName, Icon } from '../../atoms/icon/icon';

@Component({
  selector: 'app-activity-label',
  imports: [Icon],
  templateUrl: './activity-label.html',
  styleUrl: './activity-label.scss',
})
export class ActivityLabel {
  readonly label = input.required<string>();
  readonly icon = input.required<ActivityIconName>();
  readonly size = input(16);
}
