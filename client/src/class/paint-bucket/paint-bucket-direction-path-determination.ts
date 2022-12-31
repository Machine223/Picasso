import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { Direction } from '../../constants/constants';

const ADJUSTMENTCOEFFICIANT = 0.5;

export class PaintBucketDirectionPathDetermination {

   static setTraceEdgeOptimisationMap(newDirection: Direction, previousDirection: Direction, coordinatesToAdd: Coordinates): string {
    const traceEdgeOptimisationMap =  new Map<Direction, string>();
    traceEdgeOptimisationMap.set(Direction.S, this.determinePointSouth(newDirection, coordinatesToAdd));
    traceEdgeOptimisationMap.set(Direction.E, this.determinePointEast(newDirection, coordinatesToAdd));
    traceEdgeOptimisationMap.set(Direction.W,  this.determinePointWest(newDirection, coordinatesToAdd));
    traceEdgeOptimisationMap.set(Direction.NE,  this.determinePointNorthEast(newDirection, coordinatesToAdd));
    traceEdgeOptimisationMap.set(Direction.NW, this.determinePointNorthWest(newDirection, coordinatesToAdd));
    traceEdgeOptimisationMap.set(Direction.SE,  this.determinePointSouthEast(newDirection, coordinatesToAdd));
    traceEdgeOptimisationMap.set(Direction.N, this.determinePointNorth(newDirection, coordinatesToAdd));
    traceEdgeOptimisationMap.set(Direction.SW, this.determinePointSouthWest(newDirection, coordinatesToAdd));
    return traceEdgeOptimisationMap.get(previousDirection) as string;
  }

  static determinePointSouth(newDirection: Direction, coordinatesToAdd: Coordinates): string {
    if ( newDirection === Direction.E ) {
      return 'L ' + (coordinatesToAdd.xPosition - 1) + ' ' + (coordinatesToAdd.yPosition + 1) + ' ';
    }
    if ( newDirection === Direction.SE ) {
      return 'L ' + (coordinatesToAdd.xPosition - 1) + ' ' + (coordinatesToAdd.yPosition) + ' ';
    }
    return 'L ' + coordinatesToAdd.xPosition + ' ' + coordinatesToAdd.yPosition + ' ';
  }

  static  determinePointEast(newDirection: Direction, coordinatesToAdd: Coordinates): string {
    if ( newDirection === Direction.N) {
      return 'L ' + (coordinatesToAdd.xPosition + 1) + ' ' + (coordinatesToAdd.yPosition + 2) + ' ';
    }

    if ( newDirection === Direction.NE) {
      return 'L ' + coordinatesToAdd.xPosition + ' ' + (coordinatesToAdd.yPosition + 2) + ' ';
    }

    if ( newDirection === Direction.SE) {
      return 'L ' + (coordinatesToAdd.xPosition - 2) + ' ' + (coordinatesToAdd.yPosition) + ' ';
    }

    if ( newDirection === Direction.NW) {
      return 'L ' + (coordinatesToAdd.xPosition) + ' ' + (coordinatesToAdd.yPosition + 2) + ' ';
    }
    return 'L ' + coordinatesToAdd.xPosition + ' ' + coordinatesToAdd.yPosition + ' ';
  }

  static determinePointNorth(newDirection: Direction, coordinatesToAdd: Coordinates): string {
    if ( newDirection === Direction.W) {
      return 'L ' + (coordinatesToAdd.xPosition + 2) + ' ' + coordinatesToAdd.yPosition + ' ';
    }
    if (  newDirection === Direction.NW) {
      return 'L ' + (coordinatesToAdd.xPosition + 2) + ' ' + coordinatesToAdd.yPosition + ' ';
    }
    if (  newDirection === Direction.NE) {
      return 'L ' + (coordinatesToAdd.xPosition + 1) + ' ' + (coordinatesToAdd.yPosition + 1) + ' ';
    }
    return 'L ' + coordinatesToAdd.xPosition + ' ' + coordinatesToAdd.yPosition + ' ';
  }

  static determinePointWest(newDirection: Direction, coordinatesToAdd: Coordinates): string {
    if (  newDirection === Direction.S) {
      return 'L ' + (coordinatesToAdd.xPosition) + ' ' + (coordinatesToAdd.yPosition - 1 ) + ' ';
    }

    if (  newDirection === Direction.NW) {
      return 'L ' + (coordinatesToAdd.xPosition + 1) + ' ' + (coordinatesToAdd.yPosition - 1 ) + ' ';
    }

    if (  newDirection === Direction.SW) {
      return 'L ' + (coordinatesToAdd.xPosition) + ' ' + (coordinatesToAdd.yPosition - 1 ) + ' ';
    }
    return 'L ' + coordinatesToAdd.xPosition + ' ' + coordinatesToAdd.yPosition + ' ';
  }

  static determinePointNorthEast(newDirection: Direction, coordinatesToAdd: Coordinates): string {
    if ( newDirection === Direction.E) {
      return 'L ' + (coordinatesToAdd.xPosition) + ' ' + (coordinatesToAdd.yPosition + 1 ) + ' ';
    }
    if ( newDirection === Direction.N) {
      return 'L ' + (coordinatesToAdd.xPosition + 2) + ' ' + (coordinatesToAdd.yPosition + 1 ) + ' ';
    }
    if ( newDirection === Direction.NW) {
      return 'L ' + (coordinatesToAdd.xPosition + 2) + ' ' + (coordinatesToAdd.yPosition + 2) + ' ';
    }
    return 'L ' + coordinatesToAdd.xPosition + ' ' + coordinatesToAdd.yPosition + ' ';
  }

  static determinePointNorthWest(newDirection: Direction, coordinatesToAdd: Coordinates): string {
    if ( newDirection === Direction.N) {
      return 'L ' + (coordinatesToAdd.xPosition + 1) + ' ' + (coordinatesToAdd.yPosition + 1 ) + ' ';
    }
    if ( newDirection === Direction.SW) {
      return 'L ' + (coordinatesToAdd.xPosition + 2) + ' ' + (coordinatesToAdd.yPosition - 1 + ADJUSTMENTCOEFFICIANT ) + ' ';
    }
    return 'L ' + coordinatesToAdd.xPosition + ' ' + coordinatesToAdd.yPosition + ' ';
  }

  static determinePointSouthEast(newDirection: Direction, coordinatesToAdd: Coordinates): string {
    if (  newDirection === Direction.E) {
      return 'L ' + (coordinatesToAdd.xPosition - 1) + ' ' + (coordinatesToAdd.yPosition + 1 ) + ' ';
    }
    if ( newDirection === Direction.W) {
      return 'L ' + (coordinatesToAdd.xPosition + 1 + ADJUSTMENTCOEFFICIANT) + ' ' + (coordinatesToAdd.yPosition + 2 ) + ' ';
    }
    if ( newDirection === Direction.NE) {
      return 'L ' + (coordinatesToAdd.xPosition) + ' ' + (coordinatesToAdd.yPosition + 1 + ADJUSTMENTCOEFFICIANT ) + ' ';
    }
    return 'L ' + coordinatesToAdd.xPosition + ' ' + coordinatesToAdd.yPosition + ' ';
  }
  static determinePointSouthWest(newDirection: Direction, coordinatesToAdd: Coordinates): string {
    if (  newDirection === Direction.SE) {
      return 'L ' + (coordinatesToAdd.xPosition - ADJUSTMENTCOEFFICIANT) + ' '
        + (coordinatesToAdd.yPosition + ADJUSTMENTCOEFFICIANT ) + ' ';
    }
    if (  newDirection === Direction.W) {
      return 'L ' + (coordinatesToAdd.xPosition) + ' '
        + (coordinatesToAdd.yPosition + 1 ) + ' ';
    }
    return 'L ' + coordinatesToAdd.xPosition + ' ' + coordinatesToAdd.yPosition + ' ';
  }
}
