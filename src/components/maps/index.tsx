import { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { showLocation, getApps } from 'react-native-map-link';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Location from 'expo-location';

export default function Map({ coords }) {
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

    async function plotRoute() {
        const apps = await getApps({
            appsWhiteList: ['google-maps'],
            latitude: -3.8044768966064506,
            longitude: -38.52887662007451,
        })
        if (apps.length == 0) {
            Alert.alert('Erro', 'É necessário instalar um aplicativo de rota', [
                { text: 'OK' }
            ]);
            return
        } 
        Alert.alert('Você deseja traçar rota ?', '', [
            { text: 'Sim', onPress: () => {
                showLocation({
                    appsWhiteList: ['google-maps'],
                    latitude: coords.lat,
                    longitude: coords.lng,
                    sourceLatitude: lat,
                    sourceLongitude: lng,
                    directionsMode: 'car',
                })
            } },
            { text: 'Não', onPress: () =>{ return } }
        ]);
    }


    useEffect(() => {
        getLocation()
    }, [])
    return (
        <TouchableOpacity onPress={plotRoute} style={styles.locationView}>
            <Text style={{ color: 'white' }}>
                <Icon name="map-marker" size={30} color="#FFFFFF" />
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    locationView: {
        left: 290,
        width: 50,
        height: 50,
        marginTop: "20%",
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#507EA6'
    }
})