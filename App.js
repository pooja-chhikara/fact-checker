import React, { useState } from "react";
// import { View, Text, TextInput, Button } from "react-native";
import HomeScreen from "./screens/homescreen";
import AuthScreen from "./screens/auth"
// const App = () => {

//   return (
//     <View>
// <AuthScreen/>
//     <HomeScreen/>
//   </View>
//   );
// };

// export default App;


import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const RootStack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: AuthScreen,
    },
    Home: {
      screen: HomeScreen,
      options: {title: 'Welcome'},
    }
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}