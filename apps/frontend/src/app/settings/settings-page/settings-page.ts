import {Component, inject, signal} from '@angular/core';
import { PageMenubar } from '../../shared/page-menubar/page-menubar';
import { TileWithTitle } from '../../ui/layout/tile-with-title/tile-with-title';
import {Button} from '../../ui/atoms/button/button';
import { ImportService } from '../import.service';
import { Notification, NotificationVariant } from '../../ui/organisms/notification/notification';

interface ImportNotification {
  variant: NotificationVariant;
  title: string;
}

@Component({
  selector: 'app-settings-page',
  imports: [PageMenubar, TileWithTitle, Button, Notification],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  private readonly importService = inject(ImportService);

  protected readonly importButtonDisabled = signal(true)

  protected fileSelected: File | null = null;

  protected readonly importNotification = signal<ImportNotification | null>(null);

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
    this.importService.importDaylio(this.fileSelected).subscribe({
      next: () => this.importNotification.set({ variant: 'success', title: 'Import successful' }),
      error: () => this.importNotification.set({ variant: 'error', title: 'Import failed' }),
    });
  }

}
