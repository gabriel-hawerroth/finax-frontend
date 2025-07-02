import { Routes } from '@angular/router';
import { BasicTierGuard } from './core/guards/basic-tier.guard';
import { FreeTierGuard } from './core/guards/free-tier.guard';
import { UnauthenticatedUserGuard } from './core/guards/unauthenticated-user.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./main/public/views/principal/public.component').then(
        (m) => m.PublicPage
      ),
  },
  {
    path: 'fora-do-ar',
    loadComponent: () =>
      import(
        './shared/components/system-error-warning/system-error-warning.component'
      ).then((m) => m.SystemErrorWarningPage),
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'link-expirado',
    loadComponent: () =>
      import('./shared/components/expired-link/expired-link.component').then(
        (m) => m.ExpiredLinkComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./main/public/views/login/login.component').then(
        (m) => m.LoginPage
      ),
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'nova-conta',
    loadComponent: () =>
      import(
        './main/public/views/create-account/create-account.component'
      ).then((m) => m.CreateAccountPage),
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'ativacao-da-conta',
    loadComponent: () =>
      import(
        './main/public/views/user-activation/user-activation.component'
      ).then((m) => m.UserActivationPage),
  },
  {
    path: 'esqueci-minha-senha',
    loadComponent: () =>
      import(
        './main/public/views/forgot-password/forgot-password.component'
      ).then((m) => m.ForgotPasswordPage),
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'recuperacao-da-senha/:userId',
    loadComponent: () =>
      import(
        './main/public/views/change-password/change-password.component'
      ).then((m) => m.ChangePasswordPage),
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'conta-cancelada',
    loadComponent: () =>
      import(
        './main/public/views/account-canceled/account-canceled.component'
      ).then((m) => m.AccountCanceledPage),
  },
  {
    path: 'erro-cancelamento',
    loadComponent: () =>
      import(
        './main/public/views/cancelation-error/cancelation-error.component'
      ).then((m) => m.CancelationErrorPage),
  },
  {
    path: 'politica-de-privacidade',
    loadComponent: () =>
      import(
        './main/public/views/privacy-policy/privacy-policy.component'
      ).then((m) => m.PrivacyPolicyPage),
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'termos-de-uso',
    loadComponent: () =>
      import('./main/public/views/use-terms/use-terms.component').then(
        (m) => m.UseTermsPage
      ),
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./main/pages/home/views/principal/home.component').then(
        (m) => m.HomePage
      ),
    canActivate: [FreeTierGuard],
  },
  {
    path: 'fluxo-de-caixa',
    loadComponent: () =>
      import('./main/pages/cash-flow/views/principal/cash-flow.component').then(
        (m) => m.CashFlowPage
      ),
    canActivate: [FreeTierGuard],
  },
  {
    path: 'contas',
    loadComponent: () =>
      import('./main/pages/accounts/views/principal/accounts.component').then(
        (m) => m.MyBankAccountsPage
      ),
    canActivate: [FreeTierGuard],
  },
  {
    path: 'contas/:id',
    loadComponent: () =>
      import(
        './main/pages/accounts/views/register/accounts-register.component'
      ).then((m) => m.AccountsFormPage),
    canActivate: [FreeTierGuard],
  },
  {
    path: 'cartoes-de-credito',
    loadComponent: () =>
      import(
        './main/pages/credit-card/views/principal/credit-cards.component'
      ).then((m) => m.CreditCardsPage),
    canActivate: [BasicTierGuard],
  },
  {
    path: 'cartoes-de-credito/:id',
    loadComponent: () =>
      import(
        './main/pages/credit-card/views/form/credit-cards-form.component'
      ).then((m) => m.CreditCardsFormPage),
    canActivate: [BasicTierGuard],
  },
  {
    path: 'cartoes-de-credito/fatura/:id',
    loadComponent: () =>
      import(
        './main/pages/credit-card-invoice/views/principal/credit-card-invoice.component'
      ).then((m) => m.CreditCardInvoicePage),
    canActivate: [BasicTierGuard],
  },
  {
    path: 'categorias',
    loadComponent: () =>
      import(
        './main/pages/categories/views/principal/categories.component'
      ).then((m) => m.CategoriesPage),
    canActivate: [FreeTierGuard],
  },
  {
    path: 'relatorios',
    canActivate: [FreeTierGuard],
    children: [
      {
        path: 'por-categoria',
        loadComponent: () =>
          import(
            './main/pages/reports/views/releases-by-category/releases-by-category.component'
          ).then((m) => m.ReleasesByCategoryComponent),
      },
      {
        path: 'por-conta',
        loadComponent: () =>
          import(
            './main/pages/reports/views/releases-by-account/releases-by-account.component'
          ).then((m) => m.ReleasesByAccountComponent),
      },
    ],
  },
  {
    path: 'meu-perfil',
    loadComponent: () =>
      import(
        './main/pages/my-profile/views/principal/my-profile.component'
      ).then((m) => m.MyProfilePage),
    canActivate: [FreeTierGuard],
  },
  {
    path: 'configuracoes',
    loadComponent: () =>
      import(
        './main/pages/user-settings/views/principal/user-settings.component'
      ).then((m) => m.UserSettingsPage),
    canActivate: [FreeTierGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
