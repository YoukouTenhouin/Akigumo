import { ChapterInfo, ChapterFeeder, SearchResultFeeder, MangaAPI, MangaMeta, ChapterMeta } from "src/MangaAPI";
import RNFS from 'react-native-fs'
import { existsTypeAnnotation } from "@babel/types";

interface LocalMangaChapter {
    id: string
    title: string,
    pages: string[]
}

interface LocalMangaInfo {
    id: string
    title: string
    cover: string
    chapters: LocalMangaChapter[]
}

class LocalChapterFeeder implements ChapterFeeder {
    constructor(private manga: LocalMangaInfo, private chapterIdx: number) { }

    async current() {
        let chapter = this.manga.chapters[this.chapterIdx]
        return {
            meta: {
                mangaNo: this.manga.id,
                chapterNo: chapter.id,
                title: chapter.title
            },
            pages: chapter.pages.map(uri => ({ source: { uri: `file://${uri}` } }))
        }
    }

    async next() {
        if (this.chapterIdx == 0)
            return null
        this.chapterIdx -= 1
        return this.current()
    }

    async prev() {
        if (this.chapterIdx >= this.manga.chapters.length)
            return null
        this.chapterIdx += 1
        return this.current()
    }
}

class LocalSearchResultFeeder implements SearchResultFeeder {
    async more() {
        // stub
        return []
    }
}

export default class LocalMangaAPI implements MangaAPI {
    name = "local"
    rootPath = `${RNFS.ExternalDirectoryPath}/local`

    constructor() {
        RNFS.mkdir(this.rootPath)
    }

    async loadChapterInfoByPath(path: string) {
        console.log('loading chapter info:', path)
        if (!await RNFS.stat(path).then(stat => stat.isDirectory()))
            return

        if (!await RNFS.exists(`${path}/chapter.json`)
            || !await RNFS.stat(`${path}/chapter.json`).then(item => item.isFile()))
            return

        let chapterInfo = JSON.parse(await RNFS.readFile(`${path}/chapter.json`))
        let pages = await RNFS.readDir(path).then(files => files.filter(item => (
            item.isFile() && item.path.match(/\.jpg|\.png/)
        )).map(item => item.path).sort())

        return {
            title: chapterInfo.title,
            pages: pages
        }
    }

    async loadMangaInfoByPath(path: string) {
        console.log('loading manga info:', path)
        if (!await RNFS.stat(path).then(stat => stat.isDirectory()))
            return

        if (!await RNFS.exists(`${path}/manga.json`)
            || !await RNFS.stat(`${path}/manga.json`).then(item => item.isFile()))
            return

        let mangaInfo = JSON.parse(await RNFS.readFile(`${path}/manga.json`))

        let chapterDirs = await RNFS.readDir(path).then(chapters => chapters.filter(item => item.isDirectory()))
        let chapters = await Promise.all(chapterDirs.map(async item => {
            let info = await this.loadChapterInfoByPath(item.path)
            return info && { id: item.name, ...info }
        }).filter(item => item)) as LocalMangaChapter[]

        let cover
        if (await RNFS.exists(`${path}/cover.png`))
            cover = `${path}/cover.png`
        else if (await RNFS.exists(`${path}/cover.jpg`))
            cover = `${path}/cover.jpg`

        return {
            title: mangaInfo.title,
            cover: cover,
            chapters: chapters.sort((a, b) => (a.id > b.id ? -1 : 1))
        }
    }

    async getFavorite(_entries: MangaMeta[]) {
        console.log('getFavorite')
        let localDirs = await RNFS.readDir(this.rootPath)
        console.log(localDirs)
        let ret = await Promise.all(localDirs.map(async item => {
            let info = await this.loadMangaInfoByPath(item.path)
            return info && { id: item.name, ...info }
        })).then(entries => entries.filter(item => item) as LocalMangaInfo[])

        ret = ret.filter(item => item) as LocalMangaInfo[]
        return ret.map(item => ({
            id: item.id,
            title: item.title,
            coverSource: { uri: `file://${item.cover}` }
        }))
    }

    async addFavorite(entries: MangaMeta[]) {
        return entries
    }

    async removeFavorite(entries: MangaMeta[]) {
        return entries
    }

    async getManga(meta: MangaMeta) {
        let info = await this.loadMangaInfoByPath(`${this.rootPath}/${meta.id}`) as LocalMangaInfo
        return {
            meta: meta,
            chapters: info.chapters.map(item => ({
                mangaNo: meta.id,
                chapterNo: item.id,
                title: item.title
            }))
        }
    }

    async search(_queryStr: string) {
        return new LocalSearchResultFeeder
    }

    async getChapterFeeder(meta: ChapterMeta) {
        let info = await this.loadMangaInfoByPath(`${this.rootPath}/${meta.mangaNo}`) as LocalMangaInfo
        let idx = info.chapters.findIndex(item => item.id == meta.chapterNo)
        return new LocalChapterFeeder(info, idx)
    }
}