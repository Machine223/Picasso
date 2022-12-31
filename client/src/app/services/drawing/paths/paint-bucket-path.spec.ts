import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { PaintBucketPath } from './paint-bucket-path';

describe('PaintBucketPath', () => {
  it('should create an instance', () => {
    const colorService: ColorsService = new ColorsService();
    const toolProperties: ToolPropertiesService = new ToolPropertiesService();
    expect(new PaintBucketPath(colorService, toolProperties, 'black')).toBeTruthy();
  });
});
