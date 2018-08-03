import React from 'react'
import { AppRegistry } from 'react-native'

import dva from './app/utils/dva'
import Router, { routerMiddleware } from './app/router'

import appModel from './app/models/app'
import routerModel from './app/models/router'
import eventModel from './app/models/events'
import userModel from './app/models/users'
import authModel from './app/models/auth'
import watchersModel from './app/models/watchers'
import { YellowBox } from 'react-native'

const app = dva({
  initialState: {},
  models: [appModel, routerModel, eventModel, authModel, watchersModel, userModel],
  onAction: [routerMiddleware],
  onError(e) {
    console.log('onError', e)
  },
})

YellowBox.ignoreWarnings(['Warning: isMounted(...)', 'Module RCTImageLoader', 'Module RCTGeofence']);
const App = app.start(<Router />)

AppRegistry.registerComponent('Friendwatch', () => App)
