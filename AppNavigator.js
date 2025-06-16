// AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ClientsScreen from './screens/ClientsScreen';
import ClientDetail from './screens/ClientDetailScreen';
import PaymentHistoryScreen from './screens/PaymentHistoryScreen';
import PaymentReportScreen from './screens/PaymentReportScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Client List" component={ClientsScreen} />
        <Stack.Screen name="Client Payment" component={ClientDetail} />
        <Stack.Screen name="Payment History" component={PaymentHistoryScreen} />
        <Stack.Screen name="Payment Report" component={PaymentReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}