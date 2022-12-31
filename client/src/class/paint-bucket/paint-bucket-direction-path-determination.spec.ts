import { Coordinates } from '@app-services/drawing/tools/coordinates';
import { Direction } from '../../constants/constants';
import { PaintBucketDirectionPathDetermination } from './paint-bucket-direction-path-determination';

describe('PaintBucketDirectionDetermination', () => {
  let instance: PaintBucketDirectionPathDetermination;
  let coordinatesMock: Coordinates;

  beforeEach(() => {
    instance = new PaintBucketDirectionPathDetermination();
    coordinatesMock = new Coordinates(1, 2);
  });

  it('should create an instance', () => {
    expect(instance).toBeTruthy();
  });

  it('#determinePointSouth should add the right correction when turning to the east', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointSouth(Direction.E, coordinatesMock);
    expect(result).toEqual('L 0 3 ');
  });

  it('#determinePointSouth should add the right correction when turning to the south east', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointSouth(Direction.SE, coordinatesMock);
    expect(result).toEqual('L 0 2 ');
  });

  it('#determinePointSouth should add the right correction when turning another direction', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointSouth(Direction.S, coordinatesMock);
    expect(result).toEqual('L 1 2 ');
  });

  it('#determinePointEast should add the right correction when turning north', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointEast(Direction.N, coordinatesMock);
    expect(result).toEqual('L 2 4 ');
  });

  it('#determinePointEast should add the right correction when turning north east', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointEast(Direction.NE, coordinatesMock);
    expect(result).toEqual('L 1 4 ');
  });

  it('#determinePointEast should add the right correction when turning south east', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointEast(Direction.SE, coordinatesMock);
    expect(result).toEqual('L -1 2 ');
  });

  it('#determinePointEast should add the right correction when turning north west', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointEast(Direction.NW, coordinatesMock);
    expect(result).toEqual('L 1 4 ');
  });

  it('#determinePointEast should add the right correction when turning another direction', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointEast(Direction.S, coordinatesMock);
    expect(result).toEqual('L 1 2 ');
  });

  it('#determinePointNorth should add the right correction when turning west', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointNorth(Direction.W, coordinatesMock);
    expect(result).toEqual('L 3 2 ');
  });

  it('#determinePointNorth should add the right correction when turning north west', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointNorth(Direction.NW, coordinatesMock);
    expect(result).toEqual('L 3 2 ');
  });

  it('#determinePointNorth should add the right correction when turning north east', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointNorth(Direction.NE, coordinatesMock);
    expect(result).toEqual('L 2 3 ');
  });

  it('#determinePointNorth should add the right correction when turning another direction', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointNorth(Direction.S, coordinatesMock);
    expect(result).toEqual('L 1 2 ');
  });

  it('#determinePointWest should add the right correction when turning south', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointWest(Direction.S, coordinatesMock);
    expect(result).toEqual('L 1 1 ');
  });

  it('#determinePointWest should add the right correction when turning north west', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointWest(Direction.NW, coordinatesMock);
    expect(result).toEqual('L 2 1 ');
  });

  it('#determinePointWest should add the right correction when turning south west', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointWest(Direction.SW, coordinatesMock);
    expect(result).toEqual('L 1 1 ');
  });

  it('#determinePointWest should add the right correction when turning another direction', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointWest(Direction.NE, coordinatesMock);
    expect(result).toEqual('L 1 2 ');
  });

  it('#determinePointNorthEast should add the right correction when turning east', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointNorthEast(Direction.E, coordinatesMock);
    expect(result).toEqual('L 1 3 ');
  });

  it('#determinePointNorthEast should add the right correction when turning north', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointNorthEast(Direction.N, coordinatesMock);
    expect(result).toEqual('L 3 3 ');
  });

  it('#determinePointNorthEast should add the right correction when turning north west', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointNorthEast(Direction.NE, coordinatesMock);
    expect(result).toEqual('L 1 2 ');
  });

  it('#determinePointNorthEast should add the right correction when turning another direction', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointNorthEast(Direction.SE, coordinatesMock);
    expect(result).toEqual('L 1 2 ');
  });

  it('#determinePointNorthWest should add the right correction when turning north', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointNorthWest(Direction.N, coordinatesMock);
    expect(result).toEqual('L 2 3 ');
  });

  it('#determinePointNorthWest should add the right correction when turning south west', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointNorthWest(Direction.SW, coordinatesMock);
    expect(result).toEqual('L 3 1.5 ');
  });

  it('#determinePointNorthWest should add the right correction when turning another direction', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointNorthWest(Direction.E, coordinatesMock);
    expect(result).toEqual('L 1 2 ');
  });

  it('#determinePointSouthEast should add the right correction when turning east', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointSouthEast(Direction.E, coordinatesMock);
    expect(result).toEqual('L 0 3 ');
  });

  it('#determinePointSouthEast should add the right correction when turning west', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointSouthEast(Direction.W, coordinatesMock);
    expect(result).toEqual('L 2.5 4 ');
  });

  it('#determinePointSouthEast should add the right correction when turning north east', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointSouthEast(Direction.NE, coordinatesMock);
    expect(result).toEqual('L 1 3.5 ');
  });

  it('#determinePointSouthEast should add the right correction when another direction', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointSouthEast(Direction.S, coordinatesMock);
    expect(result).toEqual('L 1 2 ');
  });

  it('#determinePointSouthWest should add the right correction when south east', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointSouthWest(Direction.SE, coordinatesMock);
    expect(result).toEqual('L 0.5 2.5 ');
  });

  it('#determinePointSouthWest should add the right correction when west', () => {
    const result = PaintBucketDirectionPathDetermination.determinePointSouthWest(Direction.W, coordinatesMock);
    expect(result).toEqual('L 1 3 ');
  });

  it('#setTraceEdgeOptimisationMap should call determinePointSouth when previousdirection is south', () => {
    const spy = spyOn(PaintBucketDirectionPathDetermination, 'determinePointSouth');
    PaintBucketDirectionPathDetermination.setTraceEdgeOptimisationMap(Direction.E, Direction.S, coordinatesMock);
    expect(spy).toHaveBeenCalled();
  });

  it('#setTraceEdgeOptimisationMap should call determinePointEast when previousdirection is east', () => {
    const spy = spyOn(PaintBucketDirectionPathDetermination, 'determinePointEast');
    PaintBucketDirectionPathDetermination.setTraceEdgeOptimisationMap(Direction.N, Direction.E, coordinatesMock);
    expect(spy).toHaveBeenCalled();
  });

  it('#setTraceEdgeOptimisationMap should call determinePointWest when previousdirection is west', () => {
    const spy = spyOn(PaintBucketDirectionPathDetermination, 'determinePointWest');
    PaintBucketDirectionPathDetermination.setTraceEdgeOptimisationMap(Direction.E, Direction.W, coordinatesMock);
    expect(spy).toHaveBeenCalled();
  });

  it('#setTraceEdgeOptimisationMap should call determinePointNorthEast when previousdirection is north east', () => {
    const spy = spyOn(PaintBucketDirectionPathDetermination, 'determinePointNorthEast');
    PaintBucketDirectionPathDetermination.setTraceEdgeOptimisationMap(Direction.E, Direction.NE, coordinatesMock);
    expect(spy).toHaveBeenCalled();
  });

  it('#setTraceEdgeOptimisationMap should call determinePointNorthWest when previousdirection is north west', () => {
    const spy = spyOn(PaintBucketDirectionPathDetermination, 'determinePointNorthWest');
    PaintBucketDirectionPathDetermination.setTraceEdgeOptimisationMap(Direction.E, Direction.NW, coordinatesMock);
    expect(spy).toHaveBeenCalled();
  });

  it('#setTraceEdgeOptimisationMap should call determinePointSouthEast when previousdirection is south east', () => {
    const spy = spyOn(PaintBucketDirectionPathDetermination, 'determinePointSouthEast');
    PaintBucketDirectionPathDetermination.setTraceEdgeOptimisationMap(Direction.E, Direction.SE, coordinatesMock);
    expect(spy).toHaveBeenCalled();
  });

  it('#setTraceEdgeOptimisationMap should call determinePointNorth when previousdirection is north', () => {
    const spy = spyOn(PaintBucketDirectionPathDetermination, 'determinePointNorth');
    PaintBucketDirectionPathDetermination.setTraceEdgeOptimisationMap(Direction.E, Direction.N, coordinatesMock);
    expect(spy).toHaveBeenCalled();
  });

  it('#setTraceEdgeOptimisationMap should call determinePointSouthWest when previousdirection is south west', () => {
    const spy = spyOn(PaintBucketDirectionPathDetermination, 'determinePointSouthWest');
    PaintBucketDirectionPathDetermination.setTraceEdgeOptimisationMap(Direction.E, Direction.SW, coordinatesMock);
    expect(spy).toHaveBeenCalled();
  });
});
