import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { Drawing } from '../../../../../../common/communication/drawing';

@Injectable({
  providedIn: 'root'
})
export class DrawingPropertiesService {
  svgDrawing: SVGElement | null;
  svgBackground: SVGElement | null;
  isDrawingCreated: boolean;
  initialState: Drawing;
  currentDrawingHeight: number;
  currentDrawingWidth: number;
  currentDrawingColor: string;
  isModifiedByUser: boolean;
  color: string;
  renderer: Renderer2;

  // tslint:disable-next-line: variable-name - Reason: Approved by Mohammed Abderrahmane Brahmi for getter/setter
  private _height: number;
  // tslint:disable-next-line: variable-name - Reason: Approved by Mohammed Abderrahmane Brahmi for getter/setter
  private _width: number;

  constructor(private rendererFactory: RendererFactory2,
              private undoRedo: UndoRedoManagerService) {
    const sizeModalPropertiesWindow = 290;
    const white = '#ffffff';
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.isModifiedByUser = false;
    this._height = window.innerHeight;
    this._width = window.innerWidth - sizeModalPropertiesWindow;
    this.color = 'white';
    this.isDrawingCreated = false;
    this.initialState = { name: '', tags: [], metadata: '', previewSource: '' };
    this.currentDrawingHeight = window.innerHeight;
    this.currentDrawingWidth = window.innerWidth;
    this.currentDrawingColor = white;
    this.svgBackground = null;
    this.svgDrawing = null;
  }

  get height(): number {
    return (this.isModifiedByUser ? this._height : window.innerHeight);
  }

  set height(newHeight: number) {
    if (newHeight !== window.innerHeight) {
      this.isModifiedByUser = true;
    }
    this._height = newHeight;
  }

  get width(): number {
    return (this.isModifiedByUser ? this._width : window.innerWidth);
  }

  set width(newWidth: number) {
    if (newWidth !== window.innerWidth) {
      this.isModifiedByUser = true;
    }
    this._width = newWidth;
  }

  creationOfDrawing(color: string): void {
    if (this.isDrawingCreated) {
      const backgroundNode = this.svgBackground as Element;
      let svgElementToBeDeleted = backgroundNode.nextSibling;
      while (svgElementToBeDeleted) {
        this.renderer.removeChild(this.svgDrawing, svgElementToBeDeleted);
        svgElementToBeDeleted = svgElementToBeDeleted.nextSibling;
      }
      this.undoRedo.clearCommands();
    }
    this.isDrawingCreated = true;
    this.currentDrawingHeight = this._height;
    this.currentDrawingWidth = this._width;
    this.currentDrawingColor = color;
  }
}
