import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';

import { StackAuthenticatedParamList } from '../../routes';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export function Card({ element }: any) {

  const navigation =
    useNavigation<NativeStackNavigationProp<StackAuthenticatedParamList>>();

  
  function makePhoto() {
    navigation.navigate('Register', { id: element.id, lat: element.destination.address.lat, lng: element.destination.address.lng });
  }

  return (
    <>
      {!element.detalhe_registro_saida_id ? (
        <TouchableOpacity onPress={makePhoto}>
          <View style={styles.container}>
            <Text style={styles.title}>
              Tipo de resíduo: {!element.type ? "Sem tipo" : element.type.nome}
            </Text>
            <Text style={styles.title}>
              Destinatário:  {!element.destination ? "Sem destinatário" : element.destination.nome}
            </Text>
            <Text style={styles.title}>
              Quantidade da operação: {!element.quantity ? "Sem quantidade" : element.quantity} {!element.unitLabel ? "Sem unidade de medida" : element.unitLabel}
            </Text>
            <View style={styles.dateAndCNumberDoc}>
              <Text style={styles.text}>
                Bairro: {!element.destination ? "Sem bairro" : element.destination.address.district}
              </Text>
              <Text style={styles.text}>
                Logradouro: {!element.destination ? "Sem logradouro" : element.destination.address.street}
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
