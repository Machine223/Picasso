import { ColorsService } from '@app-services/drawing/colors/colors.service';
import { Ellipse } from '@app-services/drawing/shapes/ellipse/ellipse';
import { Rectangle } from '@app-services/drawing/shapes/rectangle/rectangle';
import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { ToolPropertiesService } from '@app-services/drawing/tools/tool-properties.service';

export class Polygon extends Ellipse {
  sides: number;
  points: string;
  pointsArray: Coordinates[];
  radius: number;

  constructor(protected colorsService: ColorsService, protected toolProperties: ToolPropertiesService) {
    super(colorsService, toolProperties);
    this.sides = toolProperties.sidesCount;
    this.points = '';
    this.pointsArray = [];
    this.radius = 0;
  }

  setPolygonParameters(rectangle: Rectangle): void {
    this.setEllipseParameters(rectangle);
    this.setPolygonRadius();
    this.getInitialPoint();
    this.setRemainingPoints();
    this.convertPointsToString();
  }

  setPolygonRadius(): void {
    this.defineRadiusFromStrokeWidth();
    this.radius = this.isXGreater() ? this.xRadius :
      this.yRadius;
  }

  isXGreater(): boolean {
    return this.width > this.height;
  }

  isXRelativelyGreater(): boolean {
    return this.width * this.getSidesRatio() > this.height;
  }

  getAngle(): number {
    return (this.sides - 2) * Math.PI / this.sides;
  }

  getInitialPoint(): void {
    const oddSidesMult = 4;
    const oddSidesConstant = 8;

    this.pointsArray = [];
    const adjustmentPolygonOddSides = this.hasEvenSides() ? 0 : this.radius / (this.sides * oddSidesMult - oddSidesConstant);
    this.pointsArray.push(new Coordinates(this.centerPoint.xPosition, this.centerPoint.yPosition -
      this.radius + adjustmentPolygonOddSides));
  }

  getSideLength(): number {
    const centerAngle = Math.PI - this.getAngle();
    return Math.sqrt(2 * this.radius * this.radius * (1 - Math.cos(centerAngle)));
  }

  getInnerRadius(): number {
    return this.radius * Math.cos(Math.PI / this.sides);
  }

  hasEvenSides(): boolean {
    return this.sides % 2 === 0;
  }

  is4SidesMultiple(): boolean {
    const fourSidesMultiple = 4;
    return this.sides % fourSidesMultiple === 0;
  }

  getSidesRatio(): number {
    if (this.is4SidesMultiple()) {
      return 1;
    }
    return this.hasEvenSides() ? this.radius / this.getInnerRadius() : (this.radius + this.getInnerRadius()) / (2 * this.radius);
  }

  getCoordinatesFromPoint(previousPoint: Coordinates, sideLength: number, angle: number): Coordinates {
    return new Coordinates(previousPoint.xPosition + sideLength * Math.cos(angle),
      previousPoint.yPosition + sideLength * Math.sin(angle));
  }

  setRemainingPoints(): void {
    const sideLength = this.getSideLength();
    let iteratingPoint = this.pointsArray[0];
    const angleIncrement = (Math.PI - this.getAngle());
    let incrementingAngle = angleIncrement / 2;

    for (let i = 0; i < this.sides - 1; i++) {
      iteratingPoint = this.getCoordinatesFromPoint(iteratingPoint, sideLength, incrementingAngle);
      this.pointsArray.push(iteratingPoint);
      incrementingAngle += angleIncrement;
    }
  }

  convertPointsToString(): void {
    this.points = '';
    this.pointsArray.forEach((point) => {
      const stringPoint = point.xPosition.toString() + ', ' + point.yPosition.toString() + ' ';
      this.points += stringPoint;
    });
  }
}
