import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

export class DrawingViewReuseStrategy implements RouteReuseStrategy {

  private savedRoutes: {[key: string]: DetachedRouteHandle } = {};

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (!route.routeConfig || route.routeConfig.loadChildren) {
      return false;
    }
    return route.routeConfig.data && route.routeConfig.data.reuse;
  }

  store(route: ActivatedRouteSnapshot, savedRoutes: DetachedRouteHandle): void {
    if (savedRoutes) {
      this.savedRoutes[this.getUrl(route)] = savedRoutes;
    }
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.savedRoutes[this.getUrl(route)];
  }

  getUrl(route: ActivatedRouteSnapshot): string {
    if (route.routeConfig && route.routeConfig.path !== undefined) {
      return route.routeConfig.path;
    }
    return '';
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    if (!future.routeConfig || !future.routeConfig.data) {
      return false;
    }
    return future.routeConfig.data.reuse || future.routeConfig === current.routeConfig;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!route.routeConfig || route.routeConfig.loadChildren) {
      return null;
    }
    return this.savedRoutes[this.getUrl(route)];
  }
}
 /* Reference : https://stackblitz.com/edit/router-reuse-strategy?file=app%2Frouter-strategy.ts
https://stackoverflow.com/questions/41280471/how-to-implement-routereusestrategy-shoulddetach-for-specific-routes-in-angular
https://github.com/angular/angular/blob/4.4.6/packages/router/src/route_reuse_strategy.ts#L67
 */
