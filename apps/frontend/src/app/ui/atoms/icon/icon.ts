import { Component, input } from '@angular/core';

export type IconName = 'arrow-right' | 'arrow-left';

@Component({
  selector: 'app-icon',
  imports: [],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
}
