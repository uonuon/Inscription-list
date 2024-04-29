import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../screens/Home';
import OrdinalDetailsScreen from '../screens/InscriptionDetails';

const Stack = createStackNavigator();

const style = {
  headerStyle: {
    backgroundColor: '#1A1A1A',
  },
  headerShadowVisible: false,
  headerTintColor: '#fff',
};

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          title: 'Ordinals',
          ...style,
        }}
      />
      <Stack.Screen
        name="OrdinalDetails"
        component={OrdinalDetailsScreen}
        options={{
          title: 'Details',
          ...style,
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
