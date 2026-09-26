import {
  Component,
  ElementRef,
  HostListener,
  Injector,
  afterNextRender,
  afterRenderEffect,
  computed,
  effect,
  inject,
  signal,
  viewChild,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { combineLatest, debounceTime, switchMap } from 'rxjs';
import { EntriesService } from '../entries.service';
import { Entry as EntryOrganism } from '../../ui/organisms/entry/entry';
import { ScrollBar } from '../../ui/atoms/scroll-bar/scroll-bar';
import { TextTile } from '../../ui/layout/text-tile/text-tile';
import { EntrySearchPanel, toSearchQueryParams } from '../entry-search-panel/entry-search-panel';
import { toEntryViewModel } from '../entry-view-model';

const BATCH_SIZE = 20;
const MAX_RENDERED = 60;
// Space kept above an entry scrolled to the top, so its date tab stays visible.
const ENTRY_TOP_OFFSET = 32;
const SEARCH_DEBOUNCE_MS = 300;

function parseSearchParams(params: ParamMap): { keyword: string; activityIds: number[] } {
  return {
    keyword: params.get('keyword') ?? '',
    activityIds: params.get('activities')?.split(',').map((id) => Number(id)) ?? [],
  };
}

@Component({
  selector: 'app-entries-list',
  imports: [EntryOrganism, ScrollBar, TextTile, EntrySearchPanel],
  templateUrl: './entries-list.html',
  styleUrl: './entries-list.scss',
})
export class EntriesList {
  private readonly entriesService = inject(EntriesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly injector = inject(Injector);

  protected readonly isSearch = this.route.snapshot.routeConfig?.path === 'search';

  protected readonly entries = toSignal(
    this.route.queryParamMap.pipe(
      switchMap((params) => {
        const { keyword, activityIds } = parseSearchParams(params);
        return keyword || activityIds.length > 0
          ? this.entriesService.search({ keyword, activityIds })
          : this.entriesService.list();
      }),
    ),
    { initialValue: [] },
  );
  protected readonly entryViewModels = computed(() => this.entries().map(toEntryViewModel));

  private readonly initialSearch = parseSearchParams(this.route.snapshot.queryParamMap);
  protected readonly searchKeyword = signal(this.initialSearch.keyword);
  protected readonly searchActivityIds = signal(this.initialSearch.activityIds);

  // Only entries in [windowStart, windowEnd) are rendered.
  private readonly windowStart = signal(0);
  private readonly windowEnd = signal(BATCH_SIZE);
  protected readonly visibleEntries = computed(() =>
    this.entryViewModels().slice(this.windowStart(), this.windowEnd()),
  );

  protected readonly scrollProgress = signal(0);
  protected readonly showScrollBar = signal(false);

  private readonly topSentinel = viewChild<ElementRef<HTMLElement>>('topSentinel');
  private readonly bottomSentinel = viewChild<ElementRef<HTMLElement>>('bottomSentinel');
  private readonly entryElements = viewChildren(EntryOrganism, { read: ElementRef });

  private lastJumpIndex: number | null = null;
  private isProgrammaticScroll = false;

  constructor() {
    // Live search: keep the URL (and so the results) in sync with the search panel.
    if (this.isSearch) {
      combineLatest([
        toObservable(this.searchKeyword).pipe(debounceTime(SEARCH_DEBOUNCE_MS)),
        toObservable(this.searchActivityIds),
      ])
        .pipe(takeUntilDestroyed())
        .subscribe(([keyword, activityIds]) =>
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: toSearchQueryParams(keyword, activityIds),
            replaceUrl: true,
          }),
        );
    }

    // A new result set (initial load or search change) starts from the top.
    effect(() => {
      const total = this.entryViewModels().length;
      this.windowStart.set(0);
      this.windowEnd.set(Math.min(total, BATCH_SIZE));
      this.scrollProgress.set(0);
      this.lastJumpIndex = null;
      window.scrollTo({ top: 0, behavior: 'instant' });
    });

    // Re-created on every window change so the initial callback re-checks sentinels that stayed visible.
    effect((onCleanup) => {
      const top = this.topSentinel()?.nativeElement;
      const bottom = this.bottomSentinel()?.nativeElement;
      this.windowStart();
      this.windowEnd();
      if (!top || !bottom) {
        return;
      }

      const observer = new IntersectionObserver(
        (observerEntries) => {
          for (const observerEntry of observerEntries) {
            if (!observerEntry.isIntersecting) {
              continue;
            }
            if (observerEntry.target === top) {
              this.extendUp();
            } else {
              this.extendDown();
            }
          }
        },
        { rootMargin: '600px 0px' },
      );
      observer.observe(top);
      observer.observe(bottom);
      onCleanup(() => observer.disconnect());
    });

    afterRenderEffect(() => {
      this.visibleEntries();
      this.showScrollBar.set(document.documentElement.scrollHeight > window.innerHeight);
    });
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    if (this.isProgrammaticScroll) {
      this.isProgrammaticScroll = false;
      return;
    }
    this.lastJumpIndex = null;
    this.scrollProgress.set(this.progressFromScroll());
  }

  @HostListener('window:resize')
  protected onWindowResize(): void {
    this.showScrollBar.set(document.documentElement.scrollHeight > window.innerHeight);
  }

  protected onScrollBarChange(progress: number): void {
    const total = this.entryViewModels().length;
    const index = Math.round(progress * (total - 1));
    this.scrollProgress.set(progress);
    if (index === this.lastJumpIndex) {
      return;
    }
    this.lastJumpIndex = index;

    const start = Math.max(0, Math.min(index - BATCH_SIZE / 2, total - BATCH_SIZE));
    this.windowStart.set(start);
    this.windowEnd.set(Math.min(total, start + BATCH_SIZE));
    afterNextRender(() => this.scrollToEntry(index), { injector: this.injector });
  }

  private scrollToEntry(index: number): void {
    // Skip stale jumps superseded by a later drag position.
    if (index !== this.lastJumpIndex) {
      return;
    }
    const element = this.entryElements()[index - this.windowStart()]?.nativeElement;
    if (!element) {
      return;
    }
    const top = index === 0 ? 0 : element.getBoundingClientRect().top + window.scrollY - ENTRY_TOP_OFFSET;
    if (Math.abs(top - window.scrollY) >= 1) {
      this.isProgrammaticScroll = true;
    }
    window.scrollTo({ top, behavior: 'instant' });
  }

  private extendUp(): void {
    const start = this.windowStart();
    if (start === 0) {
      return;
    }
    const newStart = Math.max(0, start - BATCH_SIZE);
    this.windowStart.set(newStart);
    this.windowEnd.update((end) => Math.min(end, newStart + MAX_RENDERED));
  }

  private extendDown(): void {
    const total = this.entryViewModels().length;
    const end = this.windowEnd();
    if (end >= total) {
      return;
    }
    const newEnd = Math.min(total, end + BATCH_SIZE);
    this.windowEnd.set(newEnd);
    this.windowStart.update((start) => Math.max(start, newEnd - MAX_RENDERED));
  }

  private progressFromScroll(): number {
    const total = this.entryViewModels().length;
    if (total <= 1) {
      return 0;
    }
    const root = document.documentElement;
    if (this.windowEnd() === total && window.scrollY + window.innerHeight >= root.scrollHeight - 1) {
      return 1;
    }
    const elements = this.entryElements();
    const firstVisible = elements.findIndex((element) => element.nativeElement.getBoundingClientRect().bottom > 0);
    const index = this.windowStart() + Math.max(0, firstVisible);
    return index / (total - 1);
  }
}
