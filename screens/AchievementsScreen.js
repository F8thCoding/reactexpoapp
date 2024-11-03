import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const AchievementsScreen = () => {
  const [userSteps, setUserSteps] = useState(null); 
  const navigation = useNavigation();
  const [userDistance, setUserDistance] = useState(null);
  const stepThresholds = [0, 200000, 300000, 400000, 500000, 600000];
  const distanceThresholds = [0, 20000, 30000, 40000, 50000, 60000];

  
  const [level, setLevel] = useState(1); 
  const [distanceLevel, setDistanceLevel] = useState(1); 

  const currentLevelSteps = stepThresholds[level];
  const nextLevelSteps = stepThresholds[level + 1] || stepThresholds[stepThresholds.length - 1]; //last threshold if the level is maxed out
  const progress = (userSteps - currentLevelSteps) / (nextLevelSteps - currentLevelSteps);

  const currentLevelDistance = distanceThresholds[distanceLevel];
  const nextLevelDistance = distanceThresholds[distanceLevel + 1] || distanceThresholds[distanceThresholds.length - 1];
  const distanceProgress = (userDistance - currentLevelDistance) / (nextLevelDistance - currentLevelDistance);


  useEffect(() => {
    const userRef = doc(db, 'users', auth.currentUser.uid); 
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserSteps(data.steps);
        setUserDistance(data.distance); 
      } else {
        console.log('No such document!');
      }
    });

    return () => unsubscribe(); 
  }, []);


  const calculateLevel = (steps) => {
    for (let i = stepThresholds.length - 1; i >= 0; i--) {
      if (steps >= stepThresholds[i]) return i;
    }
    return 1;
  };

  const calculateDistance = (distance) => {
    for (let i = distanceThresholds.length - 1; i >= 0; i--) {
      if (distance >= distanceThresholds[i]) return i;
    }
    return 1;
  };

  useEffect(() => {
    setLevel(calculateLevel(userSteps || 0));
  }, [userSteps]);

  useEffect(() => {
    setDistanceLevel(calculateDistance(userDistance || 0));
  }, [userDistance]);


  //Assign each image to a number based on level
  const getImageForLevel = (level) => {
    switch (level) {
      case 1: return require('../assets/level1.png');
      case 2: return require('../assets/level2.png');
      case 3: return require('../assets/level3.png');
      case 4: return require('../assets/level4.png');
      case 5: return require('../assets/level5.png');
      default: return require('../assets/level1.png'); 
    }
  };

  //Assign each image to a number based on level
  const getImageForDistance = (distanceLevel) => {
    switch (distanceLevel) {
      case 1: return require('../assets/walking1.png');
      case 2: return require('../assets/walking2.png');
      case 3: return require('../assets/walking3.png');
      case 4: return require('../assets/walking4.png');
      case 5: return require('../assets/walking5.png');
      default: return require('../assets/walking1.png'); 
    }
  };


  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Level</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => navigation.navigate('MoreAchievements')} 
        >
          <Text style={styles.moreButtonText}>More1</Text>
        </TouchableOpacity>
      </View>
  
      <View style={styles.levelContainer}>
        <Image
          source={getImageForLevel(level+1)} 
          style={styles.levelImage}
        />
      </View>
      <Text style={styles.stepsToNextLevel}>
        {nextLevelSteps - userSteps} more steps to reach Level {level+2}
      </Text>
      <Progress.Bar
        progress={Math.min(Math.max(progress, 0), 1)} //Ensure progress is between 0 and 1
        width={null} 
        height={20}
        borderWidth={0}
        borderRadius={5}
        color="#000"
        unfilledColor="#E0E0E0"
        style={styles.progressBar}
      />
      <View style={styles.separatorLine}></View>
      <View style={styles.topBar}>
        <Text style={styles.title}>Distance walked</Text>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => navigation.navigate('MoreDistance')} 
        >
          <Text style={styles.moreButtonText}>More</Text>
        </TouchableOpacity>
      </View>
  
      <View style={styles.levelContainer}>
        <Image
          source={getImageForDistance(distanceLevel+1)} 
          style={styles.levelImage}
        />
      </View>
      <Text style={styles.stepsToNextLevel}>
        {(nextLevelDistance - userDistance).toFixed(2)} more metres to reach Level {distanceLevel+2}
      </Text>
      <Progress.Bar
        progress={Math.min(Math.max(distanceProgress, 0), 1)} 
        width={null}
        height={20}
        borderWidth={0}
        borderRadius={5}
        color="#000"
        unfilledColor="#E0E0E0"
        style={styles.progressBar}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626', 
  },
  separatorLine: {
    height: 2,
    backgroundColor: '#444', 
    marginVertical: 20, 
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15, 
    backgroundColor: '#333333', 
  },
  title: {
    color: '#F0AD4E', 
    fontSize: 20, 
    fontWeight: 'bold',
  },
  levelContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 25, 
  },
  levelImage: {
    width: 120,
    height: 120,
    borderRadius: 60, 
  },
  progressBar: {
    marginTop: 15,
    width: '90%', 
    alignSelf: 'center',
    height: 22, 
    borderRadius: 11, 
    backgroundColor: '#585858', 
    borderColor: '#F0AD4E',
    borderWidth: 2, 
  },
  moreButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    backgroundColor: '#F0AD4E', 
  },
  moreButtonText: {
    color: '#262626', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepsToNextLevel: {
    color: '#F0AD4E',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
});



export default AchievementsScreen;
