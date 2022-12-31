import { TestBed } from '@angular/core/testing';
import { ApplicateColorSvgelement } from './applicate-color-svgelement';

describe('ApplicatorSVGElement', () => {
  let rectangle: SVGElement;
  let nextColor: string;
  let surface: string;
  let instance: ApplicateColorSvgelement;
  beforeEach(() => {
     TestBed.configureTestingModule({ providers: [SVGElement, ]});
     rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
     nextColor = 'black';
     surface = 'fill';
     rectangle.setAttribute('fill', 'blue');
     instance = new ApplicateColorSvgelement([rectangle], nextColor, surface);
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#execute should change the color of the fill of the node to black', () => {
    rectangle.setAttribute('fill', 'blue');
    instance.execute();
    expect(rectangle.getAttribute('fill')).toMatch('black');
  });

  it('#undo should change the color of the fill of the node to blue', () => {
    rectangle.setAttribute('fill', 'blue');
    instance.execute();
    instance.undo();
    expect(rectangle.getAttribute('fill')).toMatch('blue');
  });

  it('#undo should change the color of the fill to none if previousColor is null', () => {
    rectangle.removeAttribute(surface);
    const rectangle2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    instance = new ApplicateColorSvgelement([rectangle, rectangle2], nextColor, surface);
    instance.execute();
    instance.undo();
    expect(rectangle.getAttribute('fill')).toMatch('none');
  });

 });
