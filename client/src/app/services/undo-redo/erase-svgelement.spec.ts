import { TestBed } from '@angular/core/testing';
import { EraseSVGElement } from './erase-svgelement';

describe('EraseSVGElement', () => {
  let svg: SVGSVGElement;
  let rectangle: Element;
  let instance: EraseSVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [ ] });
    svg  = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    instance = new EraseSVGElement([rectangle], svg);
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#execute should set nodeNextSibling to null if the next sibling is the cursor', () => {
    svg.appendChild(rectangle);
    const cursor = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    cursor.id = 'cursor';
    svg.appendChild(cursor);
    instance.execute();
    expect(instance.nodesAndTheirNextSibling[0][1]).toEqual(null);
  });

  it('#execute should remove the node from the drawing', () => {
    svg.appendChild(rectangle);
    instance.execute();
    expect(instance.svgDrawing.childElementCount).toEqual(0);
  });

  it('#execute should not add the node to nodeNextSibling if it is not in the svg', () => {
    instance.execute();
    expect(instance.nodesAndTheirNextSibling.length).toEqual(0);
  });

  it('#undo should insert the node in the right order', () => {
    svg.appendChild(rectangle);
    const nextSibling = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg.appendChild(nextSibling);
    instance.execute();
    instance.undo();
    expect(instance.svgDrawing.firstChild).toEqual(rectangle);
  });
});
