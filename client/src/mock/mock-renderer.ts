/* tslint:disable  */
// Reason: Class implementation has to be the same as Renderer2
import { Renderer2 } from '@angular/core';

export class MockRenderer implements Renderer2 {
  data: { [key: string]: any; };
  destroyNode: ((node: any) => void) | null;
  createComment(value: string) {
    return;
  }
  appendChild(parent: any, newChild: any): void {
    return;
  }
  setAttribute(el: any, name: string, value: string, namespace?: string | null | undefined): void {
    return;
  }
  addClass(el: any, name: string): void {
    return;
  }
  destroy(): void {
    return;
  }
  createText(value: string) {
    return;
  }
  insertBefore(parent: any, newChild: any, refChild: any): void {
    return;
  }
  removeChild(parent: any, oldChild: any, isHostElement?: boolean | undefined): void {
    return;
  }
  selectRootElement(selectorOrNode: any, preserveContent?: boolean | undefined): void {
    return;
  }
  parentNode(node: any) {
    return;
  }
  nextSibling(node: any) {
    return;
  }
  removeAttribute(el: any, name: string, namespace?: string | null | undefined): void {
    return;
  }
  removeClass(el: any, name: string): void {
    return;
  }
  setStyle(el: any, style: string, value: any, flags?: import("@angular/core").RendererStyleFlags2 | undefined): void {
    return;
  }
  removeStyle(el: any, style: string, flags?: import("@angular/core").RendererStyleFlags2 | undefined): void {
    return;
  }
  setProperty(el: any, name: string, value: any): void {
    return;
  }
  setValue(node: any, value: string): void {
    return;
  }
  listen(target: any, eventName: string, callback: (event: any) => boolean | void): () => void {
    return () => 2;
  }
  createElement(name: string, namespace?: string): any {
    return;
  }
}
