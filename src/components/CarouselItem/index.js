import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import Geolocation from 'react-native-geolocation-service'
import Geocoder from 'react-native-geocoding'

export default class CarouselItem extends Component {
    constructor() {
        super()
        this.state = {
            lat: 0,
            lon: 0,
            error: null,
            Address: null,
        }
    };

    componentDidMount() {
        Geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
                Geocoder.from(position.coords.latitude, position.coords.longitude)
                    .then(json => {
                        console.log(json);
                        var addressComponent = json.results[0].address_components;
                        this.setState({
                            Address: addressComponent
                        })
                        console.log(addressComponent);
                    })
                    .catch(err => console.warn(err));
            },
            (error) => {
                this.setState({ error: error.message })
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 3000 }
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.lat}</Text>
                <Text>{this.state.lon}</Text>
                <Text>{this.state.Address}</Text>
                {this.state.error ? <Text>Error:{this.state.error}</Text> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    txt: {
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        color: 'black',
        textAlign: 'center',
        marginBottom: 10
    }
})