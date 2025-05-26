import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MonthlyRelease } from '../../../../../../core/entities/release/release-dto';
import { ReleaseType } from '../../../../../../core/enums/release-enums';
import { CustomCurrencyPipe } from '../../../../../../shared/pipes/custom-currency.pipe';

@Component({
  selector: 'app-release-item',
  imports: [CommonModule, TranslateModule, CustomCurrencyPipe],
  templateUrl: './release-item.component.html',
  styleUrl: './release-item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReleaseItemComponent {
  release = input.required<MonthlyRelease>();
  smallWidth = input.required<boolean>();
  open = output<MonthlyRelease>();

  private readonly _translateService = inject(TranslateService);

  categoryBgColor = computed(
    (): string => this.release().category?.color || '#AFAFAF'
  );

  categoryIcon = computed((): string =>
    this.release().isBalanceAdjustment
      ? 'edit'
      : this.release().category?.icon || 'swap_horiz'
  );

  isBalanceAdjustment = computed(() => this.release().isBalanceAdjustment);
  isTransfer = computed(() => this.release().type === ReleaseType.TRANSFER);

  transferDescription = computed(
    (): string =>
      this.release().description ||
      this._translateService.instant('cash-flow.transfer')
  );

  isCard = computed(
    (): boolean =>
      this.release().card !== null && this.release().card !== undefined
  );

  description = computed(
    (): string =>
      this.release().description || this.release().category?.name || ''
  );

  descriptionSubTitle = computed(
    (): string =>
      this.release().account?.name || this.release().card?.name || ''
  );

  transferAccountName = computed(
    (): string => this.release().account?.name || ''
  );
  targetAccountName = computed(
    (): string => this.release().targetAccount?.name || ''
  );

  accountName = computed(
    (): string =>
      this.release().account?.name || this.release().card?.name || ''
  );

  amountOperator = computed((): string =>
    this.release().type === 'E' ? '-' : '+'
  );

  isDone = computed((): boolean => this.release().done);
}
