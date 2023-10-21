import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthenticatedUserGuard } from './services/guards/unauthenticated-user.guard';
import { FreeTierGuard } from './services/guards/free-tier.guard';
import { BasicTierGuard } from './services/guards/basic-tier.guard';
import { PremiumTierGuard } from './services/guards/premium-tier.guard';
import { AdmTierGuard } from './services/guards/adm-tier.guard';
import { PublicComponent } from './components/pages/public/public.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/public/components/login/login.component';
import { CreateAccountComponent } from './components/pages/public/components/create-account/create-account.component';
import { ForgotMyPasswordComponent } from './components/pages/public/components/forgot-my-password/forgot-my-password.component';
import { CashFlowComponent } from './components/pages/cash-flow/cash-flow.component';
import { InvestmentsComponent } from './components/pages/investments/investments.component';
import { ReportCashFlowComponent } from './components/pages/report-cash-flow/report-cash-flow.component';
import { MarketIndicatorsComponent } from './components/pages/market-indicators/market-indicators.component';
import { NoticesBrazilComponent } from './components/pages/notices-brazil/notices-brazil.component';
import { NoticesInternationalComponent } from './components/pages/notices-international/notices-international.component';
import { NoticesCriptoComponent } from './components/pages/notices-cripto/notices-cripto.component';
import { ReportInvestmentsComponent } from './components/pages/report-investments/report-investments.component';
import { SpendingGoalsComponent } from './components/pages/spending-goals/spending-goals.component';
import { MyBankAccountsComponent } from './components/pages/my-bank-accounts/my-bank-accounts.component';
import { InterestCalculatorComponent } from './components/pages/interest-calculator/interest-calculator.component';
import { MyProfileComponent } from './components/pages/my-profile/my-profile.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { UserActivationComponent } from './components/pages/public/components/user-activation/user-activation.component';
import { ChangePasswordComponent } from './components/pages/public/components/change-password/change-password.component';

const routes: Routes = [
  { path: '', component: PublicComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'nova-conta',
    component: CreateAccountComponent,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'ativacao-da-conta',
    component: UserActivationComponent,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'esqueci-minha-senha',
    component: ForgotMyPasswordComponent,
    canActivate: [UnauthenticatedUserGuard],
  },
  {
    path: 'recuperacao-da-senha/:userId',
    component: ChangePasswordComponent,
    canActivate: [UnauthenticatedUserGuard],
  },
  { path: 'home', component: HomeComponent, canActivate: [FreeTierGuard] },
  {
    path: 'fluxo-de-caixa',
    component: CashFlowComponent,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'investimentos',
    component: InvestmentsComponent,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'relatorio/fluxo-de-caixa',
    component: ReportCashFlowComponent,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'relatorio/investimentos',
    component: ReportInvestmentsComponent,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'indicadores',
    component: MarketIndicatorsComponent,
    canActivate: [PremiumTierGuard],
  },
  {
    path: 'noticias/b3',
    component: NoticesBrazilComponent,
    canActivate: [PremiumTierGuard],
  },
  {
    path: 'noticias/internacional',
    component: NoticesInternationalComponent,
    canActivate: [PremiumTierGuard],
  },
  {
    path: 'noticias/criptos',
    component: NoticesCriptoComponent,
    canActivate: [PremiumTierGuard],
  },
  {
    path: 'metas-de-gasto',
    component: SpendingGoalsComponent,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'minhas-contas-de-banco',
    component: MyBankAccountsComponent,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'calculadora-de-juros',
    component: InterestCalculatorComponent,
    canActivate: [BasicTierGuard],
  },
  {
    path: 'meu-perfil',
    component: MyProfileComponent,
    canActivate: [FreeTierGuard],
  },
  {
    path: 'configuracoes',
    component: SettingsComponent,
    canActivate: [FreeTierGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
