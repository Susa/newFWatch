import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Button, Icon, Text, Body, Right, Card, CardItem, Left, ListItem, Thumbnail } from 'native-base'
import { computeSize } from '../utils/DeviceRatio'
import moment from 'moment'


const EventCard = props => (
  <TouchableOpacity onPress={props.onPress}>
  <View style={{
    shadowOffset:{  width: 5,  height: 5,  },
    shadowColor: 'gray',
    shadowOpacity: 0.3,
    borderBottomWidth: 0, 
    marginLeft: 0, 
    backgroundColor: 'rgba(255,255,255,1)', 
    padding: 5,
    borderRadius: 5,
    marginBottom: 5,
    padding: 10
  }}>
    <View  style={{ 

      flexDirection: 'row',
      alignContent: 'flex-start',

      }}>

      {/* <Thumbnail square style={{ marginTop: 5, width: computeSize(160), height: computeSize(160) }} source={require('../../assets/login.png')} /> */}
      
      <View style={{ flexDirection: 'column', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'BentonSans Light', color: 'red', marginBottom: 5, fontSize: 12 }}>{moment(props.item.event_date + ' ' + props.item.event_time).format('MMM').toUpperCase()}</Text>
        <Text style={{ fontFamily: 'BentonSans Medium', color: '#545454' }}>{moment(props.item.event_date + ' ' + props.item.event_time).format('DD')}</Text>
      </View>

      <Body style={{ alignItems: 'flex-start', marginLeft: 10 }}>
        <Text style={{ fontFamily: 'BentonSans Medium', fontSize: 20, marginBottom: 5, color: '#545454' }}>{props.item.title}</Text>
        <Text note style={{ fontFamily: 'BentonSans Light', color: 'gray', marginBottom: 6 }}>{moment(props.item.event_date + ' ' + props.item.event_time).format('ddd, MMMM Do, hh:mm A')}</Text>
        <Text note style={{ fontFamily: 'BentonSans Regular', color: 'gray' }}>
          {props.item.event_location}
        </Text>
      </Body>
    </View>

    
    {
      props.type === 'invitations' ? <CardItem footer style={{ marginTop: 10 }}>
        <Left>
          <Button iconLeft small info transparent onPress={props.acceptInvitation}>
              <Icon type="Feather" name="user-check" />
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Accept</Text>
            </Button>
        </Left>
        <Right>
          <Button iconLeft small danger style={{ marginLeft: 5 }} transparent>
              <Icon type="Feather" name="user-x" />
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Decline</Text>
            </Button>
        </Right>
      </CardItem> : null
    }

    {
      props.type === 'owner' ? <CardItem footer style={{ marginTop: 10 }}>
        <Left>
          {/* <Button iconLeft small info transparent onPress={props.acceptInvitation}>
              <Icon type="Feather" name="edit" />
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Edit</Text>
            </Button> */}
        </Left>
        <Right>
          <Button iconLeft small danger style={{ marginLeft: 5 }} transparent onPress={() => props.deleteEvent(props.item.id)}>
              <Icon type="Feather" name="delete" />
              <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Delete</Text>
            </Button>
        </Right>
      </CardItem> : null
    }
    </View>
  </TouchableOpacity>
)

export default EventCard
