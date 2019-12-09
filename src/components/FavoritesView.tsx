import React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { MainStates } from 'src/state/types'
import { MangaInfo } from 'src/MangaAPI'
import MangaInfoCard from './MangaInfoCard'
import { ThemeContext } from 'src/Theme'
import { Actions } from 'src/state/actions'

const mapState = (state: MainStates) => ({
    api: state.api.interfaces[state.api.current],
    entries: state.api.storages[state.api.current].favorites
})

const mapDispatch = {
    dispatchSearchViewClear: (): Actions => ({ type: "searchview_clear" }),
    dispatchMangaInfoClear: () => ({ type: "mangainfoview_clear" }),
    dispatchMangaInfoSetInfo: (info: MangaInfo) => ({ type: "mangainfoview_setinfo", info: info })
}

const connector = connect(
    mapState,
    mapDispatch
)

type PropsFromRedux = ConnectedProps<typeof connector>
type FavoritesViewProps = PropsFromRedux & {
    toMangaInfoView: () => void,
    toSearch: () => void
}

const styles = StyleSheet.create({
    searchButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        borderRadius: 50/2,
        elevation: 1
    },
    searchButtonText: {
        width: 50,
        height: 50,
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 24
    }
})

function SearchButton(props: { onPress: () => void }) {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <View style={{...styles.searchButton, backgroundColor: theme.primary.dark}}>
                    <TouchableOpacity onPress={props.onPress}>
                        <Icon
                            name="search"
                            style={styles.searchButtonText}
                            color={theme.secondary.text.default}
                        />
                    </TouchableOpacity>
                </View>
            )
            }
        </ThemeContext.Consumer >
    )
}

function FavoritesView(props: FavoritesViewProps) {
    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flexGrow: 1, padding: 10 }}>
                <FlatList
                    data={props.entries}
                    renderItem={({ item }) => {
                        return (<MangaInfoCard
                            coverSource={item.coverSource}
                            title={item.title}
                            onPress={() => {
                                props.dispatchMangaInfoClear()
                                props.api.getManga(item, props.dispatchMangaInfoSetInfo)
                                props.toMangaInfoView()
                            }}
                        />)
                    }}
                    keyExtractor={(item) => item.id}
                    style={{ flex: 1 }}
                />
            </View>
            <SearchButton onPress={() => { props.dispatchSearchViewClear(); props.toSearch() }} />
        </View >
    )
}

export default connector(FavoritesView)