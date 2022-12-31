export class Cursor {

  localIndex: number[];

  constructor() {
    this.localIndex = [0, 0];
  }

  moveRight(inputText: string, cursorIndex: number): string {
    return this.swapCharacters(cursorIndex, cursorIndex + 1, inputText);
  }

  moveLeft(inputText: string, cursorIndex: number): string {
    return this.swapCharacters(cursorIndex - 1, cursorIndex, inputText);
  }

  moveUp(inputText: string[], cursorIndex: number[]): string[] {
    let yPosition;
    if (cursorIndex[1] > inputText[0].length) {
      yPosition = inputText[0].length;
    } else {
      yPosition = cursorIndex[1];
    }

    const newText = ['', ''];
    let cursorFlag = false;
    for (let i = 0; i < inputText.length; i++) {
      for (let j = 0; j < inputText[i].length; j++) {
        if (i === 0 && j === yPosition) {
          newText[i] += '|';
          this.localIndex = [i, j];
          cursorFlag = true;
        }
        if (!(i === 1 && j === cursorIndex[1])) {
          newText[i] += inputText[i][j];
        }
      }
    }
    if (!cursorFlag) {
      newText[0] += '|';
      this.localIndex = [0, newText[0].length - 1];
    }
    return newText;
  }

  moveDown(inputText: string[], cursorIndex: number[]): string[] {
    let yPosition;
    if (cursorIndex[1] > inputText[1].length) {
      yPosition = inputText[0].length;
    } else {
      yPosition = cursorIndex[1];
    }

    const newText = ['', ''];
    let cursorFlag = false;
    for (let i = 0; i < inputText.length; i++) {
      for (let j = 0; j < inputText[i].length; j++) {
        if (i === 1 && j === yPosition) {
          newText[i] += '|';
          this.localIndex = [i, j];
          cursorFlag = true;
        }
        if (!(i === 0 && j === cursorIndex[1])) {
          newText[i] += inputText[i][j];
        }
      }
    }
    if (!cursorFlag) {
      newText[1] += '|';
      this.localIndex = [1, newText[1].length - 1];
    }
    return newText;
  }

  swapCharacters(pos1: number, pos2: number, input: string): string {
    let result = '';
    for (let i = 0; i < input.length; i++) {
      if (i === pos1) {
        result += input[pos2];
      } else if (i === pos2) {
        result += input[pos1];
      } else {
        result += input[i];
      }
    }
    return result;
  }
}
