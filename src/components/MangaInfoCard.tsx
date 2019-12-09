import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import FastImage from 'react-native-fast-image'
import Icon from 'react-native-vector-icons/MaterialIcons'

import { ThemeContext } from 'src/Theme'

interface MangaInfoCardProps {
    coverSource: any
    title: string
    isFavorite?: boolean
    onPress?: () => void
    onPressCover?: () => void
    onPressFavorite?: () => void
}

const styles = StyleSheet.create({
    container: {
        height: 180,
        flex: 1,
        flexDirection: 'row',
        margin: 5,
        padding: 10,
        backgroundColor: 'white',
        elevation: 1
    },
    titleContainer: {
        flexGrow: 1,
        flexDirection: "row",
        padding: 10
    },
    title: {
        flex: 1,
        textAlign: "center",
        fontWeight: "bold"
    },
    favoriteButtonContainer: {
        position: "absolute",
        right: 20,
        bottom: 20
    },
    favoriteButton: {
        fontSize: 30
    }
})

interface FavoriteButtonProps {
    isFavorite: boolean
    style?: any
    onPress: () => void
}

function FavoriteButton(props: FavoriteButtonProps) {
    let name = props.isFavorite ? "favorite" : "favorite-border"

    return (
        <ThemeContext.Consumer>
            {theme => (
                <TouchableOpacity onPress={props.onPress}>
                    <Icon
                        name={name}
                        style={{
                            ...styles.favoriteButton,
                            color: theme.primary.dark,
                            ...props.style
                        }}
                    />
                </TouchableOpacity>
            )}
        </ThemeContext.Consumer>
    )
}

export default function MangaInfoCard(props: MangaInfoCardProps) {
    let favoriteButton = (props.isFavorite != undefined && props.onPressFavorite) && (
        <FavoriteButton isFavorite={props.isFavorite} onPress={props.onPressFavorite} />
    )

    return (
        <TouchableOpacity
            disabled={!props.onPress}
            onPress={props.onPress}
        >
            <View style={styles.container}>
                <TouchableOpacity
                    disabled={!props.onPressCover}
                    onPress={props.onPressCover}
                >
                    <View style={{ height: 160, width: 120, }}>
                        <FastImage
                            source={props.coverSource}
                            resizeMode="contain"
                            style={{ height: '100%' }}
                        />
                    </View>
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text
                        style={styles.title}
                        numberOfLines={1}
                    >
                        {props.title}
                    </Text>
                </View>
                <View style={styles.favoriteButtonContainer}>
                    {favoriteButton || null}
                </View>
            </View>
        </TouchableOpacity>
    )
}