import { Injectable, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { Path } from '@app-services/drawing/paths/path';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { PathToolService } from '../path-tool.service';

@Injectable({
  providedIn: 'root'
})

export class PencilService extends PathToolService {

  constructor(protected colorsService: ColorsService,
              protected toolPropertyService: ToolPropertiesService,
              protected drawingElements: DrawingElementsService,
              protected autoSave: AutoSaveService,
              rendererFactory: RendererFactory2) {
    super(colorsService, toolPropertyService, drawingElements, autoSave, rendererFactory);
    this.path = new Path(colorsService, toolPropertyService);
  }

  onMouseDown(event: MouseEvent): void {
    this.path = new Path(this.colorsService, this.toolPropertyService);
    super.onMouseDown(event);
  }

  onMouseUp(event: MouseEvent): void {
    super.onMouseUp(event);
  }
}
