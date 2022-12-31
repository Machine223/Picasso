import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { SprayCan } from './spray-can';

describe('SprayCan', () => {
  it('should create an instance', () => {
    const colorService: ColorsService = new ColorsService();
    const toolProperties: ToolPropertiesService = new ToolPropertiesService();
    expect(new SprayCan(colorService, toolProperties)).toBeTruthy();
  });
});
