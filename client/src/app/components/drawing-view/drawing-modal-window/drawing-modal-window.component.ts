import { Component, OnInit } from '@angular/core';
import { GridService } from '@app-services/drawing/grid/grid.service';
import { SelectorToolService } from '@app-services/drawing/tools/selector-tool/selector-tool.service';
import { ToolManagerService } from '@app-services/drawing/tools/tool-manager.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { SelectionManipulationService } from '@app-services/selection-manipulation/selection-manipulation.service';
import {
  DOT_DIAMETER_LINE,
  DOT_DIAMETER_SPRAY,
  FONT_FAMILY,
  FONT_FAMILY_TYPES,
  FONT_SIZE,
  JUNCTION_TYPE_LINE,
  JUNCTION_TYPES,
  MUTATORS,
  PAINT_BUCKET,
  SELECTOR,
  SIDE_COUNT_POLYGON,
  SIZE_ERASER,
  STROKE_TYPE_TOOLS,
  STROKE_TYPES,
  STROKE_WIDTH_TOOLS,
  TEXT_ALIGNMENT,
  TEXT_ALIGNMENT_TYPES,
  TEXTURE_TYPES,
  TEXTURE_TYPES_BRUSH,
  TYPE_GRID,
} from 'constants/constants';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drawing-modal-window',
  templateUrl: './drawing-modal-window.component.html',
  styleUrls: ['./drawing-modal-window.component.scss']
})
export class DrawingModalWindowComponent implements OnInit {

  selectedTool: string;
  toolSubscription: Subscription;

  junctionTypes: string[] = JUNCTION_TYPES;
  strokeTypes: string[] = STROKE_TYPES;
  textureTypes: number[] = TEXTURE_TYPES;
  fontFamilyTypes: string[] = FONT_FAMILY_TYPES;
  textAlignmentTypes: string[] = TEXT_ALIGNMENT_TYPES;

  strokeWidthTools: string[] = STROKE_WIDTH_TOOLS;
  strokeTypeTools: string[] = STROKE_TYPE_TOOLS;

  dotDiameterSpray: string = DOT_DIAMETER_SPRAY;
  dotDiameterLine: string = DOT_DIAMETER_LINE;
  junctionTypeLine: string = JUNCTION_TYPE_LINE;
  textureTypeBrush: string = TEXTURE_TYPES_BRUSH;
  fontFamily: string = FONT_FAMILY;
  fontSize: string = FONT_SIZE;
  mutators: string = MUTATORS;
  textAlignment: string = TEXT_ALIGNMENT;
  sizeEraser: string = SIZE_ERASER;
  sideCountPolygon: string = SIDE_COUNT_POLYGON;
  gridTypeTools: string = TYPE_GRID;
  paintBucket: string = PAINT_BUCKET;
  selector: string = SELECTOR;

  constructor(private toolManager: ToolManagerService,
              public toolProperties: ToolPropertiesService,
              public gridService: GridService,
              public manipulationService: SelectionManipulationService,
              public selectorTool: SelectorToolService) {
    this.selectedTool = this.toolManager.selectedTool;
  }

  ngOnInit(): void {
    this.toolSubscription = this.toolManager.toolSubject.subscribe(
      (tool) => { this.selectedTool = tool; }
    );
  }

  changeJunctionType(junction: string, isUserInput: boolean): void {
    if (isUserInput) {
      this.toolProperties.junctionType = junction;
    }
  }

  changeStrokeType(stroke: string, isUserInput: boolean): void {
    if (isUserInput) {
      this.toolProperties.strokeType = stroke;
    }
  }

  changeTextureType(texture: number, isUserInput: boolean): void {
    if (isUserInput) {
      this.toolProperties.textureType = texture;
    }
  }

  changeFontFamily(family: string, isUserInput: boolean): void {
    if (isUserInput) {
      this.toolProperties.fontFamily = family;
    }
  }

  changeTextAlignment(alignment: string, isUserInput: boolean): void {
    if (isUserInput) {
      this.toolProperties.textAlignment = alignment;
    }
  }

  changeGridSize(): void {
    this.gridService.pathToString();
  }
}
