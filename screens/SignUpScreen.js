import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default function SignUpScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 

  //Create the initial user profile, initialised with the following values
  const handleSubmit = async ()=>{
    if(email && password){
      try{
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredentials.user, {displayName: username});
        console.log('User signed up with:', username);

        const userDocRef = doc(db, 'users', userCredentials.user.uid);
        await setDoc(userDocRef, {
          username: username,
          email: email,
          gender: 'null',
          height: 0,
          weight: 0,
          age: 0,
          activityLevel: '',
          setup: 'false',
          steps: 0,
          distance: 0,
        });

      }catch(err){
        console.log('got error', err);
        setErrorMessage(err.message);
      }
    } else {
      setErrorMessage('Please fill in all fields.');
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
      <View style={{ flex: 3.5, backgroundColor: 'white', paddingHorizontal: 32, paddingTop: 32, borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
        <View style={{ marginBottom: 6 }}>
        <Text style={{ color: '#4B5563', marginLeft: 16, marginBottom: 8 }}>
            Username
          </Text>
          <TextInput style={{ padding: 16, backgroundColor: '#9CA3AF', borderRadius: 25, marginBottom: 16, color: '#4B5563' }} value={username} onChangeText={value=> setUsername(value)} placeholder='Enter username' />
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
          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#4B5563' }}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
          <Text style={{ color: 'gray' }}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ fontWeight: 'bold', color: '#FFCC00', marginLeft: 4 }}>
              Log in
            </Text>
          </TouchableOpacity>
        </View>
        <View>
        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginVertical: 10, 
  },
  backButton: {
    position: 'absolute', 
    top: 16, 
    left: 16, 
    padding: 10, 
    zIndex: 10, 
  },
});