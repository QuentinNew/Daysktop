import { Component, input } from '@angular/core';

@Component({
  selector: 'app-activity-label',
  imports: [],
  templateUrl: './activity-label.html',
  styleUrl: './activity-label.scss',
})
export class ActivityLabel {
  readonly label = input.required<string>();
}
