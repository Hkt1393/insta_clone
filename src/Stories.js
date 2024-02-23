import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Entypo, AntDesign, EvilIcons } from "react-native-vector-icons";
import { Animated } from "react-native";
import Modal from "react-native-modal";

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
    const firestore = getFirestore(app);
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

export default function Stories() {
  const [showFullScreenImage, setShowFullScreenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [userData, setUserData] = useState([]);
  const [progress] = useState(new Animated.Value(0));
  const [storyDuration] = useState(5000);
  const [isModalVisible, setModalVisible] = useState(false);
  const [showAddStory, setShowAddStory] = useState(true);
  const [isSecondModalVisible, setIsSecondModalVisible] = useState(false);

  const [modalTimeout, setModalTimeout] = useState(null);

  useEffect(() => {
    fetchDataFromFirestore().then((data) => {
      setUserData(data);
    });
  }, []);

  const closeReportModal = () => {
    setIsSecondModalVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);

    if (isModalVisible) {
      clearTimeout(modalTimeout);
    } else {
      const timeoutId = setTimeout(() => {
        closeReportModal();
      }, 5000);
      setModalTimeout(timeoutId);
    }
  };

  const handleImagePress = (imageUri, index) => {
    setSelectedImage(imageUri);
    setShowFullScreenImage(true);
    setSelectedIndex(index);
    progress.setValue(0);

    Animated.timing(progress, {
      toValue: 1,
      duration: storyDuration,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      setShowFullScreenImage(false);
    }, storyDuration);
  };

  const handlePress = (itemId) => {
    const updatedUser = userData.map((item) =>
      item.id === itemId ? { ...item, isFocused: !item.isFocused } : item
    );
    setUserData(updatedUser);
  };

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={userData.filter((item) => item.stories)}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => handleImagePress(item.stories, index)}
            >
              <Image source={{ uri: item.stories }} style={styles.image} />
            </TouchableOpacity>
            {index === 0 && showAddStory && (
              <Image
                source={require("../assets/plus.png")}
                style={styles.addStory}
              />
            )}
            <Text>{item.name}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        initialNumToRender={1}
      />
      <Modal
        animationType="fade"
        transparent={false}
        visible={showFullScreenImage}
        onRequestClose={() => {
          setShowFullScreenImage(false);
        }}
        style={{ marginLeft: 0 }}
      >
        <View style={styles.fullScreenContainer}>
          <View
            style={{
              flexDirection: "row",
              zIndex: 10,
              width: responsiveWidth(100),
              top: responsiveHeight(7),
              right: responsiveWidth(0),
              zIndex: 10,
              alignItems: "center",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: responsiveWidth(3),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                source={{ uri: userData[selectedIndex]?.profile }}
                style={styles.profile}
              />
              <Text style={{ marginLeft: responsiveWidth(2) }}>
                {userData[selectedIndex]?.name}
              </Text>
              <Image
                source={require("../assets/icons8-verification-48.png")}
                style={styles.verification}
              />
              <Text style={{ marginLeft: responsiveWidth(2) }}>
                {Math.trunc(Math.random() * 60 - 1)}m
              </Text>
            </View>
            <View>
              <TouchableOpacity onPress={toggleModal}>
                <Entypo name="dots-three-vertical" size={18} color="white" />
              </TouchableOpacity>
              <Modal
                transparent={true}
                visible={isModalVisible}
                onSwipeComplete={() => setModalVisible(false)}
                swipeDirection="down"
                onBackdropPress={() => setModalVisible(false)}
                style={{
                  marginBottom: 0,
                  marginRight: 0,
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
                    <View style={styles.optionModal}>
                      <TouchableOpacity onPress={closeModal}>
                        <Text style={{ color: "red" }}>Report</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={closeModal}>
                        <Text style={{ fontWeight: 600 }}>Mute</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          </View>
          <Image
            source={{ uri: selectedImage }}
            style={styles.fullScreenImage}
          />
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  transform: [
                    {
                      translateX: progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [responsiveWidth(0), responsiveWidth(100)],
                      }),
                    },
                  ],
                },
              ]}
            />
          </View>
          <View style={styles.commentContainer}>
            <TextInput
              style={styles.input}
              placeholder="Send Messages"
              placeholderTextColor="white"
            />
            <TouchableOpacity
              onPress={() => handlePress(userData[selectedIndex]?.id)}
            >
              {userData[selectedIndex]?.isFocused ? (
                <AntDesign name="heart" size={24} color="red" />
              ) : (
                <AntDesign name="hearto" size={24} color="white" />
              )}
            </TouchableOpacity>
            <TouchableOpacity>
              <EvilIcons name="sc-telegram" size={33} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: responsiveWidth(18),
    height: responsiveHeight(9),
    borderRadius: 70,
    marginVertical: responsiveHeight(1.2),
    marginHorizontal: 5,
    borderWidth: 3,
    borderColor: "#e4ce91",
  },
  mainContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  addStory: {
    position: "absolute",
    left: responsiveWidth(14.2),
    top: responsiveHeight(6.8),
    zIndex: 100,
    height: responsiveHeight(2.7),
    width: responsiveWidth(5.4),
  },
  fullScreenContainer: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: responsiveWidth(100),
    height: responsiveHeight(100),
  },
  profile: {
    width: responsiveWidth(8),
    height: responsiveHeight(4),
    borderRadius: 25,
  },
  verification: {
    height: responsiveHeight(2),
    width: responsiveWidth(4),
    marginLeft: responsiveWidth(1),
  },
  progressBarContainer: {
    height: responsiveHeight(0.1),
    backgroundColor: "white",
    width: responsiveWidth(100),
    position: "absolute",
    top: responsiveHeight(1),
  },
  progressBar: {
    height: responsiveHeight(0.1),
    backgroundColor: "lightgrey",
  },
  input: {
    width: responsiveWidth(70),
    height: responsiveHeight(5),
    backgroundColor: "transparent",
    borderRadius: 25,
    paddingHorizontal: responsiveWidth(5),
    borderWidth: responsiveHeight(0.1),
    borderColor: "grey",
  },
  commentContainer: {
    height: responsiveHeight(6),
    width: responsiveWidth(95),
    bottom: responsiveHeight(6),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalContainer: {
    height: responsiveHeight(12),
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
  modalView: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  optionModal: {
    justifyContent: "space-evenly",
    height: responsiveHeight(7),
  },
});
