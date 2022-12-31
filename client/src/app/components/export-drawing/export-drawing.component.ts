import { Component, ElementRef, OnChanges, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ExportDrawingService } from '@app-services/exportDrawing/export-drawing.service';
import { ParsingService } from '@app-services/saving-feature/parsing.service';
import { filter } from 'rxjs/operators';
import { ExtensionType} from '../../../constants/constants';
import { EmailConfirmationComponent } from './email-confirmation/email-confirmation.component';

@Component({
  selector: 'app-export-drawing',
  templateUrl: './export-drawing.component.html',
  styleUrls: ['./export-drawing.component.scss']
})
export class ExportDrawingComponent implements OnChanges {

  isHovering: boolean;
  image: HTMLImageElement;
  isEmail: boolean;
  dialogConfirmRef: MatDialogRef<EmailConfirmationComponent>;
  emailControl: FormControl = new FormControl('', [Validators.required, Validators.email]);

  @ViewChild('save', {static: true})
  save: ElementRef;

  @ViewChild('canvas', {static: true})
  canvas: ElementRef;

  constructor(private parsingService: ParsingService,
              public dialogAlert: MatDialog,
              private exportDrawingService: ExportDrawingService,
              public dialogRef: MatDialogRef<ExportDrawingComponent>) {
    this.isHovering = false;
    this.parsingService.extractSVG();
    this.image = this.parsingService.image;
    this.drawCanvas();
    this.isEmail = false;
  }

  setHover(bool: boolean): void {
    this.isHovering = bool;
  }

  close(): void {
    this.dialogAlert.closeAll();
  }

  ngOnChanges(): void {
    this.drawCanvas();
    this.updateFilter('none', true);
  }

  saveImageSetAttribute(img: string): void {
    this.save.nativeElement.setAttribute('href', img);
    this.save.nativeElement.setAttribute('download',
      this.exportDrawingService.name + this.exportDrawingService.extensionType);
  }

  saveImage(isEmail: boolean): void {
    const compression = 0.05;
    if (!this.validateName()) {
      alert('Exportation impossible. Veuillez vous assurer que vos entrées respectent le format mentionné ci-dessus et recommencez.');
      return;
    }
    if (this.exportDrawingService.extensionType === ExtensionType.svg) {
      isEmail ?
        this.sendEmail(this.parsingService.image.src) :
        this.saveImageSetAttribute(this.parsingService.image.src);
    } else {
      const canvas = this.parsingService.context2D.canvas;
      const img = canvas.toDataURL('image/' + this.exportDrawingService.extensionType, compression);
      isEmail ?
        this.sendEmail(img) :
        this.saveImageSetAttribute(img);
    }
  }

  validateName(): boolean {
    return this.exportDrawingService.name !== '' && this.exportDrawingService.name !== undefined;
  }

  updateFilter(newFilter: string, isUserInput: boolean): void {
    if (isUserInput) {
      this.exportDrawingService.getFilter(newFilter);
    }
    this.drawCanvas();
  }

  drawCanvas(): void {
    this.image = new Image();
    this.image.src = this.parsingService.image.src;
    this.image.onload = () => {
      const ctx = this.canvas.nativeElement.getContext('2d');
      ctx.drawImage(this.image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    };
  }

  sendEmail(img: string): void {
    const dialogConfirmConfig = new MatDialogConfig();
    dialogConfirmConfig.disableClose = true;
    dialogConfirmConfig.autoFocus = true;
    dialogConfirmConfig.width = '700px';
    dialogConfirmConfig.height = '250px';
    this.dialogConfirmRef = this.dialogAlert.open(EmailConfirmationComponent, dialogConfirmConfig);
    this.dialogConfirmRef.afterClosed().pipe(filter((data) => data)).subscribe((confirmation) => {
      if (confirmation) {
        this.sendEmailRequest(img);
      }
      this.dialogRef.close();
    });
  }

  sendEmailRequest(img: string): void {
    this.exportDrawingService.sendEmail(img);
  }

// Reference : https://material.angular.io/components/form-field/overview
  getErrorMessage(): string {
    if (this.emailControl.hasError('required')) {
      return 'Champ obligatoire';
    }
    return this.emailControl.hasError('email') ? 'Courriel non valide' : '';
  }
}
