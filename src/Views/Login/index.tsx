import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { Spiner } from '../../components/Spiner';
import styled from './styled';
import { useAuth } from '../../hooks/useAuth';


const Login: React.FC = () => {
  const [key, setKey] = useState('');
  const { doLogin, active } = useAuth();

  function handleLogin() {
    if(key == ""){
      Alert.alert('Erro', 'Campo de senha vazio', [
        { text: 'OK'},
      ]);
      return
    }
    doLogin(key);
    setKey('');
  }

  return (
    <View style={styled.container}>
      <TextInput
        value={key}
        placeholder="Código de acesso"
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
