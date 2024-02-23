import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  AntDesign,
  Entypo,
  Ionicons,
  FontAwesome,
  Feather,
} from "react-native-vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
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

export default function Messages() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    fetchDataFromFirestore()
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  const handleNavigation = () => {
    navigation.navigate("Main");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={80} color="#e4ce91" />
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <View
        style={{
          width: responsiveWidth(100),
          justifyContent: "space-between",
          paddingHorizontal: responsiveWidth(2),
          flexDirection: "row",
          alignItem: "center",
          height: responsiveHeight(5),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: responsiveWidth(70),
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={handleNavigation}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              marginLeft: responsiveWidth(4),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 18 }}> Alexander</Text>
            <Entypo name="chevron-small-down" size={22} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: responsiveWidth(30),
            alignItems: "center",
          }}
        >
          <TouchableOpacity>
            <Feather name="video" size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <FontAwesome name="pencil-square-o" size={23} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.searchContainer}>
        <FontAwesome
          name="search"
          size={18}
          color="grey"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="grey"
        />
      </View>
      <ScrollView>
        <FlatList
          data={userData}
          renderItem={({ item, index }) => (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: responsiveWidth(3),
                  marginVertical: responsiveHeight(1),
                }}
              >
                <TouchableOpacity
                  style={{
                    width: responsiveWidth(85),
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={{ uri: item.post }} style={styles.profile} />
                    <View style={{ marginLeft: responsiveWidth(3) }}>
                      <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {Math.trunc(Math.random() * 20 + 1)}+ New messages.
                        {Math.trunc(Math.random() * 20 + 1)}m
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="camera" size={18} color="black" />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: responsiveWidth(3),
                  marginVertical: responsiveHeight(1),
                }}
              >
                <TouchableOpacity
                  style={{
                    width: responsiveWidth(85),
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image
                      source={{ uri: item.stories }}
                      style={styles.profile}
                    />
                    <View style={{ marginLeft: responsiveWidth(3) }}>
                      <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
                      <Text style={{ fontWeight: "bold" }}>
                        {Math.trunc(Math.random() * 20 + 1)}+ New messages.
                        {Math.trunc(Math.random() * 20 + 1)}m
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Feather name="camera" size={18} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    marginVertical: responsiveHeight(1),
    marginHorizontal: responsiveWidth(5),
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#EBEBEB",
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    width: responsiveWidth(80),
    height: responsiveHeight(3),
    paddingLeft: responsiveWidth(5),
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
  },
  profile: {
    height: responsiveHeight(5),
    width: responsiveWidth(10),
    borderRadius: 50,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
