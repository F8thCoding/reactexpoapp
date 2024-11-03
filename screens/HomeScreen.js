import React from 'react';
import StepCounterScreen from './StepCounterScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {  ThemeContextConsumer } from './ThemeContext';
import ProfileScreen from './ProfileScreen';
import LeaderboardsScreen from './LeaderboardsScreen';
import AchievementsScreen from './AchievementsScreen';
import WorkoutScreen from './WorkoutScreen';

//Tab screen navigation for easy navigation at the bottom and custom icons
const Tab = createBottomTabNavigator();


export default function HomeScreen() {
  
    return (
        <ThemeContextConsumer>
          {({ theme }) => (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Profile') {
                      iconName = focused ? 'account-circle' : 'account-circle-outline';
                    } else if (route.name === 'Step Counter') {
                      iconName = focused ? 'walk' : 'shoe-print';
                    } else if (route.name === 'Workout') {
                      iconName = focused ? 'dumbbell' : 'bike-fast';
                    } else if (route.name === 'Leaderboards' ) {
                      iconName = focused ? 'ladder' : 'trophy';
                    } else if (route.name === 'Achievements') {
                      iconName = focused? 'ribbon' : 'trophy-award';
                    }
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                  },
                  tabBarStyle: {
                    backgroundColor: theme === 'dark' ? '#000' : '#FFF', 
                  },
                  headerStyle: {
                    backgroundColor: theme === 'dark' ? '#000' : '#FFF', 
                  },
                  headerTintColor: theme === 'dark' ? '#FFF' : '#000', 
                  tabBarActiveTintColor: theme === 'dark' ? 'tomato' : 'blue',
                  tabBarInactiveTintColor: theme === 'dark' ? '#FFF' : '#000', 
                })}
              >
                <Tab.Screen name="Step Counter" component={StepCounterScreen} />
                <Tab.Screen name="Leaderboards" component={LeaderboardsScreen} />
                <Tab.Screen name="Achievements" component={AchievementsScreen} />
                <Tab.Screen name="Workout" component={WorkoutScreen} />
                <Tab.Screen name="Profile" component={ProfileScreen} />
                
              </Tab.Navigator>
          )}
        </ThemeContextConsumer>
    )
}