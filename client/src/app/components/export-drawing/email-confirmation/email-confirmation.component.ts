import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ExportDrawingService } from '@app-services/exportDrawing/export-drawing.service';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent {

  constructor( public exportDrawingService: ExportDrawingService,
               public dialogRef: MatDialogRef<EmailConfirmationComponent>) { }

  closeDialog(): void {
    this.dialogRef.close(false);
  }

  confirmSending(): void {
    this.dialogRef.close(true);
  }
}
