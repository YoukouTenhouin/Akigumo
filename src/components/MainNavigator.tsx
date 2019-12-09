import { createStackNavigator } from "react-navigation-stack"
import { BackHandler, TouchableOpacity } from "react-native"
import React, { useEffect } from "react"

import SearchView from "./SearchView"
import MangaInfoView from "./MangaInfoView"
import { Default } from "src/Theme"
import FavoritesView from "./FavoritesView"
import Icon from 'react-native-vector-icons/MaterialIcons'
import ReadView from "./ReadView"
import SettingsView from "./SettingsView"

function useBackHandler(handler: () => void) {
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handler)

        return () => {
            BackHandler.removeEventListener(
                "hardwareBackPress",
                handler
            )
        }
    })
}

interface ScreenProps {
    navigation: any
}

function SearchViewScreen(props: ScreenProps) {
    return <SearchView toMangaInfoView={() => props.navigation.push("MangaInfoView")} />
}

SearchViewScreen.navigationOptions = {
    title: "Search"
}

function FavoritesViewScreen(props: ScreenProps) {
    return (
        <FavoritesView
            toMangaInfoView={() => props.navigation.push("MangaInfoView")}
            toSearch={() => props.navigation.push("SearchView")} />
    )
}

FavoritesViewScreen.navigationOptions = {
    title: "Favorites"
}

function SettingsViewScreen(props: ScreenProps) {
    return <SettingsView />
}

SettingsViewScreen.navigationOptions = {
    headerRight: null,
    title: "Settings"
}

function MangaInfoViewScreen(props: ScreenProps) {
    return (
        <MangaInfoView
            toReadView={() => props.navigation.push("ReadView")}
            setTitle={title => props.navigation.getParam('title', '') != title && props.navigation.setParams({ title: title })}
        />
    )
}

MangaInfoViewScreen.navigationOptions = (props: any) => ({
    title: `${props.navigation.getParam('title', '')}` 
})

function ReadViewScreen(props: ScreenProps) {
    return (
        <ReadView />
    )
}

ReadViewScreen.navigationOptions = {
    header: null
}

const MainNavigator = createStackNavigator({
    FavoriteView: { screen: FavoritesViewScreen },
    SearchView: { screen: SearchViewScreen },
    SettingsView: { screen: SettingsViewScreen },
    MangaInfoView: { screen: MangaInfoViewScreen },
    ReadView: { screen: ReadViewScreen }
}, {
    defaultNavigationOptions: (props: any) => ({
        headerTintColor: Default.primary.text.default,
        headerStyle: {
            backgroundColor: Default.primary.default
        },
        headerRight: () => (
            <TouchableOpacity onPress={() => props.navigation.push("SettingsView")}>
                <Icon
                    name="settings"
                    style={{
                        color: "white",
                        width: 30,
                        height: 30,
                        textAlign: "center",
                        textAlignVertical: "center",
                        fontSize: 24,
                        marginRight: 10
                    }}
                />
            </TouchableOpacity>
        )
    })
})

export default MainNavigator