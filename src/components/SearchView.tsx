import React from 'react'
import { TextInput, FlatList, View } from 'react-native'
import { connect, ConnectedProps } from 'react-redux'

import MangaInfoCard from 'src/components/MangaInfoCard'
import { MangaMeta, SearchResultFeeder, MangaAPI, MangaInfo } from 'src/MangaAPI'
import { ThemeContext } from 'src/Theme'
import { MainStates } from 'src/state/types'

const mapState = (state: MainStates) => {
    let myState = state.searchViewStates
    return {
        results: myState.results,
        feeder: myState.feeder,
        api: state.api.interfaces[state.api.current]
    }
}

const mapDispatch = {
    dispatchSearch: () => ({ type: "searchview_onsearch" }),
    dispatchFeederReady: (feeder: SearchResultFeeder) => ({ type: "searchview_onfeederready", feeder: feeder }),
    dispatchMoreReceived: (entries: MangaMeta[]) => ({ type: "searchview_onmorereceived", entries: entries }),
    dispatchMangaInfoClear: () => ({ type: "mangainfoview_clear" }),
    dispatchMangaInfoSet: (info: MangaInfo) => ({ type: "mangainfoview_setinfo", info: info })
}

const connector = connect(
    mapState,
    mapDispatch
)

type PropsFromRedux = ConnectedProps<typeof connector>
type SearchViewProps = PropsFromRedux & {
    toMangaInfoView: () => void
}

function SearchView(props: SearchViewProps) {
    return (
        <ThemeContext.Consumer>
            {theme => (
                <View style={{ flex: 1, flexDirection: "column" }}>
                    <View style={{ flexGrow: 1, flexDirection: "column", padding: 10 }} key="search">
                        <View style={{ height: 50 }}>
                            <TextInput
                                style={{
                                    color: theme.background.text
                                }}
                                placeholder="Search"
                                placeholderTextColor={theme.background.text}
                                onSubmitEditing={ev => {
                                    props.dispatchSearch()
                                    props.api.search(ev.nativeEvent.text,
                                        feeder => {
                                            if (!feeder)
                                                return
                                            props.dispatchFeederReady(feeder)
                                            feeder.more(props.dispatchMoreReceived)
                                        })
                                }}
                                underlineColorAndroid={theme.primary.default}
                            />
                        </View>
                        <View style={{ flexGrow: 1 }}>
                            <FlatList
                                style={{ flex: 1 }}
                                data={props.results}
                                renderItem={item =>
                                    <MangaInfoCard
                                        coverSource={item.item.coverSource}
                                        title={item.item.title}
                                        onPress={() => {
                                            props.dispatchMangaInfoClear()
                                            props.api.getManga(item.item, props.dispatchMangaInfoSet)
                                            props.toMangaInfoView()
                                        }}
                                    />}
                                keyExtractor={item => item.id}
                                onEndReached={() => props.feeder && props.feeder.more(props.dispatchMoreReceived)}
                            />
                        </View>
                    </View>
                </View>
            )}
        </ThemeContext.Consumer>
    )
}

export default connector(SearchView)