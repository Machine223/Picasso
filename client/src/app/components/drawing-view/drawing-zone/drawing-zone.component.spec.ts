import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, Type } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { DrawingElementsService } from '@app-services/drawing/drawing-elements.service';
import { DrawingPropertiesService } from '@app-services/drawing/drawing-properties/drawing-properties.service';
import { BrushService } from '@app-services/drawing/tools/path-tools/brush-tool/brush.service';
import { PencilService } from '@app-services/drawing/tools/path-tools/pencil-tool/pencil.service';
import { LineToolService } from '@app-services/drawing/tools/shape-tools/line-tool/line-tool.service';
import { ToolManagerService } from '@app-services/drawing/tools/tool-manager.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { ExportDrawingService } from '@app-services/exportDrawing/export-drawing.service';
import { LoadingFeatureService } from '@app-services/loading-feature/loading-feature.service';
import { Drawing } from '../../../../../../common/communication/drawing';
import { DrawingZoneComponent } from './drawing-zone.component';

const MOCK_DRAWING: Drawing = { name: 'TestA', tags: ['hello', 'world'], metadata: 'test', previewSource: ''};

describe('DrawingZoneComponent', () => {
  let component: DrawingZoneComponent;
  let fixture: ComponentFixture<DrawingZoneComponent>;
  let renderer: Renderer2;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DrawingZoneComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule
      ],
      providers: [Renderer2,
        PencilService,
        ToolManagerService,
        BrushService,
        LineToolService,
        ToolPropertiesService,
        ColorsService
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    renderer = fixture.componentRef.injector.get(Renderer2 as Type<Renderer2>);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#handleShiftKeyDownEvent should call #ShiftkeyDispatcher()',
    inject([ToolManagerService], (service: ToolManagerService) => {
      const mockEvent = new KeyboardEvent('keydown', {key: 'Shift'});
      const spy: jasmine.Spy = spyOn(service, 'shiftKeyToolDispatcher').and.callThrough();
      component.renderer.removeChild = ((svgParent, svgChild) => { return; });
      component.handleShiftKeyDownEvent(mockEvent);
      expect(spy).toHaveBeenCalled();
    })
  );

  it('#handleShiftKeyDownEvent should not call #ShiftkeyDispatcher()',
    inject([ToolManagerService], (service: ToolManagerService) => {
      const mockEvent = new KeyboardEvent('keydown', {key: 'c'});
      const spy: jasmine.Spy = spyOn(service, 'shiftKeyToolDispatcher').and.callThrough();
      component.renderer.removeChild = ((svgParent, svgChild) => { return; });
      component.handleShiftKeyDownEvent(mockEvent);
      expect(spy).toHaveBeenCalledTimes(0);
    })
  );

  it('#handleShiftKeyUpEvent should call #shiftKeyDispatcher()',
    inject([ToolManagerService], (service: ToolManagerService) => {
      const mockEvent = new KeyboardEvent('keyup', {key: 'Shift'});
      const spy: jasmine.Spy = spyOn(service, 'shiftKeyToolDispatcher').and.callThrough();
      component.handleShiftKeyUpEvent(mockEvent);
      expect(spy).toHaveBeenCalled();
    })
  );

  it('#handleShiftKeyUpEvent should not call #shiftKeyDispatcher()',
    inject([ToolManagerService], (service: ToolManagerService) => {
      const mockEvent = new KeyboardEvent('keyup', {key: 'c'});
      const spy: jasmine.Spy = spyOn(service, 'shiftKeyToolDispatcher').and.callThrough();
      component.handleShiftKeyUpEvent(mockEvent);
      expect(spy).toHaveBeenCalledTimes(0);
    })
  );

  it('#loadedMetadataSubscription should call loadDrawing and updateCanvas',
    inject([LoadingFeatureService], (service: LoadingFeatureService) => {
      const spyLoadDrawing = spyOn(component, 'loadDrawing');
      const spyUpdateCanvas = spyOn(component, 'updateCanvas');
      service.loadedDrawingSubject.next(MOCK_DRAWING);
      expect(spyLoadDrawing).toHaveBeenCalled();
      expect(spyUpdateCanvas).toHaveBeenCalled();
    })
  );

  // tslint:disable-next-line: max-line-length
  it('#subscribeToSVGElementToUpdate should call addTemporarySvgShape and change the lastTemporarySelector when selectorRenderer is modified',
    inject([DrawingElementsService], (service: DrawingElementsService) => {
      const spy = spyOn(component, 'addTemporarySvgShape');
      const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      service.selectorRenderer.next(rectangle);
      expect(spy).toHaveBeenCalled();
      expect(component.lastTemporarySelector).toBe(rectangle);
    })
  );

  // tslint:disable-next-line: max-line-length
  it('#subscribeToSVGElementToUpdate should call addTemporarySvgShape and change the lastTemporaryRenderer when temporaryRenderer from Drawing Elements is modified',
    inject([DrawingElementsService], (service: DrawingElementsService) => {
      const spy = spyOn(component, 'addTemporarySvgShape');
      const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      service.temporaryRenderer.next(rectangle);
      expect(spy).toHaveBeenCalled();
      expect(component.lastTemporaryRenderer).toBe(rectangle);
    })
  );

    // tslint:disable-next-line: max-line-length
  it('#subscribeToSVGElementToUpdate should call addSvgShape when completedRenderer from Drawing Elements is modified',
    inject([DrawingElementsService], (service: DrawingElementsService) => {
      const spy = spyOn(component, 'addSvgShape');
      const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      service.completedRenderer.next(rectangle);
      expect(spy).toHaveBeenCalled();
    })
  );

    // tslint:disable-next-line: max-line-length
  it('#subscribeToSVGElementToUpdate should call addTemporarySvgShape and change the lastTemporaryCursor when cursorElement from Drawing Elements is modified',
    inject([DrawingElementsService], (service: DrawingElementsService) => {
      const spy = spyOn(component, 'addTemporarySvgShape');
      const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      service.cursorElement.next(rectangle);
      expect(spy).toHaveBeenCalled();
      expect(component.lastTemporaryCursor).toBe(rectangle);
    })
  );

    // tslint:disable-next-line: max-line-length
  it('#subscribeToSVGElementToUpdate should call removeChild when elementToDelete is modified',
    inject([DrawingElementsService], (service: DrawingElementsService) => {
      const spyRenderer = spyOn(renderer, 'removeChild');
      const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      service.elementToDelete.next(rectangle);
      expect(spyRenderer).toHaveBeenCalled();
    })
  );

  it('#subscribeToSVGElementToUpdate should call updateCanvas when the filter from Export service is modified',
    inject([ExportDrawingService], (service: ExportDrawingService) => {
      const spy = spyOn(component, 'updateCanvas');
      service.filter.next('4');
      expect(spy).toHaveBeenCalled();
    })
  );

  it('#loadDrawing should set the innerHtml when loadedMetadata is defined', () => {
    component.loadedMetadata = 'test';
    component.loadDrawing();
    expect(component.svgDrawing.nativeElement.innerHTML).toMatch(component.loadedMetadata);
  });

  it('#onEvent with mouseup should call eventToolDispatcher from Tool Manager and not updateCanvas',
  inject([ToolManagerService], (service: ToolManagerService) => {
    const spy = spyOn(service, 'eventToolDispatcher');
    const spyUpdate = spyOn(component, 'updateCanvas');
    const event = new MouseEvent('mousedown');
    component.onEvent(event);
    expect(spy).toHaveBeenCalled();
    expect(spyUpdate).not.toHaveBeenCalled();
  })
  );

  it('#addTemporarySvgShape should call appendChild and not removeChild if temporaryElement is null', () => {
    const spyRemoveChild = spyOn(renderer, 'removeChild');
    const spyAppendChild = spyOn(renderer, 'appendChild');
    const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    component.addTemporarySvgShape(rectangle, null);
    expect(spyRemoveChild).not.toHaveBeenCalled();
    expect(spyAppendChild).toHaveBeenCalled();
  });

  it('#addTemporarySvgShape should call appendChild and removeChild if temporaryElement is not null', () => {
    const spyRemoveChild = spyOn(renderer, 'removeChild');
    const spyAppendChild = spyOn(renderer, 'appendChild');
    const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    component.addTemporarySvgShape(rectangle, rectangle);
    expect(spyRemoveChild).toHaveBeenCalled();
    expect(spyAppendChild).toHaveBeenCalled();
  });

  it('#addSvgShape should call appendChild and removeChild if lastTemporaryRenderer is not null', () => {
    const spyRemoveChild = spyOn(renderer, 'removeChild');
    const spyAppendChild = spyOn(renderer, 'appendChild');
    const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    component.lastTemporaryRenderer = rectangle;
    component.addSvgShape(rectangle);
    expect(spyRemoveChild).toHaveBeenCalled();
    expect(spyAppendChild).toHaveBeenCalled();
  });

  it('#addSvgShape should call appendChild and not removeChild if lastTemporaryRenderer is null', () => {
    const spyRemoveChild = spyOn(renderer, 'removeChild');
    const spyAppendChild = spyOn(renderer, 'appendChild');
    const rectangle = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    component.lastTemporaryRenderer = null;
    component.addSvgShape(rectangle);
    expect(spyRemoveChild).not.toHaveBeenCalled();
    expect(spyAppendChild).toHaveBeenCalled();
  });

  it('#createNewDrawing should call setAttribute if the currentDrawingColor is gray',
    inject([DrawingPropertiesService], (service: DrawingPropertiesService) => {
      const spy = spyOn(renderer, 'setAttribute');
      service.currentDrawingColor = 'rgba(128,128,128,1)';
      component.createNewDrawing();
      expect(spy).toHaveBeenCalled();
    })
  );

  it('#ngAfterViewInit should not call loadDrawing if the metadata is empty', () => {
    const spyLoadDrawing = spyOn(component, 'loadDrawing');
    component.loadedMetadata = '';
    component.ngAfterViewInit();
    expect(spyLoadDrawing).not.toHaveBeenCalled();
  });

});
