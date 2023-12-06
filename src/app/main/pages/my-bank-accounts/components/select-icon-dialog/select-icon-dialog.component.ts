import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { UtilsService } from '../../../../../utils/utils.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-icon-dialog',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './select-icon-dialog.component.html',
  styleUrl: './select-icon-dialog.component.scss',
})
export class SelectIconDialogComponent {
  public utilsService = inject(UtilsService);
  private dialogRef = inject(MatDialogRef);

  language: string = this.utilsService.getUserConfigs.language;

  icons: string[] = [
    'bradesco.png',
    'itau.png',
    'banco-brasil.png',
    'nubank.png',
    'santander.png',
    'sicoob.png',
    'viacredi.png',
    'inter.png',
    'caixa.png',
    'alelo.png',
    'btgpactual.png',
    'ame.png',
    'pan.png',
    'pao-acucar.png',
    'picpay.png',
    'paypal.png',
    'mercadopago.png',
    'visa.png',
    'serasa-consumidor.png',
    'wiipo.png',
    'avenuesecuritie.png',
    'iti.png',
    'c6bank.png',
    'next.png',
    'safra.png',
    'agora.png',
    'amex.png',
    'ticket.png',
    'sodexo.png',
    'grao.png',
    'xp.png',
    'bradesco-prime.png',
    'btgplus.png',
    'hipercard.png',
    'pagar-me.png',
    'portoseguro.png',
    'b3.png',
    'binance.png',
    'binomo.png',
    'bitybank.png',
    'c-a-pay.png',
    'foxbit.png',
    'ifood-conta-digital.png',
    'infinitepay.png',
    'itau-ion.png',
    'meliuz.png',
    'monetizze.png',
    'nomad.png',
    'nu-invest.png',
    'pagbank.png',
    'pagseguro.png',
    'stone.png',
    'submarino.png',
    'tesourodireto.png',
    'tesouronacional.png',
    'ton.png',
    'toroinvestimentos.png',
    'olymp-trade.png',
    'iqoption.png',
  ];

  close(icon: string) {
    this.dialogRef.close(icon);
  }
}
