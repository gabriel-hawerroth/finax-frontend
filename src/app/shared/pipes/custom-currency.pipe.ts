import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true,
})
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) {
      return '';
    }

    let formattedValue = value.toString();

    if (!formattedValue.includes('.')) {
      formattedValue = formattedValue.concat('.00');
    }

    let parts = formattedValue.split('.');

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    parts[1] = parts[1].substring(0, 2);

    if (parts.length > 1) {
      formattedValue = parts.join(',');
    }

    return formattedValue;
  }
}
