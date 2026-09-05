import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MediaService } from '../media.service';
import { Media, MediaType } from '../media.model';
import { Tabs } from '../../ui/atoms/tabs/tabs';
import { SearchBar } from '../../ui/atoms/search-bar/search-bar';
import { MediaCard } from '../../ui/atoms/media-card/media-card';
import { Button } from '../../ui/atoms/button/button';
import { TextField } from '../../ui/atoms/text-field/text-field';
import { Tile } from '../../ui/layout/tile/tile';

export interface MediaPickerDialogData {
  year: number;
  month: number;
}

interface EditingMedia {
  id: number | null;
  name: string;
  type: MediaType;
  picture: string;
}

const FILTER_LABELS = ['All', 'Games', 'Series', 'Other'];
const FILTER_TYPES: (MediaType | null)[] = [null, 'GAME', 'SERIE', 'OTHER'];

@Component({
  selector: 'app-media-picker-dialog',
  imports: [Tabs, SearchBar, MediaCard, Button, TextField, Tile],
  templateUrl: './media-picker-dialog.html',
  styleUrl: './media-picker-dialog.scss',
})
export class MediaPickerDialog {
  private readonly data = inject<MediaPickerDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<MediaPickerDialog, Media | undefined>);
  private readonly mediaService = inject(MediaService);

  protected readonly filterLabels = FILTER_LABELS;
  protected readonly selectedFilter = signal(0);
  protected readonly search = signal('');
  protected readonly media = signal<Media[]>([]);
  protected readonly editing = signal<EditingMedia | null>(null);
  protected readonly busy = signal(false);

  protected readonly editingValid = computed(() => {
    const editing = this.editing();
    return !!editing && editing.name.trim().length > 0 && editing.picture.trim().length > 0;
  });

  protected readonly filteredMedia = computed(() => {
    const type = FILTER_TYPES[this.selectedFilter()];
    const search = this.search().trim().toLowerCase();
    return this.media().filter(
      (item) => (type === null || item.type === type) && item.name.toLowerCase().includes(search),
    );
  });

  constructor() {
    this.mediaService.list().subscribe((media) => this.media.set(media));
  }

  protected select(media: Media): void {
    if (this.editing()?.id === media.id) {
      this.editing.set(null);
      return;
    }
    this.editing.set({ id: media.id, name: media.name, type: media.type, picture: media.picture });
  }

  protected startNew(type: MediaType): void {
    this.editing.set({ id: null, name: '', type, picture: '' });
  }

  protected updateName(name: string): void {
    const editing = this.editing();
    if (editing) {
      this.editing.set({ ...editing, name });
    }
  }

  protected updateType(type: MediaType): void {
    const editing = this.editing();
    if (editing) {
      this.editing.set({ ...editing, type });
    }
  }

  protected updatePicture(picture: string): void {
    const editing = this.editing();
    if (editing) {
      this.editing.set({ ...editing, picture });
    }
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  protected save(): void {
    const editing = this.editing();
    if (!editing || !this.editingValid() || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.persist(editing).subscribe((saved) => {
      this.busy.set(false);
      this.editing.set({ id: saved.id, name: saved.name, type: saved.type, picture: saved.picture });
      this.media.update((media) => {
        const index = media.findIndex((item) => item.id === saved.id);
        return index === -1 ? [...media, saved] : media.map((item) => (item.id === saved.id ? saved : item));
      });
    });
  }

  protected delete(): void {
    const editing = this.editing();
    if (!editing || editing.id === null || this.busy()) {
      return;
    }
    if (!confirm(`Delete "${editing.name}"? This cannot be undone.`)) {
      return;
    }
    const id = editing.id;
    this.busy.set(true);
    this.mediaService.remove(id).subscribe(() => {
      this.busy.set(false);
      this.media.update((media) => media.filter((item) => item.id !== id));
      this.editing.set(null);
    });
  }

  protected confirm(): void {
    const editing = this.editing();
    if (!editing || !this.editingValid() || this.busy()) {
      return;
    }
    this.busy.set(true);
    this.persist(editing).subscribe((saved) => {
      this.mediaService.assignMonth(saved.id, this.data.year, this.data.month).subscribe((updated) => {
        this.busy.set(false);
        this.dialogRef.close(updated);
      });
    });
  }

  private persist(editing: EditingMedia) {
    const input = { name: editing.name, type: editing.type, picture: editing.picture };
    return editing.id === null
      ? this.mediaService.create(input)
      : this.mediaService.update(editing.id, input);
  }
}
