import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { Component, ComponentRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingPropertiesService } from '@app-services/drawing/drawing-properties/drawing-properties.service';
import { filter } from 'rxjs/operators';
import { RouteListenerService } from '../../../services/route-listener/route-listener.service';
import { ColorEditComponent } from '../../color-edit/color-edit.component';
import { NewDrawingAlertDialogComponent } from '../new-drawing-alert-dialog/new-drawing-alert-dialog.component';

@Component({
  selector: 'app-new-drawing-creation-dialog',
  templateUrl: './new-drawing-creation-dialog.component.html',
  styleUrls: ['./new-drawing-creation-dialog.component.scss']
})
export class NewDrawingCreationDialogComponent {

  isHovering: boolean;
  drawingForm: FormGroup;
  colorEditReference: ComponentRef<ColorEditComponent>;
  dialogAlertRef: MatDialogRef<NewDrawingAlertDialogComponent>;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.drawingForm.patchValue(
      {
        height: this.drawingPropertiesService.height,
        width: this.drawingPropertiesService.width
      });
  }

  constructor(
    public dialogRef: MatDialogRef<NewDrawingCreationDialogComponent>,
    private formBuilder: FormBuilder,
    public drawingPropertiesService: DrawingPropertiesService,
    public dialogAlert: MatDialog,
    private colorsService: ColorsService,
    private routeListener: RouteListenerService,
    private overlay: Overlay) {
      const minimumSizeDrawing = 60;
      const maximumSizeDrawing = 6000;
      this.drawingForm = this.formBuilder.group({
        height: [this.drawingPropertiesService.height, [
          Validators.required,
          Validators.min(minimumSizeDrawing),
          Validators.max(maximumSizeDrawing)
        ]],
        width: [this.drawingPropertiesService.width, [
          Validators.required,
          Validators.min(minimumSizeDrawing),
          Validators.max(maximumSizeDrawing)
        ]],
        color: 'white'
      });

      this.onChanges();
      this.isHovering = false;
   }

  setHover(bool: boolean): void {
    this.isHovering = bool;
  }

  openColorEditPanel(color: string): void {
    this.colorsService.currentColor = color;
    const config = new OverlayConfig();

    config.positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();
    config.hasBackdrop = true;

    this.colorsService.currentColor = color;
    const dialogColorPicker = new MatDialogConfig();
    dialogColorPicker.disableClose = false;
    dialogColorPicker.autoFocus = true;
    dialogColorPicker.width = '550px';
    dialogColorPicker.data = { colorReference: this.colorsService.createColorReference(color) };
    this.dialogAlert.open(ColorEditComponent, dialogColorPicker);
  }

  createDrawing(): void {
    if (localStorage.length > 0) {
      this.openAlertDialog();
    } else {
      this.drawingPropertiesService.creationOfDrawing(this.colorsService.backgroundColor);
    }
    this.dialogRef.close('drawing-view');
  }

  closeDrawingCreation(): void {
    const previousRoute = this.routeListener.getPreviousUrl();
    this.dialogRef.close(previousRoute);
  }

  openAlertDialog(): void {
    const dialogAlertConfig = new MatDialogConfig();
    dialogAlertConfig.disableClose = true;
    dialogAlertConfig.autoFocus = true;
    dialogAlertConfig.width = '500px';
    this.dialogAlertRef = this.dialogAlert.open(NewDrawingAlertDialogComponent, dialogAlertConfig);
    this.dialogAlertRef.afterClosed().pipe(filter((data) => data)).subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.drawingPropertiesService.creationOfDrawing(this.colorsService.backgroundColor);
      }
    });
  }

  onChanges(): void {
    this.drawingForm.valueChanges.subscribe((val) => {
        this.drawingPropertiesService.height = val.height;
        this.drawingPropertiesService.width = val.width;
    });
  }
}
