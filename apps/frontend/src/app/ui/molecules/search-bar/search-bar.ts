import { Component, input, output } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { Icon } from '../../atoms/icon/icon';

@Component({
  selector: 'app-search-bar',
  imports: [Button, Icon],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  readonly value = input('');
  readonly placeholder = input('Search');

  readonly valueChange = output<string>();
  readonly search = output<string>();

  protected onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  protected emitSearch(): void {
    this.search.emit(this.value());
  }
}
