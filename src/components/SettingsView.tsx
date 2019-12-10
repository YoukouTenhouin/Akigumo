import React from 'react'
import { SectionList, Picker, StyleSheet, Text } from 'react-native'
import { MainStates } from 'src/state/types'
import Actions from 'src/state/actions'
import { connect, ConnectedProps, Connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'
import { ThemeColors } from 'react-navigation'
import { ThemeContext } from 'src/Theme'

const mapState = (state: MainStates) => ({
    currentAPI: state.api.current
})

const mapDispatch = {
    dispatchAPISetCurrent: (api: string): Actions => ({ type: "api_setcurrent", current: api })
}

const connector = connect(
    mapState,
    mapDispatch
)

type PropsFromRedux = ConnectedProps<typeof connector>
type SettingsViewProps = PropsFromRedux

function SettingsView(props: SettingsViewProps) {
    return (
        <ThemeContext.Consumer>
            {theme => {
                const styles = StyleSheet.create({
                    wrapper: {
                        padding: 10
                    },
                    title: {
                        fontSize: 24,
                        color: theme.background.text,
                        fontWeight: "bold"
                    }
                })

                return (
                    <ScrollView style={styles.wrapper}>
                        <Text style={styles.title}>Sources</Text>
                        <Picker
                            itemStyle= {{ color: theme.background.text }}
                            selectedValue={props.currentAPI}
                            onValueChange={props.dispatchAPISetCurrent} >
                            <Picker.Item label="manhuagui.com" value="manhuagui" />
                            <Picker.Item label="manhuadui.com" value="manhuadui" />
                        </Picker>
                    </ScrollView>
                )
            }}
        </ThemeContext.Consumer>
    )
}

export default connector(SettingsView)