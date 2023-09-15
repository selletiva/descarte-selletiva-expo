import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native"
import { Camera, CameraType } from 'expo-camera';
import { useNavigation, useRoute } from "@react-navigation/native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import { ButtonPicture, ButtonRePicture, Buttons, ImagemPicture, ViewPicture } from "./styled";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import Spinner from 'react-native-loading-spinner-overlay';


export default function Cam() {
  const route = useRoute();
  const [captured, setCapturedImage] = useState(null)
  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { id, type }: any = route.params;

  async function capture() {
    try {
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 0.3
      });
      setCapturedImage(uri);
    } catch (error) {
      Alert.alert('Erro', "Erro ao capturar evidência", [
        { text: 'OK' }
      ])
    }
  };

  async function saveAsync(nameImage, asset) {
    const nameMemory = JSON.stringify(id)
    let currentLocation = await Location.getCurrentPositionAsync({});

    const saveEvidence = {
      [nameImage]: {
        uri: asset,
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude
      }
    }


    try {
      await AsyncStorage.mergeItem(nameMemory, JSON.stringify(saveEvidence))
      setIsLoading(false)
      Alert.alert('Sucess', 'Salvo com sucesso', [
        { text: 'OK', onPress: () => navigation.navigate('Register', { id }) },
      ]);
    } catch {
      await AsyncStorage.setItem(nameMemory, JSON.stringify(saveEvidence))
      setIsLoading(false)
      Alert.alert('Sucess', 'Salvo com sucesso', [
        { text: 'OK', onPress: () => navigation.navigate('Register', { id }) },
      ]);
    }
    setIsLoading(false)

  }

  async function savePicture() {
    const nameMemory = JSON.stringify(id)
    setIsLoading(true)
    const nameImage = `${type.toString()}`;
    const verifyIfAsyncStorageExist = await AsyncStorage.getItem(nameMemory)
    if(!verifyIfAsyncStorageExist){
      await AsyncStorage.setItem(nameMemory,'')
    }
    saveAsync(nameImage, captured);
  }

  async function trashImage() {
    setCapturedImage(null)
  }

  return (
    <View style={styles.container}>
      {captured && (
        <ViewPicture >
          <ImagemPicture source={{ uri: captured }} />
          <ButtonRePicture >
            <ButtonPicture onPress={trashImage}>
              <Feather name="trash" size={30} color="white" />
            </ButtonPicture>
            <ButtonPicture onPress={() => savePicture()}>
              <AntDesign name="save" size={40} color="white" />
            </ButtonPicture>
            <Text style={styles.text}></Text>
          </ButtonRePicture>
        </ViewPicture>
      )}
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <Buttons >
        <Text style={styles.text}></Text>
          <ButtonPicture onPress={capture}>
            <Ionicons name="camera-outline" size={40} color="white" />
          </ButtonPicture>
          <Text style={styles.text}></Text>
        </Buttons>
      </Camera>
      <Spinner
        visible={isLoading}
        textContent={'Carregando...'}
        textStyle={{ color: '#FFF' }}
      />
    </View >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  previewContainer: {
    height: '50%'
  },
  previewImage: {
    height: '50%'
  }
});

