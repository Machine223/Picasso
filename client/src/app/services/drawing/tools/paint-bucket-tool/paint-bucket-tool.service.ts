import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { PaintBucketPath } from '@app-services/drawing/paths/paint-bucket-path';
import { Path } from '@app-services/drawing/paths/path';
import { ColorSelectorService } from '@app-services/drawing/tools/colorSelector-tool/color-selector.service';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { PaintBucketBorderTracer } from 'class/paint-bucket/paint-bucket-border-tracer';
import { PaintBucketFiller } from 'class/paint-bucket/paint-bucket-filler';
import { PaintBucketHoleFinder } from 'class/paint-bucket/paint-bucket-hole-finder';
import { PaintBucketElementCreator } from 'class/svg-elements-creators/paint-bucket-element-creator';

@Injectable({
  providedIn: 'root'
})
export class PaintBucketService {

  fillPath: Path;
  initialCoordinates: Coordinates;
  svgPaintBucketCreator: PaintBucketElementCreator;
  renderer: Renderer2;

  constructor(private colorSelectorService: ColorSelectorService,
              private colorsService: ColorsService,
              private toolPropertiesService: ToolPropertiesService,
              private drawingElementService: DrawingElementsService,
              rendererFactory: RendererFactory2,
              public snackBar: MatSnackBar) {
    this.fillPath = new Path(this.colorsService, this.toolPropertiesService);
    this.fillPath.currentPath = '';
    this.renderer = rendererFactory.createRenderer(null, null);
    this.svgPaintBucketCreator = new PaintBucketElementCreator(rendererFactory);

  }

  eventTypeDispatcher(event: MouseEvent): void {
    const mapTypeDispatcher = new Map<string, () => void>();
    mapTypeDispatcher.set('mousedown', () => this.onMouseDown(event));
    (mapTypeDispatcher.get(event.type) || (() => null))();
  }

  async onMouseDown(event: MouseEvent): Promise<void> {
    const snackRef = this.snackBar.open('Application du seau en cours...', '');
    snackRef.afterOpened().subscribe(() => {
      const paintBucketWorked = this.doPaintShape(event);
      paintBucketWorked.then((res) => {
        snackRef.dismiss();
        if (res) {
          this.snackBar.open('Le seau a été appliqué avec succès.', '', {duration: 3000});
        } else {
          this.snackBar.open('La forme est trop grosse pour le seau.', '', {duration: 3000});
      }});
    });
  }

  async doPaintShape(event: MouseEvent): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.paintShape(event, () => resolve(true));
    });
  }

  paintShape(event: MouseEvent, callback: () => void): void {
    this.initialCoordinates = new Coordinates(event.offsetX, event.offsetY);
    const colorToChange = this.colorSelectorService.getColorPosition(event);
    const canvasClone = this.cloneCanvas(this.colorSelectorService.context2D);
    const colorToApplyHexa = this.colorsService.mainColor.getValue();
    const colorToApplyShape = this.colorsService.getMainColorRGBA();
    const colorToApply = this.colorToUint8ClampedArray(colorToApplyHexa);
    const fillerMainShape = new PaintBucketFiller(canvasClone, this.renderer,
      colorToChange, colorToApplyHexa, colorToApply, this.toolPropertiesService.paintBucketTolerance);
    fillerMainShape.performFill(this.initialCoordinates);
    const outerBorderCoordinate = this.findOuterBorder(fillerMainShape.contextCanvasOnlyFill, colorToApply);
    const outerBorderTracer = new PaintBucketBorderTracer(fillerMainShape.contextCanvasOnlyFill, colorToApply);
    let path = outerBorderTracer.traceBorder(outerBorderCoordinate);
    const fillerOuterMainShape =
      new PaintBucketFiller(fillerMainShape.canvasFill, this.renderer,
        this.colorToUint8ClampedArray('#000000'), colorToApplyHexa, colorToApply, 1);
    fillerOuterMainShape.fillOuter(outerBorderTracer.borderExtremum);
    fillerOuterMainShape.performFill(new Coordinates(outerBorderTracer.borderExtremum.xMin - 1, outerBorderTracer.borderExtremum.yMin - 1));
    let holeCoordinates = new Coordinates(outerBorderTracer.borderExtremum.xMin, outerBorderTracer.borderExtremum.yMin);
    const holeFinder = new PaintBucketHoleFinder(fillerMainShape.contextCanvasOnlyFill,
      outerBorderTracer.borderExtremum, colorToApply);
    const holeFiller = new PaintBucketFiller(fillerMainShape.canvasFill,
        this.renderer, this.colorToUint8ClampedArray('#000000'), colorToApplyHexa, colorToApply, 0);
    const holeBorderTracer = new PaintBucketBorderTracer(holeFiller.contextCanvasOnlyFill, colorToApply);
    while (holeCoordinates.xPosition !== -1) {
      const holeFound = holeFinder.findHole(holeCoordinates);
      holeCoordinates = new Coordinates(holeFound.xPosition, holeFound.yPosition);
      if (holeCoordinates.xPosition !== -1) {
        holeFiller.performFill(holeCoordinates);
        const holePath = holeBorderTracer.traceBorder(holeCoordinates);
        path = path + holePath;
      }
    }
    this.traceShape(path, colorToApplyShape);
    callback();
  }

  cloneCanvas(canvasToClone: CanvasRenderingContext2D): HTMLCanvasElement {
    const newCanvas: HTMLCanvasElement = this.renderer.createElement('canvas') as HTMLCanvasElement;
    this.renderer.setProperty(newCanvas, 'width', canvasToClone.canvas.width);
    this.renderer.setProperty(newCanvas, 'height', canvasToClone.canvas.height);
    const context2D: CanvasRenderingContext2D = newCanvas.getContext('2d') as CanvasRenderingContext2D;
    context2D.drawImage(canvasToClone.canvas, 0, 0);
    return newCanvas;
  }

  findOuterBorder(context: CanvasRenderingContext2D, colorToApply: Uint8ClampedArray): Coordinates {
    const y: number = this.initialCoordinates.yPosition;
    let x = 0;
    while (context.getImageData(x, y, 1, 1).data.toString() !== colorToApply.toString()) {
      ++x;
    }
    return new Coordinates(x, y);
  }

  traceShape(pathCoordinates: string, colorOfShape: string): void {
    const pathShape = new PaintBucketPath(this.colorsService, this.toolPropertiesService, colorOfShape);
    pathShape.currentPath = pathCoordinates;
    const svgShape = this.svgPaintBucketCreator.createPath(pathShape);
    this.drawingElementService.addCompletedSVGToDrawing(svgShape);
  }

  colorToUint8ClampedArray(color: string): Uint8ClampedArray {
    const byte = 255;
    const array = [];
    let mainColor: string = color;
    mainColor = mainColor.substring(1);
    let buffer = '';
    let clampedArrayIndex = 0;
    for (let i = 0; i < mainColor.length; i++) {
      buffer += mainColor.charAt(i);
      if ((i + 1) % 2 === 0) {
        array[clampedArrayIndex] = parseInt(buffer, 16);
        ++clampedArrayIndex;
        buffer = '';
      }
    }
    array[clampedArrayIndex] = byte;
    const uInt8Array = new Uint8ClampedArray(array.length);
    for (let i = 0; i < uInt8Array.length; i++) {
      uInt8Array[i] = array[i];
    }
    return uInt8Array;
  }
}
