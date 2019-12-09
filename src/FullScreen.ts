import { NativeModules } from 'react-native'

export default class FullScreen {
    static enable() {
        NativeModules.FullScreenImplementation.enable()
    }

    static enableWithStatus() {
        NativeModules.FullScreenImplementation.enableWithStatus()
    }

    static disable() {
        NativeModules.FullScreenImplementation.disable()
    }

    static set(fullScreen: boolean, statusVisible: boolean) {
        if (fullScreen)
            if (statusVisible)
                FullScreen.enableWithStatus()
            else
                FullScreen.enable()
        else
            FullScreen.disable()
    }
}