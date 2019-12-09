import { tsThisType } from "@babel/types"

export interface PageInfo {
    source: any
}

export interface ChapterMeta {
    title: string
    mangaNo: string
    chapterNo: string
}

export interface ChapterInfo {
    meta: ChapterMeta
    pages: PageInfo[]
}

export interface MangaMeta {
    title: string
    coverSource: any
    id: string
}

export interface MangaInfo {
    meta: MangaMeta
    chapters: ChapterMeta[]
}

export interface ChapterFeeder {
    prev(callback: (chapterInfo?: ChapterInfo) => void): void
    next(callback: (chapterInfo?: ChapterInfo) => void): void
    current(callback: (chapterInfo?: ChapterInfo) => void): void
}

export interface SearchResultFeeder {
    more(callback: (result: MangaMeta[]) => void): void
}

export interface MangaAPI {
    name: string

    getManga(meta: MangaMeta, callback: (info: MangaInfo) => void): void
    search(str: string, callback: (feeder: SearchResultFeeder) => void): void
    getChapterFeeder(chapter: ChapterMeta, callback: (feeder: ChapterFeeder) => void): void
}