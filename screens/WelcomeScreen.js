import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
    //Navigation screens
    const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(39, 160, 171, 1)' }}>
      <View style={{ flex: 1, justifyContent: 'space-around', marginVertical: 16 }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 32, textAlign: 'center' }}>
          Ready to ignite your journey?
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Image 
            source={require("../assets/welcome.jpg")}
            style={{ width: 350, height: 350 }} 
          />
        </View>
        <View style={{ paddingHorizontal: 28 }}>
          <TouchableOpacity onPress={()=> navigation.navigate('SignUp')}
            style={{ 
              paddingVertical: 12, 
              backgroundColor: '#FFCC00',
              borderRadius: 25, 
              marginBottom: 16
            }}>
            <Text style={{ 
              fontSize: 20, 
              fontWeight: 'bold', 
              textAlign: 'center', 
              color: '#4B5563',
            }}>
              Sign Up
            </Text>
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontWeight: 'semibold' }}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={()=> navigation.navigate('Login')}>
              <Text style={{ fontWeight: 'bold', color: '#FFCC00' }}>
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
