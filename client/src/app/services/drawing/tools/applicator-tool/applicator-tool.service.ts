import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { SelectorToolService } from '@app-services/drawing/tools/selector-tool/selector-tool.service';
import {ApplicateColorSvgelement} from '@app-services/undo-redo/applicate-color-svgelement';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { MOUSE } from '../../../../../constants/constants';
import { ColorToolService } from '../color-tool.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicatorToolService extends ColorToolService {

  renderer: Renderer2;

  constructor(protected colorsService: ColorsService,
              private selectorService: SelectorToolService,
              private rendererFactory: RendererFactory2,
              private undoRedo: UndoRedoManagerService,
              private autoSave: AutoSaveService) {
    super(colorsService);
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  onMouseUp(event: MouseEvent): void {
    if (!this.isIn) { return; }
    this.isIn = false;
    const svgElement = this.getSVGElement(event);
    if (svgElement.localName !== 'g' || this.checkChildElements(svgElement, event)) {
      this.setColor(svgElement, event.button === MOUSE.RightButton, this.checkChildElements(svgElement, event));
      this.autoSave.save(true);
    }
  }

  getSVGElement(event: MouseEvent): SVGGElement {
    let svgElement: SVGGElement = event.target || this.renderer.createElement('g', 'svg');
    if (svgElement.getAttribute('id') === 'svgdrawing') {
      return this.renderer.createElement('g', 'svg');
    }
    svgElement = this.selectorService.selector.checkParent(svgElement);
    return svgElement;
  }

  checkChildElements(svgElement: SVGGElement, event: MouseEvent): boolean {
    if (svgElement.firstElementChild === null) { return false; }
    let currentElement = svgElement.firstElementChild;
    for (let i = 0; i < svgElement.childElementCount; i++) {
      if (event.target === currentElement) {
        return true;
      }
      if (currentElement.nextElementSibling !== null) {
        currentElement = currentElement.nextElementSibling;
      }
    }
    return false;
  }

  setColor(svgElement: SVGGElement, isRightClick: boolean, isComposite: boolean): void {
    const color = isRightClick ? this.colorsService.getSecondaryColorRGBA() : this.colorsService.getMainColorRGBA();
    const surface = this.checkSurfaceType(svgElement, isComposite, isRightClick)  ? 'fill' : 'stroke';
    if (isComposite && !isRightClick) {
      this.setChildElementsAttribute(svgElement, color, surface);
    } else if (this.checkSingleElementType(svgElement, surface)) {
      const command = new ApplicateColorSvgelement([svgElement], color, surface);
      this.undoRedo.executeCommand(command);
    }
  }

  checkSurfaceType(svgElement: SVGGElement, isComposite: boolean, isRightClick: boolean): boolean {
    return (svgElement.hasAttribute('fill') && (isComposite || !isRightClick));
  }

  checkSingleElementType(svgElement: SVGGElement, surface: string): boolean {
    return !((svgElement.getAttribute('fill')) === 'none') && surface === 'fill' || surface === 'stroke';
  }

  setChildElementsAttribute(svgElement: SVGGElement, color: string, surface: string): void {
    if (svgElement.firstElementChild === null) { return; }
    const childrenSVGElement: SVGElement[] = [];
    svgElement.childNodes.forEach((node) => childrenSVGElement.push(node as SVGElement));
    const command = new ApplicateColorSvgelement(childrenSVGElement, color, surface);
    this.undoRedo.executeCommand(command);
  }
}
