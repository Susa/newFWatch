import React from 'react'
import { View } from 'react-native'
import { Thumbnail, Text } from 'native-base'

const TitleArea = () => (
  <View style={{ flexDirection: 'row' }}>
    <View style={{ flex: 0.3, justifyContent: 'center', alignItems: 'center' }}>
      <Thumbnail
        large
        source={require('../../images/head.png')}
        style={{ backgroundColor: 'white', padding: 10 }}
      />
    </View>
    <View style={{ flex: 0.7 }}>
      <Text style={{ fontSize: 20, color: 'white', fontWeight: 'bold' }}>
        GITIKA PAWHA
      </Text>
      <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>
        THE NUEVA SCHOOL
      </Text>
    </View>
  </View>
)

export default TitleArea
