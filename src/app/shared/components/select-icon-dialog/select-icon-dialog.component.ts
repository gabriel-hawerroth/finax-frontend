import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injector,
} from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonConfig,
  ButtonPreConfig,
} from '../../../core/interfaces/button-config';
import { DialogControls } from '../../../core/interfaces/dialogs-controls';
import { cloudFireCdnImgsLink } from '../../utils/utils';
import { DynamicButtonComponent } from '../dynamic-buttons/dynamic-button/dynamic-button.component';

@Component({
  selector: 'app-select-icon-dialog',
  imports: [
    CommonModule,
    NgOptimizedImage,
    TranslateModule,
    MatDialogModule,
    DynamicButtonComponent,
  ],
  templateUrl: './select-icon-dialog.component.html',
  styleUrl: './select-icon-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectIconDialog {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;

  readonly icons: string[] = this.getIcons;

  closeBtnCfg: ButtonConfig = {
    preConfig: ButtonPreConfig.CLOSE,
    onClick: () => this.control.close(),
  };

  readonly control: DialogControls<string>;

  constructor() {
    const injector = inject(Injector);

    const ref =
      injector.get<MatDialogRef<SelectIconDialog> | null>(MatDialogRef, null) ||
      injector.get<MatBottomSheetRef<SelectIconDialog> | null>(
        MatBottomSheetRef,
        null
      );

    this.control = {
      close: (result?: string) => {
        if (ref instanceof MatDialogRef) ref.close(result);
        else if (ref instanceof MatBottomSheetRef) ref.dismiss(result);
      },
    };
  }

  private get getIcons(): string[] {
    return [
      'money.png',
      'agora.png',
      'alelo.png',
      'ame.png',
      'amex.png',
      'avenuesecuritie.png',
      'b3.png',
      'banco-brasil.png',
      'banrisul.png',
      'binance.png',
      'binomo.png',
      'bitybank.png',
      'bradesco.png',
      'bradesco-prime.png',
      'brb.png',
      'btgpactual.png',
      'btgplus.png',
      'bv.png',
      'c6bank.png',
      'caixa.png',
      'c-a-pay.png',
      'carrefour.png',
      'credicard.png',
      'diners.png',
      'elo.png',
      'foxbit.png',
      'grao.png',
      'havan.png',
      'hipercard.png',
      'hotmart.png',
      'ifood-conta-digital.png',
      'infinitepay.png',
      'inter.png',
      'iqoption.png',
      'itau.png',
      'itau-ion.png',
      'iti.png',
      'latam-pass.png',
      'magalu-pay.png',
      'marisa.png',
      'master-black.png',
      'mastercard.png',
      'meliuz.png',
      'mercadobitcoin.png',
      'mercadopago.png',
      'monetizze.png',
      'next.png',
      'nomad.png',
      'nubank.png',
      'nu-invest.png',
      'olymp-trade.png',
      'pagar-me.png',
      'pagbank.png',
      'pagseguro.png',
      'pan.png',
      'pao-acucar.png',
      'paypal.png',
      'picpay.png',
      'portoseguro.png',
      'renner.png',
      'rico.png',
      'safra.png',
      'samsung.png',
      'santander.png',
      'sem-parar.png',
      'serasa-consumidor.png',
      'sicoob.png',
      'sodexo.png',
      'stone.png',
      'submarino.png',
      'tesourodireto.png',
      'tesouronacional.png',
      'ticket.png',
      'ton.png',
      'toroinvestimentos.png',
      'unicred.png',
      'viacredi.png',
      'visa.png',
      'warren.png',
      'wiipo.png',
      'xp.png',
      'will-bank.png',
    ];
  }
}
