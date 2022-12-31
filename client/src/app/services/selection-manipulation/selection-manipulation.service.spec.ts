import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { SelectorToolService } from '@app-services/drawing/tools/selector-tool/selector-tool.service';
import { TranslateService } from '@app-services/drawing/transform/translate.service';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { SelectionManipulationService } from './selection-manipulation.service';

describe('SelectionManipulationService', () => {
  let manipulationService: SelectionManipulationService;
  let selectorTool: SelectorToolService;
  let drawingElements: DrawingElementsService;
  let undoRedo: UndoRedoManagerService;
  let translateService: TranslateService;
  let renderer: Renderer2;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    manipulationService = TestBed.get(SelectionManipulationService);
    selectorTool = TestBed.get(SelectorToolService);
    drawingElements = TestBed.get(DrawingElementsService);
    undoRedo = TestBed.get(UndoRedoManagerService);
    translateService = TestBed.get(TranslateService);
    const rendererFactory = TestBed.get(RendererFactory2);
    renderer = rendererFactory.createRenderer(null, null);
  });

  it('should be created', () => {
    expect(manipulationService).toBeTruthy();
  });

  it('#deepCopySVG should make a deep copy of an SVG', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');
    const svgElement = element as SVGGElement;
    const child = document.createElementNS(document.documentElement.namespaceURI, 'ellipse');
    child.setAttribute('stroke-width', '10');
    child.setAttribute('cx', '10');
    child.setAttribute('cy', '20');
    child.setAttribute('width', '100');
    child.setAttribute('height', '300');
    const svgChild = child as SVGGElement;
    renderer.appendChild(svgElement, svgChild);
    const deepCopiedSVG = manipulationService.deepCopySVG(svgElement);

    expect(deepCopiedSVG).not.toBe(svgElement);
    deepCopiedSVG.getAttributeNames().forEach((name) => {
      expect(deepCopiedSVG.getAttribute(name)).toEqual(svgElement.getAttribute(name));
    });
    if (deepCopiedSVG.firstElementChild !== null && svgElement.firstElementChild !== null) {
      expect(deepCopiedSVG.firstElementChild).not.toBe(svgElement.firstElementChild);
      deepCopiedSVG.firstElementChild.getAttributeNames().forEach((name) => {
        if (deepCopiedSVG.firstElementChild !== null && svgElement.firstElementChild !== null) {
          expect(deepCopiedSVG.firstElementChild.getAttribute(name)).toEqual(svgElement.firstElementChild.getAttribute(name));
        }
      });
    }
  });

  it('#translateElementDuplication should call translateService and increment Offset', () => {
    const spyOnTranslate = spyOn(translateService, 'translateSelectionSVGElement');
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');
    const svgElement = element as SVGGElement;
    const offsetMax = 6;
    manipulationService.pasteOffsetMax = offsetMax;
    manipulationService.duplicateOffsetMax = offsetMax;
    manipulationService.pasteOffset = 0;
    manipulationService.duplicateOffset = 2;

    manipulationService.translateElementDuplication([svgElement], false);
    manipulationService.translateElementDuplication([svgElement], true);
    manipulationService.translateElementDuplication([svgElement], true);

    const pasteOffsetValue = 5;
    expect(manipulationService.pasteOffset).toEqual(pasteOffsetValue);
    expect(manipulationService.duplicateOffset).toEqual(0);
    const timesCalled = 3;
    expect(spyOnTranslate).toHaveBeenCalledTimes(timesCalled);
  });

  it('#cut should call copy() and delete()', () => {
    const spyOnCopy = spyOn(manipulationService, 'copy');
    const spyOnDelete = spyOn(manipulationService, 'delete');
    manipulationService.cut();
    expect(spyOnCopy).toHaveBeenCalled();
    expect(spyOnDelete).toHaveBeenCalled();
  });

  it('#copy should fill savedSelection', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');
    const svgElement = element as SVGGElement;
    selectorTool.selector.selectedElements.push(svgElement);
    selectorTool.drawingSVG = element as SVGSVGElement;
    manipulationService.copy();
    manipulationService.savedSelection[0].getAttributeNames().forEach((name) => {
      expect(manipulationService.savedSelection[0].getAttribute(name)).toEqual(svgElement.getAttribute(name));
    });
  });

  it('#copy should define a pasteOffsetMax', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');
    selectorTool.drawingSVG = element as SVGSVGElement;
    manipulationService.copy();
    expect(manipulationService.pasteOffsetMax).toBeGreaterThan(0);
  });

  it('#paste should call translateElementDuplication, addCompletedSVGToDrawing and updateSelector', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');
    const svgElement = element as SVGGElement;
    manipulationService.savedSelection.push(svgElement);

    const spyOnTranslate = spyOn(manipulationService, 'translateElementDuplication');
    const spyOnAddSVG = spyOn(drawingElements, 'addCompletedSVGToDrawing');
    const spyOnUpdateSelector = spyOn(manipulationService, 'updateSelector');

    manipulationService.paste();
    expect(spyOnTranslate).toHaveBeenCalled();
    expect(spyOnAddSVG).toHaveBeenCalled();
    expect(spyOnUpdateSelector).toHaveBeenCalled();
  });

  it('#duplicate should define a duplicateOffsetMax', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');
    selectorTool.drawingSVG = element as SVGSVGElement;
    manipulationService.duplicate();
    expect(manipulationService.duplicateOffsetMax).toBeGreaterThan(0);
  });

  it('#duplicate should call translateElementDuplication and addCompletedSVGToDrawing', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');
    const svgElement = element as SVGGElement;
    selectorTool.drawingSVG = element as SVGSVGElement;
    selectorTool.selector.selectedElements.push(svgElement);

    const spyOnTranslate = spyOn(manipulationService, 'translateElementDuplication');
    const spyOnAddSVG = spyOn(drawingElements, 'addCompletedSVGToDrawing');

    manipulationService.duplicate();
    expect(spyOnTranslate).toHaveBeenCalled();
    expect(spyOnAddSVG).toHaveBeenCalled();
  });

  it('#delete should call executeCommand and removeOutline', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');
    const svgElement = element as SVGGElement;
    selectorTool.drawingSVG = element as SVGSVGElement;
    selectorTool.selector.selectedElements.push(svgElement);

    const spyOnExecute = spyOn(undoRedo, 'executeCommand');
    const spyOnRemoveOutline = spyOn(selectorTool, 'removeOutline');

    manipulationService.delete();
    expect(spyOnExecute).toHaveBeenCalled();
    expect(spyOnRemoveOutline).toHaveBeenCalled();
  });

  it('#updateSelector should modify selectedElements and call updateSelectedOutline', () => {
    const element = document.createElementNS(document.documentElement.namespaceURI, 'rect');
    element.setAttribute('stroke-width', '10');
    element.setAttribute('x', '0');
    element.setAttribute('y', '0');
    element.setAttribute('width', '100');
    element.setAttribute('height', '300');
    const svgElement = element as SVGGElement;

    const spyOnUpdateOutline = spyOn(selectorTool, 'updateSelectedOutline');

    manipulationService.updateSelector([svgElement]);
    expect(selectorTool.selector.selectedElements).toContain(svgElement);
    expect(spyOnUpdateOutline).toHaveBeenCalled();
  });
});
