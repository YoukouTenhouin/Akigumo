import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'

import Actions from 'src/state/actions'
import { SearchViewStates, MangaInfoViewStates, ReadViewStates, APIStates } from 'src/state/types';
import ManhuaguiAPI from 'src/sources/Manhuagui';
import ManhuaduiAPI from 'src/sources/Manhuadui';
import AsyncStorage from '@react-native-community/async-storage';

function SearchViewReducer(state: SearchViewStates | undefined, actions: Actions) {
    if (!state)
        state = {
            results: []
        }
    switch (actions.type) {
        case "searchview_clear":
            state = { results: [] }
            return { results: [] }
        case "searchview_onsearch":
            state = { results: [] }
            return state
        case "searchview_onfeederready":
            state = {
                ...state,
                feeder: actions.feeder
            }
            return state
        case "searchview_onfeederfailed":
            return state
        case "searchview_onmorereceived":
            state = {
                ...state,
                results: state.results.concat(actions.entries)
            }
            return state
    }
    return state
}

function MangaInfoViewReducer(state: MangaInfoViewStates | undefined, actions: Actions) {
    switch (actions.type) {
        case "mangainfoview_clear":
            return {}
        case "mangainfoview_setinfo":
            return { info: actions.info }
    }
    return state || {}
}

function ReadViewReducer(state: ReadViewStates | undefined, actions: Actions) {
    if (!state)
        state = {
            pageIndex: 0,
            overlayVisible: false,
            leftHand: false,
            doublePage: false
        }
    switch (actions.type) {
        case "readview_clear":
            return {
                pageIndex: 0,
                overlayVisible: false,
                leftHand: false,
                doublePage: false
            }
        case "readview_feederready":
            return {
                ...state,
                feeder: actions.feeder
            }
        case "readview_chapterready":
            return {
                ...state,
                chapter: actions.chapter
            }
        case "readview_setpage":
            return {
                ...state,
                pageIndex: actions.page
            }
        case "readview_toggleoverlay":
            return {
                ...state,
                overlayVisible: !state.overlayVisible
            }
        case "readview_togglehand":
            return {
                ...state,
                leftHand: !state.leftHand
            }
        case "readview_toggledoublepage":
            return {
                ...state,
                doublePage: !state.doublePage
            }
    }
    return state
}

function APIReducer(state: APIStates | undefined, actions: Actions) {
    if (!state) {
        let manhuagui = new ManhuaguiAPI
        let manhuadui = new ManhuaduiAPI

        state = {
            interfaces: {
                manhuagui: manhuagui,
                manhuadui: manhuadui,
            },
            storages: {
                manhuagui: {
                    favorites: [],
                    histories: {}
                },
                manhuadui: {
                    favorites: [],
                    histories: {}
                }
            },
            current: "manhuagui",
        }
    }

    let currentStorage
    switch (actions.type) {
        case "api_setcurrent":
            return {
                ...state,
                current: actions.current
            }
        case "api_storage_setfavorite":
            state = {
                ...state,
                storages: {
                    ...state.storages
                }
            }
            currentStorage = state.storages[state.current]
            currentStorage.favorites = actions.entries
            return state
        case "api_storage_sethistory":
            state = {
                ...state,
                storages: {
                    ...state.storages
                }
            }
            currentStorage = state.storages[state.current]
            currentStorage.histories = {
                ...currentStorage.histories,
            }
            currentStorage.histories[actions.chapter.mangaNo] = {
                chapter: actions.chapter,
                page: actions.page
            }
            return state
    }
    return state
}

function ThemeReducer(state: string | undefined, action: Actions) {
    if (!state)
        return "default"
    switch (action.type) {
        case "theme_toggledark":
            return state == "default" ? "dark" : "default"
    }
    return state
}

function NavigationReducer(state: any, action: Actions) {
    if (state === undefined)
        return null
    switch (action.type) {
        case "navigation_setstate":
            console.log('from action:', action.state)
            return action.state
    }
    return state
}

const APIPersistConfig = {
    key: 'akigumov2_api',
    storage: AsyncStorage,
    blacklist: ['interfaces']
}

const mainReducer = combineReducers({
    api: persistReducer(APIPersistConfig, APIReducer),
    mangaInfoViewStates: MangaInfoViewReducer,
    searchViewStates: SearchViewReducer,
    readViewStates: ReadViewReducer,
    themeState: ThemeReducer,
    navigationState: NavigationReducer
})

const persistConfig = {
    key: 'akigumov2',
    storage: AsyncStorage,
    blacklist: ["api"]
}

export default persistReducer(persistConfig, mainReducer);