import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { UtilsService } from '../utils.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
  ],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.scss',
})
export class ButtonsComponent {
  @Input() showNew: boolean = false;
  @Input() showSave: boolean = false;
  @Input() showDelete: boolean = false;
  @Input() showEdit: boolean = false;
  @Input() showDownload: boolean = false;
  @Input() showClose: boolean = false;
  @Input() showGoBack: boolean = false;
  @Input() showChangePassword: boolean = false;

  @Input() disableNew: boolean = false;
  @Input() disableSave: boolean = false;
  @Input() disableDelete: boolean = false;
  @Input() disableEdit: boolean = false;
  @Input() disableDownload: boolean = false;
  @Input() disableChangePassword: boolean = false;

  @Output() onNew = new EventEmitter();
  @Output() onSave = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  @Output() onEdit = new EventEmitter();
  @Output() onDownload = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @Output() onGoBack = new EventEmitter();
  @Output() onChangePassword = new EventEmitter();

  @Input() smallBtn: boolean = false;
  @Input() bigBtn: boolean = false;

  @Input() ptBrLabelNew: string = 'Novo';

  private _utilsService = inject(UtilsService);

  language = this._utilsService.getUserConfigs.language;
  isPcScreen = this._utilsService.isPcScreen;

  get getBtnSize(): number {
    if (this.smallBtn && this.bigBtn) {
      return 1.6;
    }

    if (this.smallBtn) return 1.3;
    else if (this.bigBtn) return 1.9;

    return 1.6;
  }
}
