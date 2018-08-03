import Realm from 'realm'

const AuthSchemaObject = {
  name: 'Auth',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', default: '' },
    access_token: { type: 'string', default: '' },
    logged_user: { type: 'int', default: '' },
    user: { type: 'string', default: '' },
  },
}

const TrackerSchemaObject = {
  name: 'Tracker',
  primaryKey: 'id',
  properties: {
    id: { type: 'string', default: '' },
    trackId: { type: 'string', default: '' },
    eventId: { type: 'string', default: '' },
    tracking: { type: 'bool', default: false },
    trackDate: { type: 'date' }
  },
}

class AuthSchema extends Realm.Object {}
AuthSchema.schema = AuthSchemaObject

class TrackerSchema extends Realm.Object {}
TrackerSchema.schema = TrackerSchemaObject

export default new Realm({ schema: [AuthSchema, TrackerSchema] })
