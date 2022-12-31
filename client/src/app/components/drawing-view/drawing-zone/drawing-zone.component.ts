import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { DrawingPropertiesService } from '@app-services/drawing/drawing-properties/drawing-properties.service';
import { DrawingZonePropertiesService } from '@app-services/drawing/drawing-zone-properties/drawing-zone-properties.service';
import { GridService } from '@app-services/drawing/grid/grid.service';
import { ColorSelectorService } from '@app-services/drawing/tools/colorSelector-tool/color-selector.service';
import { EraserToolService } from '@app-services/drawing/tools/eraser-tool/eraser-tool.service';
import { SelectorToolService } from '@app-services/drawing/tools/selector-tool/selector-tool.service';
import { ToolManagerService } from '@app-services/drawing/tools/tool-manager.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { ExportDrawingService } from '@app-services/exportDrawing/export-drawing.service';
import { LoadingFeatureService } from '@app-services/loading-feature/loading-feature.service';
import { ParsingService } from '@app-services/saving-feature/parsing.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-drawing-zone',
  templateUrl: './drawing-zone.component.html',
  styleUrls: ['./drawing-zone.component.scss'],
})
export class DrawingZoneComponent implements OnInit, AfterViewInit {
  lastTemporaryRenderer: SVGElement | null;
  lastTemporarySelector: SVGElement | null;
  lastTemporaryCursor: SVGElement | null;
  cursorToolRenderer: SVGElement;
  loadedMetadata: string | null;
  loadedMetadataSubscription: Subscription;

  constructor(public renderer: Renderer2,
              private toolManager: ToolManagerService,
              private toolPropertiesService: ToolPropertiesService,
              private selectorTool: SelectorToolService,
              public grid: GridService,
              private drawingElements: DrawingElementsService,
              private colorSelectorService: ColorSelectorService,
              private eraserTool: EraserToolService,
              private loadingFeature: LoadingFeatureService,
              private parsingService: ParsingService,
              private exportService: ExportDrawingService,
              private drawingProperties: DrawingPropertiesService,
              private drawingZoneProperties: DrawingZonePropertiesService,
              private autoSave: AutoSaveService) {
    this.subscribeToSVGElementToUpdate();
    this.lastTemporaryRenderer = null;
    this.loadedMetadataSubscription = new Subscription();
    this.loadedMetadata = (this.autoSave.shouldLoad ?  localStorage.getItem('autosave') : '');
  }

  @ViewChild('svgDrawing', { static: true })
  svgDrawing: ElementRef<SVGElement>;

  @ViewChild('drawingZone', { static: true })
  drawingZone: ElementRef;

  @ViewChild('svgBackground', { static: true })
  svgBackground: ElementRef;

  @HostListener('document:keydown', ['$event'])
  handleShiftKeyDownEvent(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.toolManager.shiftKeyToolDispatcher(true);
    }
    this.renderer.removeChild(this.svgDrawing.nativeElement, this.lastTemporaryCursor);
  }

  @HostListener('document:keyup', ['$event'])
  handleShiftKeyUpEvent(event: KeyboardEvent): void {
    if (event.key === 'Shift') {
      this.toolManager.shiftKeyToolDispatcher(false);
    }
  }

  @HostListener('document:wheel', ['$event'])
  wheelEvent(wheelEvent: WheelEvent): void {
    this.renderer.listen(this.svgDrawing.nativeElement, 'wheel', (event: WheelEvent) => {
      event.preventDefault();
    });
    if (wheelEvent.type === 'wheel' && this.drawingZoneProperties.isMouseIn) {
      this.toolManager.wheelDispatcher(wheelEvent);
    }
  }

  ngOnInit(): void {
    this.loadedMetadataSubscription = this.loadingFeature.loadedDrawingSubject.subscribe(
      (inputDrawing) => {
        this.loadedMetadata = inputDrawing.metadata;
        this.loadDrawing();
        this.updateCanvas('none');
      }
    );
  }

  ngAfterViewInit(): void {
    this.createNewDrawing();
    if (this.loadedMetadata !== '') {
      this.loadDrawing();
    }
    this.eraserTool.svgDrawing = this.svgDrawing.nativeElement as SVGSVGElement;
    this.eraserTool.eraserRectangle = this.eraserTool.svgDrawing.createSVGRect();
    this.selectorTool.drawingSVG = this.svgDrawing.nativeElement as SVGSVGElement;
    this.drawingProperties.svgDrawing = this.svgDrawing.nativeElement as SVGElement;
    this.drawingProperties.svgBackground = this.svgBackground.nativeElement as SVGElement;
    const filter = 'none';
    this.updateCanvas(filter);
  }

  subscribeToSVGElementToUpdate(): void {
    this.drawingElements.selectorRenderer.subscribe((svgShape) => {
      this.addTemporarySvgShape(svgShape, this.lastTemporarySelector);
      this.lastTemporarySelector = svgShape;
    });
    this.drawingElements.temporaryRenderer.subscribe((svgShape) => {
      this.addTemporarySvgShape(svgShape, this.lastTemporaryRenderer);
      this.lastTemporaryRenderer = svgShape;
    });
    this.drawingElements.completedRenderer.subscribe({ next:  (svgShape) => {
        this.addSvgShape(svgShape as SVGGElement);
      }
    });
    this.drawingElements.cursorElement.subscribe((svgShape) => {
      this.addTemporarySvgShape(svgShape, this.lastTemporaryCursor);
      this.lastTemporaryCursor = svgShape;
    });
    this.drawingElements.elementToDelete.subscribe((svgShape) => (
      this.renderer.removeChild(this.svgDrawing.nativeElement, svgShape)
    ));
    this.exportService.filter.subscribe((filter) => {
      this.updateCanvas(filter);
    });
  }

  loadDrawing(): void {
    if (this.loadedMetadata !== null) {
      this.svgDrawing.nativeElement.innerHTML = this.loadedMetadata;
      this.autoSave.save(false);
    }
  }

  onEvent(event: MouseEvent): void {
    event.preventDefault();
    this.toolManager.eventToolDispatcher(event);
    this.drawingZoneProperties.setIsMouseIn(event);
    if (event.type === 'mouseup') {
      this.updateCanvas('none');
    }
  }

  addTemporarySvgShape(svgShape: SVGElement, temporaryElement: SVGElement | null): void {
    if (temporaryElement) {
      this.renderer.removeChild(this.svgDrawing.nativeElement, temporaryElement);
    }
    this.renderer.appendChild(this.svgDrawing.nativeElement, svgShape);
  }

  addSvgShape(svgShape: SVGElement): void {
    if (this.lastTemporaryRenderer) {
      this.renderer.removeChild(this.svgDrawing.nativeElement, this.lastTemporaryRenderer);
    }
    if (this.lastTemporaryCursor) {
      this.renderer.removeChild(this.svgDrawing.nativeElement, this.lastTemporaryCursor);
    }
    if (svgShape) {
      this.renderer.appendChild(this.svgDrawing.nativeElement, svgShape);
    }
    this.updateCanvas('none');
    this.lastTemporaryRenderer = null;
    this.lastTemporaryCursor = null;
  }

  updateCanvas(filter: string): void {
    const canvas = this.renderer.createElement('canvas') as HTMLCanvasElement;
    const imageSVG = this.renderer.createElement('img') as HTMLImageElement;

    const svgXMLfilter = this.setFilterProperties(this.svgDrawing.nativeElement,
      this.lastTemporaryRenderer || this.renderer.createElement('null', 'null'),
      this.lastTemporaryCursor || this.renderer.createElement('null', 'null'),
      this.lastTemporarySelector || this.renderer.createElement('null', 'null'));
    this.renderer.setAttribute(svgXMLfilter, 'style', 'cursor: crosshair; filter:' + filter);
    const serializedSVG = new XMLSerializer().serializeToString(svgXMLfilter);
    this.setCanvasProperties(canvas, imageSVG, serializedSVG);
    this.parsingService.updateSerializer(serializedSVG);
    const context2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    imageSVG.onload = () => {
      context2D.drawImage(imageSVG, 0, 0);
    };
    this.colorSelectorService.updateCanvasSVG(context2D);
    this.parsingService.updateCanvasSVG(context2D);
    this.parsingService.updateImage(imageSVG);
  }

  setFilterProperties(svgElement: SVGElement, tempRenderer: SVGElement, tempCursor: SVGElement, tempSelector: SVGElement): SVGElement {
    const copySVG: SVGElement = document.createElementNS('http://www.w3.org/2000/svg', svgElement.localName) as SVGElement;
    svgElement.getAttributeNames().forEach((name) => {
      copySVG.setAttribute(name, svgElement.getAttribute(name) || '');
    });
    svgElement.childNodes.forEach((childNode) => {
      if ((childNode as SVGElement === tempRenderer && tempRenderer.firstElementChild
        && tempRenderer.firstElementChild.localName === 'text') || childNode as SVGElement === tempCursor
        || childNode as SVGElement === tempSelector) { return; }
      if (childNode.nodeValue) {
        const text = this.renderer.createText(childNode.nodeValue);
        this.renderer.appendChild(copySVG, text);
      } else {
        this.renderer.appendChild(copySVG, this.setFilterProperties(childNode as SVGElement, tempRenderer, tempCursor, tempSelector));
      }
    });
    return copySVG;
  }

  setCanvasProperties(canvas: HTMLCanvasElement, imageSVG: HTMLImageElement, serializedSVG: string): void {
    this.renderer.setProperty(imageSVG, 'src', 'data:image/svg+xml,' + encodeURIComponent(serializedSVG));
    this.renderer.setProperty(canvas, 'width', this.svgDrawing.nativeElement.getBoundingClientRect().width);
    this.renderer.setProperty(canvas, 'height', this.svgDrawing.nativeElement.getBoundingClientRect().height);
  }

  createNewDrawing(): void {
    const grayInRGBA = 'rgba(128,128,128,1)';
    if (this.drawingProperties.currentDrawingColor === grayInRGBA) {
      this.renderer.setAttribute(this.drawingZone.nativeElement, 'background-color', 'LightGray');
    } else {
      this.renderer.setAttribute(this.drawingZone.nativeElement, 'background-color', 'Gray');
    }
  }

  isGridSelected(): boolean {
    return this.toolPropertiesService.gridSelected;
  }
}
