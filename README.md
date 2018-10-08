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
- [Adding customg fonts to Apple Watch](https://www.tech-recipes.com/rx/53710/how-do-i-use-custom-fonts-in-my-apple-watch-app/)
- you must properly name the app identifiers [Naming of WatchKit app identifiers](https://stackoverflow.com/questions/30203079/watchkit-extension-bundle-identifiers)
- you must build with [bitcode](https://stackoverflow.com/questions/31088618/impact-of-xcode-build-options-enable-bitcode-yes-no/31207170) as the watch kit extention requiers ist

## Android notes

- The bundle id for Android had to change because we cannot start a name with a number. For this reason the android build must be performed on the `android`
- follow the instructions from [phonegap-plugin-push](https://github.com/phonegap/phonegap-plugin-push/blob/master/docs/INSTALLATION.md) for configuring GCM
  - download the `google-services.json` from the [Firebase Console](https://console.firebase.google.com/project/seventytwofest/settings/general/android:com.lonnygomes.seventytwoFest)
- instructions on deploying can be found [here](https://ionicframework.com/docs/v1/guide/publishing.html)
- adhering to Play store's privacy policy can be found [here](https://medium.com/@swarooptvm/how-to-fix-advertising-id-policy-violation-in-google-play-store-6d9cf92d335d)

## References

- [Google Play Console](https://developer.android.com/distribute/console/)
- [Apple Programming Guide for watchOS](https://developer.apple.com/library/archive/documentation/General/Conceptual/WatchKitProgrammingGuide/index.html#//apple_ref/doc/uid/TP40014969-CH8-SW1)
- [Privacy Generator](https://app-privacy-policy-generator.firebaseapp.com)
