import { Injectable } from '@angular/core';
import { DrawingZonePropertiesService } from '@app-services/drawing/drawing-zone-properties/drawing-zone-properties.service';
import { ParsingService } from '@app-services/saving-feature/parsing.service';

@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {

  shouldLoad: boolean;

  constructor(private drawingZoneProperties: DrawingZonePropertiesService,
              private parsingService: ParsingService) {
                this.shouldLoad = true;
              }

  save(isATool: boolean): void {
    if ((!isATool) || (isATool && this.drawingZoneProperties.isMouseIn)) {
      this.parsingService.extractSVG();
      localStorage.setItem('autosave', this.parsingService.gTagsBody);
    }
  }
}
