export const createMouseEvent = (
  x: number,
  y: number,
  buttonPressed: number,
  offSetx?: number,
  offSety?: number,
  typeMouse?: string,
): MouseEvent => {
  const mouseEvent = {
    clientX: x,
    clientY: y,
    button: buttonPressed,
    offsetX: offSetx,
    offsetY: offSety,
    type: typeMouse,
  };
  return (mouseEvent as unknown) as MouseEvent;
};
export const MOCK_X = 10;
export const MOCK_Y = 10;
export const MOCK_MOUSE_EVENT = createMouseEvent(MOCK_X, MOCK_Y, 1, MOCK_X, MOCK_Y, 'mousedown');
export const MOCK_MOUSE_EVENT_MOVE = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mousemove');
export const MOCK_MOUSE_EVENT_UP = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseup');
export const MOCK_MOUSE_EVENT_LEAVE = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, 'mouseleave');
export const MOCK_MOUSE_EVENT_NULL = createMouseEvent(MOCK_X, MOCK_Y, 0, MOCK_X, MOCK_Y, '');
