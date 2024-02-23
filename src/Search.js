import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Image,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Video } from "expo-av";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { AntDesign } from "react-native-vector-icons";

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

export default function Search() {
  const [userData, setUserData] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openMediaModal = (media) => {
    setSelectedMedia(media);
  };

  const closeMediaModal = () => {
    setSelectedMedia(null);
  };

  useEffect(() => {
    fetchDataFromFirestore().then((data) => {
      setUserData(data);
    });
  }, []);

  const filteredData = userData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView>
      <View style={{ backgroundColor: "white" }}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        <View style={styles.container}>
          <View style={styles.itemContainer}>
            {searchQuery === ""
              ? userData.map((item, index) => (
                  <View key={index} style={styles.userDataContainer}>
                    {item.video && (
                      <TouchableOpacity
                        onPress={() => openMediaModal(item.video)}
                      >
                        <Video
                          source={{ uri: item.video }}
                          shouldPlay={true}
                          onError={(error) =>
                            console.error("Video Error: ", error)
                          }
                          style={styles.video}
                          resizeMode="contain"
                          isLooping
                          isMuted
                        />
                      </TouchableOpacity>
                    )}
                    <View style={styles.imageContainer}>
                      <TouchableOpacity
                        onPress={() => openMediaModal(item.post)}
                      >
                        <Image
                          source={{ uri: item.post }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => openMediaModal(item.stories)}
                      >
                        <Image
                          source={{ uri: item.stories }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => openMediaModal(item.profile)}
                      >
                        <Image
                          source={{ uri: item.profile }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              : filteredData.map((item, index) => (
                  <View key={index} style={styles.userDataContainer}>
                    {item.video && (
                      <TouchableOpacity
                        onPress={() => openMediaModal(item.video)}
                      >
                        <Video
                          source={{ uri: item.video }}
                          shouldPlay={true}
                          onError={(error) =>
                            console.error("Video Error: ", error)
                          }
                          style={styles.video}
                          resizeMode="contain"
                          isLooping
                          isMuted
                        />
                      </TouchableOpacity>
                    )}
                    <View style={styles.imageContainer}>
                      <TouchableOpacity
                        onPress={() => openMediaModal(item.post)}
                      >
                        <Image
                          source={{ uri: item.post }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => openMediaModal(item.stories)}
                      >
                        <Image
                          source={{ uri: item.stories }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => openMediaModal(item.profile)}
                      >
                        <Image
                          source={{ uri: item.profile }}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
          </View>
        </View>
        <Modal visible={selectedMedia !== null} transparent={true}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.fullScreenButton}
              onPress={closeMediaModal}
            >
              <AntDesign name="closecircle" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.fullScreenContent}>
              {selectedMedia && selectedMedia.includes("video") ? (
                <Video
                  source={{ uri: selectedMedia }}
                  shouldPlay={true}
                  onError={(error) => console.error("Video Error: ", error)}
                  style={styles.fullScreenVideo}
                  resizeMode="contain"
                  isLooping
                  useNativeControls
                />
              ) : (
                <Image
                  source={{ uri: selectedMedia }}
                  style={styles.fullScreenImage}
                />
              )}
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: responsiveHeight(4),
  },
  itemContainer: {
    flexDirection: "column",
  },
  userDataContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    flexDirection: "row",
  },
  image: {
    width: responsiveWidth(33),
    height: responsiveHeight(18),
    margin: 1,
  },
  video: {
    alignSelf: "center",
    width: responsiveWidth(33),
    height: responsiveHeight(18),
    margin: 1,
  },
  modalContainer: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  fullScreenContent: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: responsiveWidth(100),
    height: responsiveHeight(80),
  },
  fullScreenVideo: {
    width: responsiveHeight(100),
    height: responsiveWidth(100),
  },
  fullScreenButton: {
    position: "absolute",
    top: responsiveHeight(3),
    right: responsiveWidth(2),
  },
  searchInput: {
    marginTop: responsiveHeight(3),
    marginHorizontal: responsiveWidth(5),
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});
