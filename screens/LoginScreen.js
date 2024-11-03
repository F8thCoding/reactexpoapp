import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, sendPasswordResetEmail  } from 'firebase/auth';
import { auth } from '../config/firebase'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  //Firebase authenticatiom -- check that user exists with such details
  const handleSubmit = async ()=>{
    if(email && password){
      try{
        await signInWithEmailAndPassword(auth, email, password);
      }catch(err){
        console.log('got error', err);
        setErrorMessage(err.message);
      }
    } else {
      setErrorMessage('Please enter both email and password.');
    }
  };

  //Send reset password email with firebase
  const handleForgotPassword = async () => {
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset email sent successfully. Please check your inbox.');
      } catch (err) {
        console.log('Error sending password reset email:', err);
        setErrorMessage(err.message);
      }
    } else {
      setErrorMessage('Please enter your email address.');
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(39, 160, 171, 1)' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity 
                  style={styles.backButton} 
                  onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
      <View style={{ flex: 2, backgroundColor: 'white', paddingHorizontal: 32, paddingTop: 32, borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
        <View style={{ marginBottom: 6 }}>
          <Text style={{ color: '#4B5563', marginLeft: 16, marginBottom: 8 }}>
            Email Address
          </Text>
          <TextInput style={{ padding: 16, backgroundColor: '#9CA3AF', borderRadius: 25, marginBottom: 16, color: '#4B5563' }} value={email} onChangeText={value=> setEmail(value)} placeholder='Enter email' />
          <Text style={{ color: '#4B5563', marginLeft: 16, marginBottom: 8 }}>
            Password
          </Text>
          <TextInput style={{ padding: 16, backgroundColor: '#9CA3AF', borderRadius: 25, color: '#4B5563' }} value={password} onChangeText={value=> setPassword(value)} secureTextEntry placeholder='Enter password' />
          <TouchableOpacity onPress={handleForgotPassword} style={{ alignItems: 'flex-end', marginTop: 12 }}>
            <Text style={{ color: '#4B5563' }}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleSubmit} style={{ paddingVertical: 12, backgroundColor: '#FFCC00', borderRadius: 25, marginTop: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#4B5563' }}>Login</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <Text style={{ color: 'gray' }}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={{ fontWeight: 'bold', color: '#FFCC00', marginLeft: 4 }}>
                Sign up
              </Text>
          </TouchableOpacity>  
        </View>
        <View>
          {errorMessage ? <Text style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</Text> : null}
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  backButton: {
    position: 'absolute', 
    top: 16, 
    left: 16, 
    padding: 10, 
    zIndex: 10, 
  },
});