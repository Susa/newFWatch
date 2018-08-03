import React from 'react'
import { StyleSheet, Text } from 'react-native'
import { computeSize } from '../utils/DeviceRatio'

import Touchable from './Touchable'

const Button = ({ text, children, style, textStyle, ...rest }) => (
  <Touchable style={[styles.button, style]} {...rest}>
    <Text style={[styles.text, textStyle]}>{text || children}</Text>
  </Touchable>
)

const styles = StyleSheet.create({
  button: {
    borderRadius: computeSize(20),
    padding: computeSize(20),
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#037aff',
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
  },
})

export default Button
