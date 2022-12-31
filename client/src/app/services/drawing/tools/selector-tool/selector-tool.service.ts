import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { ControlPointRectangle } from '@app-services/drawing/shapes/rectangle/control-point-rectangle';
import { DashedSelectorRectangle } from '@app-services/drawing/shapes/rectangle/dashed-selector-rectangle';
import { OutlineRectangle } from '@app-services/drawing/shapes/rectangle/outline-rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { RectangleToolService } from '@app-services/drawing/tools/shape-tools/rectangle-tool/rectangle-tool.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { RotationService } from '@app-services/drawing/transform/rotation.service';
import { TranslateService } from '@app-services/drawing/transform/translate.service';
import { TransformSVGElement } from '@app-services/undo-redo/transform-svgelement';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { SelectorElementCreator } from 'class/svg-elements-creators/selector-element-creator';
import { Selector } from '../../../../../class/selector/selector';
import { CONTROL_POINT_SIZE, MOUSE } from '../../../../../constants/constants';

@Injectable({
  providedIn: 'root'
})
export class SelectorToolService {
  selector: Selector;
  isSelecting: boolean;
  isClick: boolean;
  isRightClick: boolean;
  drawingSVG: SVGSVGElement;
  outlineSVG: SVGGElement;
  selectedSVG: SVGGElement;
  selectedRectangle: OutlineRectangle;
  lastMousePosition: Coordinates;
  currentMousePosition: Coordinates;
  command: TransformSVGElement;
  selectorElementCreator: SelectorElementCreator;
  renderer: Renderer2;

  constructor(private rectangleTool: RectangleToolService,
              private drawingElements: DrawingElementsService,
              private colorsService: ColorsService,
              private toolProperties: ToolPropertiesService,
              private translateService: TranslateService,
              private rotationService: RotationService,
              private undoRedo: UndoRedoManagerService,
              protected autoSave: AutoSaveService,
              private rendererFactory: RendererFactory2) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.isSelecting = false;
    this.isClick = false;
    this.isRightClick = false;
    this.selectedSVG = this.renderer.createElement('g', 'svg');
    this.selectedRectangle = new OutlineRectangle(this.colorsService, this.toolProperties, true);
    this.lastMousePosition = new Coordinates(0, 0);
    this.currentMousePosition = new Coordinates(0, 0);
    this.selector = new Selector(this.colorsService, this.toolProperties);
    this.command = new TransformSVGElement([], this.rendererFactory);
    this.selectorElementCreator = new SelectorElementCreator(this.autoSave, this.rendererFactory);
  }

  eventTypeDispatcher(event: MouseEvent): void {
    const mapTypeDispatcher  = new Map<string, () => void> ();
    mapTypeDispatcher.set('mousedown', () => this.onMouseDown(event));
    mapTypeDispatcher.set('mousemove', () => this.onMouseMove(event));
    mapTypeDispatcher.set('mouseup', () => this.selectElements(event));
    mapTypeDispatcher.set('mouseleave', () => this.selectElements(event));
    (mapTypeDispatcher.get(event.type) || (() => null))();
  }

  onMouseDown(event: MouseEvent): void {
    this.rectangleTool.onMouseDown(event);
    this.isRightClick = event.button === MOUSE.RightButton;
    this.selector.instanceInverted = [];
    this.selector.selectedInvert = [];
    this.isClick = true;
    this.updateCurrentPosition(event);
    if (!this.checkChildElements(event)) {
      this.isSelecting = true;
    }
  }

  checkChildElements(event: MouseEvent): boolean {
    if (this.selectedSVG.firstElementChild === null) { return false; }
    let currentElement = this.selectedSVG.firstElementChild;
    for (let i = 0; i < this.selectedSVG.childElementCount; i++) {
      if ((event.target || event.relatedTarget) === currentElement) {
        return true;
      }
      if (currentElement.nextElementSibling !== null) {
        currentElement = currentElement.nextElementSibling;
      }
    }
    return false;
  }

  isAbleToTranslate(): boolean {
    return (this.translateService.isTranslatingSelection ||
            this.translateService.isInSelectionRectangle(this.selectedRectangle, this.currentMousePosition));
  }

  updateCurrentPosition(event: MouseEvent): void {
    this.lastMousePosition = this.currentMousePosition;
    this.currentMousePosition = new Coordinates(event.offsetX, event.offsetY);
  }

  isAbleToRotate(): boolean {
    return (!this.translateService.isTranslatingSelection && this.selector.selectedElements.length !== 0);
  }

  leftMouseDragTranslate(event: MouseEvent): void {
    this.updateCurrentPosition(event);
    this.translateService.isTranslatingSelection = true;
    const deltaX = this.currentMousePosition.xPosition - this.lastMousePosition.xPosition;
    const deltaY = this.currentMousePosition.yPosition - this.lastMousePosition.yPosition;
    this.translateService.translateSelection(deltaX, deltaY, this.selector);
    this.updateSelectedOutline();
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isSelecting) { return; }
    if (this.isClick && !this.isRightClick && this.isAbleToTranslate()) {
      if (!this.translateService.isTranslatingSelection) {
        this.command = new TransformSVGElement(this.selector.selectedElements, this.rendererFactory);
      }
      this.leftMouseDragTranslate(event);
      return;
    }
    this.isClick = false;
    this.rectangleTool.onMouseMove(event);
    const outlineRectangle = new DashedSelectorRectangle(this.colorsService, this.toolProperties);
    outlineRectangle.setRectangleSize(this.rectangleTool.rectangle);
    this.outlineSVG = this.selectorElementCreator.createDashedSelectorRectangle(outlineRectangle) as SVGGElement;
    this.drawingElements.temporaryRenderer.next(this.outlineSVG);
    if (!this.isRightClick) {
      this.selector.selectedElements = [];
    } else {
      this.selector.selectedInvert = [];
    }
    this.checkSelectedElements();
  }

  selectElements(event: MouseEvent): void {
    if (!this.isSelecting) {
      this.autoSave.save(false);
      return;
    }
    this.rotationService.updateRotationOrigins(this.selector, this.selectedRectangle);
    this.isSelecting = false;
    this.rectangleTool.isRectangleStarted = false;
    if (this.translateService.isTranslatingSelection) {
      this.command.getLastTransform();
      this.undoRedo.executeCommand(this.command);
      this.translateService.isTranslatingSelection = false;
      return;
    }
    if (!this.isRightClick) {
      this.selector.selectedElements = [];
    }
    if (this.isClick) {
      this.selectedRectangle = new OutlineRectangle(this.colorsService, this.toolProperties, true);
      this.selectorElementCreator.removeLastSelector();
      this.selector.selectClickTargeted(event, this.isRightClick);
      this.updateSelectedOutline();
      this.updateCurrentPosition(event);
      this.isClick = false;
      return;
    }
    this.checkSelectedElements();
    this.renderer.removeChild(this.selectorElementCreator.svgWrap, this.outlineSVG);
  }

  selectAll(): void {
    this.selector.selectedElements = [];
    const rect = this.createRectangle(this.drawingSVG);
    this.drawingSVG.getIntersectionList(rect, this.drawingSVG).forEach((svgElement) => {
      if (this.selectedSVG !== this.selector.checkParent(svgElement)) {
        this.selector.selectedElements.push(this.selector.checkParent(svgElement));
      }
    });
    this.updateSelectedOutline();
    this.rotationService.updateRotationOrigins(this.selector, this.selectedRectangle);
  }

  checkSelectedElements(): void {
    const rect = this.createRectangle(this.outlineSVG);
    this.drawingSVG.getIntersectionList(rect, this.drawingSVG).forEach((svgElement) => {
      if (svgElement === this.outlineSVG || svgElement.parentNode === this.selectedSVG) { return; }
      const currentElement = this.selector.checkParent(svgElement);
      if (this.selector.checkElementLocation(currentElement, this.outlineSVG)) {
        if (this.isRightClick && !this.selector.selectedInvert.includes(currentElement)) {
          this.selector.selectedInvert.push(currentElement);
        } else if (!this.isRightClick && !this.selector.selectedElements.includes(currentElement)) {
          this.selector.selectedElements.push(currentElement);
        }
      }
    });
    this.updateSelectedOutline();
  }

  createRectangle(svgRectangle: SVGGElement): SVGRect {
    const rect = this.drawingSVG.createSVGRect();
    rect.x = Number(svgRectangle.getAttribute('x'));
    rect.y = Number(svgRectangle.getAttribute('y'));
    rect.width = Number(svgRectangle.getAttribute('width'));
    rect.height = Number(svgRectangle.getAttribute('height'));
    return rect;
  }

  updateSelectedOutline(): void {
    this.selector.applyReversion();
    this.selector.applyInversion();
    if (this.selector.selectedElements.length !== 0) {
      this.selectedRectangle = this.selector.setRectangleCoordinates();
      this.createControlPoints();
      this.selectedSVG = this.selectorElementCreator.createSelectorRectangle(this.selectedRectangle);
      this.drawingElements.selectorRenderer.next(this.selectedSVG);
    } else {
      this.selectedRectangle = new OutlineRectangle(this.colorsService, this.toolProperties, true);
      this.selectorElementCreator.removeLastSelector();
    }
  }

  createControlPoints(): void {
    const controlPoint = new ControlPointRectangle(this.colorsService, this.toolProperties);
    controlPoint.startingPoint = new Coordinates(this.selectedRectangle.startingPoint.xPosition - CONTROL_POINT_SIZE / 2,
      this.selectedRectangle.startingPoint.yPosition + this.selectedRectangle.height / 2 - CONTROL_POINT_SIZE / 2);
    this.selectorElementCreator.createControlPointRectangle(controlPoint);
    controlPoint.startingPoint = new Coordinates(this.selectedRectangle.startingPoint.xPosition + this.selectedRectangle.width
      - CONTROL_POINT_SIZE / 2, this.selectedRectangle.startingPoint.yPosition
      + this.selectedRectangle.height / 2 - CONTROL_POINT_SIZE / 2);
    this.selectorElementCreator.createControlPointRectangle(controlPoint);
    controlPoint.startingPoint = new Coordinates(this.selectedRectangle.startingPoint.xPosition + this.selectedRectangle.width / 2
      - CONTROL_POINT_SIZE / 2, this.selectedRectangle.startingPoint.yPosition - CONTROL_POINT_SIZE / 2);
    this.selectorElementCreator.createControlPointRectangle(controlPoint);
    controlPoint.startingPoint = new Coordinates(this.selectedRectangle.startingPoint.xPosition + this.selectedRectangle.width / 2
      - CONTROL_POINT_SIZE / 2, this.selectedRectangle.startingPoint.yPosition + this.selectedRectangle.height - CONTROL_POINT_SIZE / 2);
    this.selectorElementCreator.createControlPointRectangle(controlPoint);
  }

  removeOutline(): void {
    this.selector.selectedElements = [];
    this.selectedRectangle = new OutlineRectangle(this.colorsService, this.toolProperties, true);
    this.selectorElementCreator.removeLastSelector();
    this.autoSave.save(false);
  }

  onWheel(wheelEvent: WheelEvent): void {
    if (this.isAbleToRotate()) {
      this.command = new TransformSVGElement(this.selector.selectedElements, this.rendererFactory);
      this.rotationService.rotateSelection(wheelEvent, this.selector);
      this.updateSelectedOutline();
      this.command.getLastTransform();
      this.undoRedo.executeCommand(this.command);
    }
  }

  updateOrigins(): void {
    this.rotationService.updateRotationOrigins(this.selector, this.selectedRectangle);
  }
}
