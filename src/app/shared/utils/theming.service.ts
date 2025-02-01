import { effect, Injectable, signal } from '@angular/core';

type Theme = {
  name: string;
  primaryBackgroundColor: string;
  sidebarBackgroundColor: string;
  cardBackgroundColor: string;
  backgroundHoverColor: string;
  buttonColor: string;
  primaryFontColor: string;
  sidebarFontColor: string;
  disabledFontColor: string;
  pageTitleFontColor: string;
  formFieldHintFontColor: string;
  cardTitleFontColor: string;
  snackBarMessageFontColor: string;
  policyPageParagraphFontColor: string;
  emptyMessageFontColor: string;
  dividerColor: string;
  defaultBoxShadow: string;
  defaultAccountLogoBoxShadow: string;
  defaultAccountLogoColor: string;
  categoryOptionColor: string;
  buttonHoverBackgroundColor: string;
  separator: string;
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
      buttonColor: '#176c00',
      primaryFontColor: '#000000da',
      sidebarFontColor: '#666666',
      disabledFontColor: '#9a9a9a',
      pageTitleFontColor: '#383838',
      formFieldHintFontColor: '#3a3a3a',
      cardTitleFontColor: '#1A1C18',
      snackBarMessageFontColor: '#fff',
      policyPageParagraphFontColor: '#343434',
      emptyMessageFontColor: '#818181',
      dividerColor: '#9a9a9a4d',
      defaultBoxShadow: '2px 2px 5px #9292924d',
      defaultAccountLogoBoxShadow: '0 0 0 1px #747474',
      defaultAccountLogoColor: '#3f3f3f',
      categoryOptionColor: '#fff',
      buttonHoverBackgroundColor: '#74747430',
      separator: '1px solid #6161613b',
      background: '#f9fff8',
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
      buttonColor: '#afafaf',
      primaryFontColor: '#dfdfdf',
      sidebarFontColor: '#dedede',
      disabledFontColor: '#9a9a9a',
      pageTitleFontColor: '#e6e6e6',
      formFieldHintFontColor: '#999999',
      cardTitleFontColor: '#dfdfdf',
      snackBarMessageFontColor: '#fff',
      policyPageParagraphFontColor: '#dfdfdf',
      emptyMessageFontColor: '#818181',
      dividerColor: '#8787872c',
      defaultBoxShadow: '2px 2px 5px #9292924d',
      defaultAccountLogoBoxShadow: '0 0 0 1px #747474',
      defaultAccountLogoColor: '#3f3f3f',
      categoryOptionColor: '#fff',
      buttonHoverBackgroundColor: '#74747430',
      separator: '1px solid #6161613b',
      background: '#191c1e',
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
  public buttonColor = signal(this.definedThemes[0].buttonColor);
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
  public dividerColor = signal(this.definedThemes[0].dividerColor);
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
      buttonColor,
      primaryFontColor,
      sidebarFontColor,
      disabledFontColor,
      pageTitleFontColor,
      formFieldHintFontColor,
      cardTitleFontColor,
      snackBarMessageFontColor,
      policyPageParagraphFontColor,
      emptyMessageFontColor,
      dividerColor,
      defaultBoxShadow,
      defaultAccountLogoBoxShadow,
      defaultAccountLogoColor,
      categoryOptionColor,
      buttonHoverBackgroundColor,
      separator,
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
    this.buttonColor.set(buttonColor);
    this.primaryFontColor.set(primaryFontColor);
    this.sidebarFontColor.set(sidebarFontColor);
    this.disabledFontColor.set(disabledFontColor);
    this.pageTitleFontColor.set(pageTitleFontColor);
    this.formFieldHintFontColor.set(formFieldHintFontColor);
    this.cardTitleFontColor.set(cardTitleFontColor);
    this.snackBarMessageFontColor.set(snackBarMessageFontColor);
    this.policyPageParagraphFontColor.set(policyPageParagraphFontColor);
    this.emptyMessageFontColor.set(emptyMessageFontColor);
    this.dividerColor.set(dividerColor);
    this.defaultBoxShadow.set(defaultBoxShadow);
    this.defaultAccountLogoBoxShadow.set(defaultAccountLogoBoxShadow);
    this.defaultAccountLogoColor.set(defaultAccountLogoColor);
    this.categoryOptionColor.set(categoryOptionColor);
    this.buttonHoverBackgroundColor.set(buttonHoverBackgroundColor);
    this.separator.set(separator);

    this.primary.set(primary);
    this.primaryLight.set(primaryLight);
    this.primaryDark.set(primaryDark);
    this.background.set(background);
    this.ripple.set(ripple);
    this.error.set(error);
  }
}
