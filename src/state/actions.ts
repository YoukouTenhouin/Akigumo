import { SearchResultFeeder, MangaInfo, MangaMeta, ChapterMeta, ChapterFeeder, ChapterInfo } from "src/MangaAPI"

type Actions = SearchViewActions | MangaInfoViewActions | ReadViewActions | APIActions | ThemeActions | NavigationActions

type ThemeActions = ThemeToggleDark

type ThemeToggleDark = {
    type: "theme_toggledark"
}

type SearchViewActions = SearchViewClear | SearchViewOnSearch | SearchViewOnMoreReceived | SearchViewOnFeederReady | SearchViewOnFeederFailed

interface SearchViewClear {
    type: "searchview_clear"
}

interface SearchViewOnSearch {
    type: "searchview_onsearch"
}

interface SearchViewOnFeederReady {
    type: "searchview_onfeederready"
    feeder: SearchResultFeeder
}

interface SearchViewOnFeederFailed {
    type: "searchview_onfeederfailed"
}

interface SearchViewOnMoreReceived {
    type: "searchview_onmorereceived"
    entries: MangaMeta[]
}

type MangaInfoViewActions = MangaInfoViewClear | MangaInfoViewSetInfo

interface MangaInfoViewClear {
    type: "mangainfoview_clear"
}

interface MangaInfoViewSetInfo {
    type: "mangainfoview_setinfo"
    info: MangaInfo
}

type ReadViewActions = ReadViewClear | ReadViewFeederReady | ReadViewFeederFailed
    | ReadViewChapterReady | ReadViewChapterFailed | ReadViewSetPage
    | ReadViewToggleOverlay | ReadViewToggleHand | ReadViewToggleDoublePage

interface ReadViewClear {
    type: "readview_clear"
}

interface ReadViewFeederReady {
    type: "readview_feederready"
    feeder: ChapterFeeder
}

interface ReadViewFeederFailed {
    type: "readview_feederfailed"
}

interface ReadViewChapterReady {
    type: "readview_chapterready"
    chapter: ChapterInfo
}

interface ReadViewChapterFailed {
    type: "readview_chapterfailed"
}

interface ReadViewSetPage {
    type: "readview_setpage"
    page: number
}

interface ReadViewToggleOverlay {
    type: "readview_toggleoverlay"
}

interface ReadViewToggleHand {
    type: "readview_togglehand"
}

interface ReadViewToggleDoublePage {
    type: "readview_toggledoublepage"
}

type APIActions = APISetCurrent | APIStorageActions

interface APISetCurrent {
    type: "api_setcurrent"
    current: string
}

type APIStorageActions = APIStorageSetFavorite | APIStorageSetHistory

interface APIStorageSetFavorite {
    type: "api_storage_setfavorite"
    entries: MangaMeta[]
}

interface APIStorageSetHistory {
    type: "api_storage_sethistory"
    chapter: ChapterMeta
    page: number
}

type NavigationActions = NavigationSetState

interface NavigationSetState {
    type: "navigation_setstate"
    state: any
}

export default Actions