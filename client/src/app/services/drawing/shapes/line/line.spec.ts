import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Line } from '@app-services/drawing/shapes/line/line';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { Junctions } from '../../../../../constants/constants';

describe('Line', () => {

  it('should create an instance', () => {
    const colorService: ColorsService = new ColorsService();
    const toolProperties: ToolPropertiesService = new ToolPropertiesService();

    expect(new Line(colorService, toolProperties)).toBeTruthy();
  });

  it('#constructor should set isWithDots if appropriate junction', () => {
    const colorService: ColorsService = new ColorsService();
    const toolProperties: ToolPropertiesService = new ToolPropertiesService();
    toolProperties.junctionType = Junctions.Dotted;

    expect(new Line(colorService, toolProperties)).toBeTruthy();
  });
});
