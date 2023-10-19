import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';

import { StackAuthenticatedParamList } from '../../routes';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export function Card({ element }: any) {
  const [dictionary, setDictionary] = useState({})

  const navigation =
    useNavigation<NativeStackNavigationProp<StackAuthenticatedParamList>>();


  function makePhoto() {
    navigation.navigate('Register', { id: element.id });
  }

  async function getDicionary() {
    try {
      const languageSelected = await AsyncStorage.getItem('languageSelected')
      const Parsejson = JSON.parse(languageSelected)
      setDictionary(Parsejson)
    }
    catch (error) {
      Alert.alert(dictionary["Erro"] ?? 'Erro', dictionary["ErroAoRecuperarTraduções"] ?? "Erro ao recuperar traduções", [
        { text: 'ok' }
      ])
    }
  }


  useEffect(() => {
    getDicionary()
  }, [])
  return (
    <>
      {!element.detalhe_registro_saida_id ? (
        <TouchableOpacity onPress={makePhoto}>
          <View style={styles.container}>
            <Text style={styles.title}>
              {dictionary ? `${dictionary["TipoDeResíduo"]}: `: "Tipo de resíduo: " }{!element.type ? "Sem tipo" : element.type.nome}
            </Text>
            <Text style={styles.title}>
              {dictionary ? `${dictionary["Destinatário"]}: `: "Destinatário: " } {!element.destination ? "Sem destinatário" : element.destination.nome}

            </Text>
            <Text style={styles.title}>
            {dictionary ? `${dictionary["QuantidadeDaOperação"]}: `: "Quantidade da operação: " }{!element.quantity ? "Sem quantidade" : element.quantity} {!element.unitLabel ? "Sem unidade de medida" : element.unitLabel}
            </Text>
            <View style={styles.dateAndCNumberDoc}>
              <Text style={styles.text}>
              {dictionary ? `${dictionary["Bairro"]}: `: "Bairro: " } {!element.destination ? "Sem bairro" : element.destination.address.district}
              </Text>
              <Text style={styles.text}>
              {dictionary ? `${dictionary["Logradouro"]}: `: "Logradouro: " } {!element.destination ? "Sem logradouro" : element.destination.address.street}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#5F9EA0',
    marginBottom: 10,
    textAlign: 'center',
    padding: 5,
    borderRadius: 5,
    color: 'white',
  },
  containerWithoutDest: {
    backgroundColor: 'orange',
    marginBottom: 10,
    textAlign: 'center',
    padding: 5,
    borderRadius: 5,
    color: 'white',
  },
  containerUndefned: {
    backgroundColor: 'gray',
    marginBottom: 10,
    textAlign: 'center',
    padding: 5,
    borderRadius: 5,
    color: 'white',
  },
  dateAndCNumberDoc: {
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'space-between',
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
  title: {
    backgroundColor: 'transparent',
    textAlign: 'center',
    color: 'white',
    padding: 0,
    borderRadius: 5,
    alignItems: 'center',
  },
});
