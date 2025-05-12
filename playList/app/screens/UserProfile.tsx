import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { auth, db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from 'firebase/auth';
import { useRouter } from "expo-router";


const UserAccountScreen = () => {
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

    useEffect(() => {
      const fetchUserProfile = async () => {
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          }
        }
      };

      fetchUserProfile();
    }, []);

    {/*To logout*/}
    const logout = async () => {
      console.log('Logout pressed');
      try {
        await signOut(auth);
        router.navigate("../login");
      } catch (error) {
        console.error('Logout Error:', error);
      }
    };
    

  return (
    <SafeAreaView style={styles.container}>
      {/* Header + Divider */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
        <Image
          source={require("@/assets/images/myicon.png")}
          style={styles.icon}
        />
          <Text style={styles.headerText}>User Account</Text>
        </View>
        <View style={styles.divider} />
      </View>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <Image 
            source={require("@/assets/images/userProfileImage.jpg")} 
            style={styles.profileImage} />
        <View style={styles.profileDetails}>
          <Text style={styles.detailLabel}>Name:</Text>
          <Text style={styles.detailValue}>{userData?.fullName || "Loading..."}</Text>

          <Text style={styles.detailLabel}>Email:</Text>
          <Text style={styles.detailValue}>{userData?.email || "Loading..."}</Text>

          <Text style={styles.detailLabel}>Phone:</Text>
          <Text style={styles.detailValue}>{userData?.phone || "Loading..."}</Text>
        </View>
      </View>

      {/* Update and Log Out Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button}  onPress={() => router.navigate('/UpdateAccount')}>
          <Text style={styles.buttonText}>Update Account</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={logout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserAccountScreen;



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerContainer: {
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    width:50,
    height: 50

  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    width: '100%',
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#E0E8FF',
    borderWidth: 2,
    borderColor: '#00C853',
    borderRadius: 12,
    padding: 20,
    alignSelf: 'center',
    width: '90%',
    height: 160,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 20,
    backgroundColor: '#ccc',
  },
  profileDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  detailLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
  detailValue: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    width: '90%',
    marginTop: 10,
  },
  button: {
    backgroundColor:  '#1DB954',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    flex: 0.45,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});







