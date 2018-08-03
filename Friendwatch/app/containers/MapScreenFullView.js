import React, { Component } from 'react';
import {
  AppRegistry,
  NativeEventEmitter,
  NativeModules,
  AppState,
  Geolocation
} from 'react-native';
import { Container, Content, Button, Text } from 'native-base';
import Geofence from "react-native-geofence";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { connect } from 'react-redux'

const GeofenceEmitter = new NativeEventEmitter(NativeModules.Geofence);

const interval = null;

@connect(({ app, events }) => ({ ...app, events }))
export default class MapScreenFullView extends Component {
  constructor(props) {
    super(props);

    let { address, event } = this.props.navigation.state.params

    this.state = {
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
      event
    }
  }

  componentDidMount(){
    GeofenceEmitter.addListener('didEnterRegion', (reminder) => this.didEnterRegion());
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      clearInterval(interval);
    }
    this.setState({appState: nextAppState});
  }

  subjectHasArrived = () => {
    let { event } = this.props.navigation.state.params

    let payload = {
      event_id: event.id
    }

    alert('You have arrived')
    
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
    });
  }

  stopMonitoring = () => {
    Geofence.stopMonitoring({
      identifier: 'identifier',
      latitude: this.state.region.latitude,
      longitude: this.state.region.longitude,
      radius: 100
    });
  }
  
  watcherNotified = () => {

  }



  render() {
    return (
      <Container>
        <MapView
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          region={this.state.region}
          onRegionChange={this.onRegionChange}
          mapType={'hybrid'}
          showsUserLocation={true}
          followsUserLocation={true}
          >
          <MapView.Circle draggable
            center={this.state.region}
            strokeColor={'red'}
            strokeWidth={2}
            radius={100}
          />

          <Marker
            coordinate={this.state.latlng}
            title={this.state.event.title}
            description={this.state.event.description}
          />

          {/* <Button primary full onPress={this.startMonitoring}>
            <Text>Start Tracking</Text>
          </Button>
          <Button danger full onPress={this.stopMonitoring}>
            <Text>Stop Tracking</Text>
          </Button> */}
        </MapView>
      </Container>
    );
  }
}
