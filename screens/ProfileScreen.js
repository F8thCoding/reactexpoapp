import React, { useState, useEffect  } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput  } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../config/firebase'; 
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { signOut, sendEmailVerification } from 'firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const ProfileScreen = () => {
    const [username, setUsername] = useState('');
    const [weight, setWeight] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [height, setHeight] = useState('');
    const [setup, setSetup] = useState(null); 
    const [bmi, setBmi] = useState(null);
    const [bmiCategory, setBmiCategory] = useState('');
    const [dailyCalories, setDailyCalories] = useState(null);
    const [activityLevel, setActivityLevel] = useState('');
    const [emailVerified, setEmailVerified] = useState(auth.currentUser?.emailVerified);

    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.log('got error', err);
        }
    };

    //Update based on the current users email verification status
    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((user) => {
            if (user) {
                setEmailVerified(user.emailVerified);
            }
        })
        return () => {
            unsubscribeAuth();
        };
    }, []);

    //Get all data and performe bmi/calorie functions
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUsername(user.displayName || "User");
            const userDocRef = doc(db, 'users', user.uid);

            const unsubscribe = onSnapshot(userDocRef, (doc) => {
                if (doc.exists()) {
                    const userData = doc.data();
                    setWeight(userData.weight);
                    setHeight(userData.height);
                    setGender(userData.gender);
                    setActivityLevel(userData.activityLevel);
                    setAge(userData.age);
                    setSetup(userData.setup); 
                    if (userData.weight && userData.height && userData.age && userData.gender) {
                        const heightInMeters = userData.height / 100; 
                        const calculatedBmi = userData.weight / (heightInMeters ** 2);
                        calculateDailyCalories(userData.weight, userData.height, userData.age, userData.gender, userData.activityLevel);
                        setBmi(calculatedBmi.toFixed(1)); 
                        setBmiCategory(getBmiCategory(calculatedBmi)); 
                    }
                }
            }, (err) => {
                console.log('Error fetching user data:', err);
            });

            return () => unsubscribe();
        }
    }, []);

    //Handle the picker update of activityLevel
    const handleUpdateActivityLevel = async (level) => {
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userDocRef, { activityLevel: level });
                calculateDailyCalories(weight, height, age, gender, level);
            } catch (err) {
                console.log('Error updating activity level:', err);
            }
        }
    };

    const getBmiCategory = (bmi) => {
        if (bmi < 18.5) return 'Underweight';
        else if (bmi >= 18.5 && bmi < 25) return 'Normal weight';
        else if (bmi >= 25 && bmi < 30) return 'Overweight';
        else return 'Obesity';
    };

    //Fetch all user data and make sure it's available
    useEffect(() => {
        if (weight && height && age && gender && activityLevel) {
            calculateDailyCalories(weight, height, age, gender, activityLevel);
        }
    }, [weight, height, age, gender, activityLevel]);


    const calculateDailyCalories = (weight, height, age, gender, activityLevel) => {
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else if (gender === 'female') {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        let activityMultiplier = 1.2; // Default to sedentary
        switch (activityLevel) {
            case 'Lightly Active':
                activityMultiplier = 1.375;
                break;
            case 'Moderately Active':
                activityMultiplier = 1.55;
                break;
            case 'Very Active':
                activityMultiplier = 1.725;
                break;
            case 'Super Active':
                activityMultiplier = 1.9;
                break;
        }

        const calculatedCalories = bmr * activityMultiplier;
        setDailyCalories(Math.round(calculatedCalories));
    };

    //Verify email using firebase auth
    const handleVerifyEmail = async () => {
        const user = auth.currentUser;
        if (user && !user.emailVerified) {
            try {
                await sendEmailVerification(user);
                alert('Verification email sent. Please check your inbox.');
            } catch (err) {
                console.log('Error sending verification email:', err);
                alert('Failed to send verification email.');
            }
        } else {
            alert('Email is already verified or user is not logged in.');
        }
    };

    const handleUpdateField = async (field, value) => {
        if (!value.trim()) return; 
        const user = auth.currentUser;
        if (user) {
            const userDocRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userDocRef, { [field]: Number(value) });
            } catch (err) {
                console.log(`Error updating ${field}:`, err);
            }
        }
    };

    const activityLevelItems = [
        { label: "Sedentary", value: "Sedentary", key: "Sedentary", color: "#000000", style: { fontSize: 20 } },
        { label: "Lightly Active", value: "Lightly Active", key: "Lightly Active", color: "#000000", style: { fontSize: 20 } },
        { label: "Moderately Active", value: "Moderately Active", key: "Moderately Active", color: "#000000", style: { fontSize: 20 } },
        { label: "Very Active", value: "Very Active", key: "Very Active", color: "#000000", style: { fontSize: 20 } },
        { label: "Super Active", value: "Super Active", key: "Super Active", color: "#000000", style: { fontSize: 20 } }
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{username}'s Profile</Text>
            <MaterialCommunityIcons name="account-circle" size={100} color="#f0ad4e" style={styles.profileIcon} />
            <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Weight: {weight} kg</Text>
                <TextInput
                    style={styles.input}
                    value={weight.toString()}
                    onChangeText={text => {
                        setWeight(text);
                        handleUpdateField('weight', text);
                    }}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Height: {height} cm</Text>
                <TextInput
                    style={styles.input}
                    value={height.toString()}
                    onChangeText={text => {
                        setHeight(text);
                        handleUpdateField('height', text);
                    }}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.profileItem}>
                <Text style={styles.profileLabel}>Age: {age}</Text>
                <TextInput
                    style={styles.input}
                    value={age.toString()}
                    onChangeText={text => {
                        setAge(text);
                        handleUpdateField('age', text);
                    }}
                    keyboardType="numeric"
                />
            </View>
            {bmi && (
                <>
                    <Text style={styles.profileItem}>BMI: {bmi}</Text>
                    <Text style={styles.bmiCategory}>{bmiCategory}</Text>
                </>
            )}
            {dailyCalories && (
                <Text style={styles.profileItem}>Daily Calorie Intake: {dailyCalories} kcal</Text>
            )}
            <Text style={styles.profileLabel}>Activity Level:</Text>
            <Picker
                selectedValue={activityLevel}
                style={styles.picker}
                onValueChange={(itemValue) => handleUpdateActivityLevel(itemValue)}
            >
                {activityLevelItems.map((item) => (
                    <Picker.Item
                        label={item.label}
                        value={item.value}
                        key={item.key}
                        color={item.color}
                        style={item.style}
                    />
                ))}
            </Picker>
            {!emailVerified && (
                <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyEmail}>
                    <Text style={styles.buttonText}>Verify Email</Text>
                </TouchableOpacity>
            )}
            {setup === 'false' && ( //Check if setup is false to in order to display the create account button
                <TouchableOpacity style={styles.setupButton} onPress={() => navigation.navigate('SetupScreen')}>
                    <Text style={styles.buttonText}>Setup Profile</Text>
                </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>Log out</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
    profileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    profileLabel: {
        fontSize: 16,
        color: '#f0ad4e', 
        marginRight: 10,
    },
    picker: {
        width: 250, 
        height: 44,
        color: '#f0ad4e', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: 20, 
        overflow: 'hidden', 
    },
    setupButton: {
        marginTop: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#28a745', 
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    logoutButton: {
        marginTop: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: '#7E8C8D',
    },
    profileIcon: {
        marginBottom: 20, 
    },
    verifyButton: {
        marginTop: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: '#007bff', 
    },
    label: {
        fontSize: 16,
        color: '#f0ad4e',
        marginRight: 10,
    },
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        width: 100,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    bmiCategory: {
        fontSize: 18,
        color: '#f0ad4e',
        fontWeight: 'bold',
        marginTop: 10,
    },
});

export default ProfileScreen;
