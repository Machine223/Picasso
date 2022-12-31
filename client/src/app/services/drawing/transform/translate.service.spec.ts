import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { Selector } from 'class/selector/selector';
import { ColorsService } from '../colors/colors.service';
import { DrawingElementsService } from '../drawing-elements.service';
import { OutlineRectangle } from '../shapes/rectangle/outline-rectangle';
import { Coordinates } from '../tools/coordinates';
import { SelectorToolService } from '../tools/selector-tool/selector-tool.service';
import { ToolPropertiesService } from '../tools/tool-properties.service';
import { TranslateService } from './translate.service';

const MOCK_SVG_TRANSFORM = {
  matrix: {
    multiply: (obj: DOMMatrix) => {
      // tslint:disable-next-line: no-unused-expression
      ((DOMMatrix) as unknown) as DOMMatrix;
    },
  },
};

const MOCK_SVG_GELEMENT = {
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

const MOCK_WIDTH_RECTANGLE = 10;
const MOCK_HEIGHT_RECTANGLE = 10;
const COORDINATES_VALUE_IN = 5;
const COORDINATES_VALUE_OUT = 20;
const MOCK_MOUSE_POSITION_IN = new Coordinates(COORDINATES_VALUE_IN, COORDINATES_VALUE_IN);
const MOCK_MOUSE_POSITION_OUT = new Coordinates(COORDINATES_VALUE_OUT, COORDINATES_VALUE_OUT);
const MOCK_TRANSLATE = 10;
const MOCK_CALLS = 6;

describe('TranslateService', () => {
  let service: TranslateService;
  let toolProperties: ToolPropertiesService;
  let colorsService: ColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SelectorToolService,
        Renderer2,
        ToolPropertiesService,
        ColorsService,
        UndoRedoManagerService,
        DrawingElementsService,
        TranslateService,
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
    service = TestBed.get(TranslateService);
    toolProperties = new ToolPropertiesService();
    colorsService = new ColorsService();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#isInSelectionRectangle should be called', () => {
    spyOn(service, 'isInSelectionRectangle');
    const currentMousePosition = new Coordinates(0, 0);
    const selectedRectangle = new OutlineRectangle(colorsService, toolProperties, true);
    service.isInSelectionRectangle(selectedRectangle, currentMousePosition);
    expect(service.isInSelectionRectangle).toHaveBeenCalled();
  });

  it('#isInSelectionRectangle should return true if Coordinates are in selectedRectangle', () => {
    const selectedRectangle = new OutlineRectangle(colorsService, toolProperties, true);
    selectedRectangle.startingPoint = new Coordinates(0, 0);
    selectedRectangle.width = MOCK_WIDTH_RECTANGLE;
    selectedRectangle.height = MOCK_HEIGHT_RECTANGLE;
    selectedRectangle.strokeWidth = 2;
    const returnValue = service.isInSelectionRectangle(selectedRectangle, MOCK_MOUSE_POSITION_IN);
    expect(returnValue).toBeTruthy();
  });

  it('#isInSelectionRectangle should return false if Coordinates are not in selectedRectangle', () => {
    const selectedRectangle = new OutlineRectangle(colorsService, toolProperties, true);
    selectedRectangle.startingPoint = new Coordinates(0, 0);
    selectedRectangle.width = MOCK_WIDTH_RECTANGLE;
    selectedRectangle.height = MOCK_HEIGHT_RECTANGLE;
    selectedRectangle.strokeWidth = 2;
    const returnValue = service.isInSelectionRectangle(selectedRectangle, MOCK_MOUSE_POSITION_OUT);
    expect(returnValue).toBeFalsy();
  });

  it('#translateSelection should be called', () => {
    spyOn(service, 'translateSelection');
    const selector: Selector = new Selector(colorsService, toolProperties);
    service.translateSelection( 1, 1, selector);
    expect(service.translateSelection).toHaveBeenCalled();
  });

  it('#translateSelection should applyTranslate', () => {
    const applyTranslate = spyOn(service, 'applyTranslate').and.callFake(() => null);
    const selector: Selector = new Selector(colorsService, toolProperties);
    for (let i = 0; i < MOCK_CALLS ; i++) {
      selector.selectedElements.push(createMockSVGGElement());
    }
    service.translateSelection( MOCK_TRANSLATE, MOCK_TRANSLATE, selector);
    expect(applyTranslate).toHaveBeenCalledTimes(MOCK_CALLS);
  });

  it('#applyTranslate should be called', () => {
    spyOn(service, 'applyTranslate');
    const selector: Selector = new Selector(colorsService, toolProperties);
    for (let i = 0; i < MOCK_CALLS ; i++) {
      selector.selectedElements.push(createMockSVGGElement());
    }
    for (const element of selector.selectedElements) {
      service.applyTranslate( MOCK_TRANSLATE, MOCK_TRANSLATE, element);
    }
    expect(service.applyTranslate).toHaveBeenCalled();
  });

  it('#translateSelectionSVGElement should applyTranslate', () => {
    const applyTranslate = spyOn(service, 'applyTranslate').and.callFake(() => null);
    const selector: Selector = new Selector(colorsService, toolProperties);
    for (let i = 0; i < MOCK_CALLS ; i++) {
      selector.selectedElements.push(createMockSVGGElement());
    }
    service.translateSelectionSVGElement( MOCK_TRANSLATE, MOCK_TRANSLATE, selector.selectedElements);
    expect(applyTranslate).toHaveBeenCalledTimes(MOCK_CALLS);
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

  it('#applyTranslate should called prepareFirstTransform and applyTransformation', () => {
    const spyOnCreateElement = spyOn(service.renderer, 'createElement');
    spyOnCreateElement.and.callFake(createMockSVGSVGElement);
    const spyOnPrepare = spyOn(service, 'prepareFirstTransform');
    const spyOnApplyTransformation = spyOn(service, 'applyTransformation').and.callFake(() => null);

    service.applyTranslate(0, 0, (MOCK_SVG_GELEMENT as unknown) as SVGGElement);
    expect(spyOnPrepare).toHaveBeenCalled();
    expect(spyOnApplyTransformation).toHaveBeenCalled();
  });

});
