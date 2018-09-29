# 72 Film Fest App

The official app of the Frederick, Maryland 72 Film Fest.

## Prerequisites

- Android Studio
- X Code 10
- NodeJS
- ionic

## Build instructions

To get started and view the app in the browser run the following:

```bash
ionic serve
```

To run the app on Android, you have to switch to the `android` branch and use ionic to deploy

```bash
ionic cordova run android
```

Due to customization's to the iOS X Code project, you must deploy the iOS version through X Code:

```bash
ionic cordova prepare ios
open platforms/ios/72\ Film\ Fest.xcworkspace
```

## iOS notes

- you must install [cocopods](https://cocoapods.org) for the push plugin
  - run `sudo gem install cocopods` to install it on your system
  - next run `pod setup` to sync the pods

## Android notes

- The bundle id for Android had to change because we cannot start a name with a number. For this reason the android build must be performed on the `android`
- follow the instructions from [phonegap-plugin-push](https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/INSTALLATION.md) for configuring GCM
  - download the `google-services.json` from the [Firebase Console](https://console.firebase.google.com/project/seventytwofest/settings/general/android:com.lonnygomes.seventytwoFest)

## References

- [Google Play Console](https://developer.android.com/distribute/console/)
