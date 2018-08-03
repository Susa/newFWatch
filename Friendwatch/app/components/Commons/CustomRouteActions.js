import { NavigationActions } from 'react-navigation'
import Realm from '../../utils/RealmStore'

const backAction = navigation => () =>
  navigation.dispatch(NavigationActions.back())

const navigateTo = (navigation, route, params = {}) => {
  navigation.dispatch(
    NavigationActions.navigate({
      routeName: route,
      params: params
    })
  )
}

const logoutAction = navigation => () => {
  Realm.write(() => {
    let authObjects = Realm.objects('Auth')
    Realm.delete(authObjects)
    resetNavigateTo(navigation, { routeName: 'Login' })
  })
}

const newNavigate = (navigation, route, params = {}) => {
  navigation.dispatch(
    NavigationActions.navigate({
      routeName: route,
      params: params
    })
  )
}

const resetNavigateTo = (navigation, route) => {
  navigation.dispatch(
    NavigationActions.reset({
      index: 0,
      actions: [NavigationActions.navigate(route)],
    })
  )
}

const resetNavigate = (navigation, route) => {
  navigation.dispatch(
    NavigationActions.reset({
      index: 0,
      key: null,
      actions: [NavigationActions.navigate({ routeName: route })],
    })
  )
}

const resetRootNavigateTo = navigation =>
  navigation.dispatch(
    {
        type: 'Navigation/NAVIGATE',
        routeName: 'AppNavigator',
        action: {
          type: 'Navigation/NAVIGATE',
          routeName: 'Login',
        }
    }
  )

export { backAction, navigateTo, resetNavigateTo, newNavigate, logoutAction }
