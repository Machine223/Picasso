import { Component, HostListener } from '@angular/core';
import { SelectorToolService } from '@app-services/drawing/tools/selector-tool/selector-tool.service';
import { RouteListenerService } from '@app-services/route-listener/route-listener.service';

@Component({
  selector: 'app-drawing-view',
  templateUrl: './drawing-view.component.html',
  styleUrls: ['./drawing-view.component.scss']
})
export class DrawingViewComponent {

  constructor(private routeListener: RouteListenerService,
              private selectorTool: SelectorToolService) {
    this.routeListener.loadRouting();
  }

  @HostListener('window:scroll', ['$event'])
  scroll(event: Event): void {
    if (event.target !== null) {
      this.selectorTool.selector.scroll[0] = (event.target as Element).scrollLeft;
      this.selectorTool.selector.scroll[1] = (event.target as Element).scrollTop;
    }
  }
}
