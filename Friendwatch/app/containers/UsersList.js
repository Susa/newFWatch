import React, { Component } from 'react'
import { FlatList } from 'react-native'
import { connect } from 'react-redux'
import { Thumbnail, ListItem, Body, Text, Button, Icon, Left, Right } from 'native-base'
import { Layout } from '../components'
import { navigateTo } from '../components/Commons/CustomRouteActions'
import { createForm } from 'rc-form'
import _ from 'lodash'
import Realm from '../utils/RealmStore'
import RNGooglePlaces from 'react-native-google-places'

@connect(({ app, users, events }) => ({ ...app, users, events }))
class UsersList extends Component {
  state = {
    date: '05-04-2018',
    time: '03:00',
    invited: [],
    eventLocation: 'Select Event Location',
    eventLocationDetails: '',
    loggedUser: {}
  }

  componentDidMount(){
    let auth = Realm.objects('Auth')

    this.setState({ loggedUser: JSON.parse(auth['0'].user) })
    this.getUsers()
  }

  eventLocationModal() {
    RNGooglePlaces.openPlacePickerModal()
    .then((place) => {
		  this.setState({ eventLocation: place.address, eventLocationDetails: place })
    })
    .catch(error => console.log(error.message))
  }

  onSubmit = () => {
    navigateTo(this.props.navigation, 'ChooseFriends')
  }

  _keyExtractor = (item, index) => item.id.toString();

  getUsers = () => {
    this.props.dispatch({
      type: 'users/getUsers'
    })
  }

  renderRow = ({ item }) => {
    return (<ListItem>
      <Body>
        <Text>{item.fullname}</Text>
        <Text note>Doing what you like will always keep you happy . .</Text>
      </Body>
    </ListItem>)
  }

  onEventSave = () => {
    this.props.form.validateFields((error, payload) => {
      let newPayload = {
        payload,
        user_id: auth[0].logged_user,
        invited: this.state.invited,
        event_location: this.state.eventLocation,
        event_location_details: this.state.eventLocationDetails
      }

      this.props.dispatch({
        type: 'events/saveEvent',
        payload: newPayload,
        callback: this.onSuccess,
      })
    })
  }

  onSuccess = status => {
    if (status) {
      navigateTo(this.props.navigation, 'Home')
    } else {
      alert('Creating event failed')
    }
  }

  onClose = () => {
    this.props.dispatch(NavigationActions.back())
  }

  inviteUser = (data) => {    
    let invitedList = this.state.invited

    const itemIdx = _.findIndex(invitedList, item => data.id === item.id)

    if(itemIdx < 0){
      invitedList.push(data)
      this.setState({ invited: invitedList })
    } else {
      invitedList.splice(itemIdx, 1)
      this.setState({ invited: invitedList })
    }
  }

  handleChange = (name, value) => {
    this.props.form.setFieldsValue({
      [name]: value
    })
  }

  checkInvitation = (data) => {
    let invitedList = this.state.invited

    const itemIdx = _.findIndex(invitedList, item => data.id === item.id)

    if(itemIdx < 0){
      return (
        <Button light small onPress={() => this.inviteUser(data)}>
          <Text>
            <Icon type="Feather" name="user-plus" style={{ fontSize: 14 }}/>
            Invite Friend
          </Text>
        </Button>
      )
    } else {
      return (
        <Button light small onPress={() => this.inviteUser(data)}>
          <Text>
            <Icon type="Feather" name="user-x" style={{ fontSize: 14 }}/>
            Cancel
          </Text>
        </Button>
      )
    }
  }

  _keyExtractor = (item, index) => item.id.toString()

  userClicked = (data) => {
    navigateTo(this.props.navigation, 'UserProfile', 
    { user_id: data.id, id: data.id, refreshUsersList: () => this.getUsers() })
  }

  _renderUser = ({ item, i }) => {
    return (
      <ListItem avatar onPress={() => this.userClicked(item)}>
        <Left>
          <Thumbnail source={require('../../assets/user.png')} />
        </Left>
        <Body>
          <Text>{item.fullname}</Text>
          <Text note>{item.saved_location}</Text>
        </Body>
        <Right>
          {/* <Text note>this.checkInvitation(user)} key={i}</Text> */}
        </Right>
      </ListItem>
    )
  }

  render() {
    const { getFieldProps } = this.props.form

    return (
      <Layout noBackground>
      
        <ListItem avatar onPress={() => this.userClicked(this.state.loggedUser)} key={'0_owner'}>
          <Left>
            <Thumbnail source={require('../../assets/user.png')} />
          </Left>
          <Body>
            <Text>{this.state.loggedUser.fullname}</Text>
            <Text note>{this.state.loggedUser.saved_location}</Text>
          </Body>
          <Right>
            {/* <Text note>this.checkInvitation(user)} key={i}</Text> */}
          </Right>
        </ListItem>

        <FlatList
          data={this.props.users.records}
          renderItem={this._renderUser}
          keyExtractor={this._keyExtractor}
        />

      </Layout>
    )
  }
}

export default createForm()(UsersList)
