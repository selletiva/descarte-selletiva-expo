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

  async function handleLogin() {
    if (key == '') {
      Alert.alert('Erro','Informe o código de acesso', [
        { text: 'OK' },
      ]);
      return
    }
    await doLogin(key);
    setKey('');
  }




  return (
    <View style={styled.container}>
      <TextInput
        value={key}
        placeholder={"Código de acesso"}
        onChangeText={async text => setKey(text)}
      />
      <View>
        <TouchableOpacity onPress={() => handleLogin()} style={styled.button}>
          <View style={styled.iconButton}>
            <Icon name="sign-in" size={30} color="#FFF" />
          </View>
          {active === false ? (
            <View style={styled.viewTextButton}>
              <Text style={styled.textButton}>Acessar</Text>
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
