import { inject, TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { OutlineRectangle } from './outline-rectangle';

describe('OutlineRectangle', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should create an instance',
  inject([ToolPropertiesService, ColorsService], (toolService: ToolPropertiesService, colorsService: ColorsService)  => {
    const outlineRectangle: OutlineRectangle = new OutlineRectangle(colorsService, toolService, false);
    expect(outlineRectangle).toBeTruthy();
  }));

  it('#setRectangleSize should set outline rectangle to given rectangle values', () => {
    const colorService: ColorsService = new ColorsService();
    const toolProperties: ToolPropertiesService = new ToolPropertiesService();
    const outlineRectangle = new OutlineRectangle(colorService, toolProperties, false);
    const rectangle = new Rectangle(colorService, toolProperties);
    rectangle.width = 2;
    rectangle.height = 1;
    const xCoord = 400;
    const yCoord = 500;
    rectangle.startingPoint = new Coordinates(xCoord, yCoord);
    outlineRectangle.setRectangleSize(rectangle);
    expect(outlineRectangle.width).toBe(rectangle.width);
    expect(outlineRectangle.height).toBe(rectangle.height);
    expect(outlineRectangle.startingPoint).toBe(rectangle.startingPoint);
  });
});
