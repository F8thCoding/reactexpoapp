import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import { auth } from '../config/firebase';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const SetupScreen = () => {
    const [displayName, setDisplayName] = useState('');
    const [gender, setGender] = useState(null);
    const isGenderSelected = gender !== null;

    //Fetch the username from the database and set it on the app
    useEffect(() => {
      const fetchUserData = async () => {
        const user = auth.currentUser;
        if (user !== null) {
            setDisplayName(user.displayName);
        }
      }
      fetchUserData();
    }, []);

    //Update the gender on the firestore databa based on the selection
    const updateGenderInDatabase = async (selectedGender) => {
      const userRef = doc(db, 'users', auth.currentUser.uid);

      try {
          await updateDoc(userRef, {
              gender: selectedGender,
          });
          console.log('Gender updated to:', selectedGender);
      } catch (error) {
          console.error('Error updating gender:', error);
      }
    };

  const handleGenderSelect = (selectedGender) => {
      setGender(selectedGender);
      updateGenderInDatabase(selectedGender);
    };    

    const navigation = useNavigation();

    return (
      <SafeAreaView style={styles.safeArea}>
          <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}>
                  <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.title}>Welcome {displayName}</Text>
            <Text style={styles.subtitle}>Select Gender</Text>
        <View style={styles.contentContainer}>
          <View style={styles.genderContainer}>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'female' && styles.genderOptionSelectedFemale,
              ]}
              onPress={() => handleGenderSelect('female')}>
              <Image source={require('../assets/female-modified.png')} style={styles.genderImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.genderOption,
                gender === 'male' && styles.genderOptionSelectedMale,
              ]}
              onPress={() => handleGenderSelect('male')}>
              <Image source={require('../assets/male-modified.png')} style={styles.genderImage} />
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
                style={[styles.nextButton, !isGenderSelected && styles.nextButtonDisabled]}
                onPress={() => isGenderSelected && navigation.navigate('SetupScreen2')}
                disabled={!isGenderSelected} //Disable button if gender is null
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2C3E50', 
  },     
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C3E50',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%', 
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  nextButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#27AE60',
  },
  logoutButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#7E8C8D',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C3E50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  genderOption: {
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderOptionSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  genderText: {
    color: 'white',
    fontSize: 18,
  },
  genderImage: {
    width: 120, 
    height: 120, 
    borderRadius: 60, 
  },
  genderOptionSelectedFemale: {
    backgroundColor: 'pink',
    borderRadius: 60,
  },
  genderOptionSelectedMale: {
    backgroundColor: 'blue',
    borderRadius: 60, 
  },
  backButton: {
    position: 'absolute', 
    top: 16, 
    left: 16, 
    padding: 10, 
    zIndex: 10, 
  },
  nextButtonDisabled: {
    backgroundColor: '#7E8C8D',
  },
});

export default SetupScreen;
