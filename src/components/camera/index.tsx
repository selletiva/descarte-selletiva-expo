import { useRef, useState, useEffect } from "react";
import { Alert, StyleSheet, Text, View } from "react-native"
import { Camera } from 'expo-camera';
import { useNavigation, useRoute } from "@react-navigation/native";
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
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { id, type } = route.params;
  const [textSpeener, setTextSpeener] = useState('Carregando...')
  const cameraRef = useRef<Camera>(null);
  const [dictionary, setDictionary] = useState({})



  async function getDicionary() {
    try {
      const languageSelected = await AsyncStorage.getItem('languageSelected')
      const Parsejson = JSON.parse(languageSelected)
      setDictionary(Parsejson)
    }
    catch (error) {
      Alert.alert('Erro', dictionary["ErroAoRecuperarTraduções"] ?? "Erro ao recuperar traduções", [
        { text: 'ok' }
      ])
    }
  }

  async function capture() {
    setTextSpeener(dictionary["Capturando"] ?? 'Capturando...')
    setIsLoading(true)
    try {
      const { uri } = await cameraRef.current.takePictureAsync({
        quality: 0.3,
      });
      setCapturedImage(uri);
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      Alert.alert(dictionary["Erro"] ?? 'Erro', dictionary["ErroAoCapturarEvidência"] ?? "Erro ao capturar evidência", [
        { text: dictionary["Retornar"] ?? 'Retornar', onPress: () => navigation.navigate('Register', { id }) },
        { text: dictionary["TirarNovamente"] ?? 'Tirar novamente' }
      ])
    }
  };

  async function saveAsync(nameImage, asset) {
    const nameMemory = JSON.stringify(id)
    setIsLoading(true)
    const localStorage = await AsyncStorage.getItem(nameMemory)
    setTextSpeener(dictionary["BuscandoLocalização"] ?? 'Buscando localização...')
    setIsLoading(false)
    let currentLocation = await Location.getCurrentPositionAsync({
      timeInterval: 3000,
      accuracy: 1,
    });

    if (!currentLocation) {
      Alert.alert(dictionary["Erro"] ?? 'Erro', dictionary["NãoFoiPossívelSalvarLocalização"] ?? 'Não foi possível salvar localização', [
        { text: 'OK', onPress: () => navigation.navigate('Register', { id }) },
      ]);
    }
    const dataAtual = new Date();
    dataAtual.setHours(dataAtual.getHours() - 3)

    const saveEvidence = {
      [nameImage]: {
        uri: asset,
        lat: currentLocation.coords.latitude || 0,
        lng: currentLocation.coords.longitude || 0,
        date: dataAtual
      }
    }

    if (!localStorage) {
      setTextSpeener(dictionary["GravandoNoCelular"] ?? 'Gravando no celular...')
      try {
        await AsyncStorage.setItem(nameMemory, JSON.stringify(saveEvidence))
        setIsLoading(false)
        navigation.navigate('Register', { id })
      } catch {
        setIsLoading(false)
        Alert.alert(dictionary["Erro"] ?? 'Erro', dictionary["NãoFoiPossívelSalvarAImagem"] ?? 'Não foi possível salvar a imagem', [
          { text: 'OK', onPress: () => navigation.navigate('Register', { id }) },
          { text: dictionary["SalvarNovamente"] ?? 'Salvar novamente', onPress: () => savePicture() },
        ]);
      }
      return
    }
    setTextSpeener('Gravando no celular...')
    try {
      await AsyncStorage.mergeItem(nameMemory, JSON.stringify(saveEvidence))
      setIsLoading(false)
      navigation.navigate('Register', { id })
    } catch {
      setIsLoading(false)
      Alert.alert(dictionary["Erro"] ?? 'Erro', dictionary["NãoFoiPossívelSalvarAImagem"] ?? 'Não foi possível salvar a imagem', [

        { text: 'OK', onPress: () => navigation.navigate('Register', { id }) },
        { text: dictionary["SalvarNovamente"] ?? 'Salvar novamente', onPress: () => savePicture() },

      ]);
    }
    setIsLoading(false)

  }

  async function savePicture() {
    setIsLoading(true)
    setTextSpeener(dictionary["Salvando"] ?? 'Salvando')
    const nameMemory = JSON.stringify(id)
    const nameImage = `${type.toString()}`;
    const verifyIfAsyncStorageExist = await AsyncStorage.getItem(nameMemory)
    if (!verifyIfAsyncStorageExist) {
      await AsyncStorage.setItem(nameMemory, '')
    }
    setIsLoading(false)
    saveAsync(nameImage, captured);
  }

  async function trashImage() {
    setCapturedImage(null)
  }

  useEffect(() => {

    getDicionary()
  }, [])

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
        textContent={textSpeener}
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

