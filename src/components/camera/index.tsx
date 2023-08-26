import { useEffect, useRef, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from 'expo-file-system';
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';
import { Spiner } from "../Spiner";


export default function Cam() {
  const route = useRoute();
  const [type, setType] = useState(CameraType.back);
  const [captured, setCapturedImage] = useState(null)

  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation();

  const [spinerStart, setSpinerStart] = useState(false)
 


 


  async function capture() {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        setCapturedImage(uri);
      } catch (error) {
        console.error('Erro ao tirar foto:', error);
      }
    }
  };

  async function saveAsync(nameImage, asset) {
   
    const { id }: any = route.params;
    const nameMemory = JSON.stringify(id)
    let currentLocation = await Location.getCurrentPositionAsync({});
    currentLocation.coords.latitude

    const saveEvidence = {
      [nameImage]:{
        uri:asset,
        lat:currentLocation.coords.latitude,
        lng:currentLocation.coords.longitude
      }
    }

    try {
      await AsyncStorage.mergeItem(nameMemory, JSON.stringify(saveEvidence))
      Alert.alert('Sucess', 'Salvo com sucesso', [
        { text: 'OK', onPress: () => navigation.navigate('Register', { id }) },
      ]);
    } catch {
      await AsyncStorage.setItem(nameMemory, JSON.stringify(saveEvidence))
      Alert.alert('Sucess', 'Salvo com sucesso', [
        { text: 'OK', onPress: () => navigation.navigate('Register', { id }) },
      ]);
    }

    setSpinerStart(false)

  }

  async function savePicture() {
    console.log(captured)
    setSpinerStart(true)
    const { id }: any = route.params;
    const { type }: any = route.params;
    const nameImage = `${type.toString()}`;
    const folderName = id.toString();

    try {
      const folderInfo = await MediaLibrary.getAlbumAsync(folderName);
      const fileName = `${id}/${nameImage}.jpg`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.copyAsync({
        from: captured,
        to: fileUri,
      });
      if (!folderInfo) {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        await MediaLibrary.createAlbumAsync(folderName, asset, true);
        saveAsync(nameImage, fileUri);
        return
      }
     
      const { assets } = await MediaLibrary.getAssetsAsync({
        album: folderInfo,
        mediaType: [MediaLibrary.MediaType.photo],
      });

      const exist = assets.find((item) => item.filename === `${nameImage}.jpg`);
      if (exist) return;

      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.addAssetsToAlbumAsync([asset], folderInfo, true);

      saveAsync(nameImage, fileUri);
    }
    catch (error) {
      console.error('Error saving picture:', error);
    }
  }





  return (
    <Camera style={styles.camera} type={type} ref={cameraRef}>
        {spinerStart ? <Spiner showSpiner={spinerStart}/> : null}
      <View style={styles.buttonContainer}>
        {captured ? (
          <TouchableOpacity onPress={savePicture}>
            <Image source={{ uri: captured }} style={styles.evidence}></Image>
            <Text style={styles.text}>SALVAR</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={capture}>
            <Text style={styles.text}>TIRAR</Text>
          </TouchableOpacity>

        )}
      </View>
    </Camera>
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
    flexDirection: 'row',
    bottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    alignSelf:'center'
  },
  evidence:{
    height:600,
    width:400
  }
});
