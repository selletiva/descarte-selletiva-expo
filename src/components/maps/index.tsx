import { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native'
import { showLocation } from 'react-native-map-link';
import * as Location from 'expo-location';

export default function Map() {
    const [lat, setLat] = useState(null)
    const [lng, setLng] = useState(null)

    async function getLocation() {
        let currentLocation = await Location.getCurrentPositionAsync({
            timeInterval: 3000,
            accuracy: 1,
        });

        setLat(currentLocation.coords.latitude)
        setLng(currentLocation.coords.longitude)
    }

    function plotRoute() {
        showLocation({
            appsWhiteList: ['waze'],
            latitude: -3.8033259,
            longitude: -38.6111054,
            sourceLatitude: lat,
            sourceLongitude: lng,
            directionsMode: 'car',
        })

    }


    useEffect(() => {
        getLocation()

    }, [])
    return (
        <TouchableOpacity onPress={plotRoute}>
            <Text>Traçar rota</Text>
        </TouchableOpacity>
    )
}