import { tsThisType } from "@babel/types"

/** 
 * Info of one page
 * source: source object to be passed to Image-like component
 */
export interface PageInfo {
    source: any
}

/**
 * Meta infos of one chapter
 * title: chapter title
 * mangaNo: identifier of the manga this chapter belongs to
 * chapterNo: identifier of this chapter
 */
export interface ChapterMeta {
    title: string
    mangaNo: string
    chapterNo: string
}

/**
 * Complete infos of one chapter
 * meta: Meta infos
 * pages: Infos of all pages in this chapter
 */
export interface ChapterInfo {
    meta: ChapterMeta
    pages: PageInfo[]
}

/**
 * Meta infos of one manga
 * title: title of manga
 * coverSource: source object of the cover of this manga
 * id: identifier of this manga
 */
export interface MangaMeta {
    title: string
    coverSource: any
    id: string
}

/**
 * Complete infos of one manga
 * meta: Meta infos
 * chapters: Meta infos of all chapters belong to this manga
 */
export interface MangaInfo {
    meta: MangaMeta
    chapters: ChapterMeta[]
}

/**
 * Feed chapter info into callback
 */
export interface ChapterFeeder {
    /** @param callback Callback to receive `chapterInfo` (if there is any), or `undefined` (if there is no previous chapter) */
    prev(callback: (chapterInfo?: ChapterInfo) => void): void
    /** @param callback Callback to receive `chapterInfo` (if there is any), or `undefined` (if there is no next chapter) */
    next(callback: (chapterInfo?: ChapterInfo) => void): void
    /** @param callback Callback to receive `chatperInfo` */
    current(callback: (chapterInfo?: ChapterInfo) => void): void
}

/**
 * Feed search results into callback
 */
export interface SearchResultFeeder {
    /** @param callback Callback to receive search results ([] means no more results) */
    more(callback: (result: MangaMeta[]) => void): void
}

/**
 * APIs must be provided by source implementation
 */
export interface MangaAPI {
    /** an internal string used to identifier source */
    name: string

    /** Interfaces reserved for favorites / histories syncs */
    /** accept currently stored favorites, return new favorites */
    getFavorite(current: MangaMeta[]): MangaMeta[]
    /** accept currently stored favorites and a new favorite entry, return new favorites */
    addFavorite(current: MangaMeta[], entry: MangaMeta): MangaMeta[]
    /** accept currently stored favorites and an entry to be removed, return new favorites */
    removeFavorite(curent: MangaMeta[], entry: MangaMeta): MangaMeta[]

    /* TODO: we probably should let those interfaces return a Promise */
    /** Get [[MangaInfo]] from a [[MangaMeta]] */
    getManga(meta: MangaMeta, callback: (info: MangaInfo) => void): void
    /** Get [[SearchResultFeeder]] from a query string */
    search(str: string, callback: (feeder: SearchResultFeeder) => void): void
    /** Get [[ChapterFeeder]] from a [[ChapterMeta]] */
    getChapterFeeder(chapter: ChapterMeta, callback: (feeder: ChapterFeeder) => void): void
}