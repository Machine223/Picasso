import { SidebarButton } from 'class/sidebar-button-class';

enum MOUSE {
  LeftButton = 0,
  RightButton = 2
}

enum ROTATION_ANGLE {
  Default = 0,
  Normal = 15,
  Alt = 1,
}

enum ExtensionType {
  svg = 'svg', png = 'png', jpeg = 'jpeg'
}

enum FilterType {
  none = 'Aucun', blur = 'Embrouillé', invert = 'Inversion de couleurs' , sepia = 'Sépia',
  hueRotate = 'Teinté', grayscale = 'Noir et blanc'
}

const MIN_ERASER_SIZE = 3;

const CONTROL_POINT_SIZE = 10;

enum TOOL_NAME {
  Mouse = 'Sélection (S)',
  Pencil = 'Crayon (C)',
  PaintBrush = 'Pinceau (W)',
  SprayCan = 'Aérosol (A)',
  Line = 'Ligne (L)',
  Rectangle = 'Rectangle (1)',
  Ellipse = 'Ellipse (2)',
  Polygon = 'Polygone (3)',
  Text = 'Texte (T)',
  Eraser = 'Efface (E)',
  Applicator = 'Applicateur de couleur (R)',
  Pipette = 'Pipette (I)',
  Grid = 'Grille (G)',
  NewDrawing = 'Nouveau dessin (Ctrl-O)',
  Save = 'Sauvegarder (Ctrl-S)',
  UserGuide = 'Guide d\'utilisation',
  Undo = 'Annuler (Ctrl-z)',
  Redo = 'Refaire (Ctrl-Shift-z)',
  Export = 'Exportation (Ctrl+E)',
  Bucket = 'Seau de peinture (B)'
}

enum ICON_NAME {
  Mouse = 'mouse',
  Pencil = 'edit',
  PaintBrush = 'brush',
  SprayCan = 'blur_on',
  Line = 'show_chart',
  Rectangle = 'crop_3_2',
  Ellipse = 'panorama_fish_eye',
  Polygone = 'details',
  Text = 'text_fields',
  Eraser = 'delete_sweep',
  Applicator = 'format_paint',
  Pipette = 'colorize',
  Grid = 'grid_on',
  NewDrawing = 'control_point',
  Save = 'save',
  UserGuide = 'live_help',
  Undo = 'undo',
  Redo = 'redo',
  Export = 'get_app',
  Bucket = 'format_color_fill'
}

const TOOLS_BUTTON: SidebarButton[] = [
  { name: TOOL_NAME.Mouse, icon: ICON_NAME.Mouse },
  { name: TOOL_NAME.Pencil, icon: ICON_NAME.Pencil },
  { name: TOOL_NAME.PaintBrush, icon: ICON_NAME.PaintBrush },
  { name: TOOL_NAME.SprayCan, icon: ICON_NAME.SprayCan },
  { name: TOOL_NAME.Line, icon: ICON_NAME.Line },
  { name: TOOL_NAME.Rectangle, icon: ICON_NAME.Rectangle },
  { name: TOOL_NAME.Ellipse, icon: ICON_NAME.Ellipse },
  { name: TOOL_NAME.Polygon, icon: ICON_NAME.Polygone },
  { name: TOOL_NAME.Text, icon: ICON_NAME.Text },
  { name: TOOL_NAME.Eraser, icon: ICON_NAME.Eraser },
  { name: TOOL_NAME.Applicator, icon: ICON_NAME.Applicator },
  { name: TOOL_NAME.Pipette, icon: ICON_NAME.Pipette },
  { name: TOOL_NAME.Grid, icon: ICON_NAME.Grid },
    { name: TOOL_NAME.Bucket, icon: ICON_NAME.Bucket},
];

const CONFIG_BUTTON: SidebarButton[] = [
  { name: TOOL_NAME.NewDrawing, icon: ICON_NAME.NewDrawing },
  { name: TOOL_NAME.Save, icon: ICON_NAME.Save },
  { name: TOOL_NAME.UserGuide, icon: ICON_NAME.UserGuide },
  { name: TOOL_NAME.Export, icon: ICON_NAME.Export}
];

const UNDO_BUTTON: SidebarButton = { name: TOOL_NAME.Undo, icon: ICON_NAME.Undo };
const REDO_BUTTON: SidebarButton = { name: TOOL_NAME.Redo, icon: ICON_NAME.Redo };

enum Junctions {
  Normal = 'Normal',
  Dotted = 'Avec points'
}

enum Strokes {
  Outline = 'Contour',
  Full = 'Plein',
  Both = 'Plein avec contour'
}

enum Textures {
  Texture1 = 1,
  Texture2 = 2,
  Texture3 = 3,
  Texture4 = 4,
  Texture5 = 5
}

enum Fonts {
  Arial = 'Arial',
  CourierNew = 'Courier New',
  Garamond = 'Garamond',
  Helvetica = 'Helvetica',
  TimesNewRoman = 'Times New Roman'
}

enum Alignments {
  Left = 'Gauche',
  Right = 'Droite',
  Centered = 'Centré'
}

enum BaseColors {
  Black = '#000000', White = '#ffffff', Blue = '#0000ff', Pink = '#f032e6', Purple = '#ff00ff',
  Teal = '#00ffff', Green = '#00ff00', Yellow = '#ffff00', Orange = '#f58231', Red = '#ff0000'
}

enum Direction {E, NE, N, NW, W, SW, S, SE}

const JUNCTION_TYPES: string[] = [
  Junctions.Normal,
  Junctions.Dotted
];

const STROKE_TYPES: string[] = [
  Strokes.Outline,
  Strokes.Full,
  Strokes.Both
];

const TEXTURE_TYPES: number[] = [
  Textures.Texture1,
  Textures.Texture2,
  Textures.Texture3,
  Textures.Texture4,
  Textures.Texture5
];

const FONT_FAMILY_TYPES: string[] = [
  Fonts.Arial,
  Fonts.CourierNew,
  Fonts.Garamond,
  Fonts.Helvetica,
  Fonts.TimesNewRoman
];

const TEXT_ALIGNMENT_TYPES: string[] = [
  Alignments.Left,
  Alignments.Right,
  Alignments.Centered
];

const STROKE_WIDTH_TOOLS: string[] = [
  TOOL_NAME.Pencil,
  TOOL_NAME.Line,
  TOOL_NAME.Rectangle,
  TOOL_NAME.PaintBrush,
  TOOL_NAME.Ellipse,
  TOOL_NAME.Polygon
];

const STROKE_TYPE_TOOLS: string[] = [
  TOOL_NAME.Rectangle,
  TOOL_NAME.Ellipse,
  TOOL_NAME.Polygon
];

const DOT_DIAMETER_SPRAY: string =  TOOL_NAME.SprayCan;
const DOT_DIAMETER_LINE: string =  TOOL_NAME.Line;
const JUNCTION_TYPE_LINE: string = TOOL_NAME.Line;
const TEXTURE_TYPES_BRUSH: string = TOOL_NAME.PaintBrush;
const FONT_FAMILY: string = TOOL_NAME.Text;
const FONT_SIZE: string = TOOL_NAME.Text;
const TEXT_ALIGNMENT: string = TOOL_NAME.Text;
const MUTATORS: string = TOOL_NAME.Text;
const SIZE_ERASER: string = TOOL_NAME.Eraser;
const SIDE_COUNT_POLYGON: string = TOOL_NAME.Polygon;
const TYPE_GRID: string = TOOL_NAME.Grid;
const PAINT_BUCKET: string = TOOL_NAME.Bucket;
const SELECTOR: string = TOOL_NAME.Mouse;

export {
  MOUSE,
  Junctions,
  Strokes,
  Textures,
  Fonts,
  Alignments,
  BaseColors,
  MIN_ERASER_SIZE,
  TOOLS_BUTTON,
  UNDO_BUTTON,
  REDO_BUTTON,
  CONFIG_BUTTON,
  TOOL_NAME,
  ICON_NAME,
  ExtensionType,
  FilterType,
  JUNCTION_TYPES,
  STROKE_TYPES,
  TEXTURE_TYPES,
  FONT_FAMILY_TYPES,
  TEXT_ALIGNMENT_TYPES,
  STROKE_WIDTH_TOOLS,
  DOT_DIAMETER_SPRAY,
  DOT_DIAMETER_LINE,
  STROKE_TYPE_TOOLS,
  JUNCTION_TYPE_LINE,
  TEXTURE_TYPES_BRUSH,
  FONT_FAMILY,
  FONT_SIZE,
  MUTATORS,
  TEXT_ALIGNMENT,
  SIZE_ERASER,
  SIDE_COUNT_POLYGON,
  TYPE_GRID,
  CONTROL_POINT_SIZE,
  ROTATION_ANGLE,
  PAINT_BUCKET,
  SELECTOR,
  Direction
};
