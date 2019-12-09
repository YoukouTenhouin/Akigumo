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
import { persistStore, persistReducer } from 'redux-persist'
import { Provider } from 'react-redux'
import { createAppContainer } from 'react-navigation'
import AsyncStorage from '@react-native-community/async-storage'

import MainNavigator from 'src/components/MainNavigator'
import { ThemeContext, Default } from 'src/Theme'
import { PersistGate } from 'redux-persist/integration/react'
import mainReducer from 'src/state/reducers'

const store = createStore(mainReducer)
const persistor = persistStore(store)

const AppContainer = createAppContainer(MainNavigator)

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <ThemeContext.Provider value={Default}>
        <AppContainer />
      </ThemeContext.Provider>
      </PersistGate>
    </Provider>
  )
}

export default App