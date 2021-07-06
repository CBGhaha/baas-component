import {
  DRAWTOOL_PENCIL,
  DRAWTOOL_RECT,
  DRAWTOOL_LINE,
  DRAWTOOL_LINEARROW,
  DRAWTOOL_ELLIPSE,
  DRAWTOOL_ERASER,
  DRAWTOOL_ERASER_RECTANGLE,
  DRAWTOOL_TRIANGLE,
  DRAWTOOL_STAR,
  DRAWTOOL_TEXTTOOL,
  DRAWTOOL_PRESSUREPEN,
  DRAWTOOL_SMOOTHLINE,
  DRAWTOOL_ROBOPEN,
  DRAWTOOL_RECT_EDIT,
  DRAWTOOL_SELCTE_SHAPE,
  DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE,
  DRAWTOOL_POLYGON_EDIT,
  DRAWTOOL_EDIT_SHAPE_DELETE,
  DRAWTOOL_ELLIPSE_EDIT,
  DRAWTOOL_CIRCLE_EDIT,
  DRAWTOOL_SIMPLE_ELLIPSE_EDIT,
  DRAWTOOL_SIMPLE_TRIANGLE_EDIT,
  DRAWTOOL_LINE_EDIT,
  DRAWTOOL_TEXTTOOL_EDIT,
  DRAWTOOL_LINEDASH_EDIT,
  DRAWTOOL_LINEARROW_EDIT,
  DRAWTOOL_LINEARROWDASH_EDIT,
  DRAWTOOL_COORDSYS_EDIT,
  DRAWTOOL_EDIT_PAGE_DELETE,
  DRAWTOOL_EDIT_RECOVER
} from './global';
import {
  Brush
} from './shapes/brush';
import {
  Rect
} from './shapes/rect';
import {
  Line
} from './shapes/line';
import {
  LineArrow
} from './shapes/linearrow';
import {
  Ellipse
} from './shapes/ellipse';
import {
  Eraser
} from './shapes/eraser';
import {
  EraserRectangle
} from './shapes/eraserrectangle';
import {
  Triangle
} from './shapes/triangle';
import {
  Star
} from './shapes/star';
import {
  Text
} from './shapes/text';
import {
  PressurePen
} from './shapes/pressurepen';
import {
  SmoothPen
} from './shapes/smoothpen';
import {
  RoboPen
} from './shapes/robopen';
import {
  RectEdit
} from './shapes/rect-edit';
import {
  SelectShape
} from './shapes/select-shape';
import {
  EditRegularShape
} from './shapes/edit-regular';
import {
  PolygonEdit
} from './shapes/polygon-edit';

import {
  EditDeleteShape
} from './shapes/edit-delete';
import {
  EllipseEdit
} from './shapes/ellipse-edit';

import {
  CircleEdit
} from './shapes/circle-edit';

import {
  SimpleEllipseEdit
} from './shapes/simple-ellipse-edit';
import {
  SimpleTriangleEdit
} from './shapes/simple-triangle-edit';
import {
  LineDashEdit
} from './shapes/linedash-edit';
import {
  CoordSys
} from './shapes/coord-sys';
import {
  LineEdit
} from './shapes/line-edit';
import {
  TextEdit
} from './shapes/text-edit';
import {
  LineArrowEdit
} from './shapes/linearrow-edit';
import {
  LineArrowDashEdit
} from './shapes/linearrowdash-edit';
import {
  EditDeletePage
} from './shapes/edit-delete-page';
import {
  EditRecover
} from './shapes/edit-recover';
export function makeShapeInstance(toolname) {
  switch (toolname) {
    case DRAWTOOL_PENCIL:
      return Brush;
    case DRAWTOOL_RECT:
      return Rect;
    case DRAWTOOL_LINE:
      return Line;
    case DRAWTOOL_LINEARROW:
      return LineArrow;
    case DRAWTOOL_ELLIPSE:
      return Ellipse;
    case DRAWTOOL_ERASER:
      return Eraser;
    case DRAWTOOL_ERASER_RECTANGLE:
      return EraserRectangle;
    case DRAWTOOL_TRIANGLE:
      return Triangle;
    case DRAWTOOL_STAR:
      return Star;
    case DRAWTOOL_TEXTTOOL:
      return Text;
    case DRAWTOOL_PRESSUREPEN:
      return PressurePen;
    case DRAWTOOL_SMOOTHLINE:
      return SmoothPen;
    case DRAWTOOL_ROBOPEN:
      return RoboPen;
    case DRAWTOOL_RECT_EDIT:
      return RectEdit;
    case DRAWTOOL_SELCTE_SHAPE:
      return SelectShape;
    case DRAWTOOL_EDIT_REGULAR_SHAPE_CHANGE:
      return EditRegularShape;
    case DRAWTOOL_POLYGON_EDIT:
      return PolygonEdit;
    case DRAWTOOL_EDIT_SHAPE_DELETE:
      return EditDeleteShape;
    case DRAWTOOL_ELLIPSE_EDIT:
      return EllipseEdit;
    case DRAWTOOL_CIRCLE_EDIT:
      return CircleEdit;
    case DRAWTOOL_SIMPLE_ELLIPSE_EDIT:
      return SimpleEllipseEdit;
    case DRAWTOOL_SIMPLE_TRIANGLE_EDIT:
      return SimpleTriangleEdit;
    case DRAWTOOL_LINE_EDIT:
      return LineEdit;
    case DRAWTOOL_LINEDASH_EDIT:
      return LineDashEdit;
    case DRAWTOOL_LINEARROW_EDIT:
      return LineArrowEdit;
    case DRAWTOOL_LINEARROWDASH_EDIT:
      return LineArrowDashEdit;
    case DRAWTOOL_TEXTTOOL_EDIT:
      return TextEdit;
    case DRAWTOOL_COORDSYS_EDIT:
      return CoordSys;
    case DRAWTOOL_EDIT_PAGE_DELETE:
      return EditDeletePage;
    case DRAWTOOL_EDIT_RECOVER:
      return EditRecover;
    default:
      return Brush;

  }
}