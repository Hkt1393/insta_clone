import React, { useState, useEffect, useCallback, useRef } from "react";
import { Video } from "expo-av";
import {
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import {
  Feather,
  AntDesign,
  FontAwesome5,
  Entypo,
  EvilIcons,
} from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
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

export default function Reel({ navigation }) {
  const videoRef = useRef(null);
  const [userData, setUserData] = useState([]);
  const [autoPlayIndex, setAutoPlayIndex] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalOptionVisible, setModalOptionVisible] = useState(false);
  const [isMute, setMute] = useState(false);
  const [randomLikes] = useState(Math.trunc(Math.random() * 1000 - 1));
  const [randomComments] = useState(Math.trunc(Math.random() * 1000 - 1));
  const [randomHoursAgo] = useState(Math.trunc(Math.random() * 24 - 1));
  const isFocused = useIsFocused();
  const [lastPlayedIndex, setLastPlayedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setAutoPlayIndex(index);
    } else {
      setAutoPlayIndex(null);
    }
  }, []);

  const handleVideoToggle = (index) => {
    // setAutoPlayIndex(autoPlayIndex === index ? null : index);
    setMute(!isMute);
  };

  useEffect(() => {
    fetchDataFromFirestore()
      .then((data) => {
        const videos = data.filter((item) => item.type === "video");
        setUserData(videos);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [isFocused]);

  const itemHeight = Dimensions.get("window").height;

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.y;
    if (scrollPosition >= itemHeight) {
      const nextIndex = Math.floor(scrollPosition / itemHeight);
      setAutoPlayIndex(nextIndex);
    }
  };

  const handlePress = (itemId) => {
    const updatedUser = userData.map((item) =>
      item.id === itemId ? { ...item, isFocused: !item.isFocused } : item
    );
    setUserData(updatedUser);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const toggleModalOption = () => {
    setModalOptionVisible(!isModalOptionVisible);
  };

  useEffect(() => {
    const PausedVideo = navigation.addListener("blur", () => {
      setLastPlayedIndex(autoPlayIndex);
      setAutoPlayIndex(null);
    });

    const ResumeVideo = navigation.addListener("focus", () => {
      if (lastPlayedIndex !== null) {
        setAutoPlayIndex(lastPlayedIndex);
      }
    });

    return () => {
      PausedVideo();
      ResumeVideo();
    };
  }, [navigation, autoPlayIndex, lastPlayedIndex]);

  return (
    <View>
      <FlatList
        data={userData}
        renderItem={({ item, index }) => (
          <View key={index}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: responsiveWidth(5),
                zIndex: 1000,
                top: responsiveHeight(5),
              }}
            >
              <View>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  onPress={toggleModal}
                >
                  <Text style={{ color: "white", fontSize: 21 }}>Reels</Text>
                  <Entypo name="chevron-small-down" size={24} color="white" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Feather name="camera" size={24} color="white" />
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size={80} color="#e4ce91" />
              </View>
            ) : null}
            <TouchableOpacity
              onPress={() => handleVideoToggle(index)}
              activeOpacity={1}
            >
              <Video
                source={{ uri: item.video }}
                shouldPlay={autoPlayIndex === index}
                onError={(error) => console.error("Video Error: ", error)}
                style={[styles.video, { height: itemHeight }]}
                resizeMode="contain"
                isLooping
                isMuted={isMute}
                onLoadStart={() => setIsLoading(true)}
                onLoad={() => setIsLoading(false)}
              />
            </TouchableOpacity>
            <View
              style={{
                position: "absolute",
                top: responsiveHeight(72),
              }}
            >
              <View
                style={{
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  width: responsiveWidth(100),
                  paddingRight: responsiveWidth(3),
                }}
              >
                <View style={{ marginVertical: responsiveHeight(1) }}>
                  <TouchableOpacity onPress={() => handlePress(item.id)}>
                    {item.isFocused ? (
                      <AntDesign name="heart" size={24} color="red" />
                    ) : (
                      <AntDesign name="hearto" size={24} color="white" />
                    )}
                  </TouchableOpacity>
                  <Text style={{ color: "white" }}>{randomLikes}k</Text>
                </View>
                <View style={{ marginVertical: responsiveHeight(1) }}>
                  <TouchableOpacity>
                    <FontAwesome5 name="comment" size={24} color="white" />
                  </TouchableOpacity>
                  <Text style={{ color: "white" }}>{randomComments}k</Text>
                </View>
                <View
                  style={{
                    width: responsiveWidth(100),
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: responsiveHeight(0.5),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: responsiveWidth(50),
                      paddingLeft: responsiveWidth(5),
                    }}
                  >
                    <Image
                      source={{ uri: item.stories }}
                      style={styles.profile}
                    />
                    <Text
                      style={{
                        fontWeight: "600",
                        marginLeft: responsiveWidth(1),
                        fontSize: 16,
                        color: "white",
                      }}
                    >
                      {item.name}
                    </Text>
                    <Image
                      source={require("../assets/icons8-verification-48.png")}
                      style={styles.verification}
                    />
                  </View>
                  <View>
                    <TouchableOpacity>
                      <EvilIcons name="sc-telegram" size={28} color="white" />
                    </TouchableOpacity>
                    <Text style={{ color: "white" }}>{randomLikes}k</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: responsiveScreenWidth(100),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: responsiveWidth(5),
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                    }}
                  >
                    What if the Sun exploded today
                  </Text>
                  <TouchableOpacity onPress={toggleModalOption}>
                    <Entypo
                      name="dots-three-vertical"
                      size={17}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: responsiveScreenWidth(100),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingLeft: responsiveWidth(5),
                  }}
                >
                  <View style={{ marginVertical: responsiveHeight(0.5) }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: responsiveWidth(50),
                      }}
                    >
                      <Image
                        source={{ uri: item.post }}
                        style={styles.profileLiked}
                      />
                      <Text
                        style={{
                          marginLeft: responsiveWidth(1),
                          color: "white",
                        }}
                      >
                        Liked by {item.name} and others...
                      </Text>
                    </View>
                    <View style={{ marginVertical: responsiveHeight(1) }}>
                      <Text
                        style={{
                          color: "white",
                        }}
                      >
                        audio theSpaceFact. original subtlecorporatetraits
                      </Text>
                    </View>
                  </View>
                  <View>
                    <TouchableOpacity>
                      <Feather name="square" size={24} color="white" />
                    </TouchableOpacity>
                    <Modal
                      transparent={true}
                      visible={isModalOptionVisible}
                      onSwipeComplete={() => setModalOptionVisible(false)}
                      swipeDirection="down"
                      onBackdropPress={() => setModalOptionVisible(false)}
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
                            onPress={toggleModalOption}
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
                              flexDirection: "row",
                              width: responsiveWidth(100),
                              height: responsiveHeight(12),
                              justifyContent: "space-around",
                              paddingRight: responsiveWidth(3.5),
                              alignItems: "center",
                            }}
                          >
                            <TouchableOpacity>
                              <View style={{ alignItems: "center" }}>
                                <Image
                                  source={require("../assets/saveas.jpg")}
                                  style={{
                                    height: responsiveHeight(8),
                                    width: responsiveWidth(16),
                                  }}
                                />
                                <Text>Save</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <View style={{ alignItems: "center" }}>
                                <Image
                                  source={require("../assets/add.jpg")}
                                  style={{
                                    height: responsiveHeight(8),
                                    width: responsiveWidth(16),
                                  }}
                                />
                                <Text>Remix</Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <View
                                style={{
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  source={require("../assets/sequence.jpg")}
                                  style={{
                                    height: responsiveHeight(6),
                                    width: responsiveWidth(12),
                                  }}
                                />
                                <Text
                                  style={{ marginTop: responsiveHeight(0.5) }}
                                >
                                  Sequence
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.horizentalLine}></View>
                          <View
                            style={{
                              height: responsiveHeight(30),
                              justifyContent: "space-around",
                            }}
                          >
                            <TouchableOpacity>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingLeft: responsiveWidth(1),
                                }}
                              >
                                <Image
                                  source={require("../assets/why.jpg")}
                                  style={{
                                    height: responsiveHeight(4),
                                    width: responsiveWidth(8),
                                  }}
                                />
                                <Text style={{ margin: responsiveWidth(2.5) }}>
                                  Why you're seeing this post
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingLeft: responsiveWidth(1),
                                }}
                              >
                                <Image
                                  source={require("../assets/interested.jpg")}
                                  style={{
                                    height: responsiveHeight(4),
                                    width: responsiveWidth(8),
                                  }}
                                />
                                <Text style={{ margin: responsiveWidth(2.5) }}>
                                  Interested
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingLeft: responsiveWidth(1),
                                }}
                              >
                                <Image
                                  source={require("../assets/hide.jpg")}
                                  style={{
                                    height: responsiveHeight(4),
                                    width: responsiveWidth(8),
                                  }}
                                />
                                <Text style={{ margin: responsiveWidth(2.5) }}>
                                  Not Interested
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <TouchableOpacity>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingLeft: responsiveWidth(1),
                                }}
                              >
                                <Image
                                  source={require("../assets/report.jpg")}
                                  style={{
                                    height: responsiveHeight(4),
                                    width: responsiveWidth(8),
                                  }}
                                />
                                <Text
                                  style={{
                                    margin: responsiveWidth(2.5),
                                    color: "red",
                                  }}
                                >
                                  Report
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <View style={styles.horizentalLine}></View>
                            <TouchableOpacity>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingLeft: responsiveWidth(1),
                                }}
                              >
                                <Image
                                  source={require("../assets/setting.jpg")}
                                  style={{
                                    height: responsiveHeight(4),
                                    width: responsiveWidth(8),
                                  }}
                                />
                                <Text style={{ margin: responsiveWidth(2.5) }}>
                                  Manage suggested content
                                </Text>
                              </View>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Modal>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        onEndReachedThreshold={0.7}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        ItemSeparatorComponent={null}
      />
    </View>
  );
}

const styles = {
  video: {
    alignSelf: "center",
    width: responsiveWidth(120),
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
    marginLeft: responsiveWidth(2),
  },
  profileLiked: {
    width: responsiveWidth(4),
    height: responsiveHeight(2),
    borderRadius: 25,
    paddingRight: responsiveWidth(2),
  },
  modalTouchable: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  modalView: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  modalContainer: {
    height: responsiveHeight(50),
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
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    zIndex: 1,
  },
};
