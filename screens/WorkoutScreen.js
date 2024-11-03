import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

const WorkoutScreen = () => {
  const [timerRunning, setTimerRunning] = useState(false);

  const [timer, setTimer] = useState(5 * 60); 

  //Timer
  useEffect(() => {
    let interval;
    if (timerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (!timerRunning && timer !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timerRunning, timer]);

  const startWorkout = () => {
    setTimerRunning(true);
    setTimer(5 * 60); 
  };

  const stopWorkout = () => {
    setTimerRunning(false);
  };



  const styles = getStyles();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Workout Timer</Text>

      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>
          {`${Math.floor(timer / 60)}:${`0${timer % 60}`.slice(-2)}`}
        </Text>
        <TouchableOpacity onPress={timerRunning ? stopWorkout : startWorkout} style={styles.timerButton}>
          <Text style={styles.timerButtonText}>{timerRunning ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Running</Text>
        <Image style={styles.image} source={require('../assets/running.jpg')} />
        <Text style={styles.infoText}>
          Running improves cardiovascular health and promotes mental well-being. Did you know that regular running can lead to a longer life expectancy?
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
          <Text style={styles.startButtonText}>Start Running</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionHeader}>Cycling</Text>
        <Image style={styles.image} source={require('../assets/cycling.jpg')} />
        <Text style={styles.infoText}>
          Cycling is excellent for building muscle and reducing stress. Fun fact: The longest tandem bike ever built was almost 67 feet long!
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={startWorkout}>
          <Text style={styles.startButtonText}>Start Cycling</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262626',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0AD4E',
    marginBottom: 20,
  },
  timerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  timerText: {
    fontSize: 48,
    color: '#F0AD4E',
    fontWeight: 'bold',
  },
  timerButton: {
    marginTop: 20,
    backgroundColor: '#F0AD4E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  timerButtonText: {
    fontSize: 20,
    color: '#262626',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F0AD4E',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#F0AD4E',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default WorkoutScreen;
