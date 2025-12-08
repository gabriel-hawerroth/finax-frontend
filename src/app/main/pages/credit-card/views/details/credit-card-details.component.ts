import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserCreditCard } from '../../../../../core/entities/credit-card/credit-card-dto';
import { CreditCardService } from '../../../../../core/entities/credit-card/credit-card.service';
import { CreditCardChangedEvent } from '../../../../../core/enums/entity-changed-events';
import { creditCardChangedEvent } from '../../../../../core/events/events';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../../../core/interfaces/button-config';
import { DynamicButtonComponent } from '../../../../../shared/components/dynamic-buttons/dynamic-button/dynamic-button.component';
import { CustomCurrencyPipe } from '../../../../../shared/pipes/custom-currency.pipe';
import { ResponsiveService } from '../../../../../shared/services/responsive.service';
import { SpeedDialService } from '../../../../../shared/services/speed-dial.service';
import { cloudFireCdnImgsLink } from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-credit-card-details',
  imports: [
    NgOptimizedImage,
    CustomCurrencyPipe,
    TranslateModule,
    DynamicButtonComponent
],
  templateUrl: './credit-card-details.component.html',
  styleUrl: './credit-card-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditCardDetailsComponent {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly currency = this._utils.getUserConfigs.currency;

  card: UserCreditCard = inject(MAT_BOTTOM_SHEET_DATA).card;

  seeInvoiceBtnConfig: ButtonConfig = {
    icon: 'sort',
    label: 'credit-cards.see-invoice',
    onClick: () => this.seeInvoice(),
  };

  editBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.EDIT,
    onClick: () => this.edit(),
  };

  changeSituationBtnConfig: ButtonConfig;

  deleteBtnConfig: ButtonConfig = {
    preConfig: ButtonPreConfig.DELETE,
    onClick: () => this.onDelete(),
  };

  showImage = computed(
    () => this.card.image && !this._responsiveService.isMobileView()
  );

  constructor(
    private readonly _utils: UtilsService,
    private readonly _router: Router,
    private readonly _bottomSheetRef: MatBottomSheetRef,
    private readonly _responsiveService: ResponsiveService,
    private readonly _creditCardService: CreditCardService,
    private readonly _speedDialService: SpeedDialService
  ) {
    this.changeSituationBtnConfig = {
      label: this.card.active ? 'generic.inactivate' : 'generic.activate',
      onClick: () =>
        this.card.active ? this.onInactivate() : this.onActivate(),
    };
  }

  edit() {
    this._bottomSheetRef.dismiss();
    this._router.navigateByUrl(`cartoes-de-credito/${this.card.id}`);
  }

  seeInvoice() {
    this._bottomSheetRef.dismiss();
    this._router.navigateByUrl(`cartoes-de-credito/fatura/${this.card.id}`);
  }

  onDelete() {
    this._utils
      .showConfirmDialog('credit-cards.confirm-action', {
        action: 'actions.exclude',
      })
      .then((response) => {
        if (!response) return;
        this.deleteCard();
      });
  }

  private deleteCard() {
    this._creditCardService
      .deleteById(this.card.id!)
      .then(() => {
        this._utils.showParamitezedMessages(
          'credit-cards.action-success',
          { action: 'record-events.excluded' },
          4000
        );

        creditCardChangedEvent.next({
          creditCardId: this.card.id!,
          event: CreditCardChangedEvent.DELETED,
        });

        this._bottomSheetRef.dismiss();
      })
      .catch(() => {
        if (this.card.active) {
          this._utils
            .showConfirmDialog(
              'credit-cards.error-excluding-linked-registers-inactivate'
            )
            .then((response) => {
              if (!response) return;
              this.inactivateCard();
            });
        } else {
          this._utils.showMessage(
            'credit-cards.error-excluding-linked-registers',
            4000
          );
        }
      });
  }

  onInactivate() {
    this._utils
      .showConfirmDialog('credit-cards.confirm-action', {
        action: 'generic.inactivate',
      })
      .then((response) => {
        if (!response) return;
        this.inactivateCard();
      });
  }

  private inactivateCard() {
    this._creditCardService.inactivateCard(this.card.id!).then(() => {
      this._utils.showParamitezedMessages(
        'credit-cards.action-success',
        { action: 'record-events.inactivated-f' },
        4000
      );

      creditCardChangedEvent.next({
        creditCardId: this.card.id!,
        event: CreditCardChangedEvent.INACTIVATED,
      });

      this._bottomSheetRef.dismiss();
    });
  }

  onActivate() {
    this._utils
      .showConfirmDialog('credit-cards.confirm-action', {
        action: 'generic.activate',
      })
      .then((response) => {
        if (!response) return;
        this.activeCard();
      });
  }

  private activeCard() {
    this._creditCardService.activateCard(this.card.id!).then(() => {
      this._utils.showParamitezedMessages(
        'credit-cards.action-success',
        { action: 'record-events.activated' },
        4000
      );

      creditCardChangedEvent.next({
        creditCardId: this.card.id!,
        event: CreditCardChangedEvent.ACTIVATED,
      });

      this.card.active = true;
      this._speedDialService.onSaveCreditCard(this.card);

      this._bottomSheetRef.dismiss();
    });
  }
}
