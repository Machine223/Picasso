import { OverlayModule } from '@angular/cdk/overlay';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { Router, RouterModule } from '@angular/router';
import { GridService } from '@app-services/drawing/grid/grid.service';
import { SelectorToolService } from '@app-services/drawing/tools/selector-tool/selector-tool.service';
import { ToolManagerService } from '@app-services/drawing/tools/tool-manager.service';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';
import { TranslateService } from '@app-services/drawing/transform/translate.service';
import { OpenDialogService } from '@app-services/open-dialog/open-dialog.service';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { TOOL_NAME } from 'constants/constants';
import {
  NewDrawingCreationDialogComponent } from '../new-drawing-creation/new-drawing-creation-dialog/new-drawing-creation-dialog.component';
import { KeyboardEventComponent } from './keyboard-event.component';

const MOCK_TOOL_MOUSE = TOOL_NAME.Mouse;
const MOCK_EVENT_KEY_UP_ARROWDOWN = new KeyboardEvent('keyup', { key: 'ArrowDown' });
const MOCK_EVENT_KEY_UP_ARROWUP = new KeyboardEvent('keyup', { key: 'ArrowUp' });
const MOCK_EVENT_KEY_UP_ARROWLEFT = new KeyboardEvent('keyup', { key: 'ArrowLeft' });
const MOCK_EVENT_KEY_UP_ARROWRIGHT = new KeyboardEvent('keyup', { key: 'ArrowRight' });
const MOCK_EVENT_KEY_PRESS_C = new KeyboardEvent('keypress', {key: 'c'});
const MOCK_EVENT_KEY_DOWN_C = new KeyboardEvent('keydown', {key: 'c'});
const MOCK_EVENT_KEY_PRESS_CTRL_O = new KeyboardEvent('keypress', {ctrlKey: true , key: 'o'});
const MOCK_EVENT_KEY_PRESS_CTRL_S = new KeyboardEvent('keypress', {ctrlKey: true , key: 's'});
const MOCK_EVENT_KEY_PRESS_CTRL_G = new KeyboardEvent('keypress', {ctrlKey: true , key: 'g'});
const MOCK_EVENT_KEY_PRESS_CTRL_A = new KeyboardEvent('keypress', {ctrlKey: true , key: 'a'});
const MOCK_EVENT_KEY_PRESS_CTRL_E = new KeyboardEvent('keypress', {ctrlKey: true , key: 'e'});
const MOCK_EVENT_KEY_DOWN_CTRL_Z = new KeyboardEvent('keydown', {ctrlKey: true, key: 'Z'});
// tslint:disable-next-line: variable-name
const MOCK_EVENT_KEY_DOWN_CTRL_z = new KeyboardEvent('keydown', {ctrlKey: true, key: 'z'});
const MOCK_EVENT_KEY_DOWN_SHIFT = new KeyboardEvent('keydown', {key: 'Shift'});
const MOCK_EVENT_KEY_DOWN_BACKSPACE = new KeyboardEvent('keydown', {key: 'Backspace'});
const MOCK_EVENT_KEY_DOWN_ESCAPE = new KeyboardEvent('keydown', {key: 'Escape'});
const MOCK_EVENT_KEY_UP_SHIFT = new KeyboardEvent('keyup', {key: 'Shift'});
const MOCK_EVENT_KEY_DOWN_MOUSE = new KeyboardEvent('keydown', {key: 's'});
const MOCK_EVENT_KEY_DOWN_PENCIL = new KeyboardEvent('keydown', {key: 'c'});
const MOCK_EVENT_KEY_DOWN_BRUSH = new KeyboardEvent('keydown', {key: 'w'});
const MOCK_EVENT_KEY_DOWN_SPRAY = new KeyboardEvent('keydown', {key: 'a'});
const MOCK_EVENT_KEY_DOWN_LINE = new KeyboardEvent('keydown', {key: 'l'});
const MOCK_EVENT_KEY_DOWN_RECTANGLE = new KeyboardEvent('keydown', {key: '1'});
const MOCK_EVENT_KEY_DOWN_ELLIPSE = new KeyboardEvent('keydown', {key: '2'});
const MOCK_EVENT_KEY_DOWN_POLYGON = new KeyboardEvent('keydown', {key: '3'});
const MOCK_EVENT_KEY_DOWN_COLORSELECTOR = new KeyboardEvent('keydown', {key: 'i'});
const MOCK_EVENT_KEY_DOWN_TEXT = new KeyboardEvent('keydown', {key: 't'});
const MOCK_EVENT_KEY_DOWN_ERASER = new KeyboardEvent('keydown', {key: 'e'});
const MOCK_EVENT_KEY_DOWN_APPLICATOR = new KeyboardEvent('keydown', {key: 'r'});
const MOCK_EVENT_KEY_DOWN_GRID = new KeyboardEvent('keydown', {key: 'g'});
const MOCK_EVENT_KEY_DOWN_INCREMENT = new KeyboardEvent('keydown', {key: '+'});
const MOCK_EVENT_KEY_DOWN_DECREMENT = new KeyboardEvent('keydown', {key: '-'});

describe('KeyboardEventComponent', () => {
  let component: KeyboardEventComponent;
  let fixture: ComponentFixture<KeyboardEventComponent>;
  let routerStub;
  let openDialogService: OpenDialogService;
  let toolManagerService: ToolManagerService;
  let undoRedoService: UndoRedoManagerService;
  let toolPropertiesService: ToolPropertiesService;
  let gridService: GridService;
  let translateService: TranslateService;
  let selectorToolService: SelectorToolService;

  beforeEach(async(() => {
    routerStub = {
      navigate: jasmine.createSpy('navigate'),
    };
    TestBed.configureTestingModule({
      declarations: [
        KeyboardEventComponent,
        NewDrawingCreationDialogComponent
      ],
      imports:  [
        BrowserAnimationsModule,
        BrowserModule,
        HttpClientModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatRadioModule,
        MatRippleModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        ReactiveFormsModule,
        RouterModule,
        MatIconModule,
        FormsModule,
        OverlayModule
      ],
      providers: [
        { provide: Router, useValue: routerStub },
      ]
    }).overrideModule(BrowserTestingModule, { set: {entryComponents: [NewDrawingCreationDialogComponent]}})
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    openDialogService = TestBed.get(OpenDialogService);
    toolManagerService = TestBed.get(ToolManagerService);
    undoRedoService = TestBed.get(UndoRedoManagerService);
    toolPropertiesService = TestBed.get(ToolPropertiesService);
    gridService = TestBed.get(GridService);
    translateService = TestBed.get(TranslateService);
    selectorToolService = TestBed.get(SelectorToolService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#pageDispatcher() should call drawingViewShortcut() and set urlIsDrawingView at true', () => {
    const spy: jasmine.Spy = spyOn(component, 'drawingViewShortcut').and.callThrough();
    const routeMock = '/drawing-view';
    component.pageDispatcher(routeMock, MOCK_EVENT_KEY_PRESS_C);
    expect(spy).toHaveBeenCalled();
    expect(component.urlIsDrawingView).toBe(true);
  });

  it('#pageDispatcher() should break if is starting menu and set urlIsDrawingView at false', () => {
    const spy: jasmine.Spy = spyOn(component, 'drawingViewShortcut').and.callThrough();
    const routeMock = '/starting-menu';
    component.pageDispatcher(routeMock, MOCK_EVENT_KEY_PRESS_C);
    expect(spy).not.toHaveBeenCalled();
    expect(component.urlIsDrawingView).toBe(false);
  });

  it('#updateArrowMap() firstKeyDownArrow should be true if is key up and checkIsArrown for ArrowDown', () => {
    spyOn(component, 'updateArrowMap').and.callThrough();
    component.updateArrowMap(MOCK_EVENT_KEY_UP_ARROWDOWN);
    expect(component.firstKeyDownArrow).toBe(true);
  });

  it('#updateArrowMap() firstKeyDownArrow should be true if is key up and checkIsArrown for ArrowUp', () => {
    spyOn(component, 'updateArrowMap').and.callThrough();
    component.updateArrowMap(MOCK_EVENT_KEY_UP_ARROWUP);
    expect(component.firstKeyDownArrow).toBe(true);
  });

  it('#updateArrowMap() firstKeyDownArrow should be true if is key up and checkIsArrown for ArrowLeft', () => {
    spyOn(component, 'updateArrowMap').and.callThrough();
    component.updateArrowMap(MOCK_EVENT_KEY_UP_ARROWLEFT);
    expect(component.firstKeyDownArrow).toBe(true);
  });

  it('#updateArrowMap() firstKeyDownArrow should be true if is key up and checkIsArrown for ArrowRight', () => {
    spyOn(component, 'updateArrowMap').and.callThrough();
    component.updateArrowMap(MOCK_EVENT_KEY_UP_ARROWRIGHT);
    expect(component.firstKeyDownArrow).toBe(true);
  });

  it('#keyEvent() should call #pageDispatcher() when keyEvent is call', () => {
    const spy: jasmine.Spy = spyOn(component, 'pageDispatcher').and.callThrough();
    component.keyEvent(MOCK_EVENT_KEY_PRESS_C);
    expect(spy).toHaveBeenCalled();
  });

  it('#keyEvent() should return; when openedDialog is true', () => {
    component.openedDialog = true;
    const spy: jasmine.Spy = spyOn(component, 'pageDispatcher').and.callThrough();
    component.keyEvent(MOCK_EVENT_KEY_PRESS_C);
    expect(spy).not.toHaveBeenCalled();
  });

  it('#keyEvent() should call openNewDrawingDialog when ctrl + o is pressed', () => {
    const spyOpenDialogService = spyOn(openDialogService, 'openNewDrawingDialog');
    component.keyEvent(MOCK_EVENT_KEY_PRESS_CTRL_O);
    expect(spyOpenDialogService).toHaveBeenCalled();
  });

  it('#keyEvent() should call openSavingDialog when ctrl + s is pressed', () => {
    const spyOpenDialogService = spyOn(openDialogService, 'openSavingDialog');
    component.urlIsDrawingView = true;
    component.keyEvent(MOCK_EVENT_KEY_PRESS_CTRL_S);
    expect(spyOpenDialogService).toHaveBeenCalled();
  });

  it('#keyEvent() should call openGallery when ctrl + g is pressed', () => {
    const spyOpenDialogService = spyOn(openDialogService, 'openGallery');
    component.keyEvent(MOCK_EVENT_KEY_PRESS_CTRL_G);
    expect(spyOpenDialogService).toHaveBeenCalled();
  });

  it('#keyEvent() should call selectAll from tool Manager Service when ctrl + a is pressed', () => {
    const spyToolManagerService = spyOn(toolManagerService.selectorService, 'selectAll');
    toolManagerService.selectedTool = MOCK_TOOL_MOUSE;
    component.keyEvent(MOCK_EVENT_KEY_PRESS_CTRL_A);
    expect(spyToolManagerService).toHaveBeenCalled();
  });

  it('#keyEvent() should call openExportDialog when ctrl + e is pressed', () => {
    const spyOpenDialogService = spyOn(openDialogService, 'openExportDialog');
    component.keyEvent(MOCK_EVENT_KEY_PRESS_CTRL_E);
    expect(spyOpenDialogService).toHaveBeenCalled();
  });

  it('#checkArrowDisplacement() should call ArrowPressed if ArrowDown and ArrowLeft', () => {
    toolManagerService.selectedTool = MOCK_TOOL_MOUSE;
    spyOn(component, 'checkArrowDisplacement').and.callThrough();
    spyOn(component, 'downArrowPressed');
    spyOn(component, 'leftArrowPressed');
    component.checkArrowDisplacement(MOCK_EVENT_KEY_UP_ARROWDOWN);
    component.checkArrowDisplacement(MOCK_EVENT_KEY_UP_ARROWLEFT);
    expect(component.checkArrowDisplacement).toBeDefined();
    expect(component.downArrowPressed).toHaveBeenCalled();
    expect(component.leftArrowPressed).toHaveBeenCalled();
  });

  it('#checkArrowDisplacement() should call ArrowPressed if ArrowUp and ArrowRight', () => {
    toolManagerService.selectedTool = MOCK_TOOL_MOUSE;
    spyOn(component, 'checkArrowDisplacement').and.callThrough();
    spyOn(component, 'upArrowPressed');
    spyOn(component, 'rightArrowPressed');
    component.checkArrowDisplacement(MOCK_EVENT_KEY_UP_ARROWUP);
    component.checkArrowDisplacement(MOCK_EVENT_KEY_UP_ARROWRIGHT);
    expect(component.checkArrowDisplacement).toBeDefined();
    expect(component.upArrowPressed).toHaveBeenCalled();
    expect(component.rightArrowPressed).toHaveBeenCalled();
  });

  it('#checkArrowDisplacement() should call ArrowPressed if ArrowLeft and ArrowUp', () => {
    toolManagerService.selectedTool = MOCK_TOOL_MOUSE;
    spyOn(component, 'checkArrowDisplacement').and.callThrough();
    spyOn(component, 'upArrowPressed');
    spyOn(component, 'leftArrowPressed');
    component.checkArrowDisplacement(MOCK_EVENT_KEY_UP_ARROWUP);
    component.checkArrowDisplacement(MOCK_EVENT_KEY_UP_ARROWLEFT);
    expect(component.checkArrowDisplacement).toBeDefined();
    expect(component.upArrowPressed).toHaveBeenCalled();
    expect(component.leftArrowPressed).toHaveBeenCalled();
  });

  it('#checkArrowDisplacement() should call ArrowPressed if ArrowRight and ArrowDown', () => {
    toolManagerService.selectedTool = MOCK_TOOL_MOUSE;
    spyOn(component, 'checkArrowDisplacement').and.callThrough();
    spyOn(component, 'downArrowPressed');
    spyOn(component, 'rightArrowPressed');
    component.checkArrowDisplacement(MOCK_EVENT_KEY_UP_ARROWDOWN);
    component.checkArrowDisplacement(MOCK_EVENT_KEY_UP_ARROWRIGHT);
    expect(component.checkArrowDisplacement).toBeDefined();
    expect(component.downArrowPressed).toHaveBeenCalled();
    expect(component.rightArrowPressed).toHaveBeenCalled();
  });

  it('#keyUpEvent() should call #pageDispatcher()', () => {
    const spy: jasmine.Spy = spyOn(component, 'pageDispatcher').and.callThrough();
    component.keyUpEvent(MOCK_EVENT_KEY_DOWN_C);
    expect(spy).toHaveBeenCalled();
  });

  it('#drawingViewShortcut() should call undo and removeOutline when ctrl + Z is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService.selectorService, 'removeOutline');
    spyOn(undoRedoService, 'undo');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_CTRL_Z);
    expect(spyOnToolManagerService).toHaveBeenCalled();
    expect(undoRedoService.undo).toBeDefined();
  });

  it('#drawingViewShortcut() should call redo and removeOutline when ctrl + z is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService.selectorService, 'removeOutline');
    spyOn(undoRedoService, 'redo');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_CTRL_z);
    expect(spyOnToolManagerService).toHaveBeenCalled();
    expect(undoRedoService.redo).toBeDefined();
  });

  it('#drawingViewShortcut() should call eventMapDispatcher if editingText is false', () => {
    component.editingText = false;
    const spy = spyOn(component, 'eventMapDispatcher');
    component.drawingViewShortcut(MOCK_EVENT_KEY_PRESS_C);
    expect(spy).toHaveBeenCalled();
  });

  it('#drawingViewShortcut() should call keyboardTextDispatche if editingText is true', () => {
    component.editingText = true;
    const spy = spyOn(toolManagerService, 'keyboardTextDispatcher');
    component.drawingViewShortcut(MOCK_EVENT_KEY_PRESS_C);
    expect(spy).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should not change tool if the user is currently writing text', () => {
    component.editingText = true;
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.eventMapDispatcher(MOCK_EVENT_KEY_DOWN_MOUSE);
    expect(spyOnToolManagerService).not.toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Mouse if s is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_MOUSE);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Pencil if c is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_PENCIL);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Brush if w is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_BRUSH);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Spray if a is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_SPRAY);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Line if l is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_LINE);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Rectangle if 1 is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_RECTANGLE);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Ellipse if 2 is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_ELLIPSE);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Polygon if 3 is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_POLYGON);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Color Selector if i is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_COLORSELECTOR);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Text if t is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_TEXT);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Eraser if e is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_ERASER);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should change tool for Applicator if r is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'toolChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_APPLICATOR);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should call #keyboardLineDispatcher() if Backspace is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'keyboardLineDispatcher');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_BACKSPACE);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should call #keyboardLineDispatcher() if Escape is press', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'keyboardLineDispatcher');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_ESCAPE);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should call #shiftKeyToolDipatcher() if shift is press', () => {
    const spyOnToolManagerService =  spyOn(toolManagerService, 'shiftKeyToolDispatcher');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_SHIFT);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should call gridChange if g is press', () => {
    const spyOnToolPropertiesService =  spyOn(toolPropertiesService, 'gridChange');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_GRID);
    expect(spyOnToolPropertiesService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should call increment if + is press', () => {
    const spyOnToolPropertiesService =  spyOn(gridService, 'increment');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_INCREMENT);
    expect(spyOnToolPropertiesService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should call decrement if - is press', () => {
    const spyOnToolPropertiesService =  spyOn(gridService, 'decrement');
    component.drawingViewShortcut(MOCK_EVENT_KEY_DOWN_DECREMENT);
    expect(spyOnToolPropertiesService).toHaveBeenCalled();
  });

  it('#eventMapDispatcher() should call #shiftKeyToolDipatcher() if shift unpress', () => {
    const spyOnToolManagerService = spyOn(toolManagerService, 'shiftKeyToolDispatcher');
    component.drawingViewShortcut(MOCK_EVENT_KEY_UP_SHIFT);
    expect(spyOnToolManagerService).toHaveBeenCalled();
  });

  it('#leftArrowPressed() should call translateSelection and updateSelectedOutline', () => {
    const spyOnTranslateService = spyOn(translateService, 'translateSelection');
    component.leftArrowPressed();
    expect(spyOnTranslateService).toHaveBeenCalled();
    expect(selectorToolService.updateSelectedOutline).toBeDefined();
  });

  it('#rightArrowPressed() should call translateSelection and updateSelectedOutline', () => {
    const spyOnTranslateService = spyOn(translateService, 'translateSelection');
    component.rightArrowPressed();
    expect(spyOnTranslateService).toHaveBeenCalled();
    expect(selectorToolService.updateSelectedOutline).toBeDefined();
  });

  it('#upArrowPressed() should call translateSelection and updateSelectedOutline', () => {
    const spyOnTranslateService = spyOn(translateService, 'translateSelection');
    component.upArrowPressed();
    expect(spyOnTranslateService).toHaveBeenCalled();
    expect(selectorToolService.updateSelectedOutline).toBeDefined();
  });

  it('#downArrowPressed() should call translateSelection and updateSelectedOutline', () => {
    const spyOnTranslateService = spyOn(translateService, 'translateSelection');
    component.downArrowPressed();
    expect(spyOnTranslateService).toHaveBeenCalled();
    expect(selectorToolService.updateSelectedOutline).toBeDefined();
  });
// tslint:disable-next-line: max-file-line-count
});
