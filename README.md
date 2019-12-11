## CalcetThron

A simple PWA to try [Quasar framework](https://v1.quasar-framework.org)
The applicaiton basically stores and shows the table soccer games we play during coffee pauses in THRON.
You can access it from [here](https://darthron-6a632.web.app)
This is a toy project and it's not intended to be used "professionally"


### How it's made

The project consist in a frontend web application (and PWA) built by using the amazing [Quasar framework](https://v1.quasar-framework.org) and in a backend made with [Firebase](https://firebase.google.com/).  
The following Firebase features are used:
 - [Hosting](https://firebase.google.com/products/hosting/): to host the application
 - [Authentication](https://firebase.google.com/products/auth/): to have an easy authentication setup
 - [Storage](https://firebase.google.com/products/storage/): just to store the user profile pictures for now
 - [Firestore database](https://firebase.google.com/products/firestore/): as a database for all the data. Using collection, subcollection, queries, pagination, secure validaiton rules and realtime update subscriptions
 - [Cloud functions](https://firebase.google.com/products/functions/): to listen to database changes and update the user statistics and rankings


### Create your own instance

The application at the link provided in the [demo](https://darthron-6a632.web.app) is bound to a firebase account. You can create a new instance of CalcetThron by doing this simple steps:
 - fork this repo
 - fill the firebase configuration file (`src/boot/firebase-sample.js`) with your own config provided by firebase
 - feel free to change app name and other stuff
 - follow the build steps below

Some things will need some manual setup. If you are interested you can reach me out on twitter [here](https://twitter.com/albertodeago88)


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
