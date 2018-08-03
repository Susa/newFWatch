import React, { Component } from 'react'
import { View, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native'
import { connect } from 'react-redux'

import {
  Text,
  List,
  ListItem,
  Thumbnail,
  Body,
  Right,
  Col,
  Grid,
  Content,
  Button,
  Tab,
  Tabs,
  Segment,
  Header
} from 'native-base'
import moment from 'moment'
import { Layout, EventCard } from '../components'

import { computeSize } from '../utils/DeviceRatio'
import { navigateTo } from '../components/Commons/CustomRouteActions'
import Realm from '../utils/RealmStore'
import OneSignal from 'react-native-onesignal'

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width
}

let auth = Realm.objects('Auth')

@connect(({ events }) => ({ events }))
class Home extends Component {
  
  state = {
    index: 0,
    routes: [
      { key: 'today', title: 'Today' },
      { key: 'upcoming', title: 'Upcoming' },
      { key: 'invitations', title: 'Invitations' },
    ],
    todayActive: true,
    upcomingActive: false,
    invitationsActive: false
  }

  componentWillMount(){
    this.getEvents()
  }
  
  componentDidMount(){
    OneSignal.addEventListener('ids', this.onIds);  
    OneSignal.configure()

    OneSignal.getTags(tags => {
      console.log(tags)
    })
  }

  getEvents = () => {
    this.props.dispatch({
      type: 'events/getEvents',
      callback: this.onSuccess
    })
  }

  onSuccess = (data) => {
    //console.log('evntsData ', data)
  }

  acceptInvitation = (item, user) => {
    Alert.alert(
      'Confirmation', 
      'Accept this invitation',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          console.log('dispatching')
          this.props.dispatch({
            type: 'events/acceptInvitation',
            payload: { event_id: item.id, user_id: user },
            callback: this.accepted
          })
        }},
      ],
      { cancelable: false }
    )
  }

  accepted = () => {

  }

  _handleIndexChange = index => {
    this.setState({ index }, () => this.getEvents())
  }

  _renderItem = (item, i, type) =>{
    return(
      <EventCard
        acceptInvitation={() => this.acceptInvitation(item, auth[0].logged_user)}
        onPress={() => navigateTo(this.props.navigation, 'EventDetails', item)}
        key={i}
        type={type}
        item={item}
      />
    )
  }

  render() {

    let greetings = 'Good morning'
		const myMoment = moment().format('HMM')

		if (myMoment > 1200 && myMoment <= 1800) greetings = 'Good afternoon'
		else if (myMoment >= 1800 && myMoment <= 2400) greetings = 'Good evening'

    return (
      <Layout
        showTopBar
        onPress={() => navigateTo(this.props.navigation, 'Detail', {})}
        title="Upcoming Events"
      >
        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              fontSize: computeSize(40),
              fontFamily: 'BentonSans Regular',
              color: '#fff',
            }}
          >
            {greetings},
          </Text>
        </View>
        <View style={{ marginBottom: 30 }}>
          <Text
            style={{
              fontSize: computeSize(70),
              fontFamily: 'BentonSans Regular',
              color: '#fff',
            }}
          >
            Upcoming Events
          </Text>
        </View>
        
        <View style={{ marginBottom: 10 }}>
          <Text
            style={{
              fontSize: computeSize(35),
              fontFamily: 'BentonSans Regular',
              color: 'white',
              marginBottom: 10
            }}
          >
            Today
          </Text>
        
          {
            !_.isEmpty(this.props.events.records.today) ? 
              <List
                dataArray={this.props.events.records.today}
                renderRow={(data, i) => this._renderItem(data, i, 'today')}
              />
            : 
            <View
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.4)', 
                padding: 5
              }}>
              <Text             
                  style={{
                    fontSize: computeSize(60),
                    fontFamily: 'BentonSans Regular',
                    color: 'gray',
                  }}>
                No events today
              </Text>
            </View>
          }
        </View>
        
        {/* ---------------- */}
        
        <View style={{ marginBottom: 10 }}>
          <Text
            style={{
              fontSize: computeSize(35),
              fontFamily: 'BentonSans Regular',
              color: '#2d2d2d',
              marginBottom: 10
            }}
          >
            Upcoming
          </Text>
        
          {
            !_.isEmpty(this.props.events.records.upcoming) ? 
              <List
                dataArray={this.props.events.records.upcoming}
                renderRow={(data, i) => this._renderItem(data, i, 'upcoming')}
              />
            : 
            <View
              style={{ backgroundColor: 'rgba(255,255,255,0.4)', 
                padding: 5
              }}>
              <Text             
                  style={{
                    fontSize: computeSize(60),
                    fontFamily: 'BentonSans Regular',
                    color: 'gray',
                  }}>
                No upcoming events
              </Text>
            </View>
          }

        </View>

        {/* ---------------- */}

        <View style={{ marginBottom: 10 }}>
        <TouchableOpacity onPress={() => this.getEvents()}>
          <Text
            style={{
              fontSize: computeSize(35),
              fontFamily: 'BentonSans Regular',
              color: '#2d2d2d',
              marginBottom: 10
            }}
          >
            Invitations
          </Text>
        </TouchableOpacity>
          {
            !_.isEmpty(this.props.events.records.invitations) ? 
              <List
                dataArray={this.props.events.records.invitations}
                renderRow={(data, i) => this._renderItem(data, i, 'invitations')}
              />
            : 
            <View
              style={{ backgroundColor: 'rgba(255,255,255,0.4)', 
                padding: 5
              }}>
              <Text             
                  style={{
                    fontSize: computeSize(60),
                    fontFamily: 'BentonSans Regular',
                    color: 'gray',
                  }}>
                No pending invitations
              </Text>
            </View>
          }
        </View>

      </Layout>
    )
  }
}

export default Home
