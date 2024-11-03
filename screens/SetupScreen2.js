import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import { auth } from '../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';

const SetupScreen2 = () => {
    const [weight, setWeight] = useState(20); 
    const [height, setHeight] = useState(40);

    //Update the database based on the selection
    const updateProfile = async () => {
      const userRef = doc(db, 'users', auth.currentUser.uid);

      try {
          await updateDoc(userRef, {
              weight: weight,
              height: height
          });
          console.log('Profile updated to:', {weight, height});
      } catch (error) {
          console.error('Error updating gender:', error);
      }
    };

    useEffect(() => {
      if (weight > 0) {
        updateProfile();
      }
    }, [weight]); 

    //Update profile when height changes
    useEffect(() => {
      if (height > 0) { 
        updateProfile();
      }
    }, [height]);

    const handleDonePress = async () => {
      const userRef = doc(db, 'users', auth.currentUser.uid);
      try {
          await updateDoc(userRef, {
              setup: 'true'
          });
          console.log('Profile updated to:', {weight, height});
      } catch (error) {
          console.error('Error updating gender:', error);
      }
      navigation.navigate('Home', { screen: 'Profile' });
    };
 

    const navigation = useNavigation();

    const weightItems = [...Array(231)].map((_, index) => ({
      label: `${20 + index} kg`,
      value: 20 + index,
      key: (20 + index),
      color: "#000000", 
      style: { fontSize: 20 },
    }));
    
    const heightItems = [...Array(211)].map((_, index) => ({
      label: `${40 + index} cm`,
      value: 40 + index,
      key: (40 + index),
      color: "#000000", 
      style: { fontSize: 20 }, 
    }));

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>Set Your Profile</Text>
          <Text style={styles.selectedValueText}>Selected Weight: {weight} kg</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={weight}
              style={styles.picker}
              onValueChange={(itemValue) => {
                setWeight(itemValue);
              }}>
              {weightItems.map((item) => (
                <Picker.Item
                  label={item.label}
                  value={item.value}
                  key={item.key}
                  color={item.color}
                  style={item.style}
                />
              ))}
            </Picker>
          </View>
          <Text style={styles.selectedValueText}>Selected Height: {height} cm</Text>
          <View style={styles.pickerContainer}>
            <Picker
            selectedValue={height}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setHeight(itemValue);
            }}>
            {heightItems.map((item) => (
              <Picker.Item
                label={item.label}
                value={item.value}
                key={item.key}
                color={item.color}
                style={item.style} 
              />
            ))}
          </Picker>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.nextButton} onPress={handleDonePress}>
              <Text style={styles.buttonText}>Done</Text>
            </TouchableOpacity>
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
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
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
  backButton: {
    position: 'absolute', 
    top: 16, 
    left: 16, 
    padding: 10,
    zIndex: 10, 
  },
  pickerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  picker: {
    width: 200,
    height: 44,
    backgroundColor: '#fff',
    marginBottom: 20,
    itemStyle: '',
    color: 'white',
  },
  pickerItem: {
    fontSize: 16, 
    color: 'white', 
  },
  selectedValueText: {
    fontSize: 18,
    color: 'white',
    marginVertical: 8, 
  },
});


export default SetupScreen2;
