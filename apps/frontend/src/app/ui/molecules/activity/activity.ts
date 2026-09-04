import { Component, input } from '@angular/core';
import { ActivityIconName, Icon } from '../../atoms/icon/icon';

@Component({
  selector: 'app-activity',
  imports: [Icon],
  templateUrl: './activity.html',
  styleUrl: './activity.scss',
})
export class Activity {
  readonly icon = input.required<ActivityIconName>();
  readonly label = input.required<string>();
  readonly selected = input(false);
}
