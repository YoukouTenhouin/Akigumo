package com.akigumo;

import android.content.Intent;
import android.content.IntentFilter;
import android.os.BatteryManager;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class BatteryStatusImplementation extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;

    BatteryStatusImplementation(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "BatteryStatus";
    }

    private Intent getBatteryIntent() {
        IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        return reactContext.getApplicationContext().registerReceiver(null, ifilter);
    }

    @ReactMethod
    public void getPlugged(Promise promise) {
        int plugged = getBatteryIntent().getIntExtra(BatteryManager.EXTRA_PLUGGED, -1);
        if (plugged == -1) {
            promise.reject("E_SYSAPI");
            return;
        }
        promise.resolve(plugged != 0);
    }

    @ReactMethod
    public void getIntLevel(Promise promise) {
        int level = getBatteryIntent().getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
        int scale = getBatteryIntent().getIntExtra(BatteryManager.EXTRA_SCALE, -1);

        if (level == -1 || scale == -1) {
            promise.reject("E_SYSAPI");
            return;
        }
        promise.resolve(level * 100 / scale);
    }
}