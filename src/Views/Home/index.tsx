import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as MediaLibrary from 'expo-media-library';

import { useAuth } from '../../hooks/useAuth';

import styled from './styled';
import { SafeAreaView } from 'react-native-safe-area-context';
import Spinner from 'react-native-loading-spinner-overlay';
import { Camera } from 'expo-camera';
import Api from '../../services/api';
import { Card } from '../../components/Card';

type historiesProps = {
  id: number;
};
export default function Home() {
  const { user, doLogout } = useAuth();
  const [histories, setHistory] = useState<historiesProps[]>([]);
  const navigation = useNavigation();
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

    })();
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaLibraryPermission(status === 'granted');
    })();
    (async () => {
      await Location.requestForegroundPermissionsAsync();
    })()
  }, []);

  async function getPermissionCam() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setHasCameraPermission(status === 'granted');
  }


  if (hasCameraPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show cam</Text>
        <Button onPress={getPermissionCam} title="Permitir" />
      </View>
    );
  }

  async function getPermission() {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setHasMediaLibraryPermission(status === 'granted');
  }

  if (hasMediaLibraryPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to save image</Text>
        <Button onPress={getPermission} title="Permitir" />
      </View>
    );
  }

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
      setIsLoading(false)
      setHistory(data);
    } catch (error) {
      setIsLoading(false)
    }

    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });

    return unsubscribe;
  }

  useEffect(() => {

    getDatas();
  }, [])
  useEffect(() => {
    fetchData();
  }, [navigation]);


  return (
    <SafeAreaView style={styled.container}>
      <Spinner
        visible={isLoading}
        textContent={'Buscando solicitações...'}
        textStyle={{ color: '#FFF' }}
      />
      <Text>Version:2.0.0</Text>
      <TouchableOpacity style={styled.signOut} onPress={logout}>
        <Icon name="sign-out" size={30} color="#000" />
      </TouchableOpacity>
      <View style={styled.reload}>
        <View>
          <View style={styled.infoUser}>
            <Icon name="user" size={30} color="#507EA6" />
            <Text style={styles.textBold}>
              <Text style={styles.textDescription}>Usuário:  </Text>
              {user.nome || "Usuário"}
            </Text>
          </View>
          <View style={styled.infoUser}>
            <Icon name="map-marker" size={30} color="#507EA6" />
            <Text style={styles.textBold}>
              <Text style={styles.textDescription}>Empresa : </Text>
              {user.nome_fantasia}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styled.iconReload} onPress={fetchData}>
          <Text style={styled.textReload}>Recarregar: </Text>
          <Icon name="refresh" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <Text>
        <Text style={styled.textCenter} />
      </Text>

      <ScrollView>
        <View>
          {histories.length == 0 ? <Text style={styled.textCenter} > *Sem Solicitações* </Text> : null}
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
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
