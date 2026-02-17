import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { CustomCurrencyPipe } from '../../../../../../shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-balance',
  imports: [MatCardModule, CustomCurrencyPipe, TranslateModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceComponent {
  title = input.required<string>();
  value = input.required<number>();
  currency = input.required<string>();
  icon = input.required<string>();
  iconColor = input.required<string>();

  private readonly balanceContentEl =
    viewChild<ElementRef<HTMLElement>>('balanceContent');
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly currencyPipe = new CustomCurrencyPipe();

  containerWidth = signal(0);
  rootFontSize = signal(16);

  private readonly MAX_FONT_SIZE = 1.5;
  private readonly MIN_FONT_SIZE = 0.8;
  private readonly CHAR_WIDTH_FACTOR = 0.6;

  constructor() {
    afterNextRender(() => {
      if (!isPlatformBrowser(this.platformId)) return;

      const el = this.balanceContentEl()?.nativeElement;
      if (!el) return;

      // Get the actual root font-size from computed styles
      const rootFontSizePx = parseFloat(
        getComputedStyle(document.documentElement).fontSize
      );
      this.rootFontSize.set(rootFontSizePx);

      this.containerWidth.set(el.clientWidth);

      const observer = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width;
        if (width != null) {
          this.containerWidth.set(width);
        }
      });
      observer.observe(el);

      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  private readonly displayText = computed(() => {
    return `${this.currency()} ${this.currencyPipe.transform(this.value())}`;
  });

  fontSize = computed(() => {
    const width = this.containerWidth();
    if (!width) return `${this.MAX_FONT_SIZE}rem`;

    const charCount = this.displayText().length;
    const rootFontSizePx = this.rootFontSize();
    const baseFontPx = this.MAX_FONT_SIZE * rootFontSizePx;
    const estimatedTextWidth = charCount * baseFontPx * this.CHAR_WIDTH_FACTOR;

    if (estimatedTextWidth <= width) {
      return `${this.MAX_FONT_SIZE}rem`;
    }

    const ratio = width / (charCount * rootFontSizePx * this.CHAR_WIDTH_FACTOR);
    const clamped = Math.max(
      Math.min(ratio, this.MAX_FONT_SIZE),
      this.MIN_FONT_SIZE,
    );
    return `${clamped}rem`;
  });
}
