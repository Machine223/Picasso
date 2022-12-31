import { Injectable, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { Brush } from '@app-services/drawing/paths/brush/brush';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { BrushElementCreator } from 'class/svg-elements-creators/brush-element-creator';
import { PathToolService } from '../path-tool.service';

@Injectable({
  providedIn: 'root'
})

export class BrushService extends PathToolService {

  constructor(protected colorsService: ColorsService,
              protected toolPropertyService: ToolPropertiesService,
              protected drawingElements: DrawingElementsService,
              protected autoSave: AutoSaveService,
              rendererFactory: RendererFactory2) {
    super(colorsService, toolPropertyService, drawingElements, autoSave, rendererFactory);
    this.path = new Brush(colorsService, toolPropertyService);
    this.svgElementCreator = new BrushElementCreator(rendererFactory);
  }

  onMouseDown(event: MouseEvent): void {
    this.path = new Brush(this.colorsService, this.toolPropertyService);
    super.onMouseDown(event);
  }

  onMouseUp(event: MouseEvent): void {
    super.onMouseUp(event);
  }
}
