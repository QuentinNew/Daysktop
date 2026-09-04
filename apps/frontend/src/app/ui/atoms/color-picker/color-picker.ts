import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  imports: [],
  templateUrl: './color-picker.html',
  styleUrl: './color-picker.scss',
})
export class ColorPicker {
  readonly label = input.required<string>();
  readonly value = input('#000000');
  readonly disabled = input(false);

  readonly valueChange = output<string>();

  protected readonly isFocused = signal(false);

  protected onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
