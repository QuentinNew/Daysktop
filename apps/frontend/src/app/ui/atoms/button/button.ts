import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

export type ButtonVariant = 'filled' | 'outlined' | 'text';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  readonly variant = input<ButtonVariant>('filled');
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit'>('button');
  readonly iconOnly = input(false);
}
