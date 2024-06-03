import { Routes } from '@angular/router';
import { CashFlowPage } from './main/pages/cash-flow/cash-flow.component';
import { CategoriesPage } from './main/pages/categories/categories.component';
import { CreditCardInvoicePage } from './main/pages/credit-cards/components/credit-card-invoice/credit-card-invoice.component';
import { CreditCardsFormPage } from './main/pages/credit-cards/components/credit-cards-form/credit-cards-form.component';
import { CreditCardsPage } from './main/pages/credit-cards/credit-cards.component';
import { HomePage } from './main/pages/home/home.component';
import { BankAccountsFormPage } from './main/pages/my-bank-accounts/components/bank-accounts-form/bank-accounts-form.component';
import { MyBankAccountsPage } from './main/pages/my-bank-accounts/my-bank-accounts.component';
import { MyProfilePage } from './main/pages/my-profile/my-profile.component';
import { ChangePasswordPage } from './main/pages/public/components/change-password/change-password.component';
import { CreateAccountPage } from './main/pages/public/components/create-account/create-account.component';
import { ForgotPasswordPage } from './main/pages/public/components/forgot-password/forgot-password.component';
import { LoginPage } from './main/pages/public/components/login/login.component';
import { UserActivationPage } from './main/pages/public/components/user-activation/user-activation.component';
import { PublicPage } from './main/pages/public/public.component';
import { UserSettingsPage } from './main/pages/user-settings/user-settings.component';
import { SystemErrorWarningPage } from './shared/components/system-error-warning/system-error-warning.component';
import { BasicTierGuard } from './shared/guards/basic-tier.guard';
import { FreeTierGuard } from './shared/guards/free-tier.guard';
import { UnauthenticatedUserGuard } from './shared/guards/unauthenticated-user.guard';

export const routes: Routes = [
  { path: '', component: PublicPage },
  { path: 'fora-do-ar', component: SystemErrorWarningPage },
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
    path: 'contas-de-banco',
    component: MyBankAccountsPage,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'contas-de-banco/:id',
    component: BankAccountsFormPage,
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
];
