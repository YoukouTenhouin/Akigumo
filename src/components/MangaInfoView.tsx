import React from 'react'
import { ScrollView, StyleSheet, View, FlatList, TouchableOpacity, Text, SafeAreaView } from 'react-native'

import { MainStates } from 'src/state/types'
import { connect, ConnectedProps } from 'react-redux'
import { ThemeContext } from 'src/Theme'
import { MangaMeta, ChapterFeeder, ChapterInfo, ChapterMeta } from 'src/MangaAPI'
import MangaInfoCard from './MangaInfoCard'
import Actions from 'src/state/actions'

const mapState = (state: MainStates) => ({
    info: state.mangaInfoViewStates.info,
    api: state.api.interfaces[state.api.current],
    favorites: state.api.storages[state.api.current].favorites,
    histories: state.api.storages[state.api.current].histories
})

const mapDispatch = {
    dispatchSetFavorite: (entries: MangaMeta[]): Actions => ({ type: "api_storage_setfavorite", entries: entries }),
    dispatchReadViewClear: (): Actions => ({ type: "readview_clear" }),
    dispatchSetPage: (page: number): Actions => ({ type: "readview_setpage", page: page }),
    dispatchFeederReady: (feeder: ChapterFeeder): Actions => ({ type: "readview_feederready", feeder: feeder }),
    dispatchChapterReady: (chapter: ChapterInfo): Actions => ({ type: "readview_chapterready", chapter: chapter })
}

const connector = connect(
    mapState,
    mapDispatch
)

const styles = StyleSheet.create({
    chapterRow: {
        justifyContent: 'space-between'
    },
    chapterEntry: {
        height: 40,
        margin: 10,
        flex: 1
    },
    chapterEntryText: {
        textAlign: "center",
        textAlignVertical: "center",
        width: "100%",
        height: "100%"
    }
})

type PropsFromRedux = ConnectedProps<typeof connector>
type MangaInfoViewProps = PropsFromRedux & {
    setTitle: (title: string) => void
    toReadView: () => void
}

function MangaInfoView(props: MangaInfoViewProps) {
    const onLoadMange = (meta: ChapterMeta, page: number) => {
        props.dispatchReadViewClear()
        props.dispatchSetPage(page)
        props.toReadView()
        props.api.getChapterFeeder(meta, feeder => {
            props.dispatchFeederReady(feeder)
            feeder.current(chapter => chapter && props.dispatchChapterReady(chapter))
        })
    }

    props.info && props.setTitle(props.info.meta.title)

    return (
        <ThemeContext.Consumer>
            {theme => {
                if (!props.info)
                    return null

                console.log(props.info.meta)

                let hasHistory = !!props.histories[props.info.meta.id]
                let hasFavorite = props.favorites.find(item => props.info && item.id == props.info.meta.id) != undefined

                let history = hasHistory && props.histories[props.info.meta.id]

                let onPressFavorite
                if (hasFavorite)
                    onPressFavorite = async () => props.dispatchSetFavorite(await props.api.removeFavorite(props.favorites,
                        (props.info && props.info.meta) as MangaMeta))

                else
                    onPressFavorite = async () => props.dispatchSetFavorite(await props.api.addFavorite(props.favorites,
                        (props.info && props.info.meta) as MangaMeta))

                return (
                    <ScrollView>
                        <View>
                            <View style={{ flex: 1, flexDirection: "column" }}>
                                <View style={{ flex: 1 }}>
                                    <MangaInfoCard
                                        isFavorite={hasFavorite}
                                        onPressCover={hasHistory ? () => onLoadMange(history.chapter, history.page) : undefined}
                                        onPressFavorite={onPressFavorite}
                                        coverSource={props.info.meta.coverSource}
                                        title={props.info.meta.title} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        scrollEnabled={false}
                                        data={props.info.chapters}
                                        numColumns={2}
                                        columnWrapperStyle={styles.chapterRow}
                                        renderItem={({ item }) => (
                                            <View style={{
                                                ...styles.chapterEntry,
                                                backgroundColor: theme.secondary.default
                                            }}>
                                                <TouchableOpacity onPress={() => onLoadMange(item, 0)}>
                                                    <Text style={{
                                                        ...styles.chapterEntryText,
                                                        color: theme.secondary.text.default
                                                    }}>{item.title}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                        keyExtractor={item => item.chapterNo} />
                                </View>
                            </View>
                        </View>
                    </ScrollView>)
            }}
        </ThemeContext.Consumer>
    )
}

export default connector(MangaInfoView)