
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

export interface IFeatureProperties {
    id: string;
    title: string;
    popupImage: string;
    icon: string;
    date: string;
    time: string;
    url: string;
}

export interface ISideBarState {
    sideBarDataLoading: boolean;
    events: IEvent[];
    visibleEvents: IEvent[];
    hasMoreEvents: boolean;
    searchBarQuery: string;
}

export interface IMapState {
    markersOnScreen: string[];
    activePopup: string | null;
    selectedClassification: string;
    sortSelection: string;
    showMap: boolean;
}

export interface IFetchEventsQueryParams {
    latitude: number;
    longitude: number;
    radius: number;
    classification: string;
    sortBy: string;
    searchBarQuery: string;
}