import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { SelectorToolService } from '@app-services/drawing/tools/selector-tool/selector-tool.service';
import { TranslateService } from '@app-services/drawing/transform/translate.service';
import { DeleteSVGElement } from '@app-services/undo-redo/delete-svgelement';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionManipulationService {
  savedSelection: SVGGElement[];
  pasteOffset: number;
  pasteOffsetMax: number;
  duplicateOffset: number;
  duplicateOffsetMax: number;
  memorizedSelection: SVGGElement;
  renderer: Renderer2;

  constructor(private selectorTool: SelectorToolService,
              private translateService: TranslateService,
              private drawingElements: DrawingElementsService,
              private rendererFactory: RendererFactory2,
              private undoRedo: UndoRedoManagerService) {
    this.savedSelection = [];
    this.pasteOffset = 0;
    this.pasteOffsetMax = 0;
    this.duplicateOffset = 0;
    this.duplicateOffsetMax = 0;
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.memorizedSelection = this.renderer.createElement('null', 'null');
  }

  deepCopySVG(svgElement: SVGGElement): SVGGElement {
    const copySVG: SVGGElement = document.createElementNS('http://www.w3.org/2000/svg', svgElement.localName) as SVGGElement;
    svgElement.getAttributeNames().forEach((name) => {
      copySVG.setAttribute(name, svgElement.getAttribute(name) || '');
    });
    svgElement.childNodes.forEach((childNode) => {
      this.renderer.appendChild(copySVG, this.deepCopySVG(childNode as SVGGElement));
    });
    return copySVG;
  }

  translateElementDuplication(duplicatedElements: SVGGElement[], isDuplicating: boolean): void {
    const offsetIncrement = 5;
    if (isDuplicating) {
      this.duplicateOffset >= this.duplicateOffsetMax ? this.duplicateOffset = 0 : this.duplicateOffset += offsetIncrement;
    } else {
      this.pasteOffset >= this.pasteOffsetMax ? this.pasteOffset = 0 : this.pasteOffset += offsetIncrement;
    }
    const offSet = isDuplicating ? this.duplicateOffset : this.pasteOffset;
    this.translateService.translateSelectionSVGElement(offSet, offSet, duplicatedElements);
  }

  cut(): void {
    this.copy();
    this.delete();
  }

  copy(): void {
    this.pasteOffset = 0;
    this.pasteOffsetMax = Math.min(
      Number(this.selectorTool.drawingSVG.getAttribute('height')) - this.selectorTool.selectedRectangle.startingPoint.yPosition,
      Number(this.selectorTool.drawingSVG.getAttribute('width')) - this.selectorTool.selectedRectangle.startingPoint.xPosition);
    this.savedSelection = [];
    this.selectorTool.selector.selectedElements.forEach((element) => {
      this.savedSelection.push(this.deepCopySVG(element));
    });
  }

  paste(): void {
    const pastedSelection: SVGGElement[] = [];
    this.savedSelection.forEach((element) => {
      pastedSelection.push(this.deepCopySVG(element));
    });
    this.translateElementDuplication(pastedSelection, false);

    pastedSelection.forEach((element) => {
      this.drawingElements.addCompletedSVGToDrawing(element);
    });
    this.updateSelector(pastedSelection);
  }

  duplicate(): void {
    if (this.memorizedSelection !== this.selectorTool.selectedSVG) {
      this.memorizedSelection = this.selectorTool.selectedSVG;
      this.duplicateOffset = 0;
      this.duplicateOffsetMax = Math.min(
        Number(this.selectorTool.drawingSVG.getAttribute('height')) - this.selectorTool.selectedRectangle.startingPoint.yPosition,
        Number(this.selectorTool.drawingSVG.getAttribute('width')) - this.selectorTool.selectedRectangle.startingPoint.xPosition);
    }
    const duplicatedSelection: SVGGElement[] = [];
    this.selectorTool.selector.selectedElements.forEach((element) => {
      duplicatedSelection.push(this.deepCopySVG(element));
    });
    this.translateElementDuplication(duplicatedSelection, true);

    duplicatedSelection.forEach((element) => {
      this.drawingElements.addCompletedSVGToDrawing(element);
    });
  }

  delete(): void {
    const deletionCommand = new DeleteSVGElement(this.selectorTool.selector.selectedElements, this.drawingElements);
    this.undoRedo.executeCommand(deletionCommand);
    this.selectorTool.removeOutline();
  }

  updateSelector(duplicatedSelection: SVGGElement[]): void {
    this.selectorTool.selector.selectedElements = duplicatedSelection;
    this.selectorTool.updateSelectedOutline();
  }
}
