// Traced from 'imgi_68_ahmedassemlogo.png' (the original white mark), recoloured lime.
// Two pieces, split along the 45° line of the inner gap (stroke overlaps the cut by 2 units so no seam shows):
//   stroke = the long left stroke with the rounded shoulder
//   body   = top bar, vertical, arrow notch and the second stroke
export const LOGO_W = 909;
export const LOGO_H = 544;
export const LOGO_LIME = '#8cffdb';
export const LOGO_WHITE = '#FFFFFF';
export const LOGO_INK = '#111613';

export type LogoPiece = 'stroke' | 'body';

export const LOGO_PATHS: Record<LogoPiece, string> = {
  stroke: 'M0.6 542.4L479 58.8C506 31.4 540 0 585.4 0L693 0L150.6 542.4Z',
  body: 'M814.8 0L691 0L592.6 99.4C599 95 606 93.3 614 93.3L664.8 93.3L220 543.4L368.8 543.4L707 204.6L707 543.4L814.8 543.4L814.8 401L908.6 401L814.8 293.2Z',
};

/**
 * Site-wide look of the mark:
 *   'lime'  = the whole mark in lime
 *   'mixed' = white stroke + lime body
 * Change this one value to switch the navbar, footer, modals, hero and the intro together.
 */
export const LOGO_STYLE: 'lime' | 'mixed' = 'lime';

export const logoColors = (style: 'lime' | 'mixed' | 'split' | 'monochrome') => {
  switch (style) {
    case 'mixed':
      return { stroke: LOGO_WHITE, body: LOGO_LIME };
    case 'split': // for light backgrounds
      return { stroke: LOGO_INK, body: LOGO_LIME };
    case 'monochrome':
      return { stroke: LOGO_WHITE, body: LOGO_WHITE };
    default:
      return { stroke: LOGO_LIME, body: LOGO_LIME };
  }
};
