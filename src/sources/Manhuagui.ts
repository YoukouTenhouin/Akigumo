import { constructChapterInfo } from './ManhuaguiObfs'
import { ChapterFeeder, PageInfo, ChapterInfo, ChapterMeta, SearchResultFeeder, MangaMeta, MangaInfo, MangaAPI } from '../MangaAPI'
import HTMLParser from 'fast-html-parser'

const userAgent = "Mozilla/5.0 (X11; Linux x86_64; rv:70.0) Gecko/20100101 Firefox/70.0"

type ChapterData = {
    mangaName: string
    chapterName: string
    md5: string
    path: string
    files: string[]
}

function parseMangaHTML(mangaNo: string, html: string) {
    let root = HTMLParser.parse(html)
    let title = root.querySelector('.book-title').querySelector('h1').text
    let cover = root.querySelector('.hcover').querySelector('img').attributes['src']
    let sectionsHTML = root.querySelectorAll('.chapter-list')
    const hrefRE = /\/(\d+)\/(\d+)\.html/
    let sections = sectionsHTML.map((dom) => {
        let chapters = dom.querySelectorAll('a')
        return chapters.map((dom): ChapterMeta | undefined => {
            let match = hrefRE.exec(dom.attributes['href'])
            if (!match) return
            return { title: dom.attributes['title'], mangaNo: match[1], chapterNo: match[2] }
        })
    })

    let coverSource = {
        uri: cover,
        headers: {
            'User-Agent': userAgent,
            'Referer': `https://www.manhuagui.com/comic/${mangaNo}/`
        }
    }

    return {
        meta: {
            title: title,
            coverSource: coverSource,
            id: mangaNo
        },
        chapters: Array<ChapterMeta>().concat.apply([], sections.filter((v) => { return v != undefined }) as ChapterMeta[][])
    }
}

interface searchParseResult {
    totalCount: number
    results: MangaMeta[]
}

function parseSearchHTML(html: string) {
    let root = HTMLParser.parse(html)
    let resultCount = parseInt(root.querySelectorAll('.result-count strong')[1].text)
    let resultElements = root.querySelectorAll('.book-result .cf .book-cover a')
    let results = resultElements.map((e) => {
        let idMatch = /(\d+)/.exec(e.attributes['href'])
        if (!idMatch)
            return

        let coverUri = e.querySelector('img').attributes['src']
        let title = e.attributes['title']

        let coverSource = {
            uri: coverUri,
            headers: {
                'User-Agent': userAgent
            }
        }

        return { title: title, coverSource: coverSource, id: idMatch[1] }
    })
    return { totalCount: resultCount, results: results.filter(item => item != undefined) as MangaMeta[] }
}

class ManhuaguiChapterFeeder implements ChapterFeeder {
    nextChapter?: string
    prevChapter?: string

    constructor(private mangaNo: string, private currentChapter: string) { }

    fetchChapterInfo(mangaNo: string, chapterNo: string, callback: (data: ChapterData) => void) {
        console.info(`fetching https://www.manhuagui.com/comic/${mangaNo}/${chapterNo}.html`)
        fetch(`https://www.manhuagui.com/comic/${mangaNo}/${chapterNo}.html`, { headers: { 'User-Agent': userAgent } })
            .then((res) => res.text().then(
                (text) => {
                    let jsonStr: string = constructChapterInfo(text)
                    let jsonData = JSON.parse(jsonStr.substr(12, jsonStr.length - 24))

                    console.log(jsonData)

                    let nextId: number = jsonData['nextId']
                    let prevId: number = jsonData['prevId']

                    let md5: string = jsonData['sl']['md5']
                    let path: string = jsonData['path']
                    let files: string[] = jsonData['files']
                    let mangaName: string = jsonData['bname']
                    let chapterName: string = jsonData['cname']

                    this.nextChapter = nextId == 0 ? undefined : nextId.toString()
                    this.prevChapter = prevId == 0 ? undefined : prevId.toString()

                    callback({ md5: md5, path: path, files: files, mangaName: mangaName, chapterName: chapterName })
                }))
    }

    current(callback: (chapterInfo?: ChapterInfo) => void) {
        this.prevChapter = undefined
        this.nextChapter = undefined

        this.fetchChapterInfo(this.mangaNo, this.currentChapter, (data) => {
            let pageInfos: PageInfo[] = data.files.map((file) => {
                return {
                    source: {
                        uri: `https://i.hamreus.com${data.path}${file}?cid=${this.currentChapter}&md5=${data.md5}`,
                        headers: {
                            'Referer': `https://www.manhuagui.com/comic/${this.mangaNo}/${this.currentChapter}`,
                            'User-Agent': userAgent
                        }
                    }
                }
            })
            callback({
                meta: { title: data.chapterName, chapterNo: this.currentChapter, mangaNo: this.mangaNo },
                pages: pageInfos
            })
        })
    }

    prev(callback: (chapterInfo?: ChapterInfo) => void) {
        console.log(this.prevChapter)
        if (!this.prevChapter) return callback()
        this.currentChapter = this.prevChapter
        this.current(callback)
    }

    next(callback: (chapterInfo?: ChapterInfo) => void) {
        if (!this.nextChapter) return callback()
        this.currentChapter = this.nextChapter
        this.current(callback)
    }
}

class ManhuaguiSearchResultFeeder implements SearchResultFeeder {
    currentPage: number
    totalResults: number

    constructor(private queryStr: string) {
        this.currentPage = 0
        this.totalResults = 0
    }

    fetch(page: number, callback: (result?: searchParseResult) => void) {
        if (this.totalResults != 0 && (page - 1) * 10 > this.totalResults)
            return callback()

        fetch(`https://www.manhuagui.com/s/${this.queryStr}_p${page}.html`, {
            headers: {
                'User-Agent': userAgent
            }
        }).then(res => res.text().then(html => callback(parseSearchHTML(html))))
    }

    more(callback: (result: MangaMeta[]) => void) {
        if (this.currentPage != 0 && this.currentPage * 10 > this.totalResults)
            return callback([])

        this.currentPage += 1
        this.fetch(this.currentPage, result => {
            if (!result)
                return callback([])

            this.totalResults = result.totalCount
            callback(result.results)
        })
    }
}

export default class ManhuaguiAPI implements MangaAPI {
    name: string = "manhuagui"

    getManga(meta: MangaMeta, callback: (info: MangaInfo) => void) {
        fetch(`https://www.manhuagui.com/comic/${meta.id}/`, {
            headers: {
                'User-Agent': userAgent
            }
        }).then((res) => res.text().then((text) => (callback(parseMangaHTML(meta.id, text)))))
    }

    search(str: string, callback: (feeder: SearchResultFeeder) => void) {
        callback(new ManhuaguiSearchResultFeeder(str))
    }

    getChapterFeeder(chapter: ChapterMeta, callback: (feeder: ChapterFeeder) => void) {
        callback(new ManhuaguiChapterFeeder(chapter.mangaNo, chapter.chapterNo))
    }
}