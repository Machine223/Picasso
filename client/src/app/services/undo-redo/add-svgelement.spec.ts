import { inject, TestBed } from '@angular/core/testing';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { AddSVGElement } from './add-svgelement';

describe('AddSVGElement', () => {
  let rectangle: SVGElement;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ DrawingElementsService ] });
    rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  });

  it('should create an instance',
    inject([DrawingElementsService], (inputDrawingElement: SVGElement, drawingElementsService: DrawingElementsService)  => {
      const addSvgElement: AddSVGElement = new AddSVGElement(inputDrawingElement, drawingElementsService);
      expect(addSvgElement).toBeTruthy();
  }));

  it('#execute should add the svgElement to the completedRenderer',
  inject([DrawingElementsService], (drawingElementsService: DrawingElementsService)  => {
    const addSvgElement: AddSVGElement = new AddSVGElement(rectangle, drawingElementsService);
    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(addSvgElement['drawingElementsService'].completedRenderer, 'next');
    addSvgElement.execute();
    expect(spy).toHaveBeenCalled();
  }));

  it('#undo should add the svgElement to elementToDelete',
  inject([DrawingElementsService], (drawingElementsService: DrawingElementsService)  => {
    const addSvgElement: AddSVGElement = new AddSVGElement(rectangle, drawingElementsService);
    // tslint:disable-next-line: no-string-literal
    const spy = spyOn(addSvgElement['drawingElementsService'].elementToDelete, 'next');
    addSvgElement.undo();
    expect(spy).toHaveBeenCalled();
  }));
});
