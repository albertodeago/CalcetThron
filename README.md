## CalcetThron

A simple PWA to try [Quasar framework](https://v1.quasar-framework.org)

The applicaiton basically stores and shows the table soccer games we play during coffee pauses in THRON.

You can access it from [here](https://darthron-6a632.firebaseapp.com)

This is a toy project and it's not intended to be used "professionally"

### Create your own instance

The application at the link provided in the [demo](https://darthron-6a632.firebaseapp.com) is bound to a firebase account. You can create a new instance of CalcetThron by doing this simple steps:
 - fork this repo
 - fill the firebase configuration file (`src/boot/firebase-sample.js`) with your own config provided by firebase
 - feel free to change app name and other stuff
 - follow the build steps below

### Build and Deploy

You need quasar-cli for building and firebase-tools for deploying (if you don't want to deploy with firebase-hosting you can skip this dependency).

to install those type

```
npm install -g quasar-cli firebase-tools
```

To run locally type

```
quasar dev -m pwa
```

To build for production

```
quasar build -m pwa
```

If you want to deploy with firebase the build process will create all the files you need in `dist/pwa`, move that files into `public` and then test/release using firebase cli (`firebase serve` and `firebase deploy`) (or configure the firebase.json file to change the default deploy folder).

This project makes use of firebase cloud functions. To deploy only cloud functions (firebase deploy will deploy both the app and the functions) you can run from the project root folder


```
firebase depoloy --only functions
```

### Licence

MIT
