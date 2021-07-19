# chatter-app

A react native chat app created using expo

## Features
* Custom Chat Name
* Four Background Colors
* Send Pictures from library or Camera
* Send GPS location
* View Messages Offline

## Dependencies
* @react-native-community/masked-view: 0.1.10
* @react-native-community/netinfo: 6.0.0
* @react-navigation/native: ^5.9.4
* @react-navigation/stack: ^5.14.5
* expo: ~41.0.1
* expo-image-picker: ~10.1.4
* expo-location: ~12.0.4
* expo-status-bar: ~1.0.4
* firebase: ^8.6.8
* react: 16.13.1
* react-dom: 16.13.1
* react-native: https://github.com/expo/react-native/archive/sdk41.0.0.tar.gz
* react-native-gesture-handler: ~1.10.2
* react-native-gifted-chat: ^0.16.3
* react-native-maps: 0.27.1
* react-native-reanimated: ~2.1.0
* react-native-safe-area-context: 3.2.0
* react-native-screens: ~3.0.0
* react-native-web: ^0.17.1
* react-navigation: ^4.4.4
* uuidv4: ^6.2.10

## Setup
* Verify Node is installed by typing ```node -v``` in your terminal.  
This should print the version number so you’ll see something like this ```v12.18.1```
  * If the command is unrecognized, download and install node from [nodjs.org](https://nodejs.org/en/download/)
* Install Expo Command Line  
```npm install expo-cli --global```
* Install the Expo app through your device's app store ([iOS](https://apps.apple.com/us/app/expo-go/id982107779) or [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en_US&gl=US))
  * Expo account Required [Expo.io](https://expo.io/)

### Compatible Emulators
* [Android Studio](https://developer.android.com/studio)
* [iOS Simulator](https://developer.apple.com/library/archive/documentation/IDEs/Conceptual/iOS_Simulator_Guide/GettingStartedwithiOSSimulator/GettingStartedwithiOSSimulator.html) (only available on mac)

## To Install Clone

Open the terminal in the project folder and run  
```npm install```

At this time (July 1, 2021) manual update to the LightboxOverlay.js file found in node_modules is required to prevent warnings. Please make the edits found at [oblador/react-native-lightbox@c80caf0](https://github.com/oblador/react-native-lightbox/commit/c80caf0f97eeb5cccb8363d3dfe0a6d62bbcfef9).
