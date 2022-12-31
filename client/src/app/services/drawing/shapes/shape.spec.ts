import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Shape } from '@app-services/drawing/shapes/shape';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';

describe('Shape', () => {
  let colorsService: ColorsService;
  let toolProperties: ToolPropertiesService;
  let shape: Shape;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    colorsService = TestBed.get(ColorsService);
    toolProperties = TestBed.get(ToolPropertiesService);
    shape = new Shape(colorsService, toolProperties);
  });

  it('should create an instance', ()  => {
    expect(shape).toBeTruthy();
  });

  it('#getColor should return main or secondary color', () => {
    const mainColor = shape.getColor();
    expect(mainColor).toBe(colorsService.getMainColorRGBA());
  });

  it('#cloneShape should set the current shape', () => {
    const shapeToClone = new Shape(colorsService, toolProperties);
    shapeToClone.startingPoint = new Coordinates(2, 1);
    shapeToClone.strokeWidth = 1;
    shapeToClone.stroke = colorsService.colorPresets[2];
    shapeToClone.fill = colorsService.colorPresets[1];
    shapeToClone.radius = 2;
    shape.cloneShape(shapeToClone);
    expect(shape.startingPoint).toBe(shapeToClone.startingPoint);
    expect(shape.strokeWidth).toBe(shapeToClone.strokeWidth);
    expect(shape.stroke).toBe(shapeToClone.stroke);
    expect(shape.fill).toBe(shapeToClone.fill);
    expect(shape.radius).toBe(shapeToClone.radius);
  });
});
