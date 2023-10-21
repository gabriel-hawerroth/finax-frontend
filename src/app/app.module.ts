import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
// primeng
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';
// ngx
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

// internos
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './services/interceptors/token.interceptor';
import { PublicComponent } from './components/pages/public/public.component';
import { LoginComponent } from './components/pages/public/components/login/login.component';
import { CreateAccountComponent } from './components/pages/public/components/create-account/create-account.component';
import { ForgotMyPasswordComponent } from './components/pages/public/components/forgot-my-password/forgot-my-password.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/pages/home/home.component';
import { CashFlowComponent } from './components/pages/cash-flow/cash-flow.component';
import { InvestmentsComponent } from './components/pages/investments/investments.component';
import { ReportCashFlowComponent } from './components/pages/report-cash-flow/report-cash-flow.component';
import { ReportInvestmentsComponent } from './components/pages/report-investments/report-investments.component';
import { MarketIndicatorsComponent } from './components/pages/market-indicators/market-indicators.component';
import { NoticesBrazilComponent } from './components/pages/notices-brazil/notices-brazil.component';
import { NoticesInternationalComponent } from './components/pages/notices-international/notices-international.component';
import { NoticesCriptoComponent } from './components/pages/notices-cripto/notices-cripto.component';
import { SpendingGoalsComponent } from './components/pages/spending-goals/spending-goals.component';
import { MyBankAccountsComponent } from './components/pages/my-bank-accounts/my-bank-accounts.component';
import { InterestCalculatorComponent } from './components/pages/interest-calculator/interest-calculator.component';
import { MyProfileComponent } from './components/pages/my-profile/my-profile.component';
import { SettingsComponent } from './components/pages/settings/settings.component';
import { UserActivationComponent } from './components/pages/public/components/user-activation/user-activation.component';
import { ChangePasswordComponent } from './components/pages/public/components/change-password/change-password.component';
import { ChangePasswordDialogComponent } from './components/dialogs/change-password-dialog/change-password-dialog.component';
import { ConfirmationDialogComponent } from './components/dialogs/confirmation-dialog/confirmation-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PublicComponent,
    LoginComponent,
    SidebarComponent,
    HeaderComponent,
    CreateAccountComponent,
    ForgotMyPasswordComponent,
    CashFlowComponent,
    InvestmentsComponent,
    ReportCashFlowComponent,
    ReportInvestmentsComponent,
    MarketIndicatorsComponent,
    NoticesBrazilComponent,
    NoticesInternationalComponent,
    NoticesCriptoComponent,
    SpendingGoalsComponent,
    MyBankAccountsComponent,
    InterestCalculatorComponent,
    MyProfileComponent,
    SettingsComponent,
    UserActivationComponent,
    ChangePasswordComponent,
    ChangePasswordDialogComponent,
    ConfirmationDialogComponent,
  ],
  imports: [
    //angular
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MatDividerModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    FlexLayoutModule,
    MatListModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatRadioModule,
    MatSelectModule,
    //primeng
    InputTextModule,
    ButtonModule,
    RatingModule,
    ScrollPanelModule,
    InputSwitchModule,
    RippleModule,
    SelectButtonModule,
    //ngx
    NgxMaskDirective,
    NgxMaskPipe,
    NgxMaskDirective,
  ],
  providers: [
    provideNgxMask(),
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-br' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
