import axios from 'axios'
import Realm from './RealmStore'

let auth = Realm.objects('Auth');
const IP_ADDRESS = '192.168.7.16:8000'
const auth0BaseUrl = 'http://' + IP_ADDRESS

const instance = axios.create({
  baseURL: auth0BaseUrl,
  headers: {
    'Content-Type': 'application/json'
  },
})

export const login = (path, body = {}) => {
  return instance.post(path, body)
}

export const get = (path, params = {}) => {
  instance.defaults.headers.common['Authorization'] = 'Bearer ' + auth[0].access_token;
  return instance.get(path, params)
}

export const post = (path, body) => {
  instance.defaults.headers.common['Authorization'] = 'Bearer ' + auth[0].access_token;
  return instance.post(path, body || {})
}

export const destroy = (path) => {
  instance.defaults.headers.common['Authorization'] = 'Bearer ' + auth[0].access_token;
  return instance.delete(path)
}
