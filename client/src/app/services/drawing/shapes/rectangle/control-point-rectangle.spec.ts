import { inject } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { ControlPointRectangle } from './control-point-rectangle';

describe('ControlPointRectangle', () => {
  it('should create an instance',
  inject([ColorsService, ToolPropertiesService], (colors: ColorsService, toolProperties: ToolPropertiesService) => {
    expect(new ControlPointRectangle(colors, toolProperties)).toBeTruthy();
  }));
});
