import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { AntDesign, Feather, Ionicons } from "react-native-vector-icons";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import Modal from "react-native-modal";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

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

export default function Notification() {
  const [userData, setUserData] = useState([]);
  const [randomHoursAgo] = useState(Math.trunc(Math.random() * 24 - 1));
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selectComment, setselectComment] = useState(false);
  const [isFollow, setisFollow] = useState(false);
  const [isVerified, setisVerified] = useState(false);
  const [isPeople, setisPeople] = useState(false);
  const [filters, setFilters] = useState({
    selected: false,
    comment: false,
    follow: false,
    verified: false,
    people: false,
  });

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

  const handleSelected = () => {
    setIsSelected(!isSelected);
  };

  const handleComment = () => {
    setselectComment(!selectComment);
  };

  const handlefollow = () => {
    setisFollow(!isFollow);
  };

  const handleverified = () => {
    setisVerified(!isVerified);
  };

  const handlepeople = () => {
    setisPeople(!isPeople);
  };

  const handleclear = () => {
    setIsSelected(false),
      setselectComment(false),
      setisFollow(false),
      setisVerified(false),
      setisPeople(false);
  };

  const filteredData = userData.filter((item) => {
    return (
      (!filters.selected || item.selected) &&
      (!filters.comment || item.comment) &&
      (!filters.follow || item.follow) &&
      (!filters.verified || item.verified) &&
      (!filters.people || item.people)
    );
  });

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size={80} color="#e4ce91" />
      </View>
    );
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleApply = () => {
    setFilters(filters);
    toggleModal();
  };

  return (
    <ScrollView>
      <View style={styles.main}>
        <View
          style={{
            flexDirection: "row",
            width: responsiveWidth(100),
            justifyContent: "space-between",
            paddingHorizontal: responsiveWidth(3),
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: responsiveWidth(50),
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={handleNavigation}>
              <AntDesign name="arrowleft" size={25} color="black" />
            </TouchableOpacity>
            <Text style={{ paddingLeft: responsiveWidth(2), fontSize: 18 }}>
              Notification
            </Text>
          </View>
          <TouchableOpacity onPress={toggleModal}>
            <Text
              style={{
                fontSize: 18,
                color: "#0195F7",
              }}
            >
              Filter
            </Text>
          </TouchableOpacity>
        </View>
        <Modal
          transparent={true}
          visible={isModalVisible}
          onSwipeComplete={() => setModalVisible(false)}
          swipeDirection="down"
          onBackdropPress={() => setModalVisible(false)}
          style={{
            marginBottom: 0,
            marginLeft: 0,
          }}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          <View style={styles.modalView}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  height: responsiveHeight(4),
                }}
                onPress={toggleModal}
              >
                <Image
                  source={require("../assets/swipe.jpg")}
                  style={{
                    height: responsiveHeight(3),
                    width: responsiveWidth(12),
                  }}
                />
              </TouchableOpacity>
              <View
                style={{
                  width: responsiveWidth(100),
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <View
                  style={{
                    width: responsiveWidth(60),
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: responsiveWidth(4),
                    alignItems: "center",
                    marginVertical: responsiveHeight(1),
                  }}
                >
                  <Text style={{ fontSize: 18 }}>Filter</Text>
                  <TouchableOpacity onPress={handleclear}>
                    <Text style={{ fontSize: 18, color: "darkgray" }}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.horizentalLine}></View>
              <Text
                style={{
                  marginVertical: responsiveHeight(2),
                  paddingHorizontal: responsiveWidth(3),
                  fontSize: 16,
                }}
              >
                Categories
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: responsiveWidth(3),
                  marginVertical: responsiveHeight(2),
                }}
                onPress={handleSelected}
              >
                <Text style={{ fontSize: 16 }}>Tags & mentions</Text>
                {isSelected ? (
                  <Ionicons name="checkmark-circle" size={18} color="#0195F7" />
                ) : (
                  <Feather name="circle" size={18} color="black" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: responsiveWidth(3),
                  marginVertical: responsiveHeight(2),
                }}
                onPress={handleComment}
              >
                <Text style={{ fontSize: 16 }}>Comments</Text>
                {selectComment ? (
                  <Ionicons name="checkmark-circle" size={18} color="#0195F7" />
                ) : (
                  <Feather name="circle" size={18} color="black" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: responsiveWidth(3),
                  marginVertical: responsiveHeight(2),
                }}
                onPress={handlefollow}
              >
                <Text style={{ fontSize: 16 }}>Follows</Text>
                {isFollow ? (
                  <Ionicons name="checkmark-circle" size={18} color="#0195F7" />
                ) : (
                  <Feather name="circle" size={18} color="black" />
                )}
              </TouchableOpacity>
              <View style={styles.horizentalLine}></View>
              <Text
                style={{
                  marginVertical: responsiveHeight(2),
                  paddingHorizontal: responsiveWidth(3),
                  fontSize: 16,
                }}
              >
                Account Types
              </Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: responsiveWidth(3),
                  marginVertical: responsiveHeight(2),
                }}
                onPress={handleverified}
              >
                <Text style={{ fontSize: 16 }}>Verified</Text>
                {isVerified ? (
                  <Ionicons name="checkmark-circle" size={18} color="#0195F7" />
                ) : (
                  <Feather name="circle" size={18} color="black" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingHorizontal: responsiveWidth(3),
                  marginVertical: responsiveHeight(2),
                }}
                onPress={handlepeople}
              >
                <Text style={{ fontSize: 16 }}>People you fillow</Text>
                {isPeople ? (
                  <Ionicons name="checkmark-circle" size={18} color="#0195F7" />
                ) : (
                  <Feather name="circle" size={18} color="black" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#0195F7",
                  height: responsiveHeight(5),
                  borderRadius: 10,
                }}
                onPress={handleApply}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: responsiveWidth(2),
            marginVertical: responsiveHeight(1),
          }}
        >
          <Image
            source={require("../assets/follow.jpg")}
            style={styles.image}
          />
          <View>
            <Text>Follow request</Text>
            <Text style={{ color: "grey" }}>Approve or ignore request</Text>
          </View>
        </TouchableOpacity>
        <Text style={{ paddingLeft: responsiveWidth(3), fontSize: 18 }}>
          Priority
        </Text>
        <View>
          <FlatList
            data={filteredData}
            renderItem={({ item, index }) => (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: responsiveWidth(3),
                  marginVertical: responsiveHeight(1),
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: item.profile }}
                    style={styles.tagProfile}
                  />
                  <Text style={{ marginLeft: responsiveWidth(3) }}>
                    {item.name} mentioned you in a comment{" "}
                    {Math.trunc(Math.random() * 24 - 1)}h
                  </Text>
                </View>
                <Image
                  source={{ uri: item.stories }}
                  style={styles.commentPost}
                />
              </View>
            )}
          />
        </View>
        <Text
          style={{
            paddingLeft: responsiveWidth(3),
            fontSize: 18,
            marginVertical: responsiveHeight(1),
          }}
        >
          Yesterday
        </Text>
        <View>
          <FlatList
            data={userData}
            renderItem={({ item, index }) => (
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  paddingHorizontal: responsiveWidth(3),
                  marginVertical: responsiveHeight(1),
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: item.stories }}
                    style={styles.tagProfile}
                  />
                  <Text style={{ marginLeft: responsiveWidth(3) }}>
                    {item.name} liked your story.
                    {Math.trunc(Math.random() * 7 - 1)}d
                  </Text>
                </View>
                <Image source={{ uri: item.post }} style={styles.commentPost} />
              </View>
            )}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "white",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    height: responsiveHeight(8),
    width: responsiveWidth(16),
  },
  tagProfile: {
    width: responsiveWidth(8),
    height: responsiveHeight(4),
    borderRadius: 50,
  },
  commentPost: {
    width: responsiveWidth(8),
    height: responsiveHeight(4),
  },
  modalView: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  modalContainer: {
    height: responsiveHeight(65),
    width: responsiveWidth(100),
    padding: "2%",
    zIndex: 2,
    shadowColor: "grey",
    elevation: 5,
    position: "relative",
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    backgroundColor: "white",
  },
  horizentalLine: {
    borderWidth: 0.2,
    borderColor: "lightgrey",
    marginVertical: responsiveHeight(1),
  },
});
