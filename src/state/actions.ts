import { SearchResultFeeder, MangaInfo, MangaMeta, ChapterMeta, ChapterFeeder, ChapterInfo } from "src/MangaAPI"

export type Actions = SearchViewActions | MangaInfoViewActions | ReadViewActions | APIActions

export type SearchViewActions = SearchViewClear | SearchViewOnSearch | SearchViewOnMoreReceived | SearchViewOnFeederReady | SearchViewOnFeederFailed

export interface SearchViewClear {
    type: "searchview_clear"
}

export interface SearchViewOnSearch {
    type: "searchview_onsearch"
}

export interface SearchViewOnFeederReady {
    type: "searchview_onfeederready"
    feeder: SearchResultFeeder
}

export interface SearchViewOnFeederFailed {
    type: "searchview_onfeederfailed"
}

export interface SearchViewOnMoreReceived {
    type: "searchview_onmorereceived"
    entries: MangaMeta[]
}

export type MangaInfoViewActions = MangaInfoViewClear | MangaInfoViewSetInfo

export interface MangaInfoViewClear {
    type: "mangainfoview_clear"
}

export interface MangaInfoViewSetInfo {
    type: "mangainfoview_setinfo"
    info: MangaInfo
}

export type ReadViewActions = ReadViewClear | ReadViewFeederReady |
    ReadViewFeederFailed | ReadViewChapterReady | ReadViewChapterFailed | ReadViewSetPage | ReadViewToggleOverlay | ReadViewToggleHand

export interface ReadViewClear {
    type: "readview_clear"
}

export interface ReadViewFeederReady {
    type: "readview_feederready"
    feeder: ChapterFeeder
}

export interface ReadViewFeederFailed {
    type: "readview_feederfailed"
}

export interface ReadViewChapterReady {
    type: "readview_chapterready"
    chapter: ChapterInfo
}

export interface ReadViewChapterFailed {
    type: "readview_chapterfailed"
}

export interface ReadViewSetPage {
    type: "readview_setpage"
    page: number
}

export interface ReadViewToggleOverlay {
    type: "readview_toggleoverlay"
}

export interface ReadViewToggleHand {
    type: "readview_togglehand"
}

export type APIActions = APISetCurrent | APIStorageActions

export interface APISetCurrent {
    type: "api_setcurrent"
    current: string
}

export type APIStorageActions = APIStorageAddFavorite | APIStorageRemoveFavorite | APIStorageSetHistory

export interface APIStorageAddFavorite {
    type: "api_storage_addfavorite"
    meta: MangaMeta
}

export interface APIStorageRemoveFavorite {
    type: "api_storage_removefavorite"
    meta: MangaMeta
}

export interface APIStorageSetHistory {
    type: "api_storage_sethistory"
    chapter: ChapterMeta
    page: number
}