#! /bin/bash
#build

rm -rf www
rm -rf resources/android
rm -rf android

ionic build --prod
ionic capacitor add android
npm run resources:android
# ionic capacitor open android

read -p "You should follow the instructions blew : y(yes) or n(no) ?" answer

read -p "Do you want to open Android Studio : y(yes) or n(no) ?" answer
if [[ "$answer" == 'y' || "$answer" == 'yes' ]];then
    ionic capacitor open android
fi

# instructions
# create file local.properties in the folder android
# put 'sdk.dir=D\:\\android\\Sdk' in the file

# in android/app/src/main/AndroidManifest.xml
# <uses-permission android:name="android.permission.CAMERA" />
# <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
# <uses-permission android:name="android.permission.RECORD_VIDEO"/>
# <uses-permission android:name="android.permission.RECORD_AUDIO"/>