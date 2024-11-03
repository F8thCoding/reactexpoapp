import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import { Pedometer } from 'expo-sensors';
import { useTheme } from './ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import MapView, { Polyline} from 'react-native-maps';
import * as Location from 'expo-location';
import { Picker } from '@react-native-picker/picker';
import { db, auth } from '../config/firebase'; 
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

const StepCounterScreen = () => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [subscription, setSubscription] = useState(null);
  const [stepGoal, setStepGoal] = useState();
  const [initialFirestoreSteps, setInitialFirestoreSteps] = useState(0); 
  const [sessionSteps, setSessionSteps] = useState(0);
  const [sessionDistance, setSessionDistance] = useState(0);
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startButtonStyle = subscription ? styles.buttonInactive : styles.buttonActive;
  const stopButtonStyle = subscription ? styles.buttonActive : styles.buttonInactive;
  const [location, setLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [locationSubscription, setLocationSubscription] = useState(null);

  //Create array from 1k to 550k steps
  const stepGoalItems = Array.from({ length: 250 }, (_, i) => ({
    label: `${1000 + i * 2000} Steps`,
    value: 1000 + i * 2000,
    key: `${1000 + i * 2000}`,
    color: "#000000", 
    style: { fontSize: 20 },
  }));

  const subscribeToLocationUpdates = () => {
    Location.watchPositionAsync({
      accuracy: Location.Accuracy.BestForNavigation,
      timeInterval: 5000,
      distanceInterval: 1,
    }, (locationUpdate) => {
      const { latitude, longitude } = locationUpdate.coords;
      setLocation({ latitude, longitude });
      setRouteCoordinates(prevCoords => [...prevCoords, { latitude, longitude }]);
    }).then(sub => {
      //Ensure previous subscriptions are cleared before setting a new one
      locationSubscription.current?.remove();
      locationSubscription.current = sub;
    });
  };


  useEffect(() => {
    setLocation(null);
    setRouteCoordinates([]);
  
    if (auth.currentUser) {
      //Resubscribe to location updates for the new user
      subscribeToLocationUpdates();
    } else {
      //Check that location updates are stopped when there is no logged in user
      locationSubscription.current?.remove();
    }
  
    //Cleanup function to stop location updates when the component unmounts or the user changes
    return () => {
      locationSubscription.current?.remove();
    };
  }, [auth.currentUser]);

  useFocusEffect(
    useCallback(() => {
      //Get initial steps for the pedometer
      const fetchInitialSteps = async () => {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setInitialFirestoreSteps(userData.steps || 0); // Set initial steps from Firestore
            setCurrentStepCount(userData.steps || 0); // Also set current steps to match
          }
        }
      };
      fetchInitialSteps();
  

      
    }, [])
  );
   //Empty dependency array means this effect runs once upon gaining focus

  
const renderMapView = () => {
  return location ? (
    <MapView
      key={auth.currentUser?.uid || 'map'} //Use the current users UID as a key to force reinitialization
      style={styles.map}
      showsUserLocation={true}
      followsUserLocation={true}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }}>
      <Polyline coordinates={routeCoordinates} strokeWidth={5} strokeColor="red" />
    </MapView>
  ) : null;
};

  const getStepProgress = () => {
    const safeStepGoal = Number(stepGoal) || 1; //Default to 1 to avoid division by zero
    return Math.min(currentStepCount / safeStepGoal, 1);
  };

  const calculateDistance = (steps) => {
    const stepLength = 0.762;
    return steps * stepLength; 
  };

  useEffect(() => {
    //Get the initial distance from Firestore when the component mounts or the user changes
    const fetchInitialDistance = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setDistance(userData.distance || 0); //Set the initial distance from Firestore
        }
      }
    };
  
    fetchInitialDistance();
  }, [auth.currentUser]);

  useEffect(() => {
    //Update session distance whenever sessionSteps change
    const newSessionDistance = calculateDistance(sessionSteps);
    setSessionDistance(newSessionDistance);
  }, [sessionSteps]);




  const calculateCaloriesBurned = () => {
    return (sessionSteps * 0.04).toFixed(2);
  };

  //Permissions for the pedometer. Not working?
  useEffect(() => {
    async function init() {
      let { status } = await Pedometer.requestPermissionsAsync();
      if (status !== 'granted') {
        setIsPedometerAvailable('denied');
      } else {
        setIsPedometerAvailable('granted');
      }
    }

    init();
  }, []);

  //Get the initial steps from the database and set them here
  const fetchInitialSteps = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setInitialFirestoreSteps(userData.steps || 0); 
        } else {
          console.log("No such user document!");
        }
      } catch (error) {
        console.error("Error fetching user's steps:", error);
      }
    }
  };

  const startPedometer = () => {
    if (!subscription) {
      setSessionDistance(0);
      fetchInitialSteps().then(() => {
        const sub = Pedometer.watchStepCount((result) => {
          setSessionSteps(result.steps); 
        });
        setSubscription(sub);
      });
    }
  };

  useEffect(() => {
    //current = initial+session
    setCurrentStepCount(initialFirestoreSteps + sessionSteps);
  }, [initialFirestoreSteps, sessionSteps]);

  const stopPedometerAndUpdateFirestore = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);

      const currentUser = auth.currentUser;
      if (currentUser) {
        const totalSteps = initialFirestoreSteps + sessionSteps;
        const userDocRef = doc(db, 'users', currentUser.uid);
        updateDoc(userDocRef, { steps: totalSteps })
          .then(() => console.log(`Total steps updated to ${totalSteps}`))
          .catch((error) => console.error("Error updating user's total steps:", error));
        getDoc(userDocRef).then((doc) => {
          if(doc.exists()) {
            const userData = doc.data();
            const totalDistance = (userData.distance || 0) + sessionDistance;
            updateDoc(userDocRef, { distance: totalDistance }).then(()=> console.log(`Total distance updated to ${totalDistance} metres`)).catch((error)=> console.error("Error updating total user distance:", error));
          }
        });
      }
      setSessionSteps(0);
    }
  };



  useEffect(() => {
    //Cleanup for when the component unmounts
    return () => {
      if (subscription) subscription.remove();
    };
  }, [subscription]);


  return (
    <View style={styles.container}>
      <Text style={styles.text}>Set your step goal:</Text>
      <Picker
        selectedValue={stepGoal} 
        style={styles.picker}
        onValueChange={(itemValue) => setStepGoal(Number(itemValue))}
      >
        {stepGoalItems.map((item) => (
          <Picker.Item
            label={item.label}
            value={item.value}
            key={item.key}
            color={item.color}
            style={item.style} 
          />
        ))}
      </Picker>
      <Text style={styles.text}>Current steps: {currentStepCount}</Text>
      <Progress.Bar
        progress={getStepProgress()}
        width={null} 
        height={20}
        borderWidth={0}
        borderRadius={5}
        color="#000"
        unfilledColor="#E0E0E0"
        style={styles.progressBar}
      />
      <View style={styles.weekContainer}>
        {daysOfWeek.map((day, index) => (
          <Text key={day} style={[styles.day, currentDay === index && styles.selectedDay]}>{day}</Text>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={startPedometer} style={startButtonStyle}>
          <MaterialCommunityIcons name="play" size={24} color={theme === 'light' ? '#000' : '#FFF'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={stopPedometerAndUpdateFirestore} style={stopButtonStyle} disabled={!subscription}>
          <MaterialCommunityIcons name="stop" size={24} color={theme === 'light' ? '#000' : '#FFF'} />
        </TouchableOpacity>
      </View>

      <View style={styles.exerciseDetails}>
        <Text style={styles.text}>Distance Walked: {sessionDistance.toFixed(2)} metres</Text>  
        <Text style={styles.text}>Calories Burned: {calculateCaloriesBurned()} kcal</Text>
      </View>
      {renderMapView()}
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#343a40',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f0ad4e',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#f0ad4e', 
    margin: 10,
  },
  picker: {
    width: 250, 
    height: 44,
    color: '#f0ad4e', 
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginBottom: 20, 
  },
  progressBar: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#555',
    borderColor: '#f0ad4e',
  },
  buttonActive: {
    padding: 10,
    margin: 5,
    backgroundColor: '#28a745', 
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonInactive: {
    padding: 10,
    margin: 5,
    backgroundColor: '#7E8C8D', 
    borderRadius: 5,
    alignItems: 'center',
  },
  day: {
    color: '#f0ad4e', 
    fontSize: 16,
    marginHorizontal: 5, 
  },
  selectedDay: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20, 
  },
  exerciseDetails: {
    marginTop: 20, 
  },
  map: {
    width: Dimensions.get('window').width,
    height: 300, 
    marginTop: 20, 
  },
});

export default StepCounterScreen;
