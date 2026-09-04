import { Component, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { CdkDrag, CdkDragMove } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-scroll-bar',
  imports: [CdkDrag],
  templateUrl: './scroll-bar.html',
  styleUrl: './scroll-bar.scss',
})
export class ScrollBar {
  readonly progress = input(0);
  readonly height = input<number | undefined>(undefined);
  readonly progressChange = output<number>();

  protected readonly freeDragPosition = signal({ x: 0, y: 0 });

  private readonly bar = viewChild<ElementRef<HTMLDivElement>>('bar');

  protected onTrackMouseDown(event: MouseEvent): void {
    this.emitProgressForY(event.clientY);
  }

  protected onThumbDragMoved(event: CdkDragMove): void {
    const native = event.event;
    const clientY =
      native instanceof MouseEvent ? native.clientY : (native.touches[0] ?? native.changedTouches[0])?.clientY ?? 0;
    this.emitProgressForY(clientY);
    this.freeDragPosition.set({ x: 0, y: 0 });
  }

  private emitProgressForY(clientY: number): void {
    const bar = this.bar()?.nativeElement;
    if (!bar) {
      return;
    }

    const rect = bar.getBoundingClientRect();
    const ratio = rect.height === 0 ? 0 : (clientY - rect.top) / rect.height;
    this.progressChange.emit(Math.min(1, Math.max(0, ratio)));
  }
}
