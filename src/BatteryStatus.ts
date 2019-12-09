import { NativeModules } from 'react-native'

export default class BatteryStatus {
    static getPlugged(): Promise<boolean> {
        return NativeModules.BatteryStatus.getPlugged()
    }

    static getIntLevel(): Promise<number> {
        return NativeModules.BatteryStatus.getIntLevel()
    }
}