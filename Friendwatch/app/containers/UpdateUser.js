import React, { Component } from 'react'
import { Text, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'

import {
  Form,
  Item,
  Input,
  Label,
  Button,
} from 'native-base'

import { NavigationActions } from '../utils'
import { backAction, navigateTo } from '../components/Commons/CustomRouteActions'
import { CustomCard, Layout } from '../components'

import { createForm } from 'rc-form'
import RNGooglePlaces from 'react-native-google-places'

import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window')

@connect(({ auth }) => ({ ...auth }))
class UpdateUser extends Component {
  state = {
    showModal: false,
    currentHome: 'Home Location',
    currentSaved: 'Saved Location',
    currentHomeDetails: '',
    currentSavedDetails: '',
    currentSavedCoordinate: {},
    currentUser: {},
    homeChanged: false,
    savedChanged: false
  }
  
  componentDidMount () {
    let user = this.props.navigation.state.params.user.user

    this.setState({ 
      currentUser: user,
      currentHome: user.home_location,
      currentHomeDetails: user.home_location_details,
      currentSaved: user.saved_location,
      currentSavedDetails: user.saved_location_details
    })
  }

  homeLocationModal() {
    RNGooglePlaces.openPlacePickerModal()
    .then((place) => {
		  this.setState({ currentHome: place.address, currentHomeDetails: place, homeChanged: true })
    })
    .catch(error => console.log(error.message))
  }

  savedLocationModal() {
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
		  this.setState({ 
        currentSaved: place.address, 
        currentSavedDetails: place, 
        currentSavedCoordinate: {
          longitude: place.longitude,
          latitude: place.latitude
        },
        region: {
          latitude: place.latitude,
          longitude: place.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        },
        savedChanged: true
      })
    })
    .catch(error => console.log(error.message))
  }

  showModal = key => (e) => {
    e.preventDefault()
    this.setState({
      [key]: true,
    });
  }
  
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }

  onRegister = () => {
    this.props.form.validateFields((error, payload) => {

      let newPayload = {
        ...payload,
        user_id: this.state.currentUser.id,
        email: this.state.currentUser.email,
        home_changed: this.state.savedChanged,
        saved_changed: this.state.savedChanged,
        saved_location: this.state.currentSaved,
        home_location: this.state.currentSaved,
        home_location_details: this.state.currentSavedCoordinate,
        saved_location_details: this.state.currentSavedCoordinate
      }

      this.props.dispatch({
        type: 'auth/saveUser',
        payload: newPayload,
        callback: this.onSuccess,
      })

    })
  }

  saveCallback = () => {
    setTimeout(() => this.props.navigation.state.params.refresh(), 100)
    this.setState({ locationChanged: false }, backAction(this.props.navigation))    
  }

  onSuccess = status => {
    if (status) {
      this.saveCallback()
    } else {
      alert('User registration failed')
    }
  }

  onClose = () => {
    this.props.dispatch(NavigationActions.back())
  }

  handleChange = (name, value) => {
    this.props.form.setFieldsValue({
			[name]: value
		})
  }

  selectLocationChange = (details) => {
    //console.log(details)
  }

  onPointMapClose = (coordinate) => {
    this.setState({
      currentSavedCoordinate: coordinate,
      region: {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.0015,
        longitudeDelta: 0.0015
      }
    }, () => console.log(this.state))
  }

  pointMap = () => {
    navigateTo(this.props.navigation, 'MapScreenPointOut', { onClose: this.onPointMapClose, region: this.state.region })
  }

  render() {
    const { fetching } = this.props
    const { getFieldProps } = this.props.form

    return (
      <Layout>
        
        <CustomCard header="Update user information" style={{ paddingBottom: 20, backgroundColor: 'white' }}>
          <Form>
            <Item floatingLabel>
              <Label>Fullname</Label>
              <Input
                {...getFieldProps('fullname', {
                  initialValue: this.state.currentUser.fullname
                })}
                onChangeText={val => this.handleChange('fullname', val)}
              />
            </Item>
            {/* <Item floatingLabel>
              <Label>Email Address</Label>
              <Input
                autoCapitalize='none'
                {...getFieldProps('email', {
                  initialValue: this.state.currentUser.email
                })}
                onChangeText={val => this.handleChange('email', val)}
              />
            </Item> */}

            <Item floatingLabel>
              <Label>Contact No</Label>
              <Input
                {...getFieldProps('contact_no', {
                  initialValue: this.state.currentUser.contact_no
                })}
                onChangeText={val => this.handleChange('contact_no', val)}
              />
            </Item>
            
            {/* <Item stackedLabel style={{ alignItems: 'flex-start' }}>
              <Label>Home Location</Label>
              <TouchableOpacity onPress={() => this.homeLocationModal()}>
                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 30, alignSelf: 'flex-start' }}>{this.state.currentHome}</Text>
              </TouchableOpacity>
            </Item> */}
            
            <Item stackedLabel style={{ alignItems: 'flex-start' }}>
              <Label>Saved Location</Label>
              <TouchableOpacity onPress={() => this.savedLocationModal()}>
                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 10, alignSelf: 'flex-start' }}>{this.state.currentSaved}</Text>
              </TouchableOpacity>
            </Item>
            
            {
              !_.isEmpty(this.state.currentSavedCoordinate) ? 

              <Item stackedLabel style={{ alignItems: 'flex-start' }}>
                <TouchableOpacity onPress={this.pointMap}>
                  <Label>Point out map location</Label> 
                  <MapView
                    style={{ height: 100, width: width - 80, marginTop: 15 }}
                    provider={PROVIDER_GOOGLE}
                    region={this.state.region}
                    mapType={'hybrid'}
                    >

                    <Marker
                      title={'Location'}
                      key={'Selected Location'}
                      coordinate={this.state.currentSavedCoordinate}
                    />
                  </MapView> 
                </TouchableOpacity>
              </Item>
              : null
            }

          </Form>
        </CustomCard>

        {fetching ? (
          <Button primary block onPress={this.onRegister} style={{ marginTop: 5 }}>
            <ActivityIndicator color="white" />
          </Button>
        ) : (
          <Button primary block onPress={this.onRegister} style={{ marginTop: 5 }}>
            <Text style={{ color: 'white' }}>Save Changes</Text>
          </Button>
        )}

      </Layout>
    )
  }
}

export default createForm()(UpdateUser)
