import { Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window')

const deviceSizePercent = width / 100
const ratio = 8 // The ratio to compute across all devices

export function computeSize(size) {
  return deviceSizePercent * (size / ratio)
}

export const deviceWidth = width
export const deviceHeight = height
