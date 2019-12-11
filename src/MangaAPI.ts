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
    /** @param callback Callback to receive [[ChapterInfo]] (if there is any), or `null` (if there is no previous chapter) */
    prev(): Promise<ChapterInfo | null>
    /** @param callback Callback to receive [[ChapterInfo]] (if there is any), or `null` (if there is no next chapter) */
    next(): Promise<ChapterInfo | null>
    /** @param callback Callback to receive [[ChapterInfo]] */
    current(): Promise<ChapterInfo>
}

/**
 * Feed search results into callback
 */
export interface SearchResultFeeder {
    /** @param callback Callback to receive search results ([] means no more results) */
    more(): Promise<MangaMeta[]>
}

/**
 * APIs must be provided by source implementation
 */
export interface MangaAPI {
    /** an internal string used to identifier source */
    name: string

    /** Interfaces reserved for favorites / histories syncs */
    /** accept currently stored favorites, return new favorites */
    getFavorite(current: MangaMeta[]): Promise<MangaMeta[]>
    /** accept currently stored favorites and a new favorite entry, return new favorites */
    addFavorite(current: MangaMeta[], entry: MangaMeta): Promise<MangaMeta[]>
    /** accept currently stored favorites and an entry to be removed, return new favorites */
    removeFavorite(curent: MangaMeta[], entry: MangaMeta): Promise<MangaMeta[]>

    /** Get [[MangaInfo]] from a [[MangaMeta]] */
    getManga(meta: MangaMeta): Promise<MangaInfo>
    /** Get [[SearchResultFeeder]] from a query string */
    search(str: string): Promise<SearchResultFeeder>
    /** Get [[ChapterFeeder]] from a [[ChapterMeta]] */
    getChapterFeeder(chapter: ChapterMeta): Promise<ChapterFeeder>
}