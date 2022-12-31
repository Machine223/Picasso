import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonToggleGroup, MatDialogModule, MatDrawer, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ToolManagerService } from '@app-services/drawing/tools/tool-manager.service';
import { OpenDialogService } from '@app-services/open-dialog/open-dialog.service';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { REDO_BUTTON, TOOL_NAME, UNDO_BUTTON } from 'constants/constants';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarComponent,
        MatButtonToggleGroup,
        MatDrawer
      ],
      imports: [
        MatTooltipModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        MatDialogModule,
        MatSnackBarModule
      ],
      providers: [
        ToolManagerService,
        OpenDialogService,
        UndoRedoManagerService,
        OpenDialogService
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#buttonClick should open NewDrawingDialog and removeTool if tool is NewDrawing', () => {
    const spyOnDialog = spyOn(component.openDialogService, 'openNewDrawingDialog');
    const spyOnRemoveTool = spyOn(component.toolManager, 'removeTool');
    component.buttonClick(TOOL_NAME.NewDrawing);
    expect(spyOnRemoveTool).toHaveBeenCalled();
    expect(spyOnDialog).toHaveBeenCalled();
  });

  it('#buttonClick should open SavingDialog and removeTool if tool is Save', () => {
    const spySaveDialog = spyOn(component.openDialogService, 'openSavingDialog');
    const spyOnRemoveTool = spyOn(component.toolManager, 'removeTool');
    component.buttonClick(TOOL_NAME.Save);
    expect(spyOnRemoveTool).toHaveBeenCalled();
    expect(spySaveDialog).toHaveBeenCalled();
  });

  it('#buttonClick should change routing to /user-guide and removeTool if tool is UserGuide', () => {
    const spyOnNavigate = spyOn(component.router, 'navigate');
    const spyOnRemoveTool = spyOn(component.toolManager, 'removeTool');
    component.buttonClick(TOOL_NAME.UserGuide);
    expect(spyOnRemoveTool).toHaveBeenCalled();
    expect(spyOnNavigate).toHaveBeenCalledWith(['/user-guide']);
  });

  it('#buttonClick should remove outline and call undo if tool is Undo', () => {
    const spyOnRemoveOutline = spyOn(component.toolManager.selectorService, 'removeOutline');
    const spyOnUndo = spyOn(component.undoRedo, 'undo');
    component.buttonClick(UNDO_BUTTON.name);
    expect(spyOnUndo).toHaveBeenCalled();
    expect(spyOnRemoveOutline).toHaveBeenCalled();
  });

  it('#buttonClick should remove outline and call redo if tool is Redo', () => {
    const spyOnRemoveOutline = spyOn(component.toolManager.selectorService, 'removeOutline');
    const spyOnRedo = spyOn(component.undoRedo, 'redo');
    component.buttonClick(REDO_BUTTON.name);
    expect(spyOnRedo).toHaveBeenCalled();
    expect(spyOnRemoveOutline).toHaveBeenCalled();
  });

  it('#buttonClick should open ExportDialog if tool is Export', () => {
    const spyOnExportDialog = spyOn(component.openDialogService, 'openExportDialog');
    component.buttonClick(TOOL_NAME.Export);
    expect(spyOnExportDialog).toHaveBeenCalled();
  });

  // Source: https://stackoverflow.com/questions/39372804/typescript-how-to-loop-through-enum-values-for-display-in-radio-buttons
  it('#buttonClick should change tool and removeTool for any other tool', () => {
    const spy = spyOn(component.toolManager, 'toolChange');
    for (const item in TOOL_NAME) {
      if (isNaN(Number(item))
      && item !== TOOL_NAME.NewDrawing
      && item !== TOOL_NAME.Save
      && item !== TOOL_NAME.UserGuide
      && item !== TOOL_NAME.Export) {
        component.buttonClick(item);
        expect(spy).toHaveBeenCalled();
      }
    }
  });

});
