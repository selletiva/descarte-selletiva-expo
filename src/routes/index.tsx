import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// import { Cam } from '../components/Cam';
// import Home from '../pages/Home';
import { useAuth } from '../hooks/useAuth';
import Login from '../Views/Login';
import Home from '../Views/Home';
import { Register } from '../Views/Register';
import Cam from '../components/camera';

export type StackAuthenticatedParamList = {
  Home: undefined;
  Register: undefined;
  Cam: undefined;
};

export type StackNotAuthenticatedParamList = {
  Login: undefined;
};

const Router: React.FC = () => {
  const { isAuthenticated } = useAuth();

  function renderAuthenticatedRoutes() {
    const StackRoute =
      createNativeStackNavigator<StackAuthenticatedParamList>();
    return (
      <StackRoute.Navigator screenOptions={{ headerShown: false }}>
        <StackRoute.Screen name="Home" component={Home} />
        <StackRoute.Screen name="Register" component={Register} />
        <StackRoute.Screen name="Cam" component={Cam} />
      </StackRoute.Navigator>
    );
  }

  function renderNotAuthenticatedRoutes() {
    const StackRoute =
      createNativeStackNavigator<StackNotAuthenticatedParamList>();

    return (
      <StackRoute.Navigator screenOptions={{ headerShown: false }}>
        <StackRoute.Screen name="Login" component={Login} />
      </StackRoute.Navigator>
    );
  }

  return isAuthenticated
    ? renderAuthenticatedRoutes()
    : renderNotAuthenticatedRoutes();
};

export default Router;
