import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Strokes } from '../../../../../constants/constants';
import { Polygon } from './polygon';

describe('Polygon', () => {
  let colorsService: ColorsService;
  let toolProperties: ToolPropertiesService;
  let polygon: Polygon;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    colorsService = TestBed.get(ColorsService);
    toolProperties = TestBed.get(ToolPropertiesService);
    polygon = new Polygon(colorsService, toolProperties);
  });

  it('should create an instance', () => {
    expect(polygon).toBeTruthy();
  });

  it('#setPolygonParameters should set the current polygon', () => {
    const setterRectangle = new Rectangle(colorsService, toolProperties);
    const spyOnRadius = spyOn(polygon, 'setPolygonRadius');
    const spyOnInitialPoint = spyOn(polygon, 'getInitialPoint');
    const spyOnRemainingPoints = spyOn(polygon, 'setRemainingPoints');
    const spyOnPointsToString = spyOn(polygon, 'convertPointsToString');
    setterRectangle.width = 2;
    setterRectangle.height = 1;
    setterRectangle.strokeType = Strokes.Full;
    polygon.setPolygonParameters(setterRectangle);
    expect(polygon.width).toBe(setterRectangle.width);
    expect(polygon.height).toBe(setterRectangle.height);
    expect(polygon.strokeType).toBe(setterRectangle.strokeType);
    expect(polygon.strokeWidth).toBe(0);
    expect(spyOnRadius).toHaveBeenCalled();
    expect(spyOnInitialPoint).toHaveBeenCalled();
    expect(spyOnRemainingPoints).toHaveBeenCalled();
    expect(spyOnPointsToString).toHaveBeenCalled();
  });

  it('#setPolygonRadius should set the radius', () => {
    polygon.width = 1;
    polygon.height = 2;
    polygon.xRadius = -1;
    polygon.yRadius = 2;
    polygon.setPolygonRadius();
    expect(polygon.radius).toBe(polygon.yRadius);
    polygon.width = 2;
    polygon.height = 1;
    polygon.setPolygonRadius();
    expect(polygon.radius).toBe(polygon.xRadius);
  });

  it('#getInitialPoint should set pointsArray[0]', () => {
    const sides = 6;
    polygon.sides = sides;
    const radius = 100;
    polygon.radius = radius;
    const xCoord = 200;
    const yCoord = 425;
    polygon.centerPoint = new Coordinates(xCoord, yCoord);
    polygon.getInitialPoint();
    expect(polygon.pointsArray[0]).toEqual(new Coordinates(xCoord, yCoord - radius));
  });

  it('#getSidesRatio should return the sides ratio', () => {
    const radius = 100;
    polygon.radius = radius;
    const unstableRatio = polygon.getSidesRatio();
    // tslint:disable-next-line:no-magic-numbers
    expect(unstableRatio).toEqual(0.75);
    const sides = 4;
    polygon.sides = sides;
    const stableRatio = polygon.getSidesRatio();
    expect(stableRatio).toEqual(1);
  });

  it('#getCoordinatesFromPoint should return next point Coordinates', () => {
    const sides = 4;
    polygon.sides = sides;
    const xCoord = 370;
    const yCoord = 300;
    const previousPoint = new Coordinates(xCoord, yCoord);
    const radius = 100;
    polygon.radius = radius;
    const pointCoords = polygon.getCoordinatesFromPoint(previousPoint, polygon.getSideLength(), (Math.PI - polygon.getAngle()) / 2);
    expect(pointCoords).toEqual(new Coordinates(xCoord + radius, yCoord + radius));
  });

  it('#setRemainingPOints should set pointsArray', () => {
    const spyOnCoordinates = spyOn(polygon, 'getCoordinatesFromPoint');
    polygon.pointsArray = [ new Coordinates(0, 1) ];
    polygon.setRemainingPoints();
    expect(spyOnCoordinates).toHaveBeenCalledTimes(polygon.sides - 1);
    expect(polygon.pointsArray.length).toBe(polygon.sides);
  });

  it('#convertPointsToString should set points', () => {
    polygon.pointsArray = [ new Coordinates(0, 1) ];
    polygon.convertPointsToString();
    expect(polygon.points).toBe('0, 1 ');
  });
});
