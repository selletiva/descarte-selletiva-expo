import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  StackAuthenticatedParamList,
  StackNotAuthenticatedParamList,
} from '../routes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalAlert from '../components/Modal';
import { Alert } from 'react-native';

export const AuthContext = createContext({} as AuthProviderReturn);

type AuthProviderProps = {
  children: ReactNode;
};

type AuthProviderReturn = {
  doLogin: (key: string) => Promise<void>;
  doLogout: () => Promise<void>;
  active: boolean;
  isAuthenticated: boolean;
  user: any;
};

const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Object>({});
  const [active, setActive] = useState(false);
  const [textModal, setTextModal] = useState('');
  const [dictionary, setDictionary] = useState({})

  const navigation =
    useNavigation<
      CompositeNavigationProp<
        NativeStackNavigationProp<StackAuthenticatedParamList>,
        NativeStackNavigationProp<StackNotAuthenticatedParamList>
      >
    >();

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

  const doLogin = useCallback(async (key: string) => {
    try {
      const response = await fetch('http://sistema.selletiva.com.br/serverapp/auth', {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'User-Agent': 'Thunder Client (https://www.thunderclient.com)',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key })
      });

      if (response.ok) {
        const userData = await response.json();

        setUser(userData);
        setIsAuthenticated(true);

        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        Alert.alert(dictionary["Erro"] ?? 'Erro', dictionary["CódigoDeAccesoInválido"] ?? 'Código de acesso inválido', [
          { text: 'OK' },
        ]);
        return
      }
    } catch (e) {
      Alert.alert(dictionary["Erro"] ?? 'Erro', dictionary["CódigoDeAccesoInválido"] ?? 'Código de acesso inválido', [

        { text: 'OK' },
      ]);
      return
    }
  }, []);

  const doLogout = useCallback(async () => {
    setUser({});
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('user');
  }, []);

  const redirectUser = useCallback(() => {
    if (isAuthenticated) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('Login');
    }
  }, [isAuthenticated, navigation]);

  const loadDataFromLocalStorage = useCallback(async () => {
    const userDataString = await AsyncStorage.getItem('user');
    if (!userDataString) {
      return;
    }

    const userData = JSON.parse(userDataString);
    setUser(userData);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    redirectUser();
    loadDataFromLocalStorage();
  }, [redirectUser, loadDataFromLocalStorage]);

  const returnedValues = useMemo(
    () => ({
      doLogin,
      user,
      doLogout,
      isAuthenticated,
      active,
    }),
    [doLogin, doLogout, user, isAuthenticated, active],
  );
  function openModal() {
    setActive(!active);
  }

  useEffect(() => {
    getDicionary()
  }, [])
  return (
    <AuthContext.Provider value={returnedValues}>
      <ModalAlert setActive={openModal} showModal={active} text={textModal} />
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
