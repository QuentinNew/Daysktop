import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-tabs',
  imports: [],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss',
})
export class Tabs {
  readonly labels = input.required<string[]>();
  readonly selected = input(0);
  readonly selectedChange = output<number>();
}
