import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { computeSize } from '../../utils/DeviceRatio'

export const TitleText = ({ text, style }) => (
  <Text style={[style, Titlestyles.text]}>{text}</Text>
)

export const SubText = ({ text, style }) => (
  <Text style={[style, SubTextstyles.text]}>{text}</Text>
)

const Titlestyles = StyleSheet.create({
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: computeSize(50),
  },
})

const SubTextstyles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: computeSize(30),
  },
})
