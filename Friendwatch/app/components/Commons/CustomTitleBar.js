import React from 'react'
import { Text, StatusBar } from 'react-native'
import { Header, Left, Icon, Title, Button, Body, Right } from 'native-base'
import { backAction, logoutAction } from './CustomRouteActions'
import { computeSize } from '../../utils/DeviceRatio'
import { TitleText } from './CustomText'

export const standard = ({navigation, screenProps}, title = '', disableBack = false) => {
  const header = (
    <Header style={{ backgroundColor: '#00b700', borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0, margin: 0, padding: 0 }}>
      <Left>
        <StatusBar barStyle="light-content" />
        {
          disableBack ? null : <Button transparent onPress={backAction(navigation)}>
            <Icon
              type="Feather"
              name="arrow-left"
              style={{ color: 'white' }}
            />
          </Button>
        }
      </Left>
      <Body>
        <Text
          style={{
            fontSize: computeSize(45),
            fontFamily: 'OpenSans',
            color: 'white',
          }}
        >
          
        </Text>
      </Body>
      <Right>
        <Button transparent onPress={logoutAction(screenProps.rootNavigation)}>
          <Icon
            type="Feather"
            name="wind"
            style={{ color: 'white' }}
          />
        </Button>
      </Right>
    </Header>
  )

  return {
    header,
    gesturesEnabled: false,
  }
}

export const plainStandard = ({navigation, screenProps}, title = '', disableBack = false) => {
  const header = (
    <Header style={{ backgroundColor: '#29AD8C', borderBottomWidth: 0, marginBottom: 0, paddingBottom: 0 }}>

      <Left>
        <StatusBar barStyle="dark-content" />
        {
          disableBack ? null : <Button transparent onPress={backAction(navigation)}>
            <Icon
              type="Feather"
              name="arrow-left"
              style={{ color: 'white' }}
            />
          </Button>
        }
      </Left>
      <Body>
        <Text
          style={{
            fontSize: computeSize(45),
            fontFamily: 'OpenSans',
            color: 'white',
          }}
        >
          {title}
        </Text>
      </Body>
    </Header>
  )

  return {
    header,
    gesturesEnabled: false,
  }
}

export const headless = ({ navigation }) => {
  return {
    header: 'none',
    gesturesEnabled: false,
  }
}

export const profile = ({navigation}, title = '') => {
  const header = (
    <Header style={{ backgroundColor: '#00b700', borderBottomWidth: 0 }}>
      <Left>
        <Button transparent onPress={backAction(navigation)}>
          <Icon
            type="Feather"
            name="arrow-left"
            size={25}
            style={{ color: 'white' }}
          />
        </Button>
      </Left>
      <Body>
        <Title style={{ color: 'white' }}>
          <TitleText text={title} />
        </Title>
      </Body>
      <Right />
    </Header>
  )

  return {
    header,
    gesturesEnabled: false,
  }
  
}
