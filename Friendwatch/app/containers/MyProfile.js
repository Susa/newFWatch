import React, { Component } from 'react'
import { View, Dimensions, FlatList, StatusBar, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux'

import {
  Text,
  Thumbnail,
  Icon
} from 'native-base'

import { Layout, EventCard } from '../components'
import { computeSize } from '../utils/DeviceRatio'
import { navigateTo } from '../components/Commons/CustomRouteActions'
import Realm from '../utils/RealmStore'

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width
}

let auth = Realm.objects('Auth')


@connect(({ events, users }) => ({ events, users }))
class MyProfile extends Component {
  
  state = {
    index: 0,
    routes: [
      { key: 'today', title: 'Today' },
      { key: 'upcoming', title: 'Upcoming' },
      { key: 'invitations', title: 'Invitations' },
    ],
    todayActive: true,
    upcomingActive: false,
    invitationsActive: false,
    user: {},
    watch_count: 0,
    user_count: 0,
    event_count: 0,
    isOwner: false
  }

  _keyExtractor = (item, index) => item.id.toString()

  componentDidMount(){
    if(this.props.navigation.state.params.user_id === auth[0].logged_user){
      this.setState({ isOwner: true })
    }
    this.getUser(this.props.navigation.state.params.user_id);
  }
  
  editProfileClick = () => {
    navigateTo(this.props.navigation, 'UpdateUser', { 
        user: this.props.users.activeRecord, 
        refresh: () => this.getUser(this.props.navigation.state.params.user_id)
      }
    )
  }

  updatePhoto = () => {
    navigateTo(this.props.navigation, 'TakePhoto', { 
        user: this.props.users.activeRecord, 
        refresh: () => this.getUser(this.props.navigation.state.params.user_id)
      }
    )
  }

  initialUser = () => {
    
  }

  getUser = (id = '') => {
    this.props.dispatch({
      type: 'users/getUser',
      payload: { id },
      callback: this.onUserSuccess
    })
  }
  
  deleteEvent = () => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this event?',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'Delete', onPress: () => {
          this.props.dispatch({
            type: 'events/destroyEvent',
            payload: { id },
            callback: () => this.getUserEvents(this.props.navigation.state.params.user_id)
          })
        }},
      ],
      { cancelable: false }
    )

  }

  onUserSuccess = (data) => {
    this.setState({ 
      user: data.user,
      watch_count: data.watch_count,
      user_count: data.user_count,
      event_count: data.event_count,
    }, () => this.getUserEvents(data.user.id))
  }

  getUserEvents = (user_id) => {
    this.props.dispatch({
      type: 'events/getUserEvents',
      payload: { id: user_id },
      callback: this.onSuccess
    })
  }

  onSuccess = (events) => {
    this.props.navigation.state.params.refreshUsersList()
  }

  _renderItem = (item) =>{

    let isOwner = auth[0].logged_user == item.user.id ? 'owner' : ''

    return(
      <EventCard
        acceptInvitation={() => this.acceptInvitation(item, this.props.users.activeRecord.id)}
        onPress={() => navigateTo(this.props.navigation, 'EventDetails', item)}
        key={item.id}
        type={isOwner}
        deleteEvent={() => this.deleteEvent(item.id)}
        item={item}
      />
    )
  }

  render() {
    
    let user = this.state.user;


    return (
      <Layout
        showTopBar
        onPress={() => navigateTo(this.props.navigation, 'Detail', {})}
        title="Upcoming Events"
      >
        <StatusBar barStyle="light-content" hidden={false} />
        <View style={{ marginTop: 10, alignItems: 'center' }}>

            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.3, alignItems: 'flex-start', justifyContent: 'center' }}>
                {/* {
                  this.state.isOwner ? <TouchableOpacity onPress={() => this.updatePhoto()}>
                  <Icon
                    type="Feather"
                    name="camera"
                    style={{ color: 'white' }}
                  />
                  </TouchableOpacity> : null
                } */}

              </View>
              <View style={{ flex: 0.3, alignItems: 'center' }}>
              
                <Thumbnail square style={{ width: computeSize(140), height: computeSize(140), alignSelf: 'center' }} source={require('../../assets/user.png')} />
              
              </View>
              <View style={{ flex: 0.3, alignItems: 'flex-end', justifyContent: 'center' }}>
                
                {
                  this.state.isOwner ? <TouchableOpacity onPress={() => this.editProfileClick()}>
                  <Icon
                    type="Feather"
                    name="edit"
                    style={{ color: 'white' }}
                  />
                </TouchableOpacity> : null
                }
                

              </View>
            </View>


            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: computeSize(50),
                  fontFamily: 'BentonSans Regular',
                  color: '#fff',
                }}
              >
                {user.fullname}
              </Text>
            </View>
            
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 0.3, alignItems: 'center' }}>
                <TouchableOpacity>
                  <Text style={{ alignSelf: 'center', fontSize: computeSize(50), color: 'white', fontWeight: 'bold' }}>{this.state.event_count}</Text>
                  <Text style={{ alignSelf: 'center', color: 'white' }}>Events</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.3, alignItems: 'center', borderLeftWidth: 1, borderLeftColor: 'white', borderRightWidth: 1, borderRightColor: 'white' }}>
                <TouchableOpacity>
                  <Text style={{ alignSelf: 'center', fontSize: computeSize(50), color: 'white', fontWeight: 'bold' }}>{this.state.watch_count}</Text>
                  <Text style={{ alignSelf: 'center', color: 'white' }}>Invitations</Text>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 0.3, alignItems: 'center' }}>
                <TouchableOpacity>
                  <Text style={{ alignSelf: 'center', fontSize: computeSize(50), color: 'white', fontWeight: 'bold' }}>{this.state.user_count}</Text>
                  <Text style={{ alignSelf: 'center', color: 'white' }}>Friends</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

        
        <View style={{ marginBottom: 10, marginTop: 30 }}>
          <Text
            style={{
              fontSize: computeSize(35),
              fontFamily: 'OpenSans-Semibold',
              color: 'white',
            }}
          >
            My Events
          </Text>
        </View>

        <FlatList
          data={this.props.events.userRecords}
          keyExtractor={this._keyExtractor}
          renderItem={({item}) => this._renderItem(item)}
        />

      </Layout>
    )
  }
}

export default MyProfile
