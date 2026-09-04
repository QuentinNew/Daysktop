import { Component, input } from '@angular/core';
import { TextTile } from '../../layout/text-tile/text-tile';

@Component({
  selector: 'app-settings-container',
  imports: [TextTile],
  templateUrl: './settings-container.html',
  styleUrl: './settings-container.scss',
})
export class SettingsContainer {
  readonly title = input.required<string>();
  readonly width = input(420);
}
