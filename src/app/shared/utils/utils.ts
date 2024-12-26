import { environment } from '../../../environments/environment';
import { Account } from '../../core/entities/account/account';
import { BasicAccount } from '../../core/entities/account/account-dto';
import { HomeAccount } from '../../core/entities/home-p/home-dto';
import { AccountType } from '../../core/enums/account-enums';
import { ButtonType } from '../../core/enums/button-style';
import { ResponsiveService } from './responsive.service';

export const cloudFireCdnLink: string = environment.cloudFrontUrl;
export const cloudFireCdnImgsLink: string = `${cloudFireCdnLink}/imgs/`;

export const HIDE_VALUE = '---';

export function getBtnStyle(style: string): ButtonType {
  switch (style) {
    case 'basic':
      return ButtonType.BASIC;
    case 'raised':
      return ButtonType.RAISED;
    case 'stroked':
      return ButtonType.STROKED;
    case 'flat':
      return ButtonType.FLAT;
    case 'icon':
      return ButtonType.ICON;
    case 'fab':
      return ButtonType.FAB;
    case 'mini-fab':
      return ButtonType.MINI_FAB;
    case 'extended-fab':
      return ButtonType.EXTENDED_FAB;
    default:
      return ButtonType.BASIC;
  }
}

export function getDefaultAccountImage(
  account: Account | BasicAccount | HomeAccount
): string {
  if (account.type === AccountType.CASH) {
    return 'payments';
  }

  return 'account_balance';
}

export function getResponsiveFieldWidth(
  widths: Widths,
  defaultWidth: string = '100%',
  minWidth?: string
) {
  return (responsiveService: ResponsiveService) => {
    let width: string;

    if (responsiveService.isMobileView()) {
      width = widths.sm || defaultWidth;
    } else if (responsiveService.mediumWidth()) {
      width = widths.md || defaultWidth;
    } else if (responsiveService.largeWidth()) {
      width = widths.lg || defaultWidth;
    } else {
      width = widths.xl || defaultWidth;
    }

    return `width: ${width};${minWidth ? 'min-width: ' + minWidth : ''}`;
  };
}

export interface Widths {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}
