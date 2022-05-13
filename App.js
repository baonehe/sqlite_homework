/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import Home from './Screen/Home';
import AddUser from './Screen/AddUser';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const AppStack = createStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={({ route }) => ({
          headerTitle: () => (
            <View style={styles.header}>
              <Image
                style={styles.image}
                source={{ uri: 'https://img.icons8.com/ios-filled/344/home.png' }}
              />
              <Text style={styles.text}>HOME</Text>
            </View>
          ),
        })}>
        <AppStack.Screen name="Home" component={Home} />
        <AppStack.Screen
          name="AddUser"
          component={AddUser}
          options={{ headerShown: false }}
        />
      </AppStack.Navigator>
    </NavigationContainer>

  );
}
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  image: {
    height: 20,
    width: 20,
    marginRight: 20,
  },
});
export default App;
