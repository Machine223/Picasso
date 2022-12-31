import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ColorEditComponent } from '@app-components/color-edit/color-edit.component';
import { ExportDrawingComponent } from '@app-components/export-drawing/export-drawing.component';
import { GalleryComponent } from '@app-components/gallery/gallery.component';
import { SavingFeatureDialogComponent } from '@app-components/saving-feature/saving-feature-dialog/saving-feature-dialog.component';
import { NewDrawingAlertDialogComponent } from '@app-new-drawing/new-drawing-alert-dialog/new-drawing-alert-dialog.component';
import { NewDrawingCreationDialogComponent } from '@app-new-drawing/new-drawing-creation-dialog/new-drawing-creation-dialog.component';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ShortcutsInfoService } from '@app-services/shortcuts-info/shortcuts-info.service';

@Injectable({
  providedIn: 'root'
})
export class OpenDialogService {

  constructor(public dialog: MatDialog,
              public router: Router,
              private shortcutsInfo: ShortcutsInfoService,
              private autoSave: AutoSaveService) { }

  openExportDialog(): void {
    const dialogRef = this.dialog.open(ExportDrawingComponent, this.configureDialog('570px', 'auto'));
    this.manageWindowClosing(dialogRef);
  }

  openGallery(): void {
    const dialogRef = this.dialog.open(GalleryComponent, this.configureDialog('850px', '550px'));
    this.manageWindowClosing(dialogRef);
  }

  openNewDrawingDialog(): void {
    this.autoSave.shouldLoad = false;
    const dialogRef = this.dialog.open(NewDrawingCreationDialogComponent, this.configureDialog( '550px', 'auto'));
    this.manageWindowClosing(dialogRef);
  }

  openSavingDialog(): void {
    const dialogRef = this.dialog.open(SavingFeatureDialogComponent, this.configureDialog('600px', 'auto'));
    this.manageWindowClosing(dialogRef);
  }

  openColorDialog(colorReference: number): void {
    const dialogRef = this.dialog.open(ColorEditComponent, this.configureDialog('550px', 'auto', colorReference));
    this.manageWindowClosing(dialogRef);
  }

  configureDialog(width: string, height: string, data: number = -1): MatDialogConfig {
    const dialogConfig = new MatDialogConfig();
    this.shortcutsInfo.openedDialogChange(true);
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = width;
    dialogConfig.height = height;
    if (data !== -1) {
      dialogConfig.data = { colorReference: data };
    }
    return dialogConfig;
  }

  manageWindowClosing(dialogRef: MatDialogRef<NewDrawingCreationDialogComponent | GalleryComponent
    | NewDrawingAlertDialogComponent | ExportDrawingComponent | SavingFeatureDialogComponent | ColorEditComponent>): void {
    dialogRef.afterClosed().subscribe(
      (data) => {
        this.shortcutsInfo.openedDialogChange(false);
        if (typeof (data) === 'undefined') {
          const url = this.router.url;
          this.router.navigateByUrl(url);
        } else {
          this.router.navigateByUrl(data);
        }
      });
  }

  continueDrawing(): void {
    this.router.navigateByUrl('drawing-view');
  }
}
