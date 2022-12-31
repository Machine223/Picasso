import { ICommand } from './icommand';

export class EraseSVGElement implements ICommand {
  nodes: Node[];
  svgDrawing: SVGSVGElement;
  nodesAndTheirNextSibling: [Node, Node | null][];

  constructor(nodes: Node[], svgDrawing: SVGSVGElement) {
    this.nodes = nodes;
    this.svgDrawing = svgDrawing;
    this.nodesAndTheirNextSibling = [];
  }

  execute(): void {
    this.nodes.forEach((node) => {
      let nodeNextSibling = node.nextSibling;
      if (nodeNextSibling instanceof Element && nodeNextSibling.id === 'cursor') {
        nodeNextSibling = null;
      }
      if (this.svgDrawing.contains(node)) {
        this.nodesAndTheirNextSibling.push([node, nodeNextSibling]);
        this.svgDrawing.removeChild(node);
      }
      });
  }

  undo(): void {
    let nodeAndItsNextSibling = this.nodesAndTheirNextSibling.pop();
    while (nodeAndItsNextSibling) {
      this.svgDrawing.insertBefore(nodeAndItsNextSibling[0], nodeAndItsNextSibling[1]);
      nodeAndItsNextSibling = this.nodesAndTheirNextSibling.pop();
    }
  }
}
