import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Strokes } from '../../../../../constants/constants';

describe('Rectangle', () => {
  let colorsService: ColorsService;
  let toolProperties: ToolPropertiesService;
  let rectangle: Rectangle;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    colorsService = TestBed.get(ColorsService);
    toolProperties = TestBed.get(ToolPropertiesService);
    rectangle = new Rectangle(colorsService, toolProperties);
  });

  it('should create an instance', () => {
    expect(rectangle).toBeTruthy();
  });

  it('#strokeTypeDispatcher should set fill and stroke to full', () => {
    rectangle.strokeTypeDispatcher(Strokes.Full);
    expect(rectangle.fill).toBe(colorsService.getMainColorRGBA());
    expect(rectangle.stroke).toBe('none');
  });

  it('#strokeTypeDispatcher should set fill and stroke to both', () => {
    rectangle.strokeTypeDispatcher(Strokes.Both);
    expect(rectangle.fill).toBe(colorsService.getMainColorRGBA());
    expect(rectangle.stroke).toBe(colorsService.getSecondaryColorRGBA());
  });

  it('#cloneRectangle should set the current rectangle', () => {
    const rectangleToClone = new Rectangle(colorsService, toolProperties);
    rectangleToClone.width = 2;
    rectangleToClone.height = 1;
    rectangleToClone.strokeType = Strokes.Full;
    rectangle.cloneRectangle(rectangleToClone);
    expect(rectangle.width).toBe(rectangleToClone.width);
    expect(rectangle.height).toBe(rectangleToClone.height);
    expect(rectangle.strokeType).toBe(rectangleToClone.strokeType);
    expect(rectangle.strokeWidth).toBe(0);
  });
});
