import React, { PureComponent } from 'react'
import { BackHandler, Animated, Easing } from 'react-native'
import {
  StackNavigator,
  TabNavigator,
  TabBarBottom,
  addNavigationHelpers,
  NavigationActions,
} from 'react-navigation'
import {
  initializeListeners,
  createReduxBoundAddListener,
  createReactNavigationReduxMiddleware,
} from 'react-navigation-redux-helpers'
import { connect } from 'react-redux'
import { Icon } from 'native-base'

import Loading from './containers/Loading'
import Login from './containers/Login'
import RegisterUser from './containers/RegisterUser'
import Home from './containers/Home'
import MyProfile from './containers/MyProfile'
import MyProfileTakePhoto from './containers/MyProfileTakePhoto'
import UsersList from './containers/UsersList'
import UpdateUser from './containers/UpdateUser'
import MapScreenFullView from './containers/MapScreenFullView'
import MapScreenPointOut from './containers/MapScreenPointOut'
import Events from './containers/Events'
import CreateEvent from './containers/CreateEvent'
import Invitation from './containers/Invitation'
import ChooseFriends from './containers/ChooseFriends'
import EventDetails from './containers/EventDetails'
import SearchPlaces from './components/Commons/SearchPlaces'

import * as CustomTitleBar from './components/Commons/CustomTitleBar'

const HomeNavigator = TabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({ navigation, screenProps }, 'Home', true),
    },
    Events: {
      screen: Events,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({ navigation, screenProps }, 'Events', true),
    },
    UsersList: {
      screen: UsersList,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({navigation,screenProps}, 'Users', true),
    },
    // Account: {
    //   screen: MyProfile,
    //   navigationOptions: ({ navigation, screenProps }) =>
    //     CustomTitleBar.standard({navigation,screenProps}, 'Contacts', true),
    // },
  },
  {
    initialRouteName: 'Home',
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    swipeEnabled: false,
    animationEnabled: false,
    lazyLoad: false,
    navigationOptions: ({ navigation, screenProps }) => ({
      tabBarIcon: ({ tintColor }) => {
        const { routeName } = navigation.state

        let iconName

        if (routeName === 'Home') {
          iconName = `home`
        } else if (routeName === 'Account') {
          iconName = `user`
        } else if (routeName === 'UsersList') {
          iconName = `users`
        } else if (routeName === 'Events') {
          iconName = `aperture`
        }

        return (
          <Icon
            type="Feather"
            name={iconName}
            size={25}
            style={{ color: tintColor }}
          />
        )
      },
      header: false,
    }),
    tabBarOptions: {
      activeTintColor: '#29AD8C',
      inactiveTintColor: 'gray',
      showLabel: false,
    },
  }
)

const MainNavigator = StackNavigator(
  {
    HomeNavigator: { screen: HomeNavigator },
    CreateEvent: {
      screen: CreateEvent,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({navigation,screenProps}, 'Friendwatch'),
    },
    Invitation: {
      screen: Invitation,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({navigation,screenProps}, 'Invitation'),
    },
    ChooseFriends: {
      screen: ChooseFriends,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({navigation,screenProps}, 'Friendwatch'),
    },
    UpdateUser: {
      screen: UpdateUser,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({navigation,screenProps}, 'Update User'),
    },
    UserProfile: {
      screen: MyProfile,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({navigation,screenProps}, 'User Profile'),
    },
    TakePhoto: {
      screen: MyProfileTakePhoto,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({navigation,screenProps}, 'Take Photo')
    },
    EventDetails: {
      screen: EventDetails,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({navigation,screenProps}, 'Event'),
    },
    MapScreenFullView: {
      screen: MapScreenFullView,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({navigation,screenProps}, 'MapScreenFullView'),
    },
    MapScreenPointOut: {
      screen: MapScreenPointOut,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.headless({navigation,screenProps}, 'MapScreenPointOut'),
    },
  },
  {
    headerMode: 'screen',
    initialRouteName: 'HomeNavigator',
  }
)

const AppNavigator = StackNavigator(
  {
    Login: { screen: Login },
    Register: {
      screen: RegisterUser,
      navigationOptions: ({ navigation }) =>
        CustomTitleBar.plainStandard({ navigation }, 'Register User'),
    },
    MapScreenPointOutMain: {
      screen: MapScreenPointOut,
      navigationOptions: ({ navigation }) =>
        CustomTitleBar.headless({ navigation }, 'MapScreenPointOut'),
    },
    SearchPlaces: {
      screen: SearchPlaces,
      navigationOptions: ({ navigation, screenProps }) =>
        CustomTitleBar.standard({navigation,screenProps}, 'Search Places'),
    },
    Main: { screen: ({ navigation }) => <MainNavigator screenProps={{ rootNavigation: navigation }} /> },
  },
  {
    initialRouteName: 'Login',
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps
        const { index } = scene

        const height = layout.initHeight
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        })

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        })

        return { opacity, transform: [{ translateY }] }
      },
    }),
  }
)

function getCurrentScreen(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getCurrentScreen(route)
  }
  return route.routeName
}

export const routerMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.router
)

const addListener = createReduxBoundAddListener('root')

@connect(({ app, router }) => ({ app, router }))
class Router extends PureComponent {
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandle)
  }

  componentDidMount() {
    initializeListeners('root', this.props.router)
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
  }

  backHandle = () => {
    const currentScreen = getCurrentScreen(this.props.router)
    if (currentScreen === 'Login') {
      return true
    }
    if (currentScreen !== 'Home') {
      this.props.dispatch(NavigationActions.back())
      return true
    }
    return false
  }

  render() {
    const { dispatch, app, router } = this.props
    if (app.loading) return <Loading />

    const navigation = addNavigationHelpers({
      dispatch,
      state: router,
      addListener,
    })
    return <AppNavigator navigation={navigation} />
  }
}

export function routerReducer(state, action = {}) {
  return AppNavigator.router.getStateForAction(action, state)
}

export default Router
