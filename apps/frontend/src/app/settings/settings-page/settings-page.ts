import {Component, inject, signal} from '@angular/core';
import { PageMenubar } from '../../shared/page-menubar/page-menubar';
import {SettingsContainer} from '../../ui/organisms/settings-container/settings-container';
import {Button} from '../../ui/atoms/button/button';
import { ImportService } from '../import.service';

@Component({
  selector: 'app-settings-page',
  imports: [PageMenubar, SettingsContainer, Button],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  private readonly importService = inject(ImportService);

  protected readonly importButtonDisabled = signal(true)

  protected fileSelected: File | null = null;

  public onImportFileSelected(event: Event): void {
    if (event.target instanceof HTMLInputElement && event.target.files && event.target.files.length > 0) {
      this.fileSelected = event.target.files[0];
      this.importButtonDisabled.set(false)
    }
  }

  protected onImport(): void {
    if (!this.fileSelected) {
      return;
    }
    this.importService.importDaylio(this.fileSelected).subscribe();
  }

}
