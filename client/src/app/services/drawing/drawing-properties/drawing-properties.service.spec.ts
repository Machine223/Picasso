import { TestBed } from '@angular/core/testing';
import { DrawingPropertiesService } from './drawing-properties.service';

const MOCK_PARAMETER_1 = 5;
const MOCK_PARAMETER_2 = 5;

describe('DrawingPropertiesService', () => {
  let service: DrawingPropertiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(DrawingPropertiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getHeight should return this._height when isModifiedByUser is true', () => {
    // tslint:disable-next-line: no-string-literal
    service['_height'] = MOCK_PARAMETER_1;
    service.isModifiedByUser = true;
    expect(service.height).toEqual(MOCK_PARAMETER_1);
  });

  it('#getHeight should return window.innerHeight when isModifiedByUser is false', () => {
    spyOnProperty(window, 'innerHeight').and.returnValue(MOCK_PARAMETER_2);
    service.isModifiedByUser = false;
    expect(service.height).toEqual(MOCK_PARAMETER_2);
  });

  it('#setHeight should set isModifiedByUser to true if newHeight is not equal to window.innerHeight', () => {
    spyOnProperty(window, 'innerHeight').and.returnValue(MOCK_PARAMETER_2);
    service.isModifiedByUser = false;
    service.height = 1;
    expect(service.isModifiedByUser).toBe(true);
  });

  it('#setHeight should not set isModifiedByUser to true if newHeight is equal to window.innerHeight', () => {
    spyOnProperty(window, 'innerHeight').and.returnValue(MOCK_PARAMETER_2);
    service.isModifiedByUser = false;
    service.height = MOCK_PARAMETER_2;
    expect(service.isModifiedByUser).toBe(false);
  });

  it('#getWidth should return this._width when isModifiedByUser is true', () => {
    // tslint:disable-next-line: no-string-literal
    service['_width'] = MOCK_PARAMETER_1;
    service.isModifiedByUser = true;
    expect(service.width).toEqual(MOCK_PARAMETER_1);
  });

  it('#getWidth should return window.innerWidth when isModifiedByUser is false', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(MOCK_PARAMETER_2);
    service.isModifiedByUser = false;
    expect(service.width).toEqual(MOCK_PARAMETER_2);
  });

  it('#setWidth should set isModifiedByUser to true if newWidth is not equal to window.innerWidth', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(MOCK_PARAMETER_2);
    service.isModifiedByUser = false;
    service.width = 1;
    expect(service.isModifiedByUser).toBe(true);
  });

  it('#setWidth should not set isModifiedByUser to true if newWidth is equal to window.innerWidth', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(MOCK_PARAMETER_2);
    service.isModifiedByUser = false;
    service.width = MOCK_PARAMETER_2;
    expect(service.isModifiedByUser).toBe(false);
  });

  it('#creationOfDrawing should set isDrawingCreated to true and the currentHeight to _height', () => {
    service.isDrawingCreated = false;
    service.height = MOCK_PARAMETER_2;
    service.creationOfDrawing('#000000');
    expect(service.isDrawingCreated).toBe(true);
    expect(service.currentDrawingHeight).toEqual(MOCK_PARAMETER_2);
  });

  it('#creationOfDrawing should remove the child after the background when isDrawingCreated is true', () => {
    service.isDrawingCreated = true;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    svg.appendChild(rectangle);
    svg.appendChild(circle);
    service.svgBackground = rectangle;
    service.svgDrawing = svg;
    service.creationOfDrawing('#000000');
    expect(svg.childElementCount).toEqual(1);
  });
});
