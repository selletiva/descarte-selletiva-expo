import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Card } from '../../components/Card';
import { Spiner } from '../../components/Spiner';
import { useAuth } from '../../hooks/useAuth';

import styled from './styled';
import Api from '../../services/api';
import { SafeAreaView } from 'react-native-safe-area-context';

type historiesProps = {
  id: number;
};
export default function Home() {
  const { user, doLogout } = useAuth();
  const [histories, setHistory] = useState<historiesProps[]>([]);
  const navigation = useNavigation();
  
  function logout() {
    doLogout();
  }

  async function getDatas() {
    try {
      await AsyncStorage.getItem('chave de acesso');
    } catch (error) {
      logout()
    }
  }

  async function fetchData() {
    try {
      const { data } = await Api.get('/', {
        headers: {
          Authorization: user.auth_key,
        },
        params: { onlyPendingDestination: 'true' },
      });
      setHistory(data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao recuperar solicitações', [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }

    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }

  useEffect(() =>{

    getDatas();
  },[])
  useEffect(() => {
    fetchData();
  }, [navigation]);


  return (
    <SafeAreaView style={styled.container}>
      <Text>Version:1.0.2</Text>
      <TouchableOpacity style={styled.signOut} onPress={logout}>
        <Icon name="sign-out" size={30} color="#000" />
      </TouchableOpacity>
      <View style={styled.reload}>
        <View>
          <View style={styled.infoUser}>
            <Icon name="user" size={30} color="#507EA6" />
            <Text style={styles.textBold}>
              <Text style={styles.textDescription}>Usuário: </Text>
              {user.nome}
            </Text>
          </View>
          <View style={styled.infoUser}>
            <Icon name="map-marker" size={30} color="#507EA6" />
            <Text style={styles.textBold}>
              <Text style={styles.textDescription}>Empresa: </Text>
              {user.nome_fantasia}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styled.iconReload} onPress={fetchData}>
          <Text style={styled.textReload}>Recarregar</Text>
          <Icon name="refresh" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <Text>
        <Text style={styled.textCenter} />
      </Text>

      <ScrollView>
        <View>
          {histories.length == 0 ? <Text  style={styled.textCenter} > *Sem Solicitações*</Text> : null}
          {histories.map(history => {
            return <Card element={history} key={history.id} />;
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  textBold: {
    marginLeft: 10,
    fontWeight: '500',
    color: 'black',
  },
  textDescription: {
    fontWeight: '500',
    color: 'black',
  },
});
