import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCurrencyDirective } from 'ngx-currency';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { AccountConfigs } from '../../../../../core/entities/account/account-dto';
import { AccountService } from '../../../../../core/entities/account/account.service';
import { AccountType } from '../../../../../core/enums/account-enums';
import { SelectIconDialog } from '../../../../../shared/components/select-icon-dialog/select-icon-dialog.component';
import { ResponsiveService } from '../../../../../shared/utils/responsive.service';
import {
  cloudFireCdnImgsLink,
  getResponsiveFieldWidth,
  Widths,
} from '../../../../../shared/utils/utils';
import { UtilsService } from '../../../../../shared/utils/utils.service';

@Component({
  selector: 'app-accounts-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    NgxCurrencyDirective,
    NgOptimizedImage,
    TranslateModule,
    MatTooltipModule,
  ],
  templateUrl: './accounts-form.component.html',
  styleUrl: './accounts-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsFormComponent implements OnInit, OnDestroy {
  readonly cloudFireCdnImgsLink = cloudFireCdnImgsLink;
  readonly currency = this._utils.getUserConfigs.currency;
  readonly isMobileView = this._responsiveService.isMobileView;

  private readonly _unsubscribeAll = new Subject<void>();

  accountForm = input.required<FormGroup>();
  accountId = input.required<number | null>();
  isDialog = input<boolean>(false);
  selectedIcon = output<void>();

  configs!: AccountConfigs[];

  constructor(
    private readonly _utils: UtilsService,
    private readonly _dialog: MatDialog,
    private readonly _accountService: AccountService,
    private readonly _responsiveService: ResponsiveService
  ) {}

  ngOnInit(): void {
    this.accountForm().controls['active'].disable();

    this.configs = this._accountService.getConfigs(
      Boolean(this.accountForm().controls['primaryAccountId'].getRawValue())
    );

    this.subscribeToFormChanges();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  public openSelectIconDialog() {
    lastValueFrom(
      this._dialog.open(SelectIconDialog, { autoFocus: false }).afterClosed()
    ).then((value) => {
      if (!value) return;
      this.selectIcon(value);
    });
  }

  public selectIcon(icon: string) {
    this.accountForm().get('image')!.setValue(icon);
    this.accountForm().markAsDirty();
    this.selectedIcon.emit();
  }

  removeAccountType(event: MouseEvent) {
    event.stopPropagation();
    this.accountForm().get('type')!.setValue(null);
    this.accountForm().markAsDirty();
  }

  get showDescriptionErrorHint() {
    return (
      this.accountForm().controls['name'].touched &&
      this.accountForm().controls['name'].hasError('required')
    );
  }

  private subscribeToFormChanges() {
    const formControls = this.accountForm().controls;

    formControls['primaryAccountId'].valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.configs.find((config) => config.key === 'grouper')!.show =
          !Boolean(value);
      });

    formControls['grouper'].valueChanges
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => this.onGrouperChange(value));
  }

  onGrouperChange(newValue: boolean) {
    const formControls = this.accountForm().controls;

    if (newValue) {
      if (formControls['type'].getRawValue() === AccountType.CASH)
        formControls['type'].setValue(null);

      return;
    }
  }

  get disableCashType() {
    return this.accountForm().controls['grouper'].getRawValue();
  }

  getResponsiveFieldWidth(
    widths: Widths,
    defaultWidth?: string,
    minWidth?: string
  ) {
    return getResponsiveFieldWidth(
      widths,
      defaultWidth,
      minWidth
    )(this._responsiveService);
  }
}
