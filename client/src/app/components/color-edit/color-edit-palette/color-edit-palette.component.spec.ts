import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ColorEditPaletteComponent } from './color-edit-palette.component';

describe('ColorEditPaletteComponent', () => {
  let component: ColorEditPaletteComponent;
  let fixture: ComponentFixture<ColorEditPaletteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorEditPaletteComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorEditPaletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#draw should call selectedPositionDraw when selectedHeight is instanciated', () => {
    spyOn(component, 'selectedPositionDraw').and.callThrough();
    const mouseEventMock = new MouseEvent('mousedown');
    const offset = 100;
    spyOnProperty(mouseEventMock, 'offsetY').and.returnValue(offset);
    component.onMouseDown(mouseEventMock);
    component.draw();
    expect(component.selectedPositionDraw).toHaveBeenCalled();
    expect(component.context).toBeTruthy();
  });

  it('#draw should not call selectedPositionDraw when selectedHeight is not instanciated', () => {
    const selectedHeightSpy = spyOn(component, 'selectedPositionDraw').and.callThrough();
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

  it('#selectedPositionDraw should assign #ffffff to stroke style and fill style of the context', () => {
    component.draw();
    const position = 10;
    component.selectedPosition = new Coordinates(position, position);
    component.selectedPositionDraw();
    expect(component.context.fillStyle).toEqual('#ffffff');
    expect(component.context.strokeStyle).toEqual('#ffffff');
  });

  it('#emitColor should emit a color', () => {
    spyOn(component.color, 'emit').and.callThrough();
    const colorPosition = 10;
    component.emitColor(colorPosition, colorPosition);
    expect(component.color.emit).toHaveBeenCalled();
  });

  it('#ngOnChanges should not call draw when changes.hue is null', () => {
    spyOn(component, 'draw').and.callThrough();
    const changeMock = new SimpleChange(null, undefined, false);
    component.ngOnChanges({changeMock});
    expect(component.draw).toHaveBeenCalledTimes(0);
  });

  it('#ngOnChanges should call draw when changes.hue is instanciated', () => {
    spyOn(component, 'draw').and.callThrough();
    component.ngOnChanges({
      hue: new SimpleChange(null, component.hue, true)
    });
    expect(component.draw).toHaveBeenCalled();
  });

  it('#ngOnChanges should not call color emit when pos is not instanciated', () => {
    spyOn(component.color, 'emit').and.callThrough();
    component.hue = 'hue';
    component.ngOnChanges({
      hue: new SimpleChange(null, component.hue, true)
    });
    expect(component.color.emit).toHaveBeenCalledTimes(0);
  });

  it('#ngOnChanges should call color emit when pos is instanciated', () => {
    spyOn(component.color, 'emit').and.callThrough();
    const mouseEventMock = new MouseEvent('mousedown');
    const offset = 100;
    spyOnProperty(mouseEventMock, 'offsetX').and.returnValue(offset);
    spyOnProperty(mouseEventMock, 'offsetY').and.returnValue(offset);
    component.onMouseDown(mouseEventMock);
    component.hue = 'hue';
    component.ngOnChanges({
      hue: new SimpleChange(null, component.hue, true)
    });
    expect(component.color.emit).toHaveBeenCalled();
  });
});
