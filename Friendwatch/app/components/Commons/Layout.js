import React from 'react'
import { View, TouchableOpacity, StatusBar, Image, Dimensions } from 'react-native'
import { Container, Content, Icon, Button, Text } from 'native-base'
import { computeSize } from '../../utils/DeviceRatio'

const { width, height } = Dimensions.get('window')
// Resources
// backgroundColor: '#29AD8C'

const Layout = props => {
  let backgroundImage = require('../../../assets/background2.png')

  if(props.typeTwo)
    backgroundImage = require('../../../assets/background3.png')
  else if(props.typeThree)
    backgroundImage = require('../../../assets/background4.png')
  
  if(props.noBackground)
    backgroundImage = null

  return (
    <Container style={{ backgroundColor: '#fff', flex: 1, padding: computeSize(20) }}>
    {
      !_.isEmpty(props.noBackground) || !props.noBackground ? <Image 
      style={{ height, width, resizeMode: 'cover', position: 'absolute' }} 
      source={backgroundImage}
      /> : null
    }
      
      <StatusBar barStyle="light-content" />
  
      {props.showTopBar ? (
        <View
          style={{
            flexDirection: 'row',
            paddingRight: computeSize(30),
          }}
        >
          <View style={{ flex: 0.1 }}>
            {/* <TouchableOpacity
                  onPress={props.onPress}
                  style={{ alignSelf: 'flex-end' }}
                >
                  <Icon
                    type="Feather"
                    name="arrow-left"
                    size={25}
                    style={{ color: 'white', fontWeight: 'bold' }}
                  />
                </TouchableOpacity> */}
          </View>
          <View style={{ flex: 0.8, justifyContent: 'center' }}>
            {/* <Text
                  style={{
                    color: 'white',
                    fontSize: 26,
                    fontWeight: 'bold',
                    fontFamily: 'ArialRoundedMTBold',
                  }}
                >
                  {props.title}
                </Text> */}
          </View>
          <View style={{ flex: 0.1 }}>
            {props.rightContent ? (
              <TouchableOpacity
                onPress={props.onPress}
                style={{ alignSelf: 'flex-end' }}
              >
                <Icon
                  type="Feather"
                  name="settings"
                  size={25}
                  style={{ color: 'white', fontWeight: 'bold' }}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}
      <Content>

        {
          props.children
        }

        {
          props.bottomButton ? 
            <Button block onPress={props.bottomButton} style={{ marginTop: 30 }}>
              <Text style={{ fontSize: computeSize(35) }}>{props.bottomButtonText}</Text>
            </Button> : null
        }

      </Content>


    </Container>
  )
}


export default Layout
