import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Spiner } from '../../components/Spiner';
import styled from './styled';
import { useAuth } from '../../hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Linguages from '../../components/linguages/templateLingauges';


const Login: React.FC = () => {
  const [key, setKey] = useState('');
  const { doLogin, active } = useAuth();
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

  async function handleLogin() {
    if (key == '') {
      Alert.alert('Erro', dictionary["InformeOCódigoDeAcesso"] ?? 'Informe o código de acesso', [
        { text: 'OK' },
      ]);
      return
    }
    await doLogin(key);
    setKey('');
  }




  return (
    <View style={styled.container}>
      <Linguages ChangeLanguage={getDicionary} />

      <TextInput
        value={key}
        placeholder={dictionary["CódigoDeAcesso"] ? dictionary["CódigoDeAcesso"] : "Código de acesso"}
        onChangeText={async text => setKey(text)}
      />
      <View>
        <TouchableOpacity onPress={() => handleLogin()} style={styled.button}>
          <View style={styled.iconButton}>
            <Icon name="sign-in" size={30} color="#FFF" />
          </View>
          {active === false ? (
            <View style={styled.viewTextButton}>
              <Text style={styled.textButton}>{dictionary["Acessar"] ? dictionary["Acessar"] : "Acessar"}</Text>
            </View>
          ) : (
            <View style={styled.viewTextButton}>
              <Spiner showSpiner={active} />
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
