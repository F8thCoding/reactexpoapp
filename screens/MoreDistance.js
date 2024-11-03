import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const MoreDistance = () => {
  const [userSteps, setUserSteps] = useState(null); 
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedImage, setSelectedImage] = useState(null);
  const stepThresholds = [0, 20000, 30000, 40000, 50000, 60000];

  const [level, setLevel] = useState(1);

  
  const currentLevelSteps = stepThresholds[level];
  const nextLevelSteps = stepThresholds[level + 1] || stepThresholds[stepThresholds.length - 1];
  const progress = (userSteps - currentLevelSteps) / (nextLevelSteps - currentLevelSteps);


  useEffect(() => {
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setUserSteps(data.distance);
      } else {
        console.log('No such document!');
      }
    });
    return () => unsubscribe();
  }, []);


  const calculateLevel = (distance) => {
    for (let i = stepThresholds.length - 1; i >= 0; i--) {
      if (distance >= stepThresholds[i]) return i;
    }
    return 1;
  };

  useEffect(() => {
    setLevel(calculateLevel(userSteps));
  }, [userSteps]);

  const getImageForLevel = (level) => {
    switch (level) {
      case 1: return require('../assets/walking1.png');
      case 2: return require('../assets/walking2.png');
      case 3: return require('../assets/walking3.png');
      case 4: return require('../assets/walking4.png');
      case 5: return require('../assets/walking5.png');
      default: return require('../assets/walking1.png'); 
    }
  };


  const levelImages = {
    1: require('../assets/walking1.png'),
    2: require('../assets/walking2.png'),
    3: require('../assets/walking3.png'),
    4: require('../assets/walking4.png'),
    5: require('../assets/walking5.png'),
  };

  const levelTexts = {
    1: 'Start!',
    2: '20 KM!',
    3: '30 KM!',
    4: '40 KM!',
    5: '50 KM!',
  };

  const renderLevelImages = () => {
    return stepThresholds.map((threshold, index) => {
      const level = index+1;
      const isLocked = userSteps < threshold;
      return (
        <View key={`level-${level}`} style={styles.levelBadgeContainer}>
          {!isLocked ? (
            <TouchableOpacity onPress={() => {
              setSelectedImage(levelImages[level]);
              setModalVisible(true);
            }}>
              <Image source={levelImages[level]} style={styles.levelImage} />
            </TouchableOpacity>
          ) : (
            <View style={styles.lockedLevelContainer}>
              <Image source={levelImages[level]} style={styles.levelImageLocked} />
              <MaterialCommunityIcons name="lock" size={24} color="#ffffff" style={styles.lockIcon} />
            </View>
          )}
          <Text style={styles.levelText}>{levelTexts[level]}</Text>
        </View>
      );
    });
  };



  return (
    <ScrollView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton} >
            <MaterialCommunityIcons name="arrow-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>LEVEL</Text>
        <View style={{width: 30 }} />
      </View>
  
      <View style={styles.levelContainer}>
        <Image
          source={getImageForLevel(level+1)} 
          style={styles.levelImage}
        />
      </View>
      <Text style={styles.stepsToNextLevel}>
        {(nextLevelSteps - userSteps).toFixed(2)} more metres to reach Level {level+2}
      </Text>
      <Progress.Bar
        progress={Math.min(Math.max(progress, 0), 1)}
        width={null}
        height={20}
        borderWidth={0}
        borderRadius={5}
        color="#000"
        unfilledColor="#E0E0E0"
        style={styles.progressBar}
      />
      {renderLevelImages()}
      <Modal //Zoom in effect to display badges
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Image source={selectedImage} style={styles.zoomedImage} />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15, 
    backgroundColor: '#343A40', 
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
    levelBadge: {
        marginBottom: 20, 
    },
    levelBadgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20, 
      paddingHorizontal: 20, 
    },
    levelText: {
      color: '#F0AD4E',
      fontSize: 16,
      marginLeft: 15, 
    },
    levelImageLocked: {
      tintColor: 'rgba(255, 255, 255, 0.5)', 
      width: 120, 
      height: 120,
    },
    lockIcon: {
      position: 'absolute', 
      right: 10, 
      bottom: 10, 
    },
    lockedLevelContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    },
    centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  zoomedImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain', 
  },
  buttonClose: {
    marginTop: 15, 
    backgroundColor: "#28A745",
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 5, 
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  stepsToNextLevel: {
    color: '#F0AD4E', 
    fontSize: 18, 
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 10, 
  },
});


export default MoreDistance;
