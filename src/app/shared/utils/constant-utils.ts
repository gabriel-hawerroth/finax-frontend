import { ButtonStyle } from '../../core/enums/button-style';

export const cloudFireCdnLink: string = 'https://d3dpbaewouik5z.cloudfront.net';
export const cloudFireCdnImgsLink: string =
  'https://d3dpbaewouik5z.cloudfront.net/imgs/';

export function getBtnStyle(style: string): ButtonStyle {
  switch (style) {
    case 'basic':
      return ButtonStyle.BASIC;
    case 'raised':
      return ButtonStyle.RAISED;
    case 'stroked':
      return ButtonStyle.STROKED;
    case 'flat':
      return ButtonStyle.FLAT;
    case 'icon':
      return ButtonStyle.ICON;
    case 'fab':
      return ButtonStyle.FAB;
    case 'mini-fab':
      return ButtonStyle.MINI_FAB;
    case 'extended-fab':
      return ButtonStyle.EXTENDED_FAB;
    default:
      return ButtonStyle.BASIC;
  }
}
