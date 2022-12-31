import { inject, TestBed } from '@angular/core/testing';
import { Path } from '@app-services/drawing/paths/path';
import { ColorsService } from '../colors/colors.service';
import { ToolPropertiesService } from '../tools/tool-properties.service';

describe('Path', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should create an instance',
  inject([ToolPropertiesService, ColorsService], (toolService: ToolPropertiesService, colorsService: ColorsService)  => {
    const path: Path = new Path(colorsService, toolService);
    expect(path).toBeTruthy();
  }));
});
