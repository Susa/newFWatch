import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, Alert } from 'react-native'
import {
  Text,
  List,
  ListItem,
  Body,
  Form,
  Item,
  Label,
  Input,
  CheckBox,
} from 'native-base'
import _ from 'lodash'

import { CustomCard, Layout } from '../components'
import { navigateTo } from '../components/Commons/CustomRouteActions'

@connect(({ app }) => ({ ...app }))
class ChooseFriends extends Component {
  static navigationOptions = {
    title: 'Choose Friends',
  }

  onSubmit = () => {
    Alert.alert(
      'Confirmation', 'Save event details?',
      [
        {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
        {text: 'OK', onPress: () => navigateTo(this.props.navigation, 'Home')},
      ],
      { cancelable: false }
    )
  }

  render() {
    const friends = [
      {
        avatar: require('../images/head.png'),
        name: 'Ace Lumaad',
        selected: true,
      },
      {
        avatar: require('../images/head.png'),
        name: 'Gemin Drigon',
        selected: true,
      },
      {
        avatar: require('../images/head.png'),
        name: 'John Bill Suarez',
        selected: false,
      },
    ]

    return (
      <Layout bottomButton={this.onSubmit} bottomButtonText="Done">
        <CustomCard icon header="Choose your watchers">
          <View style={{ flex: 1 }}>
            <Form>
              <Item stackedLabel last>
                <Label>Search</Label>
                <Input placeholder="Search watcher" />
              </Item>
            </Form>

            <List style={{ marginTop: 5, marginBottom: 5 }}>
              {_.map(friends, (item, i) => (
                <ListItem key={i}>
                  <CheckBox checked={item.selected} />
                  <Body>
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                  </Body>
                </ListItem>
              ))}
            </List>
          </View>
        </CustomCard>
      </Layout>
    )
  }
}

export default ChooseFriends
