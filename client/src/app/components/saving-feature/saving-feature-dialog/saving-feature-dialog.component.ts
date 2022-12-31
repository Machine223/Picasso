import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RequestLoadingComponent } from '@app-components/saving-feature/request-state-dialogs/request-loading/request-loading.component';
import {
  SavingFeatureConfirmationDialogComponent
} from '@app-components/saving-feature/saving-feature-confirmation-dialog/saving-feature-confirmation-dialog.component';
import { DrawingPropertiesService } from '@app-services/drawing/drawing-properties/drawing-properties.service';
import { LoadingFeatureService } from '@app-services/loading-feature/loading-feature.service';
import { DatabaseRequestsService } from '@app-services/saving-feature/database-requests.service';
import { ParsingService } from '@app-services/saving-feature/parsing.service';
import { deepCopy } from 'deep-copy-ts';
import { Subscription } from 'rxjs';
import { Drawing } from '../../../../../../common/communication/drawing';

@Component({
  selector: 'app-saving-feature',
  templateUrl: './saving-feature-dialog.component.html',
  styleUrls: ['./saving-feature-dialog.component.scss']
})
export class SavingFeatureDialogComponent {

  isHovering: boolean[];
  name: string;
  tags: string[];
  currentTag: string;
  previewSrcAsString: string;
  gTagsBody: string;
  image: HTMLImageElement;
  existsInGallery: boolean;
  initialDrawingState: Drawing;
  loadedDrawingSubscription: Subscription;

  @ViewChild('canvas', {static: true})
  canvas: ElementRef;

  constructor(public databaseRequests: DatabaseRequestsService,
              public dialogAlert: MatDialog,
              public requestLoadingScreen: MatDialog,
              private parsingService: ParsingService,
              public loadingFeature: LoadingFeatureService,
              private drawingProperties: DrawingPropertiesService) {
      this.isHovering = [false, false, false, false];
      this.name = deepCopy(this.drawingProperties.initialState.name);
      this.tags = deepCopy(this.drawingProperties.initialState.tags);
      this.image = new Image();
      this.parsingService.extractSVG();
      this.drawCanvas();
      this.existsInGallery = !(this.isEmpty(this.name));   // Exists if a name was attributed to Drawing, possible only if saved to Gallery
  }

  setHover(num: number, bool: boolean): void {
    this.isHovering[num] = bool;
  }

  addTag(): void {
    if (!this.isEmpty(this.currentTag) && !(this.tags.includes(this.currentTag))) {
      this.tags.push(this.currentTag);
      this.tags.sort();
    }
  }

  isEmpty(inputString: string): boolean {
    return (inputString === '' || inputString === undefined);
  }

  removeTag(tagName: string): void {
    let index = 0;
    for (const tag of this.tags) {
      if (tag === tagName) {
        this.tags.splice(index, 1);
        return;
      }
      index++;
    }
  }

  saveDrawingInfo(): void {
    if (this.validateName() && this.validateTags()) {
      const requestLoadingScreenConfig = new MatDialogConfig();
      requestLoadingScreenConfig.disableClose = true;
      requestLoadingScreenConfig.autoFocus = true;
      this.requestLoadingScreen.open(RequestLoadingComponent, requestLoadingScreenConfig);
      const confirmationPromise = new Promise((resolve, reject) => {
        const dialogRef = this.dialogAlert.open(SavingFeatureConfirmationDialogComponent, { width: '350px' });
        dialogRef.afterClosed().subscribe((hasConfirmed) => {
          hasConfirmed ? resolve() : reject();
        });
      });

      confirmationPromise
      .then(() => {
        this.gTagsBody = this.parsingService.gTagsBody;
        this.previewSrcAsString = this.parsingService.base64data;
        const drawing: Drawing = { name: this.name, tags: this.tags, metadata: this.gTagsBody, previewSource: this.previewSrcAsString };
        const successfulRequest = this.databaseRequests.sendDrawing(drawing, this.drawingProperties.initialState, this.existsInGallery);
        successfulRequest.then(() => {
          this.loadingFeature.load(drawing);
          this.existsInGallery = true;
        }).catch(() => {
          alert('Sauvegarde à la base de données impossible: veuillez ré-essayer ultérieurement.');
        });
        this.requestLoadingScreen.closeAll();
        this.close();
      })
      .catch((err: Error) => {
        alert('Sauvegarde annulée.');
        this.requestLoadingScreen.closeAll();
      });
    } else {
      alert('Sauvegarde impossible. Veuillez vous assurer que vos entrées respectent le format mentionné ci-dessus et recommencez.');
    }
  }

  validateName(): boolean {
    return this.name !== '';
  }

  validateTags(): boolean {
    for (const tag of this.tags) {
      if (tag === '') {
        return false;
      }
      const firstChar = tag.substr(0, 1).charCodeAt(0);
      if (!(this.isALowercase(firstChar) || this.isAnUppercase(firstChar))) {
        return false;
      }
    }
    return true;
  }

  isALowercase(charCode: number): boolean {
    return (charCode >= 'a'.charCodeAt(0) && charCode <= 'z'.charCodeAt(0));
  }

  isAnUppercase(charCode: number): boolean {
    return (charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0));
  }

  close(): void {
    this.dialogAlert.closeAll();
  }

  drawCanvas(): void {
    this.image = new Image();
    this.image.src = this.parsingService.image.src;
    this.image.onload = () => {
      const ctx = this.canvas.nativeElement.getContext('2d');
      ctx.drawImage(this.image, 0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    };
  }
}
