import React from 'react'

import { Default } from 'src/themes.json'

export interface Theme {
    primary: {
        normal: string
        dark: string
        light: string
    },
    secondary: {
        normal: string
        dark: string
        light: string
    }
}

const ThemeContext = React.createContext(Default)

export { ThemeContext, Default }