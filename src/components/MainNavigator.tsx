import { createStackNavigator, Header } from "react-navigation-stack"
import { BackHandler, TouchableOpacity, StyleSheet, View } from "react-native"
import React, { useEffect } from "react"

import SearchView from "./SearchView"
import MangaInfoView from "./MangaInfoView"
import { Default, ThemeContext } from "src/Theme"
import FavoritesView from "./FavoritesView"
import Icon from 'react-native-vector-icons/MaterialIcons'
import ReadView from "./ReadView"
import SettingsView from "./SettingsView"
import { createAppContainer } from "react-navigation"
import { MainStates } from "src/state/types"
import Actions from "src/state/actions"
import { connect, ConnectedProps, ReactReduxContext } from "react-redux"

const BackgroundWrapper = (props: { children: any, style?: any }) => (
    <ThemeContext.Consumer>
        {theme => (
            <View style={{
                flex: 1,
                backgroundColor: theme.background.color,
                ...styles
            }}>
                {props.children}
            </View>
        )}
    </ThemeContext.Consumer>
)

interface ScreenProps {
    navigation: any
}

function SearchViewScreen(props: ScreenProps) {
    return (
        <BackgroundWrapper>
            <SearchView toMangaInfoView={() => props.navigation.push("MangaInfoView")} />
        </BackgroundWrapper>
    )
}

SearchViewScreen.navigationOptions = {
    title: "Search"
}

function FavoritesViewScreen(props: ScreenProps) {
    return (
        <BackgroundWrapper>
            <FavoritesView
                toMangaInfoView={() => props.navigation.push("MangaInfoView")}
                toSearch={() => props.navigation.push("SearchView")} />
        </BackgroundWrapper>
    )
}

FavoritesViewScreen.navigationOptions = {
    title: "Favorites"
}

function SettingsViewScreen(props: ScreenProps) {
    return <BackgroundWrapper><SettingsView /></BackgroundWrapper>
}

SettingsViewScreen.navigationOptions = {
    headerRight: null,
    title: "Settings"
}

function MangaInfoViewScreen(props: ScreenProps) {
    return (
        <BackgroundWrapper>
            <MangaInfoView
                toReadView={() => props.navigation.push("ReadView")}
                setTitle={title => props.navigation.getParam('title', '') != title && props.navigation.setParams({ title: title })}
            />
        </BackgroundWrapper>
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

const styles = StyleSheet.create({
    headerButton: {
        color: "white",
        width: 30,
        height: 30,
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 24,
        marginRight: 10
    }
})

const navWraperMapState = (state: MainStates) => ({
    darkMode: state.themeState == "dark",
})

const navWrapperMapDispatch = {
    toggleDarkMode: (): Actions => ({ type: "theme_toggledark" }),
}

const navWrapperConnector = connect(
    navWraperMapState,
    navWrapperMapDispatch
)

type navWrapperProps = ConnectedProps<typeof navWrapperConnector>

const HeaderButtons = (props: {
    darkMode: boolean
    onToggleDark: () => void
    onOpenSettings: () => void
}) => {
    return (
        <View style={{ flexDirection: "row" }}>
            <TouchableOpacity onPress={props.onToggleDark}>
                <Icon
                    name={props.darkMode ? "brightness-7" : "brightness-4"}
                    style={styles.headerButton} />
            </TouchableOpacity>
            <TouchableOpacity onPress={props.onOpenSettings}>
                <Icon
                    name="settings"
                    style={styles.headerButton}
                />
            </TouchableOpacity>
        </View>
    )
}

function NavWrapper(props: navWrapperProps) {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <ReactReduxContext.Consumer>
                    {store => {
                        const MainNavigator = createStackNavigator({
                            FavoriteView: { screen: FavoritesViewScreen },
                            SearchView: { screen: SearchViewScreen },
                            SettingsView: { screen: SettingsViewScreen },
                            MangaInfoView: { screen: MangaInfoViewScreen },
                            ReadView: { screen: ReadViewScreen }
                        }, {
                            defaultNavigationOptions: (navProps: any) => ({
                                headerTintColor: theme.primary.text.default,
                                headerStyle: {
                                    backgroundColor: theme.primary.default
                                },
                                headerRight: () => (
                                    <HeaderButtons
                                        darkMode={props.darkMode}
                                        onToggleDark={props.toggleDarkMode}
                                        onOpenSettings={() => navProps.navigation.push('SettingsView')} />
                                )
                            })
                        })

                        const AppContainer = createAppContainer(MainNavigator)

                        /* passing in navigationState will cause MainNavigation to be re-rendered every time navigationState is change,
                         * so we access store explicitly here to avoid flickering */

                        return <AppContainer
                            persistNavigationState={state => {
                                store.store.dispatch<Actions>({ type: "navigation_setstate", state: state })
                                return new Promise<any>(resolve => resolve())
                            }}
                            loadNavigationState={() => new Promise<any>((resolve, reject) => (
                                store.store.getState().navigationState ? resolve(store.store.getState().navigationState) : reject())
                            )} />
                    }}
                </ReactReduxContext.Consumer>
            )}
        </ThemeContext.Consumer>
    )
}

export default navWrapperConnector(NavWrapper)