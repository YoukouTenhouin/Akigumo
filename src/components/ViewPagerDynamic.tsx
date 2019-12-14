import React from 'react'
import { Text, View, StyleSheet, Animated } from 'react-native'

interface ViewPagerDynamicProps {
    onPrevThanFirst?: () => void
    onNextThanLast?: () => void
    onPrev?: () => void
    onNext?: () => void
    renderPage: (index: number) => any
    pagesOnScreen: number
    animateDuration: number
    initialPage?: number
    lastPage: number
    scrollEnabled?: boolean
    style?: any
}

interface ViewPagerDynamicStates {
    offset: Animated.Value
    page: number
    width?: number
    height?: number
}

export default class ViewPagerDynamic extends React.Component<ViewPagerDynamicProps, ViewPagerDynamicStates> {
    constructor(props: ViewPagerDynamicProps) {
        super(props)
        this.state = { offset: new Animated.Value(0), page: this.props.initialPage || 0 }
    }

    shouldComponentUpdate(nextProps: ViewPagerDynamicProps, nextState: ViewPagerDynamicStates) {
        console.log(nextState, this.state)
        if (nextState !== this.state)
            return true

        let expectedProps = {
            ...this.props,
            initialPage: this.state.page,
        }
        console.log(expectedProps, nextProps)

        type PropKeys = keyof ViewPagerDynamicProps;

        for (const key in expectedProps) {
            console.log(key)
            console.log(expectedProps[key as PropKeys] !== nextProps[key as PropKeys])
            if (expectedProps[key as PropKeys] !== nextProps[key as PropKeys])
                return true
        }

        return false
    }

    private async animateOffset(config: Animated.TimingAnimationConfig) {
        return new Promise<void>(resolve => {
            Animated.timing(this.state.offset, config)
                .start(() => resolve())
        })
    }

    async prev(animated = true) {
        if (this.state.page == 0)
            return this.props.onPrevThanFirst && this.props.onPrevThanFirst()
        if (animated && this.state.width)
            await this.animateOffset({
                toValue: -1,
                duration: this.props.animateDuration,
                useNativeDriver: true
            })
        this.setState({ page: this.state.page - 1 })
        this.state.offset.setValue(0)
        this.props.onPrev && this.props.onPrev()
    }

    async next(animated = true) {
        if (this.state.page == this.props.lastPage)
            return this.props.onNextThanLast && this.props.onNextThanLast()
        if (animated && this.state.width)
            await this.animateOffset({
                toValue: 1,
                duration: this.props.animateDuration,
                useNativeDriver: true
            })
        this.setState({ page: this.state.page + 1 })
        this.state.offset.setValue(0)
        this.props.onNext && this.props.onNext()
    }

    setPage(page: number) {
        this.setState({ page: page })
    }

    render() {
        const onLayout = (event: any) => {
            let newWidth = event.nativeEvent.layout.width
            let newHeight = event.nativeEvent.layout.height

            if (this.state.width != newWidth || this.state.height != newHeight)
                this.setState({ width: newWidth, height: newHeight })
        }

        if (!this.state.width || !this.state.height)
            return (
                <View
                    style={{
                        width: "100%",
                        height: "100%",
                        ...this.props.style
                    }}
                    onLayout={onLayout} />
            )

        let pageWidth = this.state.width / this.props.pagesOnScreen
        let pagesToRender = this.props.pagesOnScreen + 2

        console.log('width', pageWidth * pagesToRender)

        const styles = StyleSheet.create({
            wrapper: {
                width: "100%",
                height: "100%",
                ...this.props.style
            },
            container: {
                height: "100%",
                flexDirection: "row-reverse",
                width: pageWidth * pagesToRender
            },
            page: {
                flex: 1,
                width: pageWidth
            }
        })

        let pages = []

        for (let i = 0; i < pagesToRender; ++i) {
            let pageIdx = this.state.page + i - 1

            console.log(i, pageIdx)

            pages.push(
                <View
                    key={`${pagesToRender}-${pageIdx}`}
                    style={styles.page} >
                    {pageIdx >= 0 && pageIdx <= this.props.lastPage ? this.props.renderPage(pageIdx) : null}
                </View>
            )
        }

        return (
            <View
                style={styles.wrapper}
                onLayout={onLayout} >

                <Animated.View
                    style={{
                        ...styles.container,
                        transform: [
                            {
                                translateX: this.state.offset.interpolate({
                                    inputRange: [-1, 1],
                                    outputRange: [-pageWidth * 2, 0],
                                    extrapolate: "clamp"
                                })
                            }
                        ]
                    }}>
                    {pages}
                </Animated.View>

            </ View >
        )
    }
}