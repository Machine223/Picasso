import { TestBed } from '@angular/core/testing';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Brush } from '@app-services/drawing/paths/brush/brush';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';

describe('Brush', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ColorsService, ToolPropertiesService]
  }));

  it('should create an instance', () => {
    const colorService: ColorsService = new ColorsService();
    const toolProperties: ToolPropertiesService = new ToolPropertiesService();

    expect(new Brush(colorService, toolProperties)).toBeTruthy();
  });
});
