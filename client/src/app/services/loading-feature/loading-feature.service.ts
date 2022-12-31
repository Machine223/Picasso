import { Injectable } from '@angular/core';
import { DrawingPropertiesService } from '@app-services/drawing/drawing-properties/drawing-properties.service';
import { deepCopy } from 'deep-copy-ts';
import { ReplaySubject } from 'rxjs';
import { Drawing } from '../../../../../common/communication/drawing';

@Injectable({
  providedIn: 'root'
})
export class LoadingFeatureService {

  loadedDrawingSubject: ReplaySubject<Drawing>;

  constructor(private drawingProperties: DrawingPropertiesService) {
    this.loadedDrawingSubject = new ReplaySubject<Drawing>();
  }

  // Changes parameter, which is then sent to drawing-zone on creation
  load(inputDrawing: Drawing): void {
    this.loadedDrawingSubject.next(inputDrawing);
    this.drawingProperties.initialState = deepCopy(inputDrawing);
  }
}
