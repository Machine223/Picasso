import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NewDrawingAlertDialogComponent } from '@app-new-drawing/new-drawing-alert-dialog/new-drawing-alert-dialog.component';
import { DrawingPropertiesService } from '@app-services/drawing/drawing-properties/drawing-properties.service';
import { LoadingFeatureService } from '@app-services/loading-feature/loading-feature.service';
import { SavedDrawingsService } from '@app-services/saved-drawings/saved-drawings.service';
import { DatabaseRequestsService } from '@app-services/saving-feature/database-requests.service';
import { Subscription } from 'rxjs';
import { Drawing } from '../../../../../common/communication/drawing';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  isHovering: boolean;
  savedDrawings: Drawing[];
  displayedDrawings: Drawing[];
  tagList: string[];
  currentTagsList: string[];
  currentTag: string;
  savedDrawingsSubscription: Subscription;
  selectedDrawing: Drawing;
  emptyDrawing: Drawing;
  activeTaskbar: boolean;

  constructor(public dialogRef: MatDialogRef<GalleryComponent>,
              private savedDrawingsService: SavedDrawingsService,
              public databaseRequests: DatabaseRequestsService,
              public loadingFeature: LoadingFeatureService,
              public sanitizer: DomSanitizer,
              public drawingProperties: DrawingPropertiesService,
              public dialog: MatDialog) {
    this.isHovering = false;
    this.savedDrawings = [];
    this.displayedDrawings = [];
    this.tagList = [];
    this.currentTagsList = [];
    this.currentTag = '';
    this.databaseRequests.getDrawings();
    this.activeTaskbar = false;
    this.emptyDrawing = { name: '', tags: [], metadata: '', previewSource: ''};
  }

  ngOnInit(): void {
    this.savedDrawingsSubscription = this.savedDrawingsService.savedDrawingsSubject.subscribe(
      (drawings) => {
        this.savedDrawings = drawings;
        this.updateDisplayedDrawings();
      });
  }

  setHover(bool: boolean): void {
    this.isHovering = bool;
  }

  selectDrawing(newSelection: Drawing): void {
    this.activeTaskbar = (newSelection !== this.selectedDrawing);
    if (newSelection !== this.selectedDrawing) {
      this.selectedDrawing = newSelection;
    } else {
      this.selectedDrawing = this.emptyDrawing;
    }
  }

  tagFiltering(): void {
    this.displayedDrawings = [];
    if (this.currentTagsList.length === 0) {
      this.updateDisplayedDrawings();
      return;
    }
    for (const drawing of this.savedDrawings) {
      let availableDrawing = false;
      for (const tag of this.currentTagsList) {
        if (drawing.tags.includes(tag)) {
          availableDrawing = true;
          break;
        }
      }
      if (availableDrawing) {
        this.displayedDrawings.push(drawing);
      }
    }
    this.sortDisplayedDrawings();
  }

  sortDisplayedDrawings(): void {
    this.displayedDrawings.sort((a, b) => {
      if (a.name < b.name) { return -1; }
      if (a.name > b.name) { return 1; }
      return 0;
    });
  }

  updateDisplayedDrawings(): void {
    if (this.displayedDrawings.length === 0) {
      this.displayedDrawings = this.savedDrawings;
    }
    this.sortDisplayedDrawings();
    this.updateAvailableTags();
  }

  updateAvailableTags(): void {
    this.savedDrawings.forEach((drawing) => {
      drawing.tags.forEach((tag) => {
        if (!this.tagList.includes(tag)) {
          this.tagList.push(tag);
        }
      });
    });
  }

  addTag(): void {
    if (!this.isEmpty(this.currentTag) && !this.currentTagsList.includes(this.currentTag)) {
      this.currentTagsList.push(this.currentTag);
    }
    this.currentTagsList.sort();
    this.tagFiltering();
  }

  isEmpty(inputString: string): boolean {
    return (inputString === '' || inputString === undefined);
  }

  removeTag(tag: string): void {
    this.currentTagsList.splice(this.currentTagsList.indexOf(tag), 1);
    this.tagFiltering();
  }

  loadToDrawingZone(): void {
    if (this.drawingProperties.isDrawingCreated) {
      let dialogRef;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '550px';
      dialogConfig.height = 'auto';
      dialogRef = this.dialog.open(NewDrawingAlertDialogComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(
        (hasConfirmed: boolean) => {
          if (hasConfirmed) {
            this.loadingFeature.load(this.selectedDrawing);
            this.dialogRef.close('drawing-view');
          }
        }
      );
    } else {
      this.loadingFeature.load(this.selectedDrawing);
      this.dialogRef.close('drawing-view');
    }
  }

  deleteFromDatabase(): void {
    this.deleteRequestPromise().then(() => {
      for (let i = 0; i < this.savedDrawings.length; i++) {
        if (this.savedDrawings[i].name === this.selectedDrawing.name) {
          this.savedDrawings.splice(i, 1);
          break;
        }
      }
    });
    this.updateDisplayedDrawings();
  }

  async deleteRequestPromise(): Promise<void> {
    this.databaseRequests.deleteDrawing(this.selectedDrawing)
    .then(() => Promise.resolve())
    .catch(() => {
      alert('Le dessin que vous avez tenté de supprimer est introuvable. Veuillez en sélectionner un autre et ré-essayer.');
      Promise.reject();
    });
  }

  // Sanitizing string to SafeUrl
  // (Source: https://stackoverflow.com/questions/37432609/how-to-avoid-adding-prefix-unsafe-to-link-by-angular2)
  sanitize(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  close(): void {
    this.dialogRef.close();
  }
}
