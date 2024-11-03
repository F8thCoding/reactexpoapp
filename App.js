import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './screens/WelcomeScreen';
import useAuth from './hooks/useAuth';
import HomeScreen from './screens/HomeScreen';
import { ThemeProvider } from './screens/ThemeContext';
import SetupScreen2 from './screens/SetupScreen2';
import SetupScreen from './screens/SetupScreen';
import MoreAchievements from './screens/MoreAchievements';
import MoreDistance from './screens/MoreDistance';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';


const Stack = createNativeStackNavigator();

//Main app -- create 2 main 'screen paths' -- 1. if user is authorised allow them into the app which is Home and has a tab navigator with the rest of the features
//2. If not authorised keep them in the Welcome screen until they sign up or log in
const App = () => {
    const {user} = useAuth();
    if(user){
        return (
            <ThemeProvider>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName='Home'>
                        <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
                        <Stack.Screen name="SetupScreen" options={{headerShown: false}} component={SetupScreen} />
                        <Stack.Screen name="SetupScreen2" options={{headerShown: false}} component={SetupScreen2} />
                        <Stack.Screen name="MoreAchievements" options={{headerShown: false}} component={MoreAchievements} />
                        <Stack.Screen name="MoreDistance" options={{headerShown: false}} component={MoreDistance} />
                    </Stack.Navigator>
                </NavigationContainer>
            </ThemeProvider>
        )
    }
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen name="Welcome" options={{headerShown: false}} component={WelcomeScreen} />
          <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
          <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />
        </Stack.Navigator>
    </NavigationContainer>
  )
};

export default App;
