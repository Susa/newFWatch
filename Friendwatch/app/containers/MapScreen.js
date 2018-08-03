import React from 'react'
import { StyleSheet, View, Dimensions, Text } from 'react-native'
import { Button } from 'native-base'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions';
const GOOGLE_MAPS_APIKEY = 'AIzaSyBURknQO77RZnC3mrtL9FS6mGcw5uXylSA'

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class MapScreen extends React.Component {
    state = {
        region: {
            latitude: 0.0,
            longitude: 0.0,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        },
        markers: []
    }
    componentDidMount(){
        this.getCoordinates()
    }

    getCoordinates = () => {
        const { eventLocation, homeLocation } = this.props

        if(eventLocation){
            this.setState({
                region: {
                    latitude: parseFloat(eventLocation.latitude),
                    longitude: parseFloat(eventLocation.longitude),
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }
            })
        }
        else {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({
                    region: {
                        latitude: parseFloat(position.coords.latitude),
                        longitude: parseFloat(position.coords.longitude),
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }
                })
            })
        }
    }
    _getPressedLocation = (event) => {
        let coordinate = event.nativeEvent.coordinate

        this.setState({
            region: {
                latitude: coordinate.latitude,
                longitude: coordinate.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            markers: [
                { latlng: coordinate }
            ]
        })
    }
    render() {
        const { region, eventLocation, homeLocation, transit } = this.props;

        let origin = { longitude: eventLocation.longitude, latitude: eventLocation.latitude }
        let destination = { longitude: homeLocation.longitude, latitude: homeLocation.latitude }
        let markers = [
            { 
                latlng: { 
                    longitude: parseFloat(eventLocation.longitude), 
                    latitude: parseFloat(eventLocation.latitude) 
                },
                title: eventLocation.address,
                description: 'Event Location'
            },
            { 
                latlng: { 
                    longitude: parseFloat(homeLocation.longitude), 
                    latitude: parseFloat(homeLocation.latitude) 
                },
                title: homeLocation.address,
                description: 'Destination'
            }
        ]

        return (
            <View style={[styles.container, this.props.style]}>
 
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={this.state.region}>
                        {markers.map((marker, i) => (
                            <Marker
                                showCallout
                                key={'mapLoc' + i}
                                coordinate={marker.latlng}
                                title={marker.title}
                                description={marker.description}
                            />
                        ))}

                    <MapViewDirections
                        origin={origin}
                        destination={destination}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    />

                </MapView>
                <View style={{ padding: 10, backgroundColor: 'rgba(255,255,255, 0.4)', flexDirection: 'row', width: width-30 }}>
                    <Text style={{ flex: 1, flexWrap: 'wrap' }}>
                        <Text>From </Text>
                        <Text style={{ fontWeight: 'bold' }}>{eventLocation.address} </Text>
                        <Text>going to </Text>
                        <Text style={{ fontWeight: 'bold' }}>{homeLocation.address} </Text>
                        <Text>via </Text>
                        <Text style={{ fontWeight: 'bold' }}>{transit}</Text>
                    </Text>
                </View>

                <Button onPress={() => this.getCoordinates()}>Refresh Map</Button>
            </View>
        )
    }
}