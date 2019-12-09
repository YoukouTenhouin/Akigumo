import React from 'react'
import { SectionList, Picker, StyleSheet, Text } from 'react-native'
import { MainStates } from 'src/state/types'
import { Actions } from 'src/state/actions'
import { connect, ConnectedProps, Connect } from 'react-redux'
import { ScrollView } from 'react-native-gesture-handler'

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
    const styles = StyleSheet.create({
        title: {
            fontSize: 24,
            fontWeight: "bold"
        }
    })

    return (
        <ScrollView>
            <Text style={styles.title}>Sources</Text>
            <Picker
                selectedValue={props.currentAPI}
                onValueChange={props.dispatchAPISetCurrent}
            >
                <Picker.Item label="manhuagui.com" value="manhuagui" />
                <Picker.Item label="manhuadui.com" value="manhuadui" />
            </Picker>
        </ScrollView>
    )
}

export default connector(SettingsView)