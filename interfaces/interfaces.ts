
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
}

export interface IEmbedded {
    venues: IVenue[];
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
    start: IStart;
}

export interface IStart {
    localDate: string;
    localTime: string;
    noSpecificTime: boolean;
}
