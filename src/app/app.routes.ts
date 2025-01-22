import { Routes } from '@angular/router';
import { BasicTierGuard } from './core/guards/basic-tier.guard';
import { FreeTierGuard } from './core/guards/free-tier.guard';
import { UnauthenticatedUserGuard } from './core/guards/unauthenticated-user.guard';
import { MyBankAccountsPage } from './main/pages/accounts/views/principal/accounts.component';
import { AccountsFormPage } from './main/pages/accounts/views/register/accounts-register.component';
import { CashFlowPage } from './main/pages/cash-flow/views/principal/cash-flow.component';
import { CategoriesPage } from './main/pages/categories/views/principal/categories.component';
import { CreditCardInvoicePage } from './main/pages/credit-card-invoice/views/principal/credit-card-invoice.component';
import { CreditCardsFormPage } from './main/pages/credit-card/views/form/credit-cards-form.component';
import { CreditCardsPage } from './main/pages/credit-card/views/principal/credit-cards.component';
import { HomePage } from './main/pages/home/views/principal/home.component';
import { MyProfilePage } from './main/pages/my-profile/views/principal/my-profile.component';
import { UserSettingsPage } from './main/pages/user-settings/views/principal/user-settings.component';
import { AccountCanceledPage } from './main/public/views/account-canceled/account-canceled.component';
import { CancelationErrorPage } from './main/public/views/cancelation-error/cancelation-error.component';
import { ChangePasswordPage } from './main/public/views/change-password/change-password.component';
import { CreateAccountPage } from './main/public/views/create-account/create-account.component';
import { ForgotPasswordPage } from './main/public/views/forgot-password/forgot-password.component';
import { LoginPage } from './main/public/views/login/login.component';
import { PublicPage } from './main/public/views/principal/public.component';
import { PrivacyPolicyPage } from './main/public/views/privacy-policy/privacy-policy.component';
import { UseTermsPage } from './main/public/views/use-terms/use-terms.component';
import { UserActivationPage } from './main/public/views/user-activation/user-activation.component';
import { SystemErrorWarningPage } from './shared/components/system-error-warning/system-error-warning.component';
import { ExpiredLinkComponent } from './shared/components/expired-link/expired-link.component';

export const routes: Routes = [
  { path: '', component: PublicPage },
  {
    path: 'fora-do-ar',
    component: SystemErrorWarningPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'link-expirado',
    component: ExpiredLinkComponent,
  },
  {
    path: 'login',
    component: LoginPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'nova-conta',
    component: CreateAccountPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'ativacao-da-conta',
    component: UserActivationPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'esqueci-minha-senha',
    component: ForgotPasswordPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'recuperacao-da-senha/:userId',
    component: ChangePasswordPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'conta-cancelada',
    component: AccountCanceledPage,
  },
  {
    path: 'erro-cancelamento',
    component: CancelationErrorPage,
  },
  {
    path: 'politica-de-privacidade',
    component: PrivacyPolicyPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'termos-de-uso',
    component: UseTermsPage,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'home',
    component: HomePage,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'fluxo-de-caixa',
    component: CashFlowPage,
    canActivate: [FreeTierGuard],
  },
  // {
  //   path: 'investimentos',
  //   component: InvestmentsComponent,
  //   canActivate: [BasicTierGuard],
  // },
  // {
  //   path: 'relatorio/fluxo-de-caixa',
  //   component: ReportCashFlowComponent,
  //   canActivate: [BasicTierGuard],
  // },
  // {
  //   path: 'relatorio/investimentos',
  //   component: ReportInvestmentsComponent,
  //   canActivate: [BasicTierGuard],
  // },
  // {
  //   path: 'indicadores',
  //   component: MarketIndicatorsComponent,
  //   canActivate: [PremiumTierGuard],
  // },
  // {
  //   path: 'noticias/b3',
  //   component: NoticesBrazilComponent,
  //   canActivate: [PremiumTierGuard],
  // },
  // {
  //   path: 'noticias/internacional',
  //   component: NoticesInternationalComponent,
  //   canActivate: [PremiumTierGuard],
  // },
  // {
  //   path: 'noticias/criptos',
  //   component: NoticesCriptoComponent,
  //   canActivate: [PremiumTierGuard],
  // },
  // {
  //   path: 'metas-de-gasto',
  //   component: SpendingGoalsComponent,
  //   canActivate: [FreeTierGuard],
  // },
  {
    path: 'contas',
    component: MyBankAccountsPage,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'contas/:id',
    component: AccountsFormPage,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'cartoes-de-credito',
    component: CreditCardsPage,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'cartoes-de-credito/:id',
    component: CreditCardsFormPage,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'cartoes-de-credito/fatura/:id',
    component: CreditCardInvoicePage,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'categorias',
    component: CategoriesPage,
    canActivate: [FreeTierGuard],
  },
  // {
  //   path: 'calculadora-de-juros',
  //   component: InterestCalculatorComponent,
  //   canActivate: [BasicTierGuard],
  // },
  {
    path: 'meu-perfil',
    component: MyProfilePage,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'configuracoes',
    component: UserSettingsPage,
    canActivate: [FreeTierGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
