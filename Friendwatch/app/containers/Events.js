import React, { Component } from 'react'
import { TouchableOpacity, View, Text, Image } from 'react-native'
import { connect } from 'react-redux'
import { Icon } from 'native-base'
import { Layout, CustomCard } from '../components'
import { navigateTo } from '../components/Commons/CustomRouteActions'

@connect(({ app }) => ({ ...app }))
class Events extends Component {
  static navigationOptions = {}
  render() {
    return (
      <Layout
        typeTwo
        onPress={() =>
          navigateTo(this.props.navigation, 'Account Settings', {})
        }
      >
        <TouchableOpacity
          onPress={() => navigateTo(this.props.navigation, 'CreateEvent', {})}
        >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 150 }}>
          <Image
            source={require('../../assets/add-event.png')}
            style={{ width: 100, height: 100, marginBottom: 20 }}
          />
          <Text style={{ fontSize: 20, fontFamily: 'OpenSans', color: '#2d2d2d' }}>Create New Event</Text>
        </View>
        </TouchableOpacity>
      </Layout>
    )
  }
}

export default Events
