import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorEditSliderComponent } from './color-edit-slider.component';

describe('ColorEditSliderComponent', () => {
  let component: ColorEditSliderComponent;
  let fixture: ComponentFixture<ColorEditSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorEditSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorEditSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#draw should call selectedHeighDraw when selectedHeight is instanciated', () => {
    spyOn(component, 'selectedHeightDraw').and.callThrough();
    const mouseEventMock = new MouseEvent('mousedown');
    const offset = 100;
    spyOnProperty(mouseEventMock, 'offsetY').and.returnValue(offset);
    component.onMouseDown(mouseEventMock);
    component.draw();
    expect(component.selectedHeightDraw).toHaveBeenCalled();
    expect(component.context).toBeTruthy();
  });

  it('#draw should not call selectedHeighDraw when selectedHeight is not instanciated', () => {
    const selectedHeightSpy = spyOn(component, 'selectedHeightDraw').and.callThrough();
    component.draw();
    expect(selectedHeightSpy).toHaveBeenCalledTimes(0);
    expect(component.context).toBeTruthy();
  });

  it('#draw should not give new value to context when context is already instanciated', () => {
    const canvasRenderingMock = component.canvas.nativeElement.getContext('2d');
    component.context = canvasRenderingMock;
    component.draw();
    expect(component.context).toBe(canvasRenderingMock);
  });

  it('#selectedHeightDraw should assign 5 to line width and #ffffff to stroke style of the context', () => {
    const height = 1000;
    component.selectedHeightDraw(height);
    const lineWidth = 5;
    expect(component.context.lineWidth).toEqual(lineWidth);
    expect(component.context.strokeStyle).toEqual('#ffffff');
  });

  it('#onMouseDown should call draw', () => {
    spyOn(component, 'draw').and.callThrough();
    const mouseEventMock = new MouseEvent('mousedown');
    component.onMouseDown(mouseEventMock);
    expect(component.draw).toHaveBeenCalled();
  });

  it('#onMouseDown should set mouseDown to true', () => {
    const mouseEventMock = new MouseEvent('mousedown');
    component.onMouseDown(mouseEventMock);
    expect(component.mouseDown).toBe(true);
  });

  it('#onMouseMove should not call draw when mouseDown is false', () => {
    spyOn(component, 'draw').and.callThrough();
    const mouseEventMock = new MouseEvent('mousemove');
    component.onMouseMove(mouseEventMock);
    expect(component.draw).toHaveBeenCalledTimes(0);
  });

  it('#onMouseMove should call draw when mouseDown is true', () => {
    component.mouseDown = true;
    spyOn(component, 'draw').and.callThrough();
    const mouseEventMock = new MouseEvent('mousemove');
    component.onMouseMove(mouseEventMock);
    expect(component.draw).toHaveBeenCalledTimes(1);
  });

  it('#onMouseUp should set mouseDown to false', () => {
    component.mouseDown = true;
    component.onMouseUp();
    expect(component.mouseDown).toBe(false);
  });
});
