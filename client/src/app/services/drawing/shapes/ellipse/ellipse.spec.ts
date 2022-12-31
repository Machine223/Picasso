import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Strokes } from '../../../../../constants/constants';
import { Ellipse } from './ellipse';

describe('Ellipse', () => {
  let colorsService: ColorsService;
  let toolProperties: ToolPropertiesService;
  let ellipse: Ellipse;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    colorsService = TestBed.get(ColorsService);
    toolProperties = TestBed.get(ToolPropertiesService);
    ellipse = new Ellipse(colorsService, toolProperties);
  });

  it('should create an instance', () => {
    expect(ellipse).toBeTruthy();
  });

  it('#setEllipseParameter should set the current ellipse', () => {
    const setterRectangle = new Rectangle(colorsService, toolProperties);
    const spyOnCenterPoint = spyOn(ellipse, 'setCenterPointCoordinates');
    const spyOnRadius = spyOn(ellipse, 'defineRadiusFromStrokeWidth');
    setterRectangle.width = 2;
    setterRectangle.height = 1;
    setterRectangle.strokeType = Strokes.Full;
    ellipse.setEllipseParameters(setterRectangle);
    expect(ellipse.width).toBe(setterRectangle.width);
    expect(ellipse.height).toBe(setterRectangle.height);
    expect(ellipse.strokeType).toBe(setterRectangle.strokeType);
    expect(ellipse.strokeWidth).toBe(0);
    expect(spyOnCenterPoint).toHaveBeenCalled();
    expect(spyOnRadius).toHaveBeenCalled();
  });

  it('#setCenterPointCoordinates should calculate the centerPoint of current ellipse', () => {
    const xCoord = 250;
    const yCoord = 400;
    ellipse.startingPoint = new Coordinates(xCoord, yCoord);
    const width = 100;
    ellipse.width = width;
    const height = 100;
    ellipse.height = height;
    ellipse.setCenterPointCoordinates();
    expect(ellipse.centerPoint.xPosition).toBe(ellipse.startingPoint.xPosition + ellipse.width / 2);
    expect(ellipse.centerPoint.yPosition).toBe(ellipse.startingPoint.yPosition + ellipse.height / 2);
  });

  it('#defineRadiusFromStrokeWidth should calculate the tempStrokeWidth of current ellipse', () => {
    const strokeWidth = 30;
    ellipse.strokeWidth = strokeWidth;
    const width = 100;
    ellipse.width = width;
    const height1 = 100;
    ellipse.height = height1;
    ellipse.defineRadiusFromStrokeWidth();
    expect(ellipse.tempStrokeWidth).toBe(ellipse.strokeWidth);
    const height2 = 50;
    ellipse.height = height2;
    ellipse.defineRadiusFromStrokeWidth();
    expect(ellipse.tempStrokeWidth).not.toBe(ellipse.strokeWidth);
  });
});
