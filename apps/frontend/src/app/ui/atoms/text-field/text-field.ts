import { Component, input, output, signal } from '@angular/core';

export type TextFieldVariant = 'line' | 'filled';

@Component({
  selector: 'app-text-field',
  imports: [],
  templateUrl: './text-field.html',
  styleUrl: './text-field.scss',
})
export class TextField {
  readonly label = input.required<string>();
  readonly value = input('');
  readonly type = input<'text' | 'email' | 'password'>('text');
  readonly disabled = input(false);
  readonly variant = input<TextFieldVariant>('line');

  readonly valueChange = output<string>();

  protected readonly isFocused = signal(false);

  protected onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }
}
