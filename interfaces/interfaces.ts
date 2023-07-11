
export interface ILocation {
    longitude: number;
    latitude: number;
}

export interface IEvent {
    id: string;
    name: string;
    url: string;
    images: IImage[];
    dates: IDates;
    _embedded: IEmbedded;
    classifications: IClassification[];
}

export interface IClassification {
    segment: ISegment;
}

export interface ISegment {
    name: string;
}

export interface IEmbedded {
    venues: IVenue[];
    attractions: IAttraction[];
}

export interface IAttraction {
    name: string;
}

export interface IVenue {
    location: ILocation;
}

export interface IImage {
    ratio: string;
    width: number;
    height: number;
    url: string;
}

export interface IDates {
    start: IStartEnd;
    end: IStartEnd;
}

export interface IStartEnd {
    localDate: string;
    localTime: string;
    noSpecificTime: boolean;
}

export interface ISideBarState {
    sideBarDataLoading: boolean;
    events: IEvent[];
    visibleEvents: IEvent[];
    hasMoreEvents: boolean;
}

export interface IMapState {
    markersOnScreen: string[];
}

export interface IFetchEventsQueryParams {
    latlong: ILocation;
    radius: number;
}