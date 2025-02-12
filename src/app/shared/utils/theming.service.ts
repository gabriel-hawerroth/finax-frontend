import { Injectable, signal } from '@angular/core';

type Theme = {
  name: string;
  primaryBackgroundColor: string;
  sidebarBackgroundColor: string;
  cardBackgroundColor: string;
  backgroundHoverColor: string;
  buttonTextColor: string;
  buttonBorderColor: string;
  primaryFontColor: string;
  sidebarFontColor: string;
  disabledFontColor: string;
  pageTitleFontColor: string;
  formFieldHintFontColor: string;
  cardTitleFontColor: string;
  snackBarMessageFontColor: string;
  policyPageParagraphFontColor: string;
  emptyMessageFontColor: string;
  amountsFontColor: string;
  dividerColor: string;
  iconBoxShadow: string;
  defaultBoxShadow: string;
  defaultAccountLogoBoxShadow: string;
  defaultAccountLogoColor: string;
  categoryOptionColor: string;
  buttonHoverBackgroundColor: string;
  separator: string;
  primaryGreen: string;
  background: string;
  primary: string;
  primaryLight: string;
  ripple: string;
  primaryDark: string;
  error: string;
};

@Injectable({
  providedIn: 'root',
})
export class ThemingService {
  public definedThemes: Theme[] = [
    {
      name: 'light',
      primaryBackgroundColor: '#eff3f8',
      sidebarBackgroundColor: '#fafafa',
      cardBackgroundColor: '#fefefe',
      backgroundHoverColor: '#f5f5f5',
      buttonTextColor: '#176c00',
      buttonBorderColor: '#afafaf',
      primaryFontColor: '#000000da',
      sidebarFontColor: '#666666',
      disabledFontColor: '#9a9a9a',
      pageTitleFontColor: '#383838',
      formFieldHintFontColor: '#3a3a3a',
      cardTitleFontColor: '#1A1C18',
      snackBarMessageFontColor: '#fff',
      policyPageParagraphFontColor: '#343434',
      emptyMessageFontColor: '#818181',
      amountsFontColor: '#3d799c',
      dividerColor: '#9a9a9a4d',
      iconBoxShadow: '0 0 2px #5d5d5d',
      defaultBoxShadow: '2px 2px 5px #9292924d',
      defaultAccountLogoBoxShadow: '0 0 0 1px #747474',
      defaultAccountLogoColor: '#3f3f3f',
      categoryOptionColor: '#fff',
      buttonHoverBackgroundColor: '#74747430',
      separator: '1px solid #6161613b',
      primaryGreen: '#176c00',
      background: '#fafafa',
      primary: '#176c00',
      primaryLight: '#dcffd4',
      ripple: '#1b80001e',
      primaryDark: '#072100',
      error: '#ba1a1a',
    },
    {
      name: 'dark',
      primaryBackgroundColor: '#383838',
      sidebarBackgroundColor: '#212121',
      cardBackgroundColor: '#212121',
      backgroundHoverColor: '#383838',
      buttonTextColor: '#dfdfdf',
      buttonBorderColor: '#afafaf93',
      primaryFontColor: '#dfdfdf',
      sidebarFontColor: '#dedede',
      disabledFontColor: '#9a9a9a',
      pageTitleFontColor: '#e6e6e6',
      formFieldHintFontColor: '#999999',
      cardTitleFontColor: '#dfdfdf',
      snackBarMessageFontColor: '#fff',
      policyPageParagraphFontColor: '#dfdfdf',
      emptyMessageFontColor: '#818181',
      amountsFontColor: '#3d799c',
      dividerColor: '#8787872c',
      iconBoxShadow: '0 0 2px #5d5d5d',
      defaultBoxShadow: '2px 2px 5px #9292924d',
      defaultAccountLogoBoxShadow: '0 0 0 1px #747474',
      defaultAccountLogoColor: '#3f3f3f',
      categoryOptionColor: '#fff',
      buttonHoverBackgroundColor: '#74747430',
      separator: '1px solid #6161613b',
      primaryGreen: '#176c00',
      background: '#383838',
      primary: '#176c00',
      primaryLight: '#747474',
      ripple: '#7efc661e',
      primaryDark: '#e6e6e6',
      error: '#ffb4ab',
    },
  ];

  public primaryBackgroundColor = signal(
    this.definedThemes[0].primaryBackgroundColor
  );
  public sidebarBackgroundColor = signal(
    this.definedThemes[0].sidebarBackgroundColor
  );
  public cardBackgroundColor = signal(
    this.definedThemes[0].cardBackgroundColor
  );
  public backgroundHoverColor = signal(
    this.definedThemes[0].backgroundHoverColor
  );
  public buttonTextColor = signal(this.definedThemes[0].buttonTextColor);
  public buttonBorderColor = signal(this.definedThemes[0].buttonBorderColor);
  public primaryFontColor = signal(this.definedThemes[0].primaryFontColor);
  public sidebarFontColor = signal(this.definedThemes[0].sidebarFontColor);
  public disabledFontColor = signal(this.definedThemes[0].disabledFontColor);
  public pageTitleFontColor = signal(this.definedThemes[0].pageTitleFontColor);
  public formFieldHintFontColor = signal(
    this.definedThemes[0].formFieldHintFontColor
  );
  public cardTitleFontColor = signal(this.definedThemes[0].cardTitleFontColor);
  public snackBarMessageFontColor = signal(
    this.definedThemes[0].snackBarMessageFontColor
  );
  public policyPageParagraphFontColor = signal(
    this.definedThemes[0].policyPageParagraphFontColor
  );
  public emptyMessageFontColor = signal(
    this.definedThemes[0].emptyMessageFontColor
  );
  public amountsFontColor = signal(this.definedThemes[0].amountsFontColor);
  public dividerColor = signal(this.definedThemes[0].dividerColor);
  public iconBoxShadow = signal(this.definedThemes[0].iconBoxShadow);
  public defaultBoxShadow = signal(this.definedThemes[0].defaultBoxShadow);
  public defaultAccountLogoBoxShadow = signal(
    this.definedThemes[0].defaultAccountLogoBoxShadow
  );
  public defaultAccountLogoColor = signal(
    this.definedThemes[0].defaultAccountLogoColor
  );
  public categoryOptionColor = signal(
    this.definedThemes[0].categoryOptionColor
  );
  public buttonHoverBackgroundColor = signal(
    this.definedThemes[0].buttonHoverBackgroundColor
  );
  public separator = signal(this.definedThemes[0].separator);
  public primaryGreen = signal(this.definedThemes[0].primaryGreen);

  public primary = signal(this.definedThemes[0].primary);
  public primaryLight = signal(this.definedThemes[0].primaryLight);
  public ripple = signal(this.definedThemes[0].ripple);
  public primaryDark = signal(this.definedThemes[0].primaryDark);
  public background = signal(this.definedThemes[0].background);
  public error = signal(this.definedThemes[0].error);

  constructor() {}

  public applyTheme(themeName: string) {
    const theme = this.definedThemes.find((t) => t.name === themeName);
    if (!theme) {
      console.error('Theme not found');
      return;
    }

    const {
      primaryBackgroundColor,
      sidebarBackgroundColor,
      cardBackgroundColor,
      backgroundHoverColor,
      buttonTextColor,
      buttonBorderColor,
      primaryFontColor,
      sidebarFontColor,
      disabledFontColor,
      pageTitleFontColor,
      formFieldHintFontColor,
      cardTitleFontColor,
      snackBarMessageFontColor,
      policyPageParagraphFontColor,
      emptyMessageFontColor,
      amountsFontColor,
      dividerColor,
      iconBoxShadow,
      defaultBoxShadow,
      defaultAccountLogoBoxShadow,
      defaultAccountLogoColor,
      categoryOptionColor,
      buttonHoverBackgroundColor,
      separator,
      primaryGreen,
      primary,
      primaryLight,
      primaryDark,
      ripple,
      background,
      error,
    } = theme;

    this.primaryBackgroundColor.set(primaryBackgroundColor);
    this.sidebarBackgroundColor.set(sidebarBackgroundColor);
    this.cardBackgroundColor.set(cardBackgroundColor);
    this.backgroundHoverColor.set(backgroundHoverColor);
    this.buttonTextColor.set(buttonTextColor);
    this.buttonBorderColor.set(buttonBorderColor);
    this.primaryFontColor.set(primaryFontColor);
    this.sidebarFontColor.set(sidebarFontColor);
    this.disabledFontColor.set(disabledFontColor);
    this.pageTitleFontColor.set(pageTitleFontColor);
    this.formFieldHintFontColor.set(formFieldHintFontColor);
    this.cardTitleFontColor.set(cardTitleFontColor);
    this.snackBarMessageFontColor.set(snackBarMessageFontColor);
    this.policyPageParagraphFontColor.set(policyPageParagraphFontColor);
    this.emptyMessageFontColor.set(emptyMessageFontColor);
    this.amountsFontColor.set(amountsFontColor);
    this.dividerColor.set(dividerColor);
    this.iconBoxShadow.set(iconBoxShadow);
    this.defaultBoxShadow.set(defaultBoxShadow);
    this.defaultAccountLogoBoxShadow.set(defaultAccountLogoBoxShadow);
    this.defaultAccountLogoColor.set(defaultAccountLogoColor);
    this.categoryOptionColor.set(categoryOptionColor);
    this.buttonHoverBackgroundColor.set(buttonHoverBackgroundColor);
    this.separator.set(separator);
    this.primaryGreen.set(primaryGreen);

    this.primary.set(primary);
    this.primaryLight.set(primaryLight);
    this.primaryDark.set(primaryDark);
    this.background.set(background);
    this.ripple.set(ripple);
    this.error.set(error);
  }
}
