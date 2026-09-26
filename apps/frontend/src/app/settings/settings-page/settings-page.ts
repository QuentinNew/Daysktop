import {Component, inject, signal} from '@angular/core';
import { TileWithTitle } from '../../ui/layout/tile-with-title/tile-with-title';
import {Button} from '../../ui/atoms/button/button';
import { ImportService } from '../import.service';
import { ExportService } from '../export.service';
import { Notification, NotificationVariant } from '../../ui/organisms/notification/notification';

interface SettingsNotification {
  variant: NotificationVariant;
  title: string;
}

@Component({
  selector: 'app-settings-page',
  imports: [TileWithTitle, Button, Notification],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.scss',
})
export class SettingsPage {
  private readonly importService = inject(ImportService);
  private readonly exportService = inject(ExportService);

  protected readonly importButtonDisabled = signal(true)

  protected fileSelected: File | null = null;

  protected readonly notification = signal<SettingsNotification | null>(null);

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
      next: () => this.notification.set({ variant: 'success', title: 'Import successful' }),
      error: () => this.notification.set({ variant: 'error', title: 'Import failed' }),
    });
  }

  protected onExport(): void {
    this.exportService.exportBackup().subscribe({
      next: (blob) => {
        this.downloadBlob(blob, 'daysktop-export.json');
        this.notification.set({ variant: 'success', title: 'Export successful' });
      },
      error: () => this.notification.set({ variant: 'error', title: 'Export failed' }),
    });
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

}
