import React, { Component } from 'react'
import { Text, ActivityIndicator, StatusBar, TouchableOpacity, Dimensions } from 'react-native'
import { connect } from 'react-redux'

import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Header,
  Left,
  Right,
  Icon,
  Body
} from 'native-base'
import { NavigationActions } from '../utils'
import { computeSize } from '../utils/DeviceRatio'
import { resetNavigateTo, backAction, navigateTo, newNavigate } from '../components/Commons/CustomRouteActions'
import { CustomCard, Layout, ValidationText } from '../components'

import { createForm } from 'rc-form'
import RNGooglePlaces from 'react-native-google-places'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window')

@connect(({ auth }) => ({ ...auth }))
class RegisterUser extends Component {
  state = {
    showModal: false,
    currentHome: 'Home Location',
    currentSaved: 'Saved Location',
    currentHomeDetails: '',
    currentSavedDetails: '',
    currentSavedCoordinate: {}

  }
  
  homeLocationModal() {
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
		  this.setState({ currentHome: place.address, currentHomeDetails: place })
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
        }
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

      if(error){
        
      }
      else {
        if(payload.password !== payload.confirm) {
          alert('Password mismatch')
        }
        else {
          let newPayload = {
            ...payload,
            saved_location: this.state.currentSaved,
            home_location: this.state.currentSaved,
            saved_location_details: this.state.currentSavedCoordinate,
            home_location_details: this.state.currentSavedCoordinate
          }
          this.props.dispatch({
            type: 'auth/saveUser',
            payload: newPayload,
            callback: this.onSuccess,
          })
        }
      }
    })
  }

  onSuccess = status => {
    if (status) {
      resetNavigateTo(this.props.navigation, { routeName: 'Login' })
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
        latitudeDelta: 0.001,
        longitudeDelta: 0.001
      }
    }, () => console.log(this.state))
  }

  pointMap = () => {
    newNavigate(this.props.navigation, 'MapScreenPointOutMain', { onClose: this.onPointMapClose, region: this.state.region })
  }

  render() {
    const { fetching } = this.props
    const { getFieldProps, getFieldError } = this.props.form

    return (
      <Layout>
        <Header style={{ backgroundColor: 'transparent', borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }}>
          <Left>
            <StatusBar barStyle="dark-content" />
              <Button transparent onPress={backAction(this.props.navigation)}>
                <Icon
                  type="Feather"
                  name="arrow-left"
                  style={{ color: 'white' }}
                />
              </Button>
          </Left>
          <Body>
            <Text
              style={{
                fontSize: computeSize(45),
                fontFamily: 'OpenSans',
                color: 'white',
              }}
            >
              New User
            </Text>
          </Body>
          <Right></Right>
        </Header>
        
        <StatusBar barStyle="light-content" />

        <CustomCard header="Fill up information" style={{ paddingBottom: 20, backgroundColor: 'white' }}>
          <Form>
            <Item floatingLabel>
              <Label>Fullname</Label>
              <Input
                {...getFieldProps('fullname', {
                    rules: [{
                      required: true,
                      message: 'Fullname is required',
                    }]
                  }
                )}
                onChangeText={val => this.handleChange('fullname', val)}
              />
            </Item>
            <ValidationText {...this.props} field='fullname' />

            <Item floatingLabel>
              <Label>Email Address</Label>
              <Input
                autoCapitalize='none'
                {...getFieldProps('email', {
                  rules: [{
                    type: 'email',
                    required: true,
                    message: 'Email is empty or invalid',
                  }]
                })}
                onChangeText={val => this.handleChange('email', val)}
              />
            </Item>
            <ValidationText {...this.props} field='email' />

            <Item floatingLabel>
              <Label>Password</Label>
              <Input
                autoCapitalize='none'
                {...getFieldProps('password')}
                onChangeText={val => this.handleChange('password', val)}
                secureTextEntry
              />
            </Item>

            <Item floatingLabel>
              <Label>Confirm Password</Label>
              <Input
                autoCapitalize='none'
                {...getFieldProps('confirm')}
                onChangeText={val => this.handleChange('confirm', val)}
                secureTextEntry
              />
            </Item>
                
            <Item floatingLabel>
              <Label>Contact No</Label>
              <Input
                {...getFieldProps('contact_no', {
                    rules: [{
                      required: true,
                      message: 'Contact is required',
                    }]
                  }
                )}
                onChangeText={val => this.handleChange('contact_no', val)}
              />
            </Item>
            <ValidationText {...this.props} field='contact_no' />
            
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
          <Button success block onPress={this.onRegister}>
            <ActivityIndicator color="white" />
          </Button>
        ) : (
          <Button success block onPress={this.onRegister}>
            <Text style={{ color: 'white' }}>Save User</Text>
          </Button>
        )}
      </Layout>
    )
  }
}

export default createForm()(RegisterUser)
