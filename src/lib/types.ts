

export type ReleaseType = "Album" | "EP" | "Single"

export interface Artist {
    id: string;
    name: string;
    photo_path: string;
}

export interface Release {
    id: string;
    name: string;
    photo_path: string;
    release_date: string; 
    type: ReleaseType;
    artists: Artist[];
}

export interface Track{
    id: string;
    name: string;
    duration_s : number;
    artists: Artist[];
    release: Release;
}



export interface CatalogProvider{
    search: (query: string) => Promise<string[]>;
}
