import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'

import { SearchViewActions, MangaInfoViewActions, APIActions, ReadViewActions } from 'src/state/actions'
import { SearchViewStates, MangaInfoViewStates, ReadViewStates, APIStates } from 'src/state/types';
import ManhuaguiAPI from 'src/sources/Manhuagui';
import ManhuaduiAPI from 'src/sources/Manhuadui';
import AsyncStorage from '@react-native-community/async-storage';
import autoMergeLevel1 from 'redux-persist/es/stateReconciler/autoMergeLevel1';
import hardSet from 'redux-persist/es/stateReconciler/hardSet';

function SearchViewReducer(state: SearchViewStates | undefined, actions: SearchViewActions) {
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

function MangaInfoViewReducer(state: MangaInfoViewStates | undefined, actions: MangaInfoViewActions) {
    switch (actions.type) {
        case "mangainfoview_clear":
            return {}
        case "mangainfoview_setinfo":
            return { info: actions.info }
    }
    return state || {}
}

function ReadViewReducer(state: ReadViewStates | undefined, actions: ReadViewActions) {
    if (!state)
        state = {
            pageIndex: 0,
            overlayVisible: false,
            leftHand: false
        }
    switch (actions.type) {
        case "readview_clear":
            return {
                pageIndex: 0,
                overlayVisible: false,
                leftHand: false
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
    }
    return state
}

function APIReducer(state: APIStates | undefined, actions: APIActions) {
    if (!state)
        state = {
            interfaces: {
                manhuagui: new ManhuaguiAPI,
                manhuadui: new ManhuaduiAPI
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
    
    let currentStorage
    switch (actions.type) {
        case "api_setcurrent":
            return {
                ...state,
                current: actions.current
            }
        case "api_storage_addfavorite":
            state = {
                ...state,
                storages: {
                    ...state.storages
                }
            }
            let currentStorage = state.storages[state.current]
            if (currentStorage.favorites.find(item => item.id == actions.meta.id) != undefined)
                return state
            currentStorage.favorites = currentStorage.favorites.concat([actions.meta])
            return state
        case "api_storage_removefavorite":
            state = {
                ...state,
                storages: {
                    ...state.storages
                }
            }
            currentStorage = state.storages[state.current]
            currentStorage.favorites = currentStorage.favorites.filter(item => item.id != actions.meta.id)
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

const APIPersistConfig = {
    key: 'akigumov2_api',
    storage: AsyncStorage,
    blacklist: ['interfaces']
}

const mainReducer = combineReducers({
    api: persistReducer(APIPersistConfig, APIReducer),
    mangaInfoViewStates: MangaInfoViewReducer,
    searchViewStates: SearchViewReducer,
    readViewStates: ReadViewReducer
})

const persistConfig = {
    key: 'akigumov2',
    storage: AsyncStorage,
    whitelist: []
}

export default persistReducer(persistConfig, mainReducer);