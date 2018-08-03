import React from 'react'
import { AppRegistry } from 'react-native'

import dva from './utils/dva'
import Router, { routerMiddleware } from './router'

import appModel from './models/app'
import routerModel from './models/router'
import eventModel from './models/events'
import userModel from './models/users'
import authModel from './models/auth'
import watchersModel from './models/watchers'

const app = dva({
  initialState: {},
  models: [appModel, routerModel, eventModel, authModel, watchersModel, userModel],
  onAction: [routerMiddleware],
  onError(e) {
    console.log('onError', e)
  },
})

const App = app.start(<Router />)

AppRegistry.registerComponent('WatchApp', () => App)
