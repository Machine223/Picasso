import { TestBed } from '@angular/core/testing';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { DeleteSVGElement } from './delete-svgelement';

describe('DeleteSvgelement', () => {
  let drawingElements: DrawingElementsService;
  let instance: DeleteSVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrawingElementsService,
     ],
    });
    drawingElements = TestBed.get(DrawingElementsService);
    instance = new DeleteSVGElement([], drawingElements);
  });

  it('should be create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#execute should set update observer on elementToDelete of drawingElements', () => {
    const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    instance.selectedElements.push(rectangle);
    const spyOnNext = spyOn(drawingElements.elementToDelete, 'next').and.returnValue();
    instance.execute();
    expect(spyOnNext).toHaveBeenCalledWith(rectangle);
  });

  it('#undo should set update observer on completedRenderer of drawingElements', () => {
    const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    instance.selectedElements.push(rectangle);
    const spyOnNext = spyOn(drawingElements.completedRenderer, 'next').and.returnValue();
    instance.undo();
    expect(spyOnNext).toHaveBeenCalledWith(rectangle);
  });

});
