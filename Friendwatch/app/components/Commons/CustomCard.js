import React from 'react'
import { View } from 'react-native'
import { Card, CardItem, Text, Icon } from 'native-base'
import { computeSize } from '../../utils/DeviceRatio'

const CustomCard = props => (
  <View style={[{ padding: computeSize(10), borderColor: 'white', borderRadius: 5 }, props.style]}>
    <Card
      transparent
      style={[{ borderRadius: computeSize(10) }, props.style]}
    >
      {props.header ? (
        <CardItem header>
          {
            props.icon ? (
              <Icon
                type="Feather"
                name="edit"
                size={20}
                style={{ color: 'gray' }}
              />
            ): null
          }
          <Text style={{ fontSize: computeSize(50), color: 'gray' }}>
            {props.header}
          </Text>
        </CardItem>
      ) : null}

      {props.children}

      {props.footer ? (
        <CardItem footer>
          <Text />
        </CardItem>
      ) : null}
    </Card>
  </View>
)
export default CustomCard
