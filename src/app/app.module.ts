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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
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
import {
  NgxCurrencyDirective,
  NgxCurrencyInputMode,
  provideEnvironmentNgxCurrency,
} from 'ngx-currency';

// internos
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './services/interceptors/token.interceptor';
import { PublicComponent } from './main/pages/public/public.component';
import { LoginComponent } from './main/pages/public/components/login/login.component';
import { CreateAccountComponent } from './main/pages/public/components/create-account/create-account.component';
import { ForgotMyPasswordComponent } from './main/pages/public/components/forgot-my-password/forgot-my-password.component';
import { SidebarComponent } from './main/sidebar/sidebar.component';
import { HeaderComponent } from './main/header/header.component';
import { HomeComponent } from './main/pages/home/home.component';
import { CashFlowComponent } from './main/pages/cash-flow/cash-flow.component';
import { InvestmentsComponent } from './main/pages/investments/investments.component';
import { ReportCashFlowComponent } from './main/pages/report-cash-flow/report-cash-flow.component';
import { ReportInvestmentsComponent } from './main/pages/report-investments/report-investments.component';
import { MarketIndicatorsComponent } from './main/pages/market-indicators/market-indicators.component';
import { NoticesBrazilComponent } from './main/pages/notices-brazil/notices-brazil.component';
import { NoticesInternationalComponent } from './main/pages/notices-international/notices-international.component';
import { NoticesCriptoComponent } from './main/pages/notices-cripto/notices-cripto.component';
import { SpendingGoalsComponent } from './main/pages/spending-goals/spending-goals.component';
import { MyBankAccountsComponent } from './main/pages/my-bank-accounts/my-bank-accounts.component';
import { InterestCalculatorComponent } from './main/pages/interest-calculator/interest-calculator.component';
import { MyProfileComponent } from './main/pages/my-profile/my-profile.component';
import { SettingsComponent } from './main/pages/settings/settings.component';
import { UserActivationComponent } from './main/pages/public/components/user-activation/user-activation.component';
import { ChangePasswordComponent } from './main/pages/public/components/change-password/change-password.component';
import { ChangePasswordDialogComponent } from './main/dialogs/change-password-dialog/change-password-dialog.component';
import { ConfirmationDialogComponent } from './main/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BankAccountsEditComponent } from './main/pages/my-bank-accounts/components/bank-accounts-edit/bank-accounts-edit.component';
import { EditBalanceDialogComponent } from './main/pages/my-bank-accounts/components/edit-balance-dialog/edit-balance-dialog.component';
import { CustomCurrencyPipe } from './utils/customCurrencyPipe';

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
    BankAccountsEditComponent,
    EditBalanceDialogComponent,
    CustomCurrencyPipe,
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
    DragDropModule,
    MatExpansionModule,
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
    NgxMatSelectSearchModule,
    NgxMaskDirective,
    NgxCurrencyDirective,
  ],
  providers: [
    provideNgxMask(),
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-br' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    provideEnvironmentNgxCurrency({
      align: 'right',
      allowNegative: true,
      allowZero: true,
      decimal: ',',
      precision: 2,
      prefix: '',
      suffix: '',
      thousands: '.',
      nullable: false,
      min: null,
      max: null,
      inputMode: NgxCurrencyInputMode.Financial,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
