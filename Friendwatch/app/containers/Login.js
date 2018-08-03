import React, { Component } from 'react'
import { Text, ActivityIndicator, StatusBar, Image, View } from 'react-native'
import { connect } from 'react-redux'

import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
} from 'native-base'

import { NavigationActions } from '../utils'
import { resetNavigateTo, navigateTo, newNavigate } from '../components/Commons/CustomRouteActions'
import { createForm } from 'rc-form'
import Realm from '../utils/RealmStore'
import OneSignal from 'react-native-onesignal'
 


@connect(({ auth }) => ({ ...auth }))
class Login extends Component {
  
  constructor(props){
    super(props)
  }
  
  componentDidMount(){
    let authObjects = Realm.objects('Auth')

    OneSignal.init("e2b737c6-705f-4c4f-b651-ae728ca93eb9");

    if(_.size(authObjects) > 0)
     resetNavigateTo(this.props.navigation, { routeName: 'Main' })
  }

  onLogin = () => {
    this.props.form.validateFields((error, payload) => {

      //console.log(payload)
      
      this.props.dispatch({
        type: 'auth/tryLogin',
        payload,
        callback: this.onSuccess,
      })
    })
  }

  onRegister = () => {
    newNavigate(this.props.navigation, 'Register')
  }

  onIds(device) {
    //console.log('Device info: ', );
  }

  onSuccess = callbackData => {
    if (callbackData.status) {
      OneSignal.sendTags({ email: callbackData.email });
      resetNavigateTo(this.props.navigation, { routeName: 'Main' })
    } else {
      alert('Wrong password')
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

  render() {
    const { fetching } = this.props
    const { getFieldProps } = this.props.form

    return (
      <Container style={{ backgroundColor: 'white' }}>
        <StatusBar barStyle="dark-content" hidden={false} />


        <Content style={{ marginTop: 100 }}>
        
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Image
              source={require('../../assets/add-event.png')}
              style={{ width: 100, height: 100 }}
            />
          </View>

          <Form>
            <Item floatingLabel>
              <Label>Email Address</Label>
              <Input
                autoCapitalize='none'
                {...getFieldProps('email', {
                  initialValue: ''
                })}
                onChangeText={val => this.handleChange('email', val)}
              />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input
                autoCapitalize='none'
                {...getFieldProps('password', {
                  initialValue: ''
                })}
                onChangeText={val => this.handleChange('password', val)}
                secureTextEntry
              />
            </Item>
          </Form>
        </Content>

        <Button style={{ alignSelf: 'center' }} primary transparent onPress={this.onRegister}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Don't have an account? Create One</Text>
        </Button>

        {fetching ? (
          <Button success block onPress={this.onLogin}>
            <ActivityIndicator color="white" />
          </Button>
        ) : (
          <Button success block onPress={this.onLogin}>
            <Text style={{ color: 'white' }}>Login</Text>
          </Button>
        )}
      </Container>
    )
  }
}

export default createForm()(Login)
