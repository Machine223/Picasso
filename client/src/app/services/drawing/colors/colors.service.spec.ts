import { TestBed } from '@angular/core/testing';
import { ColorsService } from './colors.service';

const MOCK_COLOR = '#fe39ae';
enum ColorReferences {Main = 0, Secondary = 1, Background = 2}
describe('ColorsService', () => {
  let service: ColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ColorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#confirmColor should set the mainColor when called appropriately', () => {
    service.currentColor = MOCK_COLOR;
    service.confirmColor(ColorReferences.Main);
    const mainColor = service.mainColor.getValue();
    expect(mainColor).toEqual(MOCK_COLOR);
  });

  it('#confirmColor should set the secondaryColor when called appropriately', () => {
    service.currentColor = MOCK_COLOR;
    service.confirmColor(ColorReferences.Secondary);
    const secondaryColor = service.secondaryColor.getValue();
    expect(secondaryColor).toEqual(MOCK_COLOR);
  });

  it('#confirmColor should set the backgroundColor when called appropriately', () => {
      service.currentColor = MOCK_COLOR;
      service.confirmColor(ColorReferences.Background);
      expect(service.backgroundColor).toEqual(MOCK_COLOR);
  });

  it('#colorSwap should call mainColor and secondaryColor next', () => {
    const spyOnMainColor = spyOn(service.mainColor, 'next');
    const spyOnSecondaryColor = spyOn(service.secondaryColor, 'next');
    service.colorSwap();
    expect(spyOnMainColor).toHaveBeenCalled();
    expect(spyOnSecondaryColor).toHaveBeenCalled();
  });

  it('#presetColorCheck should call presetModification', () => {
    const spyOnPresetModification = spyOn(service, 'presetModification');
    service.colorPresets[2] = MOCK_COLOR;
    service.presetColorCheck(MOCK_COLOR);
    expect(spyOnPresetModification).toHaveBeenCalled();
  });

  it('#presetMainColorUse should call mainColor next', () => {
    const spyOnMainColor = spyOn(service.mainColor, 'next');
    service.presetMainColorUse(1);
    expect(spyOnMainColor).toHaveBeenCalled();
  });

});
