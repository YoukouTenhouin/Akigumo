/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react'
import { createStore } from 'redux'
import { persistStore } from 'redux-persist'
import { Provider, connect, ConnectedProps } from 'react-redux'

import { ThemeContext, Default, Dark } from 'src/Theme'
import { PersistGate } from 'redux-persist/integration/react'
import mainReducer from 'src/state/reducers'
import { StatusBar } from 'react-native'
import NavWrapper from 'src/components/MainNavigator'
import { MainStates } from 'src/state/types'
import AsyncStorage from '@react-native-community/async-storage'

const store = createStore(mainReducer)
const persistor = persistStore(store)

const themedContainerMapState = (state: MainStates) => ({
  theme: state.themeState
})

const themedContainerConnector = connect(
  themedContainerMapState
)

type ThemedContainerProps = ConnectedProps<typeof themedContainerConnector>;

const ThemedContainer = themedContainerConnector((props: ThemedContainerProps) => {
  let theme = props.theme == "default" ? Default : Dark

  return (
    <ThemeContext.Provider value={theme}>
      <StatusBar backgroundColor={theme.primary.light} barStyle="light-content" />
      <NavWrapper />
    </ThemeContext.Provider>
  )
})

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemedContainer />
      </PersistGate>
    </Provider>
  )
}

export default App