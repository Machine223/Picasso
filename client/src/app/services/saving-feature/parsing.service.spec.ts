import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ParsingService } from './parsing.service';

describe('ParsingService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ Renderer2 ]
  }));

  let service: ParsingService;
  const MOCK_DOCUMENT = '<html><svg>blahblah</svg></html>';

  beforeEach(() => {
    service = TestBed.get(ParsingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#extractSVG should call createBlob', async () => {
    const spy = spyOn(service, 'createBlob');
    service.extractSVG();
    expect(spy).toHaveBeenCalled();
  });

  it('#createBlob should create a blob', () => {
    spyOn(XMLSerializer.prototype, 'serializeToString').and.returnValue(MOCK_DOCUMENT);
    const blob = service.createBlob();
    expect(blob).toBeDefined();
  });

  it('#getSvgTagsBody should return content inside the <svg> tags, including the tags', async () => {
    const expectedString = '<svg>extracted</svg>';
    const transcript = 'ejfeseffffsanjfnsf' + expectedString + 'fdfsfsfjenfsjenfs';
    const extract = await service.getSvgTagsBody(transcript);
    expect(extract).toEqual(expectedString);
  });

  it('#getInnerSvgTagsBody should only return the content inside the <svg> tags', async () => {
    const expectedString = 'extracted';
    const transcript = 'ejfeseffffs<svg>' + expectedString + '</svg>fdfsfnfsjenfs';
    const extract = await service.getInnerSvgTagsBody(transcript);
    expect(extract).toEqual(expectedString);
  });

  it('#updateImage should update service.image', async () => {
    const parameter = new Image();
    const spy = spyOn(service, 'parsingImage');
    await service.updateImage(parameter);
    const newValue = service.image;
    expect(parameter).toEqual(newValue);
    expect(spy).toHaveBeenCalled();
  });

  it('#updateSerializer should update service.xml', async () => {
    const parameter = 'hello';
    await service.updateSerializer(parameter);
    const newValue = service.xml;
    expect(parameter).toEqual(newValue);
  });
});
