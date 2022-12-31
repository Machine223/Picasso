import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { Selector } from 'class/selector/selector';
import { ColorsService } from '../colors/colors.service';
import { OutlineRectangle } from '../shapes/rectangle/outline-rectangle';
import { SelectorToolService } from '../tools/selector-tool/selector-tool.service';
import { ToolPropertiesService } from '../tools/tool-properties.service';
import { RotationService } from './rotation.service';

const MOCK_WIDTH_RECTANGLE = 10;
const MOCK_HEIGHT_RECTANGLE = 10;
const MOCK_ROTATION_ANGLE = 300;

const createMockSVGSVGElement = (): SVGSVGElement => {
  const mockSVGSVG = {
    createSVGTransform: () => {
      const mockTransform = {
        setTranslate: () => null,
        setRotate: () => null,
        setScale: () => null,
        matrix: (DOMMatrix) as unknown as DOMMatrix,
      };
      return mockTransform as unknown as SVGTransform;
    },
    createSVGTransformFromMatrix: () => null,
  };
  return mockSVGSVG as unknown as SVGSVGElement;
};

const createMockSVGGElement = () => {
  const mockSVGElement = {
    transform : {
        baseVal : {
          numberOfItems: 6,
          appendItem: () => null,
        },
    },
    createSVGTransform: () => {
      const mockTransform = {
        setTranslate: () => null,
        setRotate: () => null,
        setScale: () => null,
        matrix: (DOMMatrix) as unknown as DOMMatrix,
      };
      return mockTransform as unknown as SVGTransform;
    },
    createSVGTransformFromMatrix: () => null,
  };
  return (mockSVGElement as unknown) as SVGGElement;
};

const createWheelEvent = (deltaX: number, deltaY: number): WheelEvent => {
  const wheelEvent = {
    deltaX,
    deltaY,
    preventDefault: () => null,
  };
  return (wheelEvent as unknown) as WheelEvent;
};

const MOCK_RECTANGLE = {
  x: {
    baseVal: {
      value: MOCK_WIDTH_RECTANGLE as number,
    },
  },
  y: {
    baseVal: {
      value: MOCK_HEIGHT_RECTANGLE as number,
    },
  },
  width: {
    baseVal: {
      value: MOCK_WIDTH_RECTANGLE as number,
    },
  },
  height: {
    baseVal: {
      value: MOCK_HEIGHT_RECTANGLE as number,
    },
  },
};

const MOCK_SVG_GELEMENT = ({
  getBoundingClientRect: () => {
    return (MOCK_RECTANGLE as unknown) as ClientRect;
  },
  transform: {
    baseVal: {
      numberOfItems: 1,
      clear: () => null,
      consolidate: () => {
          const mockTransform = {
              matrix: ((DOMMatrix) as unknown) as DOMMatrix,
          };
          return (mockTransform as unknown) as SVGTransform;
      },
      appendItem: () => null,
    },
  },
} as unknown) as SVGGElement;

const MOCK_SVG_TRANSFORM = {
  matrix: {
    multiply: (obj: DOMMatrix) => {
      // tslint:disable-next-line: no-unused-expression
      ((DOMMatrix) as unknown) as DOMMatrix;
    },
  },
};

const MOCK_SVG_GELEMENT_NULL = {
  transform: {
    baseVal: {
      numberOfItems: 0,
      consolidate: () => {
        return (MOCK_SVG_TRANSFORM as unknown) as SVGTransform;
      },
      appendItem: () => null,
      createSVGTransform: () => null,
    },
  },
};

describe('RotationService', () => {
  let service: RotationService;
  let toolProperties: ToolPropertiesService;
  let colorsService: ColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SelectorToolService,
        ToolPropertiesService,
        ColorsService,
        {
          provide: Renderer2,
          useValue: {
            createElement: () => null,
            setAttribute: () => null,
            appendChild: () => null,
            removeChild: () => null,
            listen: () => null,
            setStyle: () => null,
          },
        },
      ],
    });
    service = TestBed.get(RotationService);
    toolProperties = new ToolPropertiesService();
    colorsService = new ColorsService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#updateElementsOrigins should update Origins of selected elements', () => {
    const spyOnClear = spyOn(service.selectedElementsOrigin, 'clear').and.callFake(() => null);
    const spyOnUpdate = spyOn(service.selectedElementsOrigin, 'set').and.callFake(
      () => new Map<SVGGElement, Coordinates>(),
    );
    const selector: Selector = new Selector(colorsService, toolProperties);
    selector.selectedElements.push(MOCK_SVG_GELEMENT);

    service.updateElementsOrigins(selector);

    expect(spyOnClear).toHaveBeenCalled();
    expect(spyOnUpdate).toHaveBeenCalled();
  });

  it('#updateRotationOrigins should update outlineRectangleOrigin', () => {
    const selectedRectangle = new OutlineRectangle(colorsService, toolProperties, true);
    selectedRectangle.startingPoint = new Coordinates(0, 0);
    selectedRectangle.width = MOCK_WIDTH_RECTANGLE;
    selectedRectangle.height = MOCK_HEIGHT_RECTANGLE;

    const selector: Selector = new Selector(colorsService, toolProperties);
    selector.selectedElements.push(MOCK_SVG_GELEMENT);

    service.selectedElementsOrigin = new Map<SVGGElement, Coordinates>();

    service.updateRotationOrigins(selector, selectedRectangle);

    expect(service.outlineRectangleOrigin.xPosition).toEqual(MOCK_WIDTH_RECTANGLE / 2);
    expect(service.outlineRectangleOrigin.yPosition).toEqual(MOCK_HEIGHT_RECTANGLE / 2);
  });

  it('#updateRotationOrigins should call updateElementsOrigins', () => {
    const spyOnUpdateElements = spyOn(service, 'updateElementsOrigins');
    const selectedRectangle = new OutlineRectangle(colorsService, toolProperties, true);
    selectedRectangle.startingPoint = new Coordinates(0, 0);
    selectedRectangle.width = MOCK_WIDTH_RECTANGLE;
    selectedRectangle.height = MOCK_HEIGHT_RECTANGLE;

    const selector: Selector = new Selector(colorsService, toolProperties);
    selector.selectedElements.push(MOCK_SVG_GELEMENT);

    service.selectedElementsOrigin = new Map<SVGGElement, Coordinates>();

    service.updateRotationOrigins(selector, selectedRectangle);

    expect(spyOnUpdateElements).toHaveBeenCalled();
  });

  it('#rotateSelection should change rotationAngle to positive for positive deltaY', () => {
    const selector: Selector = new Selector(colorsService, toolProperties);
    service.rotateSelection(createWheelEvent(0, MOCK_ROTATION_ANGLE), selector);
    expect(service.rotationAngle).toBeGreaterThan(0);
  });

  it('#rotateSelection should change rotationAngle to negative for negative deltaY', () => {
    const selector: Selector = new Selector(colorsService, toolProperties);
    service.rotateSelection(createWheelEvent(0, -MOCK_ROTATION_ANGLE), selector);
    expect(service.rotationAngle).toBeLessThan(0);
  });

  it('#rotateSelection should applyRotation on the center element whene isShiftDown is true and should not updateElementsOrigins', () => {
    const selector: Selector = new Selector(colorsService, toolProperties);
    service.isShiftDown = true;
    const element = createMockSVGGElement();
    const coordinates = new Coordinates(0, 0);
    selector.selectedElements.push(element);
    service.selectedElementsOrigin.set(element, coordinates);
    const spyOnRotate = spyOn(service, 'applyRotation');
    const spyOnUpdateOrigins = spyOn(service, 'updateElementsOrigins').and.callFake(() => null);

    service.rotateSelection(createWheelEvent(0, MOCK_ROTATION_ANGLE), selector);

    expect(spyOnRotate).toHaveBeenCalledWith(element, coordinates);
    expect(spyOnUpdateOrigins).not.toHaveBeenCalled();
  });

  it('#rotateSelection should applyRotation on the center outlineRect whene isShiftDown is false and should updateElementsOrigins', () => {
    const selector: Selector = new Selector(colorsService, toolProperties);
    service.isShiftDown = false;
    const element = createMockSVGGElement();
    const coordinates = new Coordinates(0, 0);
    selector.selectedElements.push(element);
    service.selectedElementsOrigin.set(element, coordinates);
    const spyOnRotate = spyOn(service, 'applyRotation');
    const spyOnUpdateOrigins = spyOn(service, 'updateElementsOrigins').and.callFake(() => null);

    service.rotateSelection(createWheelEvent(0, MOCK_ROTATION_ANGLE), selector);

    expect(spyOnRotate).toHaveBeenCalledWith(element, coordinates);
    expect(spyOnUpdateOrigins).toHaveBeenCalled();
  });

  it('#prepareFirstTransform should not set default transform if there is 1 and more element(s) and not append Item', () => {
    const spyOnCreateElement = spyOn(service.renderer, 'createElement');
    spyOnCreateElement.and.callFake(createMockSVGSVGElement);

    const spy = spyOn(MOCK_SVG_GELEMENT.transform.baseVal, 'appendItem');

    service.prepareFirstTransform((MOCK_SVG_GELEMENT as unknown) as SVGGElement);

    expect(spyOnCreateElement).not.toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#prepareFirstTransform should set default transform if there is 0 element and append Item', () => {
    const spyOnCreateElement = spyOn(service.renderer, 'createElement');
    spyOnCreateElement.and.callFake(createMockSVGSVGElement);

    const spy = spyOn(MOCK_SVG_GELEMENT_NULL.transform.baseVal, 'appendItem');
    service.prepareFirstTransform((MOCK_SVG_GELEMENT_NULL as unknown) as SVGGElement);

    expect(spyOnCreateElement).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  it('#transformToMatrix should return a function that prepare element for transform', () => {
    const spyOnPrepare = spyOn(service, 'prepareFirstTransform');
    service.transformToMatrix((MOCK_SVG_GELEMENT as unknown) as SVGGElement);

    expect(spyOnPrepare).toEqual(jasmine.any(Function));
  });

  it('#applyTransformation should called transformToMatrix', () => {
    const spyOnCreateElementRenderer = spyOn(service.renderer, 'createElement');
    spyOnCreateElementRenderer.and.callFake(createMockSVGSVGElement);

    const spyOnGetTransformMatrix = spyOn(service, 'transformToMatrix');
    service.applyTransformation((MOCK_SVG_GELEMENT as unknown) as SVGGElement, (MOCK_SVG_TRANSFORM as unknown) as SVGTransform);

    expect(spyOnGetTransformMatrix).toHaveBeenCalled();
  });

  it('#applyTransformation should called appendItem', () => {
    const spyOnCreateElement = spyOn(service.renderer, 'createElement');
    spyOnCreateElement.and.callFake(createMockSVGSVGElement);

    const spyOnAppendItem = spyOn(MOCK_SVG_GELEMENT.transform.baseVal, 'appendItem');
    service.applyTransformation((MOCK_SVG_GELEMENT as unknown) as SVGGElement, (MOCK_SVG_TRANSFORM as unknown) as SVGTransform);

    expect(spyOnAppendItem).toHaveBeenCalled();
  });

  it('#applyRotation should called prepareFirstTransform and applyTransformation', () => {
    const spyOnCreateElement = spyOn(service.renderer, 'createElement');
    spyOnCreateElement.and.callFake(createMockSVGSVGElement);
    const spyOnPrepare = spyOn(service, 'prepareFirstTransform');
    const spyOnApplyTransformation = spyOn(service, 'applyTransformation').and.callFake(() => null);
    const coordinates = new Coordinates(0, 0);
    service.applyRotation((createMockSVGGElement() as unknown) as SVGGElement, coordinates );
    expect(spyOnPrepare).toHaveBeenCalled();
    expect(spyOnApplyTransformation).toHaveBeenCalled();
  });

});
