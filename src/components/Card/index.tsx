import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';

import { StackAuthenticatedParamList } from '../../routes';
export function Card({ element }: any) {
  const navigation =
    useNavigation<NativeStackNavigationProp<StackAuthenticatedParamList>>();

  function makePhoto() {
    navigation.navigate('Register', { id: element.id });
  }
  return (
    <>
      {!element.detalhe_registro_saida_id ? (
        <TouchableOpacity onPress={makePhoto}>
          <View style={styles.container}>
            <Text style={styles.title}>
              Tipo de resíduo: {element.type.nome}
            </Text>
            <Text style={styles.title}>
              Destinatário: {element.destination.nome}
            </Text>
            <Text style={styles.title}>
              Quantidade da operação: {element.quantity} {element.unitLabel}
            </Text>
            <View style={styles.dateAndCNumberDoc}>
              <Text style={styles.text}>
                Bairro: {element.destination.address.district}
              </Text>
              <Text style={styles.text}>
                Logradouro: {element.destination.address.street}
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
