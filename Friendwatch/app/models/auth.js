import update from 'react-addons-update'
import _ from 'lodash'
import { createAction } from '../utils'
import { post, login } from '../utils/RESTUtils'
import Realm from '../utils/RealmStore'
import uuid from 'uuid'
export default {
  namespace: 'auth',
  state: {
    records: [],
    activeRecord: {},
    fetching: false,
  },
  reducers: {
    updateState(state, { payload }) {
      return { ...state, ...payload }
    },
    loadAuth(state, { payload }) {
      return update(state, {
        records: {
          $set: payload,
        },
      })
    },
    updateActiveRecord(state, { payload }) {
      if (payload === 'clear') {
        return update(state, {
          activeRecord: {
            $set: {},
          },
        })
      }
      return update(state, {
        activeRecord: {
          $merge: payload,
        },
      })
    },
  },
  effects: {
    tryLogin: [
      function*({ payload, callback }, { call, put }) {
        yield put(createAction('updateState')({ fetching: true }))
        try {
          
          const response = yield login('/api/trylogin', {
            email: payload.email,
            password: payload.password,
          })

          //console.log('Response ', response)
          
          Realm.write(() => {
            let authObjects = Realm.objects('Auth')
            Realm.delete(authObjects)

            Realm.create('Auth', {
              id: uuid.v1(),
              access_token: response.data.access_token,
              logged_user: response.data.user_id,
              user: JSON.stringify(response.data.user)
            })
          })

          yield put(createAction('updateState')({ fetching: false }))

          if (!_.isEmpty(response)) {
            if (callback) {
              callback({ status: true, message: 'Success', email: response.data.user.email })
            }
          }
        } catch (e) {
          console.log(e)
          yield put(createAction('updateState')({ fetching: false }))
          callback({ status: false, message: 'Error', email: '' })
        }
      },
      // yield put(createAction('loadAuth')(loadData))
      { type: 'takeLatest' },
    ],
    saveUser: [
      function*({ payload, callback }, { call, put }) {
        yield put(createAction('updateState')({ fetching: true }))
        try {

          const response = []
          
          if(!_.isEmpty(payload.user_id))
            response = yield post('/api/user', payload)
          else
            response = yield login('/api/user', payload)

          if(payload.user_id)
          {
            Realm.write(() => {
              let authObjects = Realm.objects('Auth')
              let currentID = authObjects[0].id

              //Realm.delete(authObjects)
  
              Realm.create('Auth', {
                id: currentID,
                logged_user: response.data.id,
                user: JSON.stringify(response.data)
              }, true)
            })
          }

          yield put(createAction('updateState')({ fetching: false }))
          if (!_.isEmpty(response)) {
            if (callback) {
              callback(true)
            }
          }
        } catch (e) {
          yield put(createAction('updateState')({ fetching: false }))
          callback(false, e)
          console.log(e, 'Something wrong happened')
        }
      },
    ],
  },
}
