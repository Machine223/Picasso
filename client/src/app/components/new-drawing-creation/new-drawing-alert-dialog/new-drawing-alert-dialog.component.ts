import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-drawing-alert-dialog',
  templateUrl: './new-drawing-alert-dialog.component.html',
  styleUrls: ['./new-drawing-alert-dialog.component.scss']
})
export class NewDrawingAlertDialogComponent {

  isHovering: boolean;

  constructor(public dialogAlertRef: MatDialogRef<NewDrawingAlertDialogComponent>) {
    this.isHovering = false;
  }

  setHover(bool: boolean): void {
    this.isHovering = bool;
  }

  closeDialog(): void {
    this.dialogAlertRef.close(false);
  }

  confirmDrawing(): void {
    this.dialogAlertRef.close(true);
  }
}
