import { NavigationContainer } from '@react-navigation/native';

import AuthProvider from './src/contexts/AuthContext';
import Router from './src/routes';

const App = () => {

  return (
    <NavigationContainer>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
