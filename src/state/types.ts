import { MangaMeta, ChapterMeta, MangaAPI, SearchResultFeeder, MangaInfo, ChapterFeeder, ChapterInfo } from "src/MangaAPI";

export interface SearchViewStates {
    results: MangaMeta[]
    feeder?: SearchResultFeeder
}

export interface MangaInfoViewStates {
    info?: MangaInfo
}

export interface ReadViewStates {
    feeder?: ChapterFeeder
    chapter?: ChapterInfo
    pageIndex: number
    overlayVisible: boolean
    leftHand: boolean
    doublePage: boolean
}

interface HistoryEntries {
    [key: string]: { chapter: ChapterMeta, page: number }
}

export interface SourceStorageStates {
    favorites: MangaMeta[]
    histories: HistoryEntries
}

export interface SourceInterfaces {
    [key: string]: MangaAPI
}

export interface SourceStorages {
    [key: string]: SourceStorageStates
}

export interface APIStates {
    interfaces: SourceInterfaces,
    storages: SourceStorages, 
    current: string
}

export interface MainStates {
    api: APIStates
    searchViewStates: SearchViewStates
    mangaInfoViewStates: MangaInfoViewStates
    readViewStates: ReadViewStates
    themeState: "default" | "dark"
    navigationState?: any
}