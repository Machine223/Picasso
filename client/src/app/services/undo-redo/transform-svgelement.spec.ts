import { RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TransformSVGElement } from './transform-svgelement';

describe('TransformSVGElement', () => {
  let rectangle: SVGRectElement;
  let svg: SVGSVGElement;
  let translation: SVGTransform;
  let instance: TransformSVGElement;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [] });
    rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    svg  = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
    translation = svg.createSVGTransform();
    translation.setTranslate(1, 1);
    rectangle.transform.baseVal.insertItemBefore(translation, 0);
    const rendererFactory = TestBed.get(RendererFactory2);
    instance = new TransformSVGElement([rectangle], rendererFactory);
  });

  it('should be create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#execute should set transform on element to last value', () => {
    const domMatrix = rectangle.transform.baseVal.consolidate().matrix;
    instance.elementsLastTransform.push([rectangle, domMatrix ]);
    instance.execute();
    const xTranslationOfRectangle = rectangle.transform.baseVal.getItem(0).matrix.e;
    expect(xTranslationOfRectangle).toEqual(1);
  });

  it('#undo should set transform on element to initial value', () => {
    const domMatrix = rectangle.transform.baseVal.consolidate().matrix;
    instance.elementsInitialTransform = [];
    instance.elementsInitialTransform.push([rectangle, domMatrix]);
    instance.undo();
    const xTranslationOfRectangle = rectangle.transform.baseVal.getItem(0).matrix.e;
    expect(xTranslationOfRectangle).toEqual(1);
  });

  it('#getLastTransform should push the element and its tranform value in the elementsLastTransform array', () => {
    const domMatrix = rectangle.transform.baseVal.consolidate().matrix;
    instance.elementsLastTransform.push([rectangle, domMatrix]);
    instance.getLastTransform();
    expect(instance.elementsLastTransform[0][1]).toEqual(domMatrix);
  });

  it('#getInitialTransform should set the translation to 0 in the elementsInitialTransform array if the element has not transform', () => {
    const rectangleNoTransform = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const domMatrix = rectangle.transform.baseVal.consolidate().matrix;
    const rendererFactory = TestBed.get(RendererFactory2);
    instance = new TransformSVGElement([rectangleNoTransform], rendererFactory);
    expect(instance.elementsInitialTransform[0][1]).toEqual(domMatrix);
  });

  it('#getLastTransform should set the translation to 0 in the elementsLastTransform array if the element has not transform', () => {
    const rectangleNoTransform = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const domMatrix = rectangle.transform.baseVal.consolidate().matrix;
    const rendererFactory = TestBed.get(RendererFactory2);
    instance = new TransformSVGElement([rectangleNoTransform], rendererFactory);
    instance.getLastTransform();
    expect(instance.elementsLastTransform[0][1]).toEqual(domMatrix);
  });
});
