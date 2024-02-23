import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Touchable,
  Button,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  Feather,
  Entypo,
  AntDesign,
  Ionicons,
  EvilIcons,
} from "react-native-vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCh1ezAGozOiL4SQlo6BODXGvdqkFxLxIY",
  authDomain: "instagram-a306d.firebaseapp.com",
  projectId: "instagram-a306d",
  storageBucket: "instagram-a306d.appspot.com",
  messagingSenderId: "1051683228023",
  appId: "1:1051683228023:web:96968c5191c7b9869e7972",
  measurementId: "G-0FHPYTESC2",
};

const app = initializeApp(firebaseConfig);

export default function Profile() {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchDataFromFirestore = async () => {
    try {
      const firestore = getFirestore();
      const userCollectionRef = collection(firestore, "user");

      const querySnapshot = await getDocs(userCollectionRef);

      const userData = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userData.push(data);
      });

      return userData;
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchDataFromFirestore().then((data) => {
      setUserData(data);
      setIsLoading(false);
    });
  }, []);

  const profileImage = userData.length > 0 ? userData[0].profile : null;
  const profileName = userData.length > 0 ? userData[1].name : null;
  const filteredUserData = userData.filter((item) => item.id === 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            height: responsiveHeight(5),
            alignItems: "center",
            width: responsiveWidth(35),
            justifyContent: "space-around",
          }}
        >
          <Feather name="lock" size={24} color="black" />
          <TouchableOpacity
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text
              style={{ fontSize: responsiveFontSize(2.3), fontWeight: "bold" }}
            >
              {profileName}
            </Text>
            <Entypo name="chevron-small-down" size={18} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            height: responsiveHeight(5),
            width: responsiveWidth(25),
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <Feather name="plus-square" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather
              name="menu"
              size={24}
              color="black"
              style={{ marginLeft: responsiveWidth(7) }}
            />
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size={80} color="#e4ce91" />
        </View>
      ) : (
        <ScrollView>
          <View style={styles.profile}>
            {profileImage && (
              <Image source={{ uri: profileImage }} style={styles.image} />
            )}
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold" }}>
                {Math.trunc(Math.random() * 20 + 1)}
              </Text>
              <Text>Post</Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold" }}>
                {Math.trunc(Math.random() * 2000 + 1)}
              </Text>
              <Text>Followers</Text>
            </View>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontWeight: "bold" }}>
                {Math.trunc(Math.random() * 500 + 1)}
              </Text>
              <Text>Following</Text>
            </View>
          </View>
          <View
            style={{
              marginVertical: responsiveHeight(2),
              paddingHorizontal: responsiveWidth(6),
            }}
          >
            <Text
              style={{ fontSize: responsiveFontSize(2), fontWeight: "bold" }}
            >
              {profileName}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: responsiveWidth(5),
              height: responsiveHeight(6),
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "lightgrey",
                height: responsiveHeight(3.7),
                width: responsiveWidth(37),
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Text>Edit profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "lightgrey",
                height: responsiveHeight(3.7),
                width: responsiveWidth(37),
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Text>Share profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "lightgrey",
                height: responsiveHeight(3.7),
                width: responsiveWidth(8),
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <AntDesign name="adduser" size={18} color="black" />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginVertical: responsiveHeight(1),
            }}
          >
            <TouchableOpacity>
              <Image
                source={require("../assets/square.jpg")}
                style={styles.logoContainer}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require("../assets/video.jpg")}
                style={styles.logoContainer}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require("../assets/tag.jpg")}
                style={styles.logoContainer}
              />
            </TouchableOpacity>
          </View>
          <View>
            {filteredUserData.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  height: responsiveHeight(18),
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  paddingHorizontal: responsiveWidth(2),
                }}
              >
                <Image
                  source={{ uri: item.profile }}
                  style={{
                    height: responsiveHeight(16),
                    width: responsiveWidth(31),
                    margin: responsiveHeight(0.1),
                  }}
                />
                <Image
                  source={{ uri: item.post }}
                  style={{
                    height: responsiveHeight(16),
                    width: responsiveWidth(31),
                    margin: responsiveHeight(0.1),
                  }}
                />
                <Image
                  source={{ uri: item.stories }}
                  style={{
                    height: responsiveHeight(16),
                    width: responsiveWidth(31),
                    margin: responsiveHeight(0.1),
                  }}
                />
              </View>
            ))}
          </View>
          <View
            style={{
              height: responsiveHeight(8),
              justifyContent: "center",
              paddingHorizontal: responsiveWidth(3),
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              Complete your profile
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ color: "green" }}>3 of 4</Text>
              <Text style={{ color: "grey" }}> Complete</Text>
            </View>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", width: responsiveWidth(200) }}>
              <View
                style={{
                  height: responsiveHeight(25),
                  width: responsiveWidth(45),
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  borderWidth: 0.5,
                  borderColor: "lightgrey",
                  borderRadius: 5,
                  marginLeft: responsiveWidth(3),
                  paddingHorizontal: responsiveWidth(2),
                }}
              >
                <View
                  style={{
                    height: responsiveHeight(8),
                    width: responsiveHeight(8),
                    borderRadius: 50,
                    borderColor: "lightgrey",
                    borderWidth: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={25}
                    color="lightgrey"
                  />
                </View>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(2),
                  }}
                >
                  Add bio
                </Text>
                <Text style={{ color: "lightgrey" }}>
                  Tell your followers a little bit about yourself
                </Text>
                <Button
                  title="Add bio"
                  style={{
                    height: responsiveHeight(2.5),
                    width: responsiveWidth(6),
                    borderRadius: 10,
                  }}
                />
              </View>
              <View
                style={{
                  height: responsiveHeight(25),
                  width: responsiveWidth(45),
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  borderWidth: 0.5,
                  borderColor: "lightgrey",
                  borderRadius: 5,
                  marginLeft: responsiveWidth(3),
                  paddingHorizontal: responsiveWidth(2),
                }}
              >
                <View
                  style={{
                    height: responsiveHeight(8),
                    width: responsiveHeight(8),
                    borderRadius: 50,
                    borderColor: "lightgrey",
                    borderWidth: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="user" size={25} color="lightgrey" />
                </View>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(2),
                  }}
                >
                  Add your name
                </Text>
                <Text style={{ color: "lightgrey" }}>
                  Add your full name so your freind know its you.
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "lightgrey",
                    height: responsiveHeight(4),
                    width: responsiveWidth(20),
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Edit Name</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: responsiveHeight(25),
                  width: responsiveWidth(45),
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  borderWidth: 0.5,
                  borderColor: "lightgrey",
                  borderRadius: 5,
                  marginLeft: responsiveWidth(3),
                  paddingHorizontal: responsiveWidth(2),
                }}
              >
                <View
                  style={{
                    height: responsiveHeight(8),
                    width: responsiveHeight(8),
                    borderRadius: 50,
                    borderColor: "lightgrey",
                    borderWidth: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <EvilIcons name="user" size={30} color="lightgrey" />
                </View>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(2),
                  }}
                >
                  Add profile photo
                </Text>
                <Text style={{ color: "lightgrey" }}>
                  choose a profile photo to represent yourself on instagram
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "lightgrey",
                    height: responsiveHeight(4),
                    width: responsiveWidth(28),
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Change photo</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  height: responsiveHeight(25),
                  width: responsiveWidth(45),
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  borderWidth: 0.5,
                  borderColor: "lightgrey",
                  borderRadius: 5,
                  marginLeft: responsiveWidth(3),
                  paddingHorizontal: responsiveWidth(2),
                }}
              >
                <View
                  style={{
                    height: responsiveHeight(8),
                    width: responsiveHeight(8),
                    borderRadius: 50,
                    borderColor: "lightgrey",
                    borderWidth: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather name="users" size={25} color="lightgrey" />
                </View>
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: responsiveFontSize(2),
                  }}
                >
                  Find people to follow
                </Text>
                <Text style={{ color: "lightgrey" }}>
                  Folloe people and interests you care about.
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: "lightgrey",
                    height: responsiveHeight(4),
                    width: responsiveWidth(20),
                    borderRadius: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Find more</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(3),
    alignItems: "center",
    height: responsiveHeight(5),
  },
  image: {
    height: responsiveHeight(10),
    width: responsiveWidth(20),
    borderRadius: 50,
  },
  profile: {
    marginVertical: responsiveHeight(1),
    height: responsiveHeight(10),
    width: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoContainer: {
    height: responsiveHeight(6),
    width: responsiveWidth(12),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
