import React, { Component } from 'react'
import { View, TouchableOpacity, Text, Dimensions } from 'react-native'
import { RNCamera } from 'react-native-camera'
import { Button, Icon } from 'native-base'

const { width, height } = Dimensions.get('window')

export default class TakePicture extends Component {
  state = {
    front: true,
    type: RNCamera.Constants.Type.front
  }
  
  takePicture = async () => {
    try {
      const data = await this.camera.takePictureAsync();
      console.log('Path to image: ' + data.uri);
    } catch (err) {
      // console.log('err: ', err);
    }
  }

  changeMode = () => {
    if(this.state.front)
      this.setState({ front: false, type: RNCamera.Constants.Type.back })
    else
      this.setState({ front: true, type: RNCamera.Constants.Type.front })
  }

  render() {
    return (
      <View>
        <RNCamera
          style={{ width, height }}
          type={this.state.type}
          ref={cam => {
            this.camera = cam;
          }}>

          <View style={{ flex: 1, position: 'absolute', bottom: 70, flexDirection: 'row' }}>
            
            <View style={{ flex: 0.5 }}>
              <Button iconLeft>
                <Text>Take Photo</Text>
              </Button>
            </View>

            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
              <Button iconLeft style={{ alignSelf: 'flex-end' }}>
                <Text>Switch</Text>
              </Button>
            </View>

          </View>


            {/* <TouchableOpacity onPress={this.takePicture}>
              <Text>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={this.changeMode}>
              <Text>Switch</Text>
            </TouchableOpacity> */}
        </RNCamera>
          
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignSelf: 'flex-end' }}>

          </View>
      </View>
    );
  }
}