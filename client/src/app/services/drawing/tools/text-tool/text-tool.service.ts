import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { SVGElementCreator } from 'class/svg-elements-creators/svg-element-creator';
import { TextElementCreator } from 'class/svg-elements-creators/text-element-creator';
import { BehaviorSubject } from 'rxjs';
import { Text } from '../../text/text';
import { Coordinates } from '../coordinates';
import { ToolPropertiesService } from '../tool-properties.service';

@Injectable({
  providedIn: 'root'
})
export class TextToolService {

  lastOffset: Coordinates;
  textProperties: Text;
  isWriting: boolean;
  wasAborted: boolean;
  mouseInTextbox: boolean;
  svgElementCreator: SVGElementCreator;
  mapKeyboardDispatcher: Map<string, () => void>;
  currentText: SVGElement;
  renderer: Renderer2;
  textCreator: TextElementCreator;
  editingTextSubject: BehaviorSubject<boolean>;

  constructor(public toolProperties: ToolPropertiesService,
              private colorsService: ColorsService,
              public drawingElements: DrawingElementsService,
              private autoSave: AutoSaveService,
              private rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.lastOffset = new Coordinates(0, 0);
    this.isWriting = false;
    this.wasAborted = false;
    this.mouseInTextbox = false;
    this.svgElementCreator = new SVGElementCreator(rendererFactory);
    this.editingTextSubject = new BehaviorSubject<boolean>(false);
    this.keyboardMapCreator();
  }

  keyboardMapCreator(): void {
    this.mapKeyboardDispatcher = new Map<string, () => void>();
    this.mapKeyboardDispatcher.set('Enter', () => { this.textCreator.addLineBelow(); this.updateText(); });
    this.mapKeyboardDispatcher.set('Backspace', () => { this.textCreator.removeLetter(-1); this.updateText(); });
    this.mapKeyboardDispatcher.set('Delete', () => { this.textCreator.removeLetter(1); this.updateText(); });
    this.mapKeyboardDispatcher.set('Escape', () => { this.abortEdition(); });
    this.mapKeyboardDispatcher.set('ArrowLeft', () => { this.textCreator.moveCursorLeft(); this.updateText(); });
    this.mapKeyboardDispatcher.set('ArrowRight', () => { this.textCreator.moveCursorRight(); this.updateText(); });
    this.mapKeyboardDispatcher.set('ArrowUp', () => { this.textCreator.moveCursorUp(); this.updateText(); });
    this.mapKeyboardDispatcher.set('ArrowDown', () => { this.textCreator.moveCursorDown(); this.updateText(); });
  }

  keyboardEventDispatcher(event: KeyboardEvent): void {
    if (this.isPrintableCharacter(event.key) && this.isWriting) {
      this.textCreator.addLetter(event);
      this.updateText();
    }
    (this.mapKeyboardDispatcher.get(event.key) || (() => null))();
  }

  eventTypeDispatcher(event: MouseEvent): void {
    const mapTypeDispatcher  = new Map<string, () => void> ();
    mapTypeDispatcher.set('mousedown', () => this.onMouseDown(event));
    (mapTypeDispatcher.get(event.type) || (() => null))();
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.isWriting || this.wasAborted) {
      this.textProperties = new Text(this.colorsService, this.toolProperties);
      this.getAttributesFromModalWindow();
      this.lastOffset = { xPosition: event.offsetX, yPosition: event.offsetY + this.textProperties.fontSize };
      this.textProperties.startingPoint.xPosition = this.lastOffset.xPosition;
      this.textProperties.startingPoint.yPosition = this.lastOffset.yPosition;
      this.createNewText();
      this.wasAborted = false;
    } else if (this.isWriting && !this.textCreator.isMouseInTextbox(event)) {
      this.finalizeText();
    }
  }

  createNewText(): void {
    this.isWriting = true;
    this.textCreator = new TextElementCreator(this.rendererFactory, this.colorsService, this.toolProperties);
    this.editingTextSubject.next(true);
    this.currentText = this.textCreator.createNewTextElement(this.textProperties);
    this.drawingElements.temporaryRenderer.next(this.currentText);
  }

  updateText(): void {
    this.currentText = this.textCreator.updateTextInElement(this.textProperties);
    this.drawingElements.temporaryRenderer.next(this.currentText);
  }

  getAttributesFromModalWindow(): void {
    this.textProperties.alignment = this.toolProperties.textAlignment;
    this.textProperties.color = this.colorsService.getMainColorRGBA();
    this.textProperties.isBold = this.toolProperties.bold;
    this.textProperties.isItalics = this.toolProperties.italics;
    this.textProperties.fontSize = this.toolProperties.fontSize;
    this.textProperties.fontFamily = this.toolProperties.fontFamily;
  }

  abortEdition(): void {
    this.isWriting = false;
    this.editingTextSubject.next(false);
    this.textProperties = new Text(this.colorsService, this.toolProperties);
    this.createNewText();
    this.wasAborted = true;
  }

  finalizeText(): void {
    this.textCreator.removeLetter(0);
    this.currentText = this.textCreator.updateTextInElement(this.textProperties);
    this.currentText = this.textCreator.removeTextBox(this.currentText);
    this.drawingElements.addCompletedSVGToDrawing(this.currentText);
    this.editingTextSubject.next(false);
    this.isWriting = false;
    this.autoSave.save(true);
  }

  isPrintableCharacter(code: string): boolean {
    return code.length === 1;
  }
}
