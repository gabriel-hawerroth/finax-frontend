import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true,
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    // Verifica se o valor é válido
    if (isNaN(value)) {
      return '';
    }

    // Converte o número para uma string
    let formattedValue = value.toString();

    if (!formattedValue.includes('.')) {
      formattedValue = formattedValue.concat('.00');
    }

    // Divide a parte inteira e decimal
    let parts = formattedValue.split('.');

    // Adiciona o ponto para separar as milhares
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Se houver parte decimal, adiciona a vírgula
    if (parts.length > 1) {
      formattedValue = parts.join(',');
    }

    return formattedValue;
  }
}
