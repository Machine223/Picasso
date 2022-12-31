import { inject } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { DashedSelectorRectangle } from './dashed-selector-rectangle';

describe('DashedSelectorRectangle', () => {
  it('should create an instance',
  inject([ColorsService, ToolPropertiesService], (colors: ColorsService, toolProperties: ToolPropertiesService) => {
    expect(new DashedSelectorRectangle(colors, toolProperties)).toBeTruthy();
  }));
});
