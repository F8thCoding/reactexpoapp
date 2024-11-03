import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { db , auth } from '../config/firebase'; 
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const LeaderboardsScreen = () => {
  const [userSteps, setUserSteps] = useState([]);
  const currentUserID = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('steps', 'desc')); 

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const steps = [];
      querySnapshot.forEach((doc) => {
        steps.push({ id: doc.id, ...doc.data() });
      });
      console.log(steps);
      setUserSteps(steps);
    });

    //Clean up the listener once the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LEADERBOARD</Text>
      <FlatList
        data={userSteps}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={[styles.listItem, index === 0 ? styles.firstItem : {}]}>
            <Text style={styles.rank}>{index + 1}</Text>
            <Text style={styles.playerName}>{item.username || 'Anonymous'}</Text>
            <Text style={styles.matches}>--</Text> 
            <Text style={styles.steps}>{item.steps}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#1E1E1E',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F0AD4E', 
    textAlign: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: '#343A40', 
  },
  listItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical: 5, 
    borderRadius: 10, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  firstItem: {
    backgroundColor: '#F0AD4E',
    color: '#1E1E1E', 
  },
  rank: {
    width: '10%',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#343A40',
  },
  playerName: {
    width: '50%',
    fontSize: 16,
    color: '#343A40', 
    textAlign: 'left', 
  },
  matches: {
    width: '0%',
  },
  steps: {
    width: '40%', 
    fontSize: 16,
    fontWeight: 'bold',
    color: '#343A40',
    textAlign: 'right', 
  },
  listContainer: {
    width: '100%', 
    flexGrow: 1,
  },
});


export default LeaderboardsScreen;
