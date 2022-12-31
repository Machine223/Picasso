import { Injectable } from '@angular/core';
import { AutoSaveService } from '@app-services/auto-save/auto-save.service';
import { ICommand } from './icommand';

@Injectable({
  providedIn: 'root'
})
export class UndoRedoManagerService {
  executedCommands: ICommand[];
  undoneCommands: ICommand[];

  constructor(private autoSave: AutoSaveService) {
    this.executedCommands = [];
    this.undoneCommands = [];
  }

  executeCommand(command: ICommand): void {
    this.undoneCommands = [];
    command.execute();
    this.executedCommands.push(command);
  }

  undo(): void {
    const command = this.executedCommands.pop();
    if (command) {
      command.undo();
      this.undoneCommands.push(command);
      this.autoSave.save(false);
    }
  }

  redo(): void {
    const command = this.undoneCommands.pop();
    if (command) {
      command.execute();
      this.executedCommands.push(command);
      this.autoSave.save(false);
    }
  }

  clearCommands(): void {
    this.executedCommands = [];
    this.undoneCommands = [];
  }
}
