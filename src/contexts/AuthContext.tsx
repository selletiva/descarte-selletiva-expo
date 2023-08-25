import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

// import ModalAlert from '../components/Modal';
import {
  StackAuthenticatedParamList,
  StackNotAuthenticatedParamList,
} from '../routes';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const navigation =
    useNavigation<
      CompositeNavigationProp<
        NativeStackNavigationProp<StackAuthenticatedParamList>,
        NativeStackNavigationProp<StackNotAuthenticatedParamList>
      >
    >();

  const doLogin = useCallback(async (key: string) => {
    try {
      const { data: userData } = await axios.post(
        'http://sistema.selletiva.com.br/serverapp/auth',
        { key },
      );

      setUser(userData);
      setIsAuthenticated(true);

      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (e: any) {
      setTextModal('Códico com Erro');
      setActive(oldState => !oldState);
    }
  }, []);

  const doLogout = useCallback(async () => {
    setUser({});
    setIsAuthenticated(false);
    await AsyncStorage.clear();
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

  return (
    <AuthContext.Provider value={returnedValues}>
      {/* <ModalAlert setActive={openModal} showModal={active} text={textModal} /> */}
      {children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;
