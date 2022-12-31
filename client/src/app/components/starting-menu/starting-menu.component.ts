import { Component, OnInit } from '@angular/core';
import { OpenDialogService } from '@app-services/open-dialog/open-dialog.service';
import { RouteListenerService } from '@app-services/route-listener/route-listener.service';
import { SavedDrawingsService } from '@app-services/saved-drawings/saved-drawings.service';
import { Subscription } from 'rxjs';
import { Drawing } from '../../../../../common/communication/drawing';

@Component({
  selector: 'app-starting-menu',
  templateUrl: './starting-menu.component.html',
  styleUrls: ['./starting-menu.component.scss']
})
export class StartingMenuComponent implements OnInit {

  isHovering: boolean[];
  hasLocalStorage: boolean;
  hasSavedDrawings: boolean;
  savedDrawings: Drawing[];
  savedDrawingsSubscription: Subscription;

  constructor(private routeListener: RouteListenerService,
              private savedDrawingsService: SavedDrawingsService,
              public openDialogService: OpenDialogService) {
    this.routeListener.loadRouting();
    this.isHovering = [false, false, false, false];
    this.hasLocalStorage = localStorage.length > 0;
  }

  setHover(num: number, bool: boolean): void {
    this.isHovering[num] = bool;
  }

  ngOnInit(): void {
    this.routeListener.getPreviousUrl();
    this.savedDrawingsSubscription = this.savedDrawingsService.savedDrawingsSubject.subscribe(
      (drawings) => {
        this.savedDrawingsChange(drawings);
      });
  }

  savedDrawingsChange(drawings: Drawing[]): void {
    this.savedDrawings = drawings;
    this.hasSavedDrawings = (this.savedDrawings.length > 0);
  }

  openDialog(): void {
    this.openDialogService.openNewDrawingDialog();
  }

  openGallery(): void {
    this.openDialogService.openGallery();
  }

  continueDrawing(): void {
    this.openDialogService.continueDrawing();
  }
}
