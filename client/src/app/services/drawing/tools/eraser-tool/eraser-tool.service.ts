import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { EraserCursor } from '@app-services/drawing/shapes/rectangle/eraser-cursor';
import { EraseSVGElement } from '@app-services/undo-redo/erase-svgelement';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { VisualIndicatorElementCreator } from 'class/svg-elements-creators/visual-indicator-element-creator';
import { BaseColors } from '../../../../../constants/constants';
import { ToolPropertiesService } from '../tool-properties.service';

const ERASER_PRECISION = 25;

@Injectable({
  providedIn: 'root'
})
export class EraserToolService {
  cursor: EraserCursor;
  isErasing: boolean;
  svgDrawing: SVGSVGElement;
  renderer: Renderer2;
  coloredNode: [Node, string | null, string | null] [];
  selectedNode: Node [];
  eraserRectangle: SVGRect;
  eraserSize: number;
  visualIndicatorCreator: VisualIndicatorElementCreator;

  constructor(private toolProperties: ToolPropertiesService,
              private colorsService: ColorsService,
              private drawingElements: DrawingElementsService,
              private rendererFactory: RendererFactory2,
              private undoRedo: UndoRedoManagerService,
              private autoSave: AutoSaveService) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.isErasing = false;
    this.cursor = new EraserCursor(this.colorsService, toolProperties);
    this.coloredNode = [];
    this.eraserSize = 0;
    this.visualIndicatorCreator = new VisualIndicatorElementCreator(rendererFactory);
  }

  eventTypeDispatcher(event: MouseEvent): void {
    const mapTypeDispatcher  = new Map< string , () => void > ();
    mapTypeDispatcher.set('mousedown', () => this.onMouseDown());
    mapTypeDispatcher.set('mousemove', () => this.onMouseMove(event));
    mapTypeDispatcher.set('mouseup', () => this.onMouseUp());
    mapTypeDispatcher.set('mouseleave', () => this.onMouseLeave());
    mapTypeDispatcher.set('mouseenter', () => this.onMouseEnter(event));
    (mapTypeDispatcher.get(event.type) || (() => null))();
  }

  onMouseDown(): void {
    this.isErasing = true;
  }

  onMouseEnter(event: MouseEvent): void {
    this.eraserSize = this.toolProperties.eraserSize;
    this.cursor.updateSize();
    this.setEraserCursor(event);
    this.eraserRectangle = this.svgDrawing.createSVGRect();
    this.eraserRectangle.width = this.eraserSize;
    this.eraserRectangle.height = this.eraserSize;
  }

  onMouseMove(event: MouseEvent): void {
    this.setEraserCursor(event);
    const svgElementTouchedByEraser = this.getNodeTouchedByEraser(event);
    if (!this.isErasing) {
      this.removeHighlight();
    }
    if (svgElementTouchedByEraser instanceof SVGElement) {
      this.highlightSVGElement(svgElementTouchedByEraser);
    }
  }

  onMouseUp(): void {
    if (this.isErasing) {
      const command = new EraseSVGElement(this.selectedNode, this.svgDrawing);
      this.undoRedo.executeCommand(command);
      if (command.nodesAndTheirNextSibling.length > 0) {
        this.autoSave.save(true);
      }
    }
    this.isErasing = false;
  }

  onMouseLeave(): void {
    this.isErasing = false;
    const emptyCursor = this.visualIndicatorCreator.deleteCursor();
    this.drawingElements.cursorElement.next(emptyCursor);
  }

  setEraserCursor(event: MouseEvent): void {
    this.cursor.setCursorStartingPoint(event);
    const eraserElement = this.visualIndicatorCreator.createEraserCursorAddOn(this.cursor);
    this.drawingElements.cursorElement.next(eraserElement);
  }

  getVerificationPointsTable(event: MouseEvent): [number, number][] {
    const verificationPointsTable: [number, number][] = [];
    for (let i = 2; i <= ERASER_PRECISION; i++) {
      verificationPointsTable.push([event.offsetX + this.eraserSize / i, event.offsetY + this.eraserSize / i ]);
      verificationPointsTable.push([event.offsetX - this.eraserSize / i, event.offsetY - this.eraserSize / i ]);
      verificationPointsTable.push([event.offsetX + this.eraserSize / i, event.offsetY - this.eraserSize / i ]);
      verificationPointsTable.push([event.offsetX - this.eraserSize / i, event.offsetY + this.eraserSize / i ]);
      verificationPointsTable.push([event.offsetX - this.eraserSize / i, event.offsetY ]);
      verificationPointsTable.push([event.offsetX, event.offsetY - this.eraserSize / 2 ]);
    }
    verificationPointsTable.push([event.offsetX, event.offsetY]);
    return verificationPointsTable;
  }

  getNodeTouchedByEraser(event: MouseEvent): Node | null {
    const listOfNearNodes = this.getListOfTouchedNodes(event);
    const verificationPointsTable: [number, number][] = this.getVerificationPointsTable(event);

    for (let i = listOfNearNodes.length - 1; i >= 0; i--) {
      const svgElement = listOfNearNodes[i] as SVGGeometryElement;
      const transformation = this.getTransformationSvgElement(svgElement);
      for (const point of verificationPointsTable) {
        const pointToVerify = this.svgDrawing.createSVGPoint();
        pointToVerify.x = point[0] - transformation[0];
        pointToVerify.y = point[1] - transformation[1];
        if (svgElement.isPointInFill(pointToVerify)) {
          if (!(svgElement.getAttribute('fill') === 'none')) {
            return svgElement;
          }
        } else if (svgElement.isPointInStroke(pointToVerify)) {
           return svgElement;
        }
      }
    }
    return null;
  }

  getTransformationSvgElement(svgElement: SVGGeometryElement): [number, number] {
    const parentElement = svgElement.parentElement as Element;
    if (parentElement.localName === 'g') {
      svgElement = parentElement as SVGGeometryElement;
    }
    const transformAttribute = svgElement.getAttribute('transform');
    if (!transformAttribute) {
      return [0, 0];
    }
    const transformElements = transformAttribute.split('(');
    if (transformElements[0] === 'translate') {
      const numbersInsideTransform = transformElements[1].split(' ');
      const xTranslation = (Number)(numbersInsideTransform[0]);
      const secondNumberWithoutLastCharacter = numbersInsideTransform[1].split(')');
      const yTranslation = (Number)(secondNumberWithoutLastCharacter[0]);
      return [xTranslation, yTranslation];
    }
    return [0, 0];
  }

  getListOfTouchedNodes(event: MouseEvent): NodeList {
    this.eraserRectangle.x = event.offsetX - this.eraserSize / 2;
    this.eraserRectangle.y = event.offsetY - this.eraserSize / 2;
    return this.svgDrawing.getIntersectionList(this.eraserRectangle, this.svgDrawing);
  }

  highlightSVGElement(svgElement: SVGElement): void {
    if (this.selectedNode.indexOf(svgElement) !== -1) {
      return;
    }
    const parentElement = svgElement.parentElement as Element;
    if (parentElement.localName === 'g') {
      if (this.selectedNode.indexOf(parentElement) === -1) {
        this.highlightWrapper(parentElement);
        this.selectedNode.push(parentElement);
      }
    } else {
      this.changeColor(svgElement);
      this.selectedNode.push(svgElement);
    }
  }

  highlightWrapper(parentNode: Element): void {
    const firstChild = parentNode.firstChild;
    if (firstChild instanceof Element) {
      this.changeColor(firstChild);
      let nextPartofSVGElement = firstChild.nextSibling;
      while (nextPartofSVGElement) {
        this.changeColor(nextPartofSVGElement);
        nextPartofSVGElement = nextPartofSVGElement.nextSibling;
      }
    }
  }

  changeColor(node: Node): void {
    if (node instanceof Element) {
      const strokeColor = node.getAttribute('stroke');
      const strokeWidth = node.getAttribute('stroke-width');
      this.coloredNode.push([node, strokeColor, strokeWidth]);
      if (strokeWidth === '0' || null) {
        this.renderer.setAttribute(node, 'stroke-width', '2');
      }
      if (!this.checkIfColorNearRed(strokeColor)) {
        this.renderer.setAttribute(node, 'stroke', BaseColors.Red);
      } else {
        this.renderer.setAttribute(node, 'stroke', 'firebrick');
      }
    }
  }

  removeHighlight(): void {
    if (this.coloredNode.length > 0) {
      this.coloredNode.forEach ((nodeTuple) => {
        this.renderer.setAttribute(nodeTuple[0], 'stroke', nodeTuple[1] ? nodeTuple[1] : 'none');
        this.renderer.setAttribute(nodeTuple[0], 'stroke-width', nodeTuple[2] ? nodeTuple[2] : 'none'); });
      this.coloredNode = [];
    }
    this.selectedNode = [];
  }

  checkIfColorNearRed(color: string | null ): boolean {
    if (color) {
      const rbgaNumberStartIndex = 5;
      const colorWithoutRgbaPrefix = color.slice(rbgaNumberStartIndex, -1);
      const colorRGBA = colorWithoutRgbaPrefix.split(',');
      const beginningOfRedColors = 200;
      if (Number(colorRGBA[0]) > beginningOfRedColors) {
        return true;
      }
    }
    return false;
  }
}
