import { Injectable, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { Line } from '@app-services/drawing/shapes/line/line';
import { LineElementCreator } from 'class/svg-elements-creators/line-element-creator';
import { Coordinates } from '../../coordinates';
import { ToolPropertiesService } from '../../tool-properties.service';

enum Radial45Degrees {FirstRay = 0, SecondRay = 45, ThirdRay = 90, FourthRay = 135,
                      FifthRay = 180, SixthRay = 225, SeventhRay = 270, EightRay = 315}

@Injectable({
  providedIn: 'root'
})
export class LineToolService {
  isLineStarted: boolean;
  isAwaitingMove: boolean;

  line: Line;
  lastMouseEvent: MouseEvent;
  isShiftMode: boolean;
  mapKeyboardDispatcher: Map<string, () => void>;
  lineCreator: LineElementCreator;

  constructor(private colorsService: ColorsService,
              private toolProperties: ToolPropertiesService,
              private drawingElements: DrawingElementsService,
              private rendererFactory: RendererFactory2,
              private autoSave: AutoSaveService) {
    this.isLineStarted = false;
    this.isAwaitingMove = false;
    this.isShiftMode = false;

    this.line = new Line(this.colorsService, this.toolProperties);
    this.keyboardMapCreator();
    this.lineCreator = new LineElementCreator(this.rendererFactory);
  }

  keyboardMapCreator(): void {
    this.mapKeyboardDispatcher = new Map<string, () => void>();
    this.mapKeyboardDispatcher.set('Escape', () => this.deleteLineCompletely());
    this.mapKeyboardDispatcher.set('Backspace', () => this.deleteLinePartially());
  }

  eventTypeDispatcher(event: MouseEvent): void {
    this.lastMouseEvent = event;
    const mapMouseDispatcher = new Map<string , () => void>();
    mapMouseDispatcher.set('mouseup', () => this.onMouseUp(event));
    mapMouseDispatcher.set('mousemove', () => {
      this.onMouseMove(event.shiftKey, event);
      this.isAwaitingMove = false;
    });
    mapMouseDispatcher.set('dblclick', () => this.lineEndEvent());
    mapMouseDispatcher.set('mouseleave', () => this.lineEndEvent());
    (mapMouseDispatcher.get(event.type) || (() => null))();
  }

  keyboardEventDispatcher(event: KeyboardEvent): void {
    (this.mapKeyboardDispatcher.get(event.key) || (() => null))();
  }

  onMouseUp(event: MouseEvent): void {
    const maxPixels = 3;
    let coordinates = this.shiftKeyEquation(event.shiftKey, event);
    const initCoordinates = new Coordinates(event.offsetX, event.offsetY);

    if (!this.isLineStarted) {
      this.isLineStarted = true;
      this.line = new Line(this.colorsService, this.toolProperties);
      this.line.initialPoint = initCoordinates;
      this.line.startingPoint = initCoordinates;
      if (this.line.isWithDots) {
        this.lineCreator.createCircle(this.line);
      }
    } else if (!this.isAwaitingMove) {
      if (this.getRelativeCoordinates(coordinates, this.line.initialPoint, maxPixels)) {
        coordinates = this.line.initialPoint;
      }
      this.line.endingPoint = coordinates;
      let lineElement = this.lineCreator.createLinePart(this.line, false);
      this.drawingElements.temporaryRenderer.next(lineElement);
      this.line.startingPoint = coordinates;
      this.line.endingPoint = initCoordinates;
      if (this.line.isWithDots) {
        this.lineCreator.createCircle(this.line);
      }
      lineElement = this.lineCreator.createLinePart(this.line, true);
      this.drawingElements.temporaryRenderer.next(lineElement);
    }

    this.isAwaitingMove = true;
  }

  onMouseMove(isDown: boolean, event: MouseEvent): void {
    const coordinates = this.shiftKeyEquation(isDown, event);
    if (this.isLineStarted) {
      this.line.endingPoint = coordinates;
      const lineElement = this.lineCreator.createLinePart(this.line, true);
      this.drawingElements.temporaryRenderer.next(lineElement);
    }
  }

  lineEndEvent(): void {
    if (this.isLineStarted) {
      const lineElement = this.lineCreator.finishElementWithParts(this.line.isWithDots);
      this.drawingElements.addCompletedSVGToDrawing(lineElement);
      this.isLineStarted = false;
      this.autoSave.save(true);
    }
  }

  deleteLineCompletely(): void {
    const emptyElement = this.lineCreator.deleteElementWithParts();
    this.drawingElements.temporaryRenderer.next(emptyElement);
    this.isLineStarted = false;
  }

  deleteLinePartially(): void {
    this.line.startingPoint = this.lineCreator.deleteLineParts(this.line.isWithDots ? 2 : 1);
    const lineElement = this.lineCreator.createLinePart(this.line, true);
    this.drawingElements.temporaryRenderer.next(lineElement);
  }

  onShiftKey(isDown: boolean): void {
    if (!isDown) {
      this.isShiftMode = false;
    }
    if (!this.isShiftMode) {
      this.onMouseMove(isDown, this.lastMouseEvent);
    }
    if (isDown) {
      this.isShiftMode = true;
    }
  }

  shiftKeyEquation(shiftKey: boolean, event: MouseEvent): Coordinates {
    const coordinates = new Coordinates(event.offsetX, event.offsetY);
    if (!shiftKey) {
      return coordinates;
    }
    return this.useRadialGroup(this.getRadialValue(coordinates), coordinates);
  }

  getRelativeCoordinates(coordinatesA: Coordinates, coordinatesB: Coordinates, maximum: number): boolean {
    return Math.abs(coordinatesA.xPosition - coordinatesB.xPosition) <= maximum &&
           Math.abs(coordinatesA.yPosition - coordinatesB.yPosition) <= maximum;
  }

  getRadialValue(coordinates: Coordinates): number {
    const rayCount = 8;
    const rayDegreeInterval = 45;
    let negativeYAdjustment = 2;
    if (coordinates.yPosition - this.line.startingPoint.yPosition < 0) {
      negativeYAdjustment += rayCount / 2;
    }
    let radialFractionAsNumeral = Math.round(negativeYAdjustment +
                                  ((Math.atan((coordinates.yPosition - this.line.startingPoint.yPosition)
                                  / (coordinates.xPosition - this.line.startingPoint.xPosition))) * (rayCount / 2) / Math.PI));
    if (radialFractionAsNumeral === rayCount) {
      radialFractionAsNumeral = 0;
    }
    return radialFractionAsNumeral * rayDegreeInterval;
  }

  useRadialGroup(radialValue: number, coordinates: Coordinates): Coordinates {
    const radialMap = new Map<number, Coordinates>();
    radialMap.set(Radial45Degrees.FirstRay, new Coordinates(this.line.startingPoint.xPosition, coordinates.yPosition));
    radialMap.set(Radial45Degrees.SecondRay, new Coordinates(coordinates.xPosition,
      - coordinates.xPosition + this.line.startingPoint.xPosition + this.line.startingPoint.yPosition));
    radialMap.set(Radial45Degrees.ThirdRay, new Coordinates(coordinates.xPosition, this.line.startingPoint.yPosition));
    radialMap.set(Radial45Degrees.FourthRay, new Coordinates(coordinates.xPosition,
      coordinates.xPosition - this.line.startingPoint.xPosition + this.line.startingPoint.yPosition));
    radialMap.set(Radial45Degrees.FifthRay, new Coordinates(this.line.startingPoint.xPosition, coordinates.yPosition));
    radialMap.set(Radial45Degrees.SixthRay, new Coordinates(coordinates.xPosition,
      - coordinates.xPosition + this.line.startingPoint.xPosition + this.line.startingPoint.yPosition));
    radialMap.set(Radial45Degrees.SeventhRay, new Coordinates(coordinates.xPosition, this.line.startingPoint.yPosition));
    radialMap.set(Radial45Degrees.EightRay, new Coordinates(coordinates.xPosition,
      coordinates.xPosition - this.line.startingPoint.xPosition + this.line.startingPoint.yPosition));

    return radialMap.get(radialValue) || coordinates;
  }
}
