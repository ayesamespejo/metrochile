export type PlannerFlowState =
  | 'mapHome'
  | 'networkAll'
  | 'alternatives'
  | 'plannerSearch'
  | 'routeResults'
  | 'routeDetail'
  | 'activeTrip';

export type LineStatusCode = '0' | '1' | '2' | '3' | '4' | string;

export interface LineStatusItem {
  id: string;
  label: string;
  displayNumber: string;
  color: string;
  estado: LineStatusCode;
  statusLabel: string;
  icon: 'check' | 'alert' | 'close';
}

export type IncidentSeverity = 'alert' | 'interrupted';

export type SurfaceAlternativeKind = 'support' | 'habitual' | 'walk';

export interface SurfaceAlternative {
  id: string;
  kind: SurfaceAlternativeKind;
  /** Código de bus ("406") o vacío para apoyo/caminata */
  code?: string;
  title: string;
  subtitle: string;
  meta?: string;
  badge?: 'Apoyo' | 'Habitual';
  free?: boolean;
}

export interface SurfaceAlternativesBundle {
  support: SurfaceAlternative[];
  habitual: SurfaceAlternative[];
  walk: SurfaceAlternative[];
}

/** Incidencia operativa de una línea (banner compacto / detalle). */
export interface NetworkIncident {
  lineId: string;
  lineLabel: string;
  displayNumber: string;
  lineCode: string;
  color: string;
  severity: IncidentSeverity;
  /** Controlado / Servicio interrumpido */
  controlLabel: string;
  /** Banner: "Servicio interrumpido en L5" o "Incidencias en Línea 2" */
  summary: string;
  /** Título: estación cerrada / tramo sin servicio */
  headline: string;
  /** "Tramo Baquedano → Carlos Valdovinos sin servicio" */
  tramoLabel?: string;
  detail: string;
  affectedStations: string[];
  updatedLabel: string;
  sinceLabel?: string;
  icon: 'alert' | 'close';
  alternatives: SurfaceAlternativesBundle;
}

export type PlannerLocationType =
  | 'current'
  | 'station'
  | 'stop'
  | 'poi'
  | 'place'
  | 'recent'
  | 'favorite'
  | 'home'
  | 'work';

export type ScheduleTiming = 'depart' | 'arrive';

export type RouteSortPreference = 'fastest' | 'transfers' | 'walk';

export type RouteModeFilter = {
  mixed: boolean;
  metro: boolean;
  bus: boolean;
};

export interface PlannerLocation {
  id: string;
  type: PlannerLocationType;
  name: string;
  subtitle?: string;
  lat: number;
  lon: number;
  lines?: string[];
  category?: string;
}

export type AutocompleteSuggestion =
  | {
      type: 'station';
      id: string;
      name: string;
      lines: string[];
      lat: number;
      lon: number;
    }
  | {
      type: 'poi';
      id: string;
      name: string;
      category?: string;
      lat: number;
      lon: number;
    }
  | {
      type: 'place';
      placeId: string;
      name: string;
      description?: string | null;
    };

export interface AutocompleteResponse {
  query: string;
  suggestions: AutocompleteSuggestion[];
  meta?: {
    google?: 'ok' | 'skipped' | 'disabled' | 'error';
  };
}

export interface ResolvedPlace {
  placeId: string;
  lat: number;
  lon: number;
  label: string;
}

export type TransitMode = 'WALK' | 'SUBWAY' | 'BUS' | 'RAIL';
export type RouteModePreference = 'metro' | 'bus' | 'any';

export interface NavigatorPoint {
  stopId: string;
  name: string;
  lat: number;
  lon: number;
}

export interface NavigatorStop extends NavigatorPoint {
  mode: 'subway' | 'bus' | 'rail';
  routeIds: string[];
  parentStationId?: string | null;
  wheelchairBoarding?: number;
  distanceM?: number;
}

export interface NavigatorLine {
  lineId: string;
  agencyId?: string;
  shortName: string;
  longName: string;
  mode: 'subway' | 'bus' | 'rail';
  color: string;
  textColor: string;
  parentLineId?: string | null;
  expressVariant?: 'roja' | 'verde' | null;
  stopCount?: number;
  minHeadwaySecs?: number | null;
}

export interface NavigatorLineStop extends NavigatorPoint {
  seq: number;
}

export interface NavigatorLineDetail extends NavigatorLine {
  frequencies?: Array<{
    startTimeSecs: number;
    endTimeSecs: number;
    headwaySecs: number;
    serviceId: string;
  }>;
  direction0Stops?: NavigatorLineStop[];
  /** El backend entrega pares [latitud, longitud]. */
  shapes?: Record<string, Array<[number, number]>>;
}

export interface PlanLeg {
  mode: TransitMode;
  from: NavigatorPoint;
  to: NavigatorPoint;
  travelTimeSecs: number;
  distanceM?: number;
  routeId?: string;
  routeShortName?: string;
  headsign?: string;
  headwaySecs?: number | null;
  expectedWaitSecs?: number;
  nextArrivalSecs?: number | null;
  boardingTimeSecs?: number;
  expressVariant?: 'roja' | 'verde' | null;
  intermediateStops?: NavigatorPoint[];
}

export type RouteOptimization = 'time' | 'transfers' | 'walk';
export type RouteLabel =
  | 'Más rápida'
  | 'Menos transbordos'
  | 'Menos caminata'
  | 'Solo Metro'
  | 'Solo Micro'
  | 'Combinada';

/** Clasificación del itinerario según modos de tránsito (sin caminata). */
export type RouteModeKind = 'metro' | 'bus' | 'mixed';

export interface NavigatorItinerary {
  durationSecs: number;
  walkDistanceM: number;
  transfers: number;
  label?: string;
  legs: PlanLeg[];
}

export interface ServiceAlert {
  id: string;
  source: 'dtpm' | 'metro_rt';
  effect:
    | 'delay'
    | 'deviation'
    | 'no_service'
    | 'accessibility'
    | 'informational';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description?: string | null;
  affectedRoutes: string[];
  affectedStops: string[];
  issuedAt?: string | null;
  delayMinutes?: number;
}

export interface PlanResponse {
  query: {
    from?: {lat: number; lon: number};
    to?: {lat: number; lon: number};
    departAt: string;
    modes?: string[];
    optimize?: RouteOptimization;
  };
  itineraries: NavigatorItinerary[];
  alerts?: ServiceAlert[];
}

export interface PlannedItinerary extends NavigatorItinerary {
  id: string;
  departAt: string;
  labels: RouteLabel[];
  alerts: ServiceAlert[];
}

export interface RouteMapLeg {
  id: string;
  mode: TransitMode;
  routeId?: string;
  routeShortName?: string;
  color: string;
  /** Geometría MapLibre/GeoJSON: [longitud, latitud] por vértice. */
  coordinates: Array<[number, number]>;
  /**
   * Marcadores del tramo [lon, lat]:
   * solo estaciones (SUBWAY/RAIL). Vacío en BUS y WALK.
   */
  stationCoordinates: Array<[number, number]>;
  /** Puntitos de caminata precomputados [lon, lat]. Solo WALK. */
  walkDotCoordinates?: Array<[number, number]>;
  /** Instrucciones peatonales OSRM (solo WALK). */
  walkingSteps?: Array<{
    instruction: string;
    distanceMeters: number;
    durationSeconds: number;
  }>;
}

export interface SavedTrip {
  id: string;
  origin: PlannerLocation;
  destination: PlannerLocation;
  lineId?: string;
  createdAt: number;
}