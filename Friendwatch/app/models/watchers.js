import update from 'react-addons-update'
import _ from 'lodash'
import { createAction } from '../utils'
import { get, post, destroy } from '../utils/RESTUtils'

export default {
  namespace: 'watchers',
  state: {
    records: [],
    activeRecord: {},
  },
  reducers: {
    loadWatchers(state, { payload }) {
      return update(state, {
        records: {
          $set: payload,
        },
      })
    },
  },
  effects: {
    getWatchers: [
      function*({ payload, callback = null }, { call, put }) {
        try {
          const data = yield get('/api/v1/watchers')

          if (!_.isEmpty(data)) {
            yield put(createAction('loadWatchers')(data.data))
            if (callback) {
              callback(true)
            }
          }
        } catch (e) {
          callback(false)
          console.log(e, 'error get Events')
        }
      },

      { type: 'takeLatest' },
    ],
    addWatchers: [
      function*({ payload, callback = null }, { call, put }) {
        try {
          const data = yield post('/api/v1/watcher', payload)

          if (!_.isEmpty(data)) {
            if (callback) {
              callback(true)
            }
          }
          yield put(createAction('loadWatchers')())
        } catch (e) {
          callback(false)
          console.log(e, 'error get Events')
        }
      },

      { type: 'takeLatest' },
    ],
    destroyWatchers: [
      function*({ payload, callback = null }, { call, put }) {
        try {
          const data = yield destroy(`/api/v1/watchers/${payload.id}`)

          if (!_.isEmpty(data)) {
            if (callback) {
              callback(true)
            }
          }
          yield put(createAction('loadWatchers')())
        } catch (e) {
          callback(false)
          console.log(e, 'error get Events')
        }
      },

      { type: 'takeLatest' },
    ],
  },
}
