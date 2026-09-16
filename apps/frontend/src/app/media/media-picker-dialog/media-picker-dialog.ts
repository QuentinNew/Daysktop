import { Component, ElementRef, computed, effect, inject, signal, viewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MediaService } from '../media.service';
import { Media, MediaType } from '../media.model';
import { Tabs } from '../../ui/atoms/tabs/tabs';
import { SearchBar } from '../../ui/atoms/search-bar/search-bar';
import { MediaCard } from '../../ui/atoms/media-card/media-card';
import { Button } from '../../ui/atoms/button/button';
import { TextField } from '../../ui/atoms/text-field/text-field';
import { Tile } from '../../ui/layout/tile/tile';
import { ImageFramer, ImageFraming } from '../../ui/atoms/image-framer/image-framer';
import { ScrollBar } from '../../ui/atoms/scroll-bar/scroll-bar';

export interface MediaPickerDialogData {
  year: number;
  month: number;
  mediaId?: number;
}

interface EditingMedia {
  id: number | null;
  name: string;
  type: MediaType;
  picture: string;
  zoom: number;
  focalX: number;
  focalY: number;
  createdAt: string | null;
  updatedAt: string | null;
}

const FILTER_LABELS = ['All', 'Games', 'Series', 'Other'];
const FILTER_TYPES: (MediaType | null)[] = [null, 'GAME', 'SERIE', 'OTHER'];

@Component({
  selector: 'app-media-picker-dialog',
  imports: [Tabs, SearchBar, MediaCard, Button, TextField, Tile, ImageFramer, ScrollBar],
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

  protected readonly gridScrollProgress = signal(0);
  protected readonly gridOverflows = signal(false);
  private readonly gridContainer = viewChild<ElementRef<HTMLElement>>('gridContainer');

  constructor() {
    this.mediaService.list().subscribe((media) => {
      this.media.set(media);
      const preselected = media.find((item) => item.id === this.data.mediaId);
      if (preselected) {
        this.select(preselected);
      }
    });

    effect((onCleanup) => {
      this.filteredMedia();
      const el = this.gridContainer()?.nativeElement;
      if (!el) {
        this.gridOverflows.set(false);
        return;
      }

      const update = () => this.gridOverflows.set(el.scrollHeight > el.clientHeight);
      update();

      const observer = new ResizeObserver(update);
      observer.observe(el);
      onCleanup(() => observer.disconnect());
    });
  }

  protected onGridScroll(event: Event): void {
    const el = event.target as HTMLElement;
    const maxScroll = el.scrollHeight - el.clientHeight;
    this.gridScrollProgress.set(maxScroll > 0 ? el.scrollTop / maxScroll : 0);
  }

  protected onGridScrollBarChange(progress: number): void {
    const el = this.gridContainer()?.nativeElement;
    if (!el) {
      return;
    }
    el.scrollTop = progress * (el.scrollHeight - el.clientHeight);
    this.gridScrollProgress.set(progress);
  }

  protected select(media: Media): void {
    if (this.editing()?.id === media.id) {
      this.editing.set(null);
      return;
    }
    this.editing.set({
      id: media.id,
      name: media.name,
      type: media.type,
      picture: media.picture,
      zoom: media.zoom,
      focalX: media.focalX,
      focalY: media.focalY,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    });
  }

  protected startNew(type: MediaType): void {
    this.editing.set({
      id: null,
      name: '',
      type,
      picture: '',
      zoom: 1,
      focalX: 50,
      focalY: 50,
      createdAt: null,
      updatedAt: null,
    });
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
      this.editing.set({ ...editing, picture, zoom: 1, focalX: 50, focalY: 50 });
    }
  }

  protected formatDate(iso: string): string {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  }

  protected updateFraming(framing: ImageFraming): void {
    const editing = this.editing();
    if (editing) {
      this.editing.set({ ...editing, ...framing });
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
      this.editing.set({
        id: saved.id,
        name: saved.name,
        type: saved.type,
        picture: saved.picture,
        zoom: saved.zoom,
        focalX: saved.focalX,
        focalY: saved.focalY,
        createdAt: saved.createdAt,
        updatedAt: saved.updatedAt,
      });
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
    const input = {
      name: editing.name,
      type: editing.type,
      picture: editing.picture,
      zoom: editing.zoom,
      focalX: editing.focalX,
      focalY: editing.focalY,
    };
    return editing.id === null
      ? this.mediaService.create(input)
      : this.mediaService.update(editing.id, input);
  }
}
