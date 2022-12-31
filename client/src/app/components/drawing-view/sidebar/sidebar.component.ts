import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToolManagerService } from '@app-services/drawing/tools/tool-manager.service';
import { OpenDialogService } from '@app-services/open-dialog/open-dialog.service';
import { UndoRedoManagerService } from '@app-services/undo-redo/undo-redo-manager.service';
import { SidebarButton } from 'class/sidebar-button-class';
import { CONFIG_BUTTON, REDO_BUTTON, TOOL_NAME, TOOLS_BUTTON, UNDO_BUTTON, } from 'constants/constants';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {

  TOOLS_BUTTON: SidebarButton[] = TOOLS_BUTTON;
  CONFIG_BUTTON: SidebarButton[] = CONFIG_BUTTON;
  UNDO_BUTTON: SidebarButton = UNDO_BUTTON;
  REDO_BUTTON: SidebarButton = REDO_BUTTON;

  constructor(public toolManager: ToolManagerService,
              public router: Router,
              public undoRedo: UndoRedoManagerService,
              public openDialogService: OpenDialogService) { }

  buttonClick(name: string): boolean {
    switch (name) {
      case TOOL_NAME.NewDrawing:
        this.toolManager.removeTool();
        this.openDialogService.openNewDrawingDialog();
        break;

      case TOOL_NAME.Save:
        this.toolManager.removeTool();
        this.openDialogService.openSavingDialog();
        break;

      case TOOL_NAME.UserGuide:
        this.toolManager.removeTool();
        this.router.navigate(['/user-guide']);
        break;

      case UNDO_BUTTON.name:
        this.undoRedo.undo();
        this.toolManager.selectorService.removeOutline();
        break;

      case REDO_BUTTON.name:
        this.undoRedo.redo();
        this.toolManager.selectorService.removeOutline();
        break;

      case TOOL_NAME.Export:
        this.openDialogService.openExportDialog();
        break;

      default:
        this.toolManager.removeTool();
        this.toolManager.toolChange(name);
        break;
    }
    return false;
  }
}
