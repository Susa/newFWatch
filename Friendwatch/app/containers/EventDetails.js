import React, { Component } from 'react'
import { 
  View, Alert,
  AppRegistry,
  NativeEventEmitter,
  NativeModules,
  AppState,
  Geolocation } from 'react-native'
import { connect } from 'react-redux'
import { Text, Icon, Body, Button, Form, Tabs, Tab, List, Left, Right, Radio, Picker } from 'native-base'
import { Layout, CustomCard } from '../components'
import { navigateTo } from '../components/Commons/CustomRouteActions'
import { computeSize } from '../utils/DeviceRatio'
import Geofence from "react-native-geofence";
import moment from 'moment'
import uuid from 'uuid'
import Realm from '../utils/RealmStore'

const GeofenceEmitter = new NativeEventEmitter(NativeModules.Geofence);

let auth = Realm.objects('Auth')
const interval = null

@connect(({ app, events }) => ({ ...app, events }))
class EventDetails extends Component {
  constructor(props){
    super(props)
    
    let { params } = this.props.navigation.state
    let address = JSON.parse(params.event_location_details)
    
    this.state = {
      locValue: 'home',
      transpoValue: params.return_transpo,
      transpoLabel: params.return_transpo,
      afterEventValue: params.return_plan,
      afterEventLabel: params.return_plan,
      evLoc: JSON.parse(params.event_location_details),
      homeLoc: JSON.parse(params.user.home_location_details),
      eventID: this.props.navigation.state.params.id,
      region: {
        latitude: address.latitude,
        longitude: address.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02
      },
      latlng: {
        latitude: address.latitude,
        longitude: address.longitude,
      },
      appState: AppState.currentState,
      event: params,
      trackState: false,
      viewOnly: true
    }
  }

  componentDidMount(){
    let { params } = this.props.navigation.state

    GeofenceEmitter.addListener('didEnterRegion', (reminder) => this.didEnterRegion());
    AppState.addEventListener('change', this._handleAppStateChange);

    if(params.user.id === auth[0].logged_user){
      this.setState({ viewOnly: false })
    }
    // Realm.write(() => {
    //   let trackObj = Realm.objects('Tracker')
    //   Realm.delete(trackObj)
    // })

    let trackValue = this.state.trackState
    let trackObj = Realm.objects('Tracker')
    let trackedEvent = trackObj.filtered("eventId = '" + params.id + "'")

    if(!_.isEmpty(trackedEvent)){
      trackValue = trackedEvent[0].tracking
    }

    this.setState({
      locValue: params.return_plan,
      transpoValue: params.return_transpo,
      trackState: trackValue
    })

  }

  // componentWillUnmount() {
  //   AppState.removeEventListener('change', this._handleAppStateChange);
  // }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      clearInterval(interval);
    }
    this.setState({appState: nextAppState});
  }

  subjectHasArrived = () => {
    let { params } = this.props.navigation.state

    let payload = {
      event_id: params.id
    }
    
    this.props.dispatch({
      type: 'events/notifyWatchers',
      payload,
      callback: this.watcherNotified
    })
  }

  didEnterRegion = () => {
    this.subjectHasArrived()
  }

  onRegionChange = () => {
    return(region)=>{
      this.setState({region})
    }
  }

  startMonitoring = () => {
    Geofence.startMonitoring({
      identifier: 'identifier',
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
      radius: 100
    })

    Realm.write(() => {
      let { params } = this.props.navigation.state
      
      Realm.create('Tracker', {
        id: uuid.v1(),
        trackId: params.id.toString(),
        eventId: params.id.toString(),
        tracking: true,
        trackDate: moment().format('MM/DD/YYYY')
      })

      this.setState({ trackState: true })
    })
  }

  stopMonitoring = () => {
    let { params } = this.props.navigation.state

    Geofence.stopMonitoring({
      identifier: 'identifier',
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
      radius: 100
    })

    Realm.write(() => {
      let trackObj = Realm.objects('Tracker')
      let trackedEvent = trackObj.filtered("eventId = '" + params.id + "'")
      Realm.delete(trackedEvent)
    })

    this.setState({ trackState: false })

  }

  onSubmit = () => {
    Alert.alert(
      'Confirmation', 'Save event details?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => {
          this.onConfirm()
          navigateTo(this.props.navigation, 'Home')
        }},
      ],
      { cancelable: false }
    )
  }

  locChange = (locValue) => {
    let { params } = this.props.navigation.state
    let homeLoc = JSON.parse(params.user.home_location_details)
    
    if(locValue === 'saved')
      homeLoc = JSON.parse(params.user.saved_location_details)

    this.setState({
      locValue,
      evLoc: JSON.parse(params.event_location_details),
      homeLoc
    })
  }

  transpoChange = (transpoValue, transpoLabel) => {
    this.setState({
      transpoValue,
      transpoLabel
    })
  }

  mapFullView = () => {
    let { params } = this.props.navigation.state
    let address = JSON.parse(params.event_location_details)
    navigateTo(this.props.navigation, 'MapScreenFullView', { address, event: params })
  }

  onConfirm = () => {
    let payload = {
      event_id: this.props.navigation.state.params.id,
      return_plan: this.state.locValue,
      return_transpo: this.state.transpoValue
    }

    this.props.dispatch({
      type: 'events/updateEventPlan',
      payload,
      callback: this.onSuccess
    })
  }

  onValueChangeAfterEvent(value) {
    
    let payload = {
      event_id: this.props.navigation.state.params.id,
      return_plan: value,
      return_transpo: this.state.transpoLabel
    }

    this.setState({
      afterEventLabel: value
    }, () => {
      this.props.dispatch({
        type: 'events/updateEventPlan',
        payload,
        callback: this.onSuccess
      })
    })
  }

  onValueChangeTranspo(value) {

    let payload = {
      event_id: this.props.navigation.state.params.id,
      return_plan: this.state.afterEventLabel,
      return_transpo: value
    }

    this.setState({
      transpoLabel: value
    }, () => {
      this.props.dispatch({
        type: 'events/updateEventPlan',
        payload,
        callback: this.onSuccess
      })
    })
  }

  onSuccess = () => {
    console.log('done')
  }

  render() {
    let { params } = this.props.navigation.state

    const savedLocations = [
      { value: 'home', label: 'Home' },
      { value: 'saved', label: 'Saved Location' }
    ]

    const homeTranspo = [
      { value: 'walk', label: 'Walk' },
      { value: 'bus', label: 'Bus' },
      { value: 'train', label: 'Train' },
      { value: 'bike', label: 'Bike'},
      { value: 'taxi', label: 'Lyft/Taxi'},
      { value: 'vehicle', label: 'Personal Vehicle'}
    ]

    let address = JSON.parse(params.event_location_details)

    return (
      <Layout 
        noBackground bottomButton={this.mapFullView} 
        bottomButtonText="Full Map View Mode"
      >

        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              fontSize: computeSize(60),
              fontFamily: 'BentonSans Regular',
              color: '#454545',
            }}
          >
            {params.title}
          </Text>
        </View>

        <View style={{ marginTop: 10, marginBottom: 5 }}>
          <Text
            style={{
              fontSize: computeSize(35),
              fontFamily: 'BentonSans Regular',
              color: 'gray',
            }}
          >
            {params.description}
          </Text>
        </View>
        
        <View style={{ marginTop: 5, marginBottom: 20 }}>
          <Text
            style={{
              fontSize: computeSize(35),
              fontFamily: 'BentonSans Regular',
              color: 'gray',
            }}
          >
            by {params.user.fullname}
          </Text>
        </View>
        
        
        <View>
          <Text style={{ fontFamily: 'BentonSans Thin', color: '#454545' }}>Event Details</Text>
        </View>

        <View  style={{ 
          borderBottomWidth: 0, 
          marginLeft: 0, 
          backgroundColor: 'rgba(255,255,255,0.4)', 
          borderRadius: 5,
          marginBottom: 5,
          flexDirection: 'row',
          alignContent: 'flex-start',
          marginTop: 10
          }} >

          <Icon type="Feather" name="calendar" size={20} style={{ color: '#2d2d2d' }} />

          <Body style={{ alignItems: 'flex-start', marginLeft: 5 }}>
            <Text
              style={{
                fontSize: computeSize(35),
                fontFamily: 'BentonSans Regular',
                color: '#454545',
              }}
            >
              {moment(params.event_date + ' ' + params.event_time).format('MMMM Do, hh:mm A')}
            </Text>
          </Body>
        </View>

        <View  style={{ 
          borderBottomWidth: 0, 
          marginLeft: 0, 
          backgroundColor: 'rgba(255,255,255,0.4)', 
          borderRadius: 5,
          marginBottom: 5,
          flexDirection: 'row',
          alignContent: 'flex-start',
          marginTop: 20,
          marginBottom: 20,
          }} >

          <Icon type="Feather" name="map-pin" size={20} style={{ color: '#2d2d2d' }} />

          <Body style={{ alignItems: 'flex-start', marginLeft: 5 }}>
            <Text
              style={{
                fontSize: computeSize(35),
                fontFamily: 'BentonSans Regular',
                color: '#454545',
                marginBottom: 5
              }}
            >
              {address.name}
            </Text>
            <Text
              style={{
                fontSize: computeSize(35),
                fontFamily: 'BentonSans Regular',
                color: 'gray',
              }}
            >
              {address.addressComponents.locality}, {address.addressComponents.administrative_area_level_2}
            </Text>
          </Body>
        </View>
              
        <View>
          <Text style={{ fontFamily: 'BentonSans Thin', color: '#454545' }}>Details after the event</Text>
        </View>

        <View  style={{ 
          borderBottomWidth: 0, 
          marginLeft: 0, 
          backgroundColor: 'rgba(255,255,255,0.4)', 
          borderRadius: 5,
          marginBottom: 5,
          flexDirection: 'row',
          alignContent: 'flex-start',
          marginTop: 10
          }} >

          <Icon type="Feather" name="map-pin" size={20} style={{ color: '#2d2d2d' }} />

          <Body style={{ alignItems: 'flex-start', marginLeft: 5 }}>
            <Text
              style={{
                fontSize: computeSize(35),
                fontFamily: 'BentonSans Regular',
                color: '#454545',
                marginBottom: 5
              }}
            >
              Location after event
            </Text>
            <Text
              style={{
                fontSize: computeSize(35),
                fontFamily: 'BentonSans Regular',
                color: 'gray',
              }}
            >

            {
              !this.state.viewOnly ? 
              <Picker
                mode="dropdown"
                selectedValue={this.state.afterEventLabel}
                onValueChange={this.onValueChangeAfterEvent.bind(this)}
                placeholder='Select your return location'
                textStyle={{ fontWeight: 'bold'  }}
              >

                <Picker.Item label="My Home Location" value="home" />
                <Picker.Item label="My Saved Location" value="saved" />

              </Picker>
              : <Text>{this.state.afterEventLabel ? this.state.afterEventLabel : 'No specified return location yet'}</Text>
            }
              
            </Text>
          </Body>
        </View>
        
        <View  style={{ 
          borderBottomWidth: 0, 
          marginLeft: 0, 
          backgroundColor: 'rgba(255,255,255,0.4)', 
          borderRadius: 5,
          marginBottom: 5,
          flexDirection: 'row',
          alignContent: 'flex-start',
          marginTop: 10,
          marginBottom: 20
          }} >

          <Icon type="Feather" name="rotate-ccw" size={20} style={{ color: '#2d2d2d' }} />

          <Body style={{ alignItems: 'flex-start', marginLeft: 5 }}>
            <Text
              style={{
                fontSize: computeSize(35),
                fontFamily: 'BentonSans Regular',
                color: '#454545',
                marginBottom: 5
              }}
            >
              Return Transit
            </Text>
            <Text
              style={{
                fontSize: computeSize(35),
                fontFamily: 'BentonSans Regular',
                color: 'gray',
              }}
            >

            {
              !this.state.viewOnly ? 
              <Picker
                mode="dropdown"
                selectedValue={this.state.transpoLabel}
                onValueChange={this.onValueChangeTranspo.bind(this)}
                placeholder='Select your return transit mode'
                textStyle={{ fontWeight: 'bold'  }}
              >

                <Picker.Item label="Walk" value="walk" />
                <Picker.Item label="Bus" value="bus" />
                <Picker.Item label="Train" value="train" />
                <Picker.Item label="Bike" value="bike" />
                <Picker.Item label="Lyft/Taxi" value="taxi" />
                <Picker.Item label="Personal Vehicle" value="vehicle" />

              </Picker>
              : <Text>{this.state.afterEventLabel ? this.state.afterEventLabel : 'No specified return transit yet'}</Text>
            }


            </Text>
          </Body>
        </View>
        
        {
          !this.state.viewOnly ? 
            <View>
              {
                this.state.trackState ? 
                <Button style={{ width: '100%', justifyContent: 'center' }} danger onPress={this.stopMonitoring}>
                  <Text>Stop Tracking</Text>
                </Button> 
                :
                <Button style={{ width: '100%', justifyContent: 'center' }} onPress={this.startMonitoring}>
                  <Text>Start Tracking</Text>
                </Button>
              }   
            </View> : null
        }   

        {/* <View>
          <Text style={{ fontFamily: 'BentonSans Thin', color: '#454545' }}>Map View</Text>
        </View>
        
        <View style={{ flex: 1, height: 300, marginTop: 10 }}>

          <MapScreen 
              style={{ position: 'relative', height: '100%' }}
              eventLocation={this.state.evLoc}
              homeLocation={this.state.homeLoc}
              transit={this.state.transpoLabel}
            />

        </View> */}

      </Layout>
    )
  }
}

export default EventDetails
