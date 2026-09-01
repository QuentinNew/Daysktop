import { Component, input } from '@angular/core';

@Component({
  selector: 'app-activity',
  imports: [],
  templateUrl: './activity.html',
  styleUrl: './activity.scss',
})
export class Activity {
  readonly label = input.required<string>();
}
