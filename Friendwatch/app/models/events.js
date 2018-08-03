import update from 'react-addons-update'
import _ from 'lodash'
import { createAction } from '../utils'
import { get, post, destroy } from '../utils/RESTUtils'
import Realm from '../utils/RealmStore'
let auth = Realm.objects('Auth');

export default {
  namespace: 'events',
  state: {
    records: [],
    userRecords: [],
    activeRecord: {},
    activeInvites: []
  },
  reducers: {
    loadEvents(state, { payload }) {
      return update(state, {
        records: {
          $set: payload,
        },
      })
    },
    loadUserRecords(state, { payload }) {
      return update(state, {
        userRecords: {
          $set: payload,
        },
      })
    },
    updateInvite(state, { payload }) {
      return update(state, {
        records: {
          $set: payload,
        },
      })
    }
  },
  effects: {
    getEvents: [
      function*({ payload, callback = null }, { call, put }) {
        try {
          const data = yield get('/api/v1/events/' + auth[0].logged_user + '/summary')

          if (!_.isEmpty(data)) {

            yield put(createAction('loadEvents')(data.data))
            if (callback) {
              callback(data.data)
            }
          }
        } catch (e) {
          callback(false)
          console.log(e, 'error get Events')
        }
      },

      { type: 'takeLatest' },
    ],
    getUserEvents: [
      function*({ payload, callback = null }, { call, put }) {
        try {
          const data = yield get('/api/v1/events/' + payload.id)
          if (!_.isEmpty(data)) {

            yield put(createAction('loadUserRecords')(data.data))
            if (callback) {
              callback(data.data)
            }
          }
        } catch (e) {
          callback(false)
          console.log(e, 'error get Events')
        }
      },

      { type: 'takeLatest' },
    ],
    updateInvite: [
      function*({ payload, callback = null }, { call, put }) {
        try {
          yield put(createAction('updateInvite')(payload))
        } catch (e) {
          callback(false)
        }
      },
      { type: 'takeLatest' },
    ],
    saveEvent: [
      function*({ payload, callback = null }, { call, put }) {
        try {

          const data = yield post('/api/v1/event', payload)

          if (!_.isEmpty(data)) {
            if (data.data == 200) {
              callback(true)
            }
          }
          yield put(createAction('getEvents')())
        } catch (e) {
          callback(false)
          console.log(e, 'error get Events')
        }
      },

      { type: 'takeLatest' },
    ],
    notifyWatchers: [
      function*({ payload, callback = null }, { call, put }) {
        try {
          const data = yield post('/api/v1/events/notifywatchers', payload)

          if (!_.isEmpty(data)) {
            if (data.data == 200) {
              callback(true)
            }
          }
          //yield put(createAction('getEvents')())
        } catch (e) {
          callback(false)
          console.log(e, 'error get Events')
        }
      },

      { type: 'takeLatest' },
    ],
    updateEventPlan: [
      function*({ payload, callback = null }, { call, put }) {
        try {
          const data = yield post('/api/v1/updatereturn', payload)

          if (!_.isEmpty(data)) {
            if (callback) {
              callback(true)
            }
          }
          yield put(createAction('getEvents')())
        } catch (e) {
          callback(false)
          console.log(e, 'error get Events')
        }
      },

      { type: 'takeLatest' },
    ],
    acceptInvitation: [
      function*({ payload, callback = null }, { call, put }) {
        try {
          const data = yield post('/api/v1/acceptinvitation', payload)

          if (!_.isEmpty(data)) {
            if (data.data == 200) {
              callback(true)
            }
          }
          yield put(createAction('getEvents')())
        } catch (e) {
          callback(false)
          console.log(e, 'error get Events')
        }
      },

      { type: 'takeLatest' },
    ],
    destroyEvent: [
      function*({ payload, callback = null }, { call, put }) {
        try {
          const data = yield destroy(`/api/v1/event/${payload.id}`)

          if (!_.isEmpty(data)) {
            if (callback) {
              callback(true)
            }
          }
          yield put(createAction('getEvents')())
        } catch (e) {
          callback(false)
          console.log(e, 'error get Events')
        }
      },

      { type: 'takeLatest' },
    ],
  },
  
}
