import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-saving-feature-confirmation-dialog',
  templateUrl: './saving-feature-confirmation-dialog.component.html',
  styleUrls: ['./saving-feature-confirmation-dialog.component.scss']
})
export class SavingFeatureConfirmationDialogComponent {

  isHovering: boolean;

  constructor(public dialogAlertRef: MatDialogRef<SavingFeatureConfirmationDialogComponent>) {
    this.isHovering = false;
  }

  setHover(bool: boolean): void {
    this.isHovering = bool;
  }

  closeDialog(): boolean {
    this.dialogAlertRef.close(false);
    return false;
  }

  confirmDrawing(): boolean {
    this.dialogAlertRef.close(true);
    return true;
  }
}
