import { LineStatusCode } from './types';

export const METRO_RED = '#E1071B';
export const METRO_GREEN = '#009A44';
/** Azul de “Tu ubicación” (detalle de ruta y mapa). */
export const MAP_LOCATION_COLOR = '#2B7DE9';
export const SHEET_BG = '#F3F4F6';
export const CARD_BG = '#FFFFFF';

/** Marcador de ubicación / origen GPS: mismo azul en mapa y timeline. */
export const MAP_LOCATION_MARKER = {
  fill: MAP_LOCATION_COLOR,
  stroke: '#FFFFFF',
  radius: 7,
  strokeWidth: 2.5,
} as const;

/** Colores oficiales Metro Santiago (Figma). */
export const LINE_COLORS: Record<string, string> = {
  l1: '#E3071B',
  l2: '#FDB813',
  l3: '#6B3A1F',
  l4: '#0A2E8C',
  l4a: '#0078D7',
  l5: '#009A44',
  l6: '#8B2E9C',
};

/** 6 líneas principales + 4A (scroll horizontal). */
export const LINE_ORDER = ['l1', 'l2', 'l3', 'l4', 'l4a', 'l5', 'l6'] as const;

export const LINE_DISPLAY: Record<string, { label: string; number: string }> = {
  l1: { label: 'Línea 1', number: '1' },
  l2: { label: 'Línea 2', number: '2' },
  l3: { label: 'Línea 3', number: '3' },
  l4: { label: 'Línea 4', number: '4' },
  l4a: { label: 'Línea 4A', number: '4A' },
  l5: { label: 'Línea 5', number: '5' },
  l6: { label: 'Línea 6', number: '6' },
};

export const SNAP_POINTS = {
  mapHome: [178, 410],
  mapHomeWithAlert: [158, 520],
  // Mismo diseño cerrado/abierto: peek recorta la card; abierto muestra card + líneas + planificador
  mapHomeInterrupted: [168, 780],
} as const;

/** Altura del panel "Estado de la red" (hasta L6 + poco margen). */
export const NETWORK_ALL_SHEET_HEIGHT = 420;
export const NETWORK_ALL_SHEET_HEIGHT_WITH_ALERT = 640;
export const NETWORK_ALL_SHEET_HEIGHT_INTERRUPTED = 720;
export const ALTERNATIVES_SHEET_HEIGHT = 680;
export const PLANNER_SEARCH_SHEET_HEIGHT = '90%';
export const ROUTE_RESULTS_SNAP_POINTS = [248, '78%'] as const;
export const ROUTE_DETAIL_SHEET_HEIGHT = '90%';

export const ALERT_BANNER_BG = '#FBF3E4';
export const ALERT_ACCENT = '#E8920A';
export const STATUS_OK_COLOR = '#68bea3';

export const INTERRUPT_BG = '#FDECEC';
export const INTERRUPT_BORDER = '#E1071B';
export const INTERRUPT_TEXT = '#E1071B';
export const INTERRUPT_CHIP_BG = '#F8D0D0';
export const SURFACE_BLUE = '#1B4F9C';
export const SUPPORT_GREEN = '#2E9B6A';

export const getStatusMeta = (estado?: LineStatusCode) => {
  switch (String(estado)) {
    case '0':
    case '1':
      return {
        icon: 'check' as const,
        statusLabel: 'Línea disponible',
        badgeColor: STATUS_OK_COLOR,
      };
    case '2':
    case '4':
      return {
        icon: 'alert' as const,
        statusLabel: 'Retraso',
        badgeColor: ALERT_ACCENT,
      };
    case '3':
      return {
        icon: 'close' as const,
        statusLabel: 'Servicio interrumpido',
        badgeColor: METRO_RED,
      };
    default:
      return {
        icon: 'check' as const,
        statusLabel: 'Línea disponible',
        badgeColor: STATUS_OK_COLOR,
      };
  }
};

export const isProblemEstado = (estado?: LineStatusCode) => {
  const e = String(estado ?? '1');
  return e === '2' || e === '3' || e === '4';
};

export const isInterruptedEstado = (estado?: LineStatusCode) =>
  String(estado ?? '') === '3';