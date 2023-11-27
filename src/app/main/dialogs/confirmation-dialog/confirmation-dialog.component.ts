import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from '../../../utils/utils.service';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent implements OnInit {
  @Input() message: string = '';

  private _dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  public utilsService = inject(UtilsService);

  language: string = '';

  ngOnInit(): void {
    this.utilsService.userConfigs.asObservable().subscribe((value) => {
      this.language = value!.language;
    });
  }

  onConfirmClick(): void {
    this._dialogRef.close(true);
  }

  onCancelClick(): void {
    this._dialogRef.close(false);
  }
}
