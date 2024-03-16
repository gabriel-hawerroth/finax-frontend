import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  input,
} from '@angular/core';
import { UtilsService } from '../utils.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonsComponent {
  @Output() onNew = new EventEmitter();
  @Output() onSave = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onDownload = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @Output() onGoBack = new EventEmitter();
  @Output() onChangePassword = new EventEmitter();
  @Output() onGeneric = new EventEmitter();

  public readonly showNew = input<boolean>(false);
  public readonly showSave = input<boolean>(false);
  public readonly showDelete = input<boolean>(false);
  public readonly showEdit = input<boolean>(false);
  public readonly showDownload = input<boolean>(false);
  public readonly showClose = input<boolean>(false);
  public readonly showGoBack = input<boolean>(false);
  public readonly showChangePassword = input<boolean>(false);
  public readonly showGeneric = input<boolean>(false);

  public readonly disableNew = input<boolean>(false);
  public readonly disableSave = input<boolean>(false);
  public readonly disableDelete = input<boolean>(false);
  public readonly disableEdit = input<boolean>(false);
  public readonly disableDownload = input<boolean>(false);
  public readonly disableChangePassword = input<boolean>(false);
  public readonly disableGeneric = input<boolean>(false);

  public readonly showSaveLoading = input<boolean>(false);

  public readonly smallBtn = input<boolean>(false);
  public readonly bigBtn = input<boolean>(false);

  public readonly labelNewM = input<boolean>(false);

  public readonly genericIcon = input<string>('');
  public readonly genericLabel = input<string>('');
  public readonly genericColor = input<string>('');

  private readonly _utilsService = inject(UtilsService);

  public readonly isPcScreen = this._utilsService.isPcScreen;

  get getBtnSize(): number {
    if (this.smallBtn() && this.bigBtn()) return 1.6;
    else if (this.smallBtn()) return 1.3;
    else if (this.bigBtn()) return 1.9;

    return 1.6;
  }
}
