import React, { Component } from 'react'
import { FlatList, TouchableOpacity, Dimensions } from 'react-native'
import DatePicker from 'react-native-datepicker'
import { connect } from 'react-redux'
import { Form, Item, Label, Input, ListItem, Body, Text, Button, Icon, Right } from 'native-base'
import { CustomCard, Layout, ValidationText } from '../components'
import { navigateTo } from '../components/Commons/CustomRouteActions'
import { createForm } from 'rc-form'
import _ from 'lodash'
import moment from 'moment'
import Realm from '../utils/RealmStore'
import { computeSize } from '../utils/DeviceRatio'
import RNGooglePlaces from 'react-native-google-places'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

const { width, height } = Dimensions.get('window')

let auth = Realm.objects('Auth');

@connect(({ app, users, events }) => ({ ...app, users, events }))
class CreateEvent extends Component {

  constructor(props){
    super(props)

    let currentDate = moment().format('MMMM DD, YYYY')
    let currentTime = moment().format('HH:mm:ss')

    this.state = {
      date: currentDate,
      time: currentTime,
      invited: [],
      eventLocation: 'Select Event Location',
      eventLocationDetails: '',
      eventCoordinate: {},
      eventRegion: {}
    }
  }

  _keyExtractor = (item, index) => item.id.toString()

  eventLocationModal() {
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
      
      this.setState({ 
        eventLocation: place.address, 
        eventLocationDetails: place, 
        eventCoordinate: {
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

  onSubmit = () => {
    navigateTo(this.props.navigation, 'ChooseFriends')
  }

  _keyExtractor = (item, index) => item.id.toString();

  componentDidMount(){
    this.props.dispatch({
      type: 'users/getUsers'
    })

    this.handleChange('event_date', this.state.date)
    this.handleChange('event_time', this.state.time)
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
      if(_.isEmpty(this.state.eventCoordinate)){
        alert('Please fill up address and point out exact map location')
      }

      else {

        let invited = _.filter(this.props.users.records, (user, i) => {
          return user.selected == true
        })

        if(_.size(invited) == 0){
          alert('Please invite at least one user')
        }
        else {
          let newPayload = {
            payload,
            user_id: auth[0].logged_user,
            invited,
            event_location: this.state.eventLocation,
            event_location_details: this.state.eventCoordinate
          }
  
          this.props.dispatch({
            type: 'events/saveEvent',
            payload: newPayload,
            callback: navigateTo(this.props.navigation, 'Home'),
          })
        }
      }
    })
  }

  onSuccess = status => {
    // if (status) {
    //   Toast.success('Event successfully created', 0.5)
    // } else {
    //   Toast.fail('Creating event failed', 1)
    // }
  }

  onClose = () => {
    this.props.dispatch(NavigationActions.back())
  }

  inviteUser = (data) => {
    this.props.dispatch({
      type: 'users/inviteUser',
      userId: data.id
    })
  }

  handleChange = (name, value) => {
    this.props.form.setFieldsValue({
      [name]: value
    })
  }

  _renderItem = ({item}) => (
    <ListItem>
      <Body>
        <Text>{item.fullname}</Text>
      </Body>
      <Right>
        {
          item.selected ? 
          (<Button small onPress={() => this.inviteUser(item)} danger style={{ width: computeSize(170), justifyContent: 'center' }}>
            <Text>
              Cancel
            </Text>
          </Button>) : 
          (<Button small onPress={() => this.inviteUser(item)} primary style={{ width: computeSize(170), justifyContent: 'center' }}>
            <Text>
              Invite
            </Text>
          </Button>)
        }
      </Right>
    </ListItem>
  )

  onPointMapClose = (coordinate) => {
    this.setState({
      eventCoordinate: coordinate,
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
    const { getFieldProps } = this.props.form

    return (
      <Layout>
        <CustomCard header="Fill up friendwatch details" footer style={{ backgroundColor: 'white' }}>
          <Form>
            <Item stackedLabel>
              <Label>What is the event?</Label>
              <Input
                {...getFieldProps('title', {
                  rules: [{
                    required: true,
                    message: 'Event title is required',
                  }]
                }
              )}
              placeholder="Title of the event"
              onChangeText={val => this.handleChange('title', val)}
              />
            </Item>
            <ValidationText {...this.props} field='title' />

            <Item stackedLabel>
              <Label>Short event description</Label>
              <Input
                {...getFieldProps('description', {
                  rules: [{
                    required: true,
                    message: 'Short description is required',
                  }]
                }
              )}
              placeholder="More event details"
              onChangeText={val => this.handleChange('description', val)}
              />
            </Item>
            <ValidationText {...this.props} field='description' />

            <Item stackedLabel>
              <Label>Date of the event?</Label>
              <DatePicker
                {...getFieldProps('event_date')}
                style={{ alignSelf: 'flex-start' }}
                date={this.state.date}
                mode="date"
                placeholder="Select Event Date"
                format="MMMM DD, YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => {
                  this.setState({ date }, () => this.handleChange('event_date', date))
                }}
                showIcon={false}
                customStyles={{
                  dateText: {
                    fontSize: 16,
                  },
                  dateInput: {
                    borderWidth: 0,
                    alignSelf: 'flex-start',
                    alignItems: 'flex-start',
                  },
                }}
              />
            </Item>

            <Item stackedLabel>
              <Label>Time of the event?</Label>
              <DatePicker
                {...getFieldProps('event_time')}
                style={{ alignSelf: 'flex-start' }}
                date={this.state.time}
                mode="time"
                placeholder="Select Event Time"
                format="hh:mm A"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={time => {
                  this.setState({ time }, () => this.handleChange('event_time', time))
                }}
                showIcon={false}
                customStyles={{
                  dateText: {
                    fontSize: 16,
                  },
                  dateInput: {
                    borderWidth: 0,
                    alignSelf: 'flex-start',
                    alignItems: 'flex-start',
                  },
                }}
              />
            </Item>
            <Item stackedLabel style={{ alignItems: 'flex-start' }}>
              <TouchableOpacity onPress={() => this.eventLocationModal()}>
                <Label>Specify Event Location</Label> 
                <Text style={{ fontSize: 18, marginTop: 10, marginBottom: 10, alignSelf: 'flex-start' }}>{this.state.eventLocation}</Text>
              </TouchableOpacity>
            </Item>
            {
              !_.isEmpty(this.state.eventCoordinate) ? 

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
                      title={'Marker Here'}
                      key={'MarkerKey'}
                      coordinate={this.state.eventCoordinate}
                    />
                  </MapView> 
                </TouchableOpacity>
              </Item>
              : null
            }
          </Form>
        </CustomCard>

        <CustomCard header="Select friends to watch you" style={{ backgroundColor: 'white' }}>
          <FlatList
            data={this.props.users.records}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
          />
        </CustomCard>

        <Button primary block onPress={this.onEventSave} style={{ marginTop: 5, fontSize: computeSize(35) }}><Text> Create Event </Text></Button>

      </Layout>
    )
  }
}

export default createForm()(CreateEvent)
