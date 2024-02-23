import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Touchable,
  TextInput,
  RefreshControl,
} from "react-native";
import {
  FlatList,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { Video } from "expo-av";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Octicons } from "react-native-vector-icons/Octicons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome } from "react-native-vector-icons";
import Modal from "react-native-modal";
import { firebase } from "./Config";

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

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export default function Post() {
  const [userData, setUserData] = useState([]);
  const [autoPlayIndex, setAutoPlayIndex] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMute, setMute] = useState(false);
  const [randomLikes] = useState(Math.trunc(Math.random() * 100000 - 1));
  const [randomComments] = useState(Math.trunc(Math.random() * 1000 - 1));
  const [randomHoursAgo] = useState(Math.trunc(Math.random() * 24 - 1));
  const [lastPlayedIndex, setLastPlayedIndex] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [isCommentLiked, setCommentLiked] = useState(false);
  const [isCommentModalVisible, setCommentModalVisible] = useState(false);
  const [isShareModalVisible, setShareModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [rerenderKey, setRerenderKey] = useState(0);

  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setAutoPlayIndex(index);
    } else {
      setAutoPlayIndex(null);
    }
  }, []);

  const handleVideoToggle = (index) => {
    setAutoPlayIndex(autoPlayIndex === index ? null : index);
    if (autoPlayIndex === index) {
      setShowPauseIcon(true);
      setTimeout(() => {
        setShowPauseIcon(false);
      }, 1500);
    } else {
      setShowPlayIcon(true);
      setTimeout(() => {
        setShowPlayIcon(false);
      }, 1500);
    }
  };

  // const fetchDataFromFirestore = async () => {
  //   try {
  //     const firestore = getFirestore();
  //     const userCollectionRef = collection(firestore, "user");

  //     const querySnapshot = await getDocs(userCollectionRef);

  //     const userData = [];

  //     querySnapshot.forEach((doc) => {
  //       const data = doc.data();

  //       if (data.type === "video") {
  //         data.videoIsReady = false;
  //       }

  //       userData.push(data);
  //     });

  //     return userData;
  //   } catch (error) {
  //     console.error("Error fetching data from Firestore: ", error);
  //     throw error;
  //   }
  // };

  const handlePress = (itemId) => {
    const updatedUser = userData.map((item) =>
      item.id === itemId ? { ...item, isFocused: !item.isFocused } : item
    );
    setUserData(updatedUser);
  };

  const handleSave = (itemId) => {
    const updatedUser = userData.map((item) =>
      item.id === itemId ? { ...item, isSaved: !item.isSaved } : item
    );
    setUserData(updatedUser);
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // useEffect(() => {
  //   fetchDataFromFirestore().then((data) => {
  //     setUserData(data);
  //   });
  // }, []);

  const handleMute = () => {
    setMute(!isMute);
  };

  useEffect(() => {
    const userCollection = firebase.firestore().collection("user");

    const unsubscribe = userCollection.onSnapshot((snapshot) => {
      const updatedData = [];
      snapshot.forEach((doc) => {
        updatedData.push(doc.data());
      });
      setUserData(updatedData);
    });

    // Cleanup the listener when the component unmounts.
    return () => unsubscribe();
  }, []);

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

  const handleCommentLiked = () => {
    setCommentLiked(!isCommentLiked);
  };

  const handleCommentModal = () => {
    setCommentModalVisible(!isCommentModalVisible);
  };

  const handleShareModal = () => {
    setShareModalVisible(!isShareModalVisible);
  };

  const onRefresh = () => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  };

  return (
    <View style={styles.container}>
      <FlatList
        RefreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        data={userData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          if (item.type === "image") {
            return (
              <View style={styles.itemContainer}>
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: responsiveWidth(50),
                        marginLeft: 10,
                      }}
                    >
                      <Image
                        source={{ uri: item.profile }}
                        style={styles.profile}
                      />
                      <Text
                        style={{
                          fontWeight: "600",
                          marginLeft: responsiveWidth(1),
                          fontSize: 16,
                        }}
                      >
                        {item.name}
                      </Text>
                      <Image
                        source={require("../assets/icons8-verification-48.png")}
                        style={styles.verification}
                      />
                    </View>
                    <View
                      style={{
                        width: responsiveWidth(47),
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity onPress={toggleModal}>
                        <Image
                          source={require("../assets/three_dot.jpg")}
                          style={{
                            height: responsiveHeight(5),
                            width: responsiveWidth(10),
                            alignSelf: "flex-end",
                          }}
                        />
                      </TouchableOpacity>
                      <Modal
                        transparent={true}
                        visible={isModalVisible}
                        onSwipeComplete={() => setModalVisible(false)}
                        onBackdropPress={() => setModalVisible(false)}
                        swipeDirection="down"
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
                                flexDirection: "row",
                                width: responsiveWidth(100),
                                height: responsiveHeight(12),
                                justifyContent: "space-around",
                                paddingRight: responsiveWidth(3.5),
                                alignItems: "center",
                              }}
                            >
                              <TouchableOpacity
                                onPress={() => handleSave(item.id)}
                              >
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
                                <View style={{ alignItems: "center" }}>
                                  <Image
                                    source={require("../assets/qr.jpg")}
                                    style={{
                                      height: responsiveHeight(8),
                                      width: responsiveWidth(16),
                                    }}
                                  />
                                  <Text>QR code</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.horizentalLine}></View>
                            <View
                              style={{
                                height: responsiveHeight(12),
                                justifyContent: "space-around",
                              }}
                            >
                              <TouchableOpacity>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    source={require("../assets/star.jpg")}
                                    style={{
                                      height: responsiveHeight(6),
                                      width: responsiveWidth(12),
                                    }}
                                  />
                                  <Text>Add to favorites</Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    source={require("../assets/unfollow.jpg")}
                                    style={{
                                      height: responsiveHeight(5.5),
                                      width: responsiveWidth(11),
                                    }}
                                  />
                                  <Text style={{ margin: responsiveWidth(1) }}>
                                    Unfollow
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
                                  <Text
                                    style={{ margin: responsiveWidth(2.5) }}
                                  >
                                    Add to favorites
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
                                  <Text
                                    style={{ margin: responsiveWidth(2.5) }}
                                  >
                                    Hide
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
                                    source={require("../assets/about.jpg")}
                                    style={{
                                      height: responsiveHeight(4),
                                      width: responsiveWidth(8),
                                    }}
                                  />
                                  <Text
                                    style={{ margin: responsiveWidth(2.5) }}
                                  >
                                    About this account
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
                            </View>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  </View>
                  {isLoading ? (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size={80} color="#e4ce91" />
                    </View>
                  ) : null}

                  <TouchableOpacity
                    onDoublePress={() => {
                      handleDoublePress(item.id);
                    }}
                  >
                    <Image
                      source={{ uri: item.post }}
                      style={styles.image}
                      onLoad={() => setIsLoading(false)}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: responsiveWidth(27),
                      height: responsiveHeight(5),
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity onPress={() => handlePress(item.id)}>
                      <Image
                        source={
                          item.isFocused
                            ? require("../assets/like.jpg")
                            : require("../assets/likeUnfocussed.jpg")
                        }
                        style={{
                          height: responsiveHeight(4.1),
                          width: responsiveWidth(8.2),
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleCommentModal}>
                      <Image
                        source={require("../assets/comment.jpg")}
                        style={{
                          height: responsiveHeight(4.5),
                          width: responsiveWidth(9),
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShareModal}>
                      <Image
                        source={require("../assets/share.jpg")}
                        style={{
                          height: responsiveHeight(3.5),
                          width: responsiveWidth(7),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <Modal
                    transparent={true}
                    visible={isCommentModalVisible}
                    onSwipeComplete={() => setCommentModalVisible(false)}
                    onBackdropPress={() => setCommentModalVisible(false)}
                    swipeDirection="down"
                    style={{
                      marginBottom: 0,
                      marginLeft: 0,
                    }}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                  >
                    <View style={styles.modalView}>
                      <View style={styles.modalCommentContainer}>
                        <View
                          style={{
                            justifyContent: "space-around",
                            alignItems: "center",
                            height: responsiveHeight(8),
                          }}
                        >
                          <TouchableOpacity onPress={handleCommentModal}>
                            <Image
                              source={require("../assets/swipe.jpg")}
                              style={{
                                height: responsiveHeight(3),
                                width: responsiveWidth(12),
                              }}
                            />
                          </TouchableOpacity>
                          <Text>Comments</Text>
                        </View>
                        <View style={styles.horizentalLine}></View>
                        <FlatList
                          data={userData}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item, index }) => (
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingHorizontal: responsiveWidth(1),
                                alignItems: "center",
                                marginVertical: responsiveHeight(2),
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  source={{ uri: item.profile }}
                                  style={{
                                    height: responsiveHeight(6),
                                    width: responsiveWidth(12),
                                    borderRadius: 50,
                                  }}
                                />
                                <View
                                  style={{ marginLeft: responsiveWidth(3) }}
                                >
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text>{item.name}</Text>

                                    <Text
                                      style={{
                                        color: "grey",
                                        fontSize: responsiveFontSize(1.3),
                                      }}
                                    >
                                      {Math.trunc(Math.random() * 23 + 1)}h
                                    </Text>
                                  </View>
                                  <Text>Random Comments will go here 😃</Text>
                                  <TouchableOpacity>
                                    <Text
                                      style={{
                                        color: "grey",
                                        fontSize: responsiveFontSize(1.3),
                                      }}
                                    >
                                      Reply
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              {item.isFocused ? (
                                <TouchableOpacity
                                  onPress={() => handlePress(item.id)}
                                >
                                  <AntDesign
                                    name="heart"
                                    size={18}
                                    color="red"
                                  />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => handlePress(item.id)}
                                >
                                  <AntDesign
                                    name="hearto"
                                    size={18}
                                    color="black"
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        />
                      </View>
                    </View>
                  </Modal>
                  <View
                    style={{
                      width: responsiveWidth(68),
                      alignItems: "flex-end",
                    }}
                  >
                    <TouchableOpacity onPress={() => handleSave(item.id)}>
                      <Image
                        source={
                          item.isSaved
                            ? require("../assets/save.jpg")
                            : require("../assets/saveed.jpg")
                        }
                        style={{
                          height: responsiveHeight(5),
                          width: responsiveWidth(10),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    marginLeft: responsiveWidth(3.5),
                    marginBottom: responsiveHeight(2),
                  }}
                >
                  <Text>{randomLikes} likes</Text>
                  <Text>
                    {item.name}{" "}
                    {item.comment ||
                      " There are no passengers on spaceship earth. We are all crew."}
                  </Text>
                  <Text style={{ color: "grey", fontSize: 13 }}>
                    View all {randomComments} comments
                  </Text>
                  <Text style={{ color: "grey", fontSize: 12 }}>
                    {randomHoursAgo} hours ago. see translation
                  </Text>
                </View>
              </View>
            );
          } else if (item.type === "video") {
            return (
              <View style={styles.itemContainer}>
                <View>
                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: responsiveWidth(50),
                        marginLeft: 10,
                      }}
                    >
                      <Image
                        source={{ uri: item.profile }}
                        style={styles.profile}
                      />
                      <Text
                        style={{
                          fontWeight: "600",
                          marginLeft: responsiveWidth(1),
                          fontSize: 16,
                        }}
                      >
                        {item.name}
                      </Text>
                      <Image
                        source={require("../assets/icons8-verification-48.png")}
                        style={styles.verification}
                      />
                    </View>
                    <View
                      style={{
                        width: responsiveWidth(47),
                        justifyContent: "center",
                      }}
                    >
                      <TouchableOpacity onPress={toggleModal}>
                        <Image
                          source={require("../assets/three_dot.jpg")}
                          style={{
                            height: responsiveHeight(5),
                            width: responsiveWidth(10),
                            alignSelf: "flex-end",
                          }}
                        />
                      </TouchableOpacity>
                      <Modal
                        transparent={true}
                        visible={isModalVisible}
                        onSwipeComplete={() => setModalVisible(false)}
                        onBackdropPress={() => setModalVisible(false)}
                        swipeDirection="down"
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
                                    source={
                                      item.isSaved
                                        ? require("../assets/save.jpg")
                                        : require("../assets/saveed.jpg")
                                    }
                                    style={{
                                      height: responsiveHeight(5),
                                      width: responsiveWidth(10),
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
                                <View style={{ alignItems: "center" }}>
                                  <Image
                                    source={require("../assets/qr.jpg")}
                                    style={{
                                      height: responsiveHeight(8),
                                      width: responsiveWidth(16),
                                    }}
                                  />
                                  <Text>QR code</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.horizentalLine}></View>
                            <View
                              style={{
                                height: responsiveHeight(12),
                                justifyContent: "space-around",
                              }}
                            >
                              <TouchableOpacity>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    source={require("../assets/star.jpg")}
                                    style={{
                                      height: responsiveHeight(6),
                                      width: responsiveWidth(12),
                                    }}
                                  />
                                  <Text>Add to favorites</Text>
                                </View>
                              </TouchableOpacity>
                              <TouchableOpacity>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                  }}
                                >
                                  <Image
                                    source={require("../assets/unfollow.jpg")}
                                    style={{
                                      height: responsiveHeight(5.5),
                                      width: responsiveWidth(11),
                                    }}
                                  />
                                  <Text style={{ margin: responsiveWidth(1) }}>
                                    Unfollow
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
                                  <Text
                                    style={{ margin: responsiveWidth(2.5) }}
                                  >
                                    Add to favorites
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
                                  <Text
                                    style={{ margin: responsiveWidth(2.5) }}
                                  >
                                    Hide
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
                                    source={require("../assets/about.jpg")}
                                    style={{
                                      height: responsiveHeight(4),
                                      width: responsiveWidth(8),
                                    }}
                                  />
                                  <Text
                                    style={{ margin: responsiveWidth(2.5) }}
                                  >
                                    About this account
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
                            </View>
                          </View>
                        </View>
                      </Modal>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleVideoToggle(index)}
                    activeOpacity={1}
                  >
                    <Video
                      source={{ uri: item.video }}
                      shouldPlay={autoPlayIndex === index}
                      onError={(error) => console.error("Video Error: ", error)}
                      style={styles.video}
                      resizeMode="contain"
                      isMuted={isMute}
                      isLooping
                      onReadyForDisplay={() => {
                        const updatedData = [...userData];
                        updatedData[index].videoIsReady = true;
                        setUserData(updatedData);
                      }}
                    />
                    {showPlayIcon && (
                      <View>
                        <Image
                          source={require("../assets/playNew.png")}
                          style={styles.playPauseIcons}
                        />
                      </View>
                    )}
                    {showPauseIcon && (
                      <View style={styles.circularBackground}>
                        <Image
                          source={require("../assets/pauseNew.png")}
                          style={styles.playPauseIcons}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: responsiveWidth(27),
                      height: responsiveHeight(5),
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity onPress={() => handlePress(item.id)}>
                      <Image
                        source={
                          item.isFocused
                            ? require("../assets/like.jpg")
                            : require("../assets/likeUnfocussed.jpg")
                        }
                        style={{
                          height: responsiveHeight(4.1),
                          width: responsiveWidth(8.2),
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleCommentModal}>
                      <Image
                        source={require("../assets/comment.jpg")}
                        style={{
                          height: responsiveHeight(4.5),
                          width: responsiveWidth(9),
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleShareModal}>
                      <Image
                        source={require("../assets/share.jpg")}
                        style={{
                          height: responsiveHeight(3.5),
                          width: responsiveWidth(7),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  <Modal
                    transparent={true}
                    visible={isShareModalVisible}
                    onSwipeComplete={() => setShareModalVisible(false)}
                    onBackdropPress={() => setShareModalVisible(false)}
                    swipeDirection="down"
                    style={{
                      marginBottom: 0,
                      marginLeft: 0,
                    }}
                    animationIn="slideInUp"
                    animationOut="slideOutDown"
                  >
                    <View style={styles.modalView}>
                      <View style={styles.modalShareContainer}>
                        <View
                          style={{
                            justifyContent: "space-around",
                            alignItems: "center",
                            height: responsiveHeight(8),
                          }}
                        >
                          <TouchableOpacity onPress={handleShareModal}>
                            <Image
                              source={require("../assets/swipe.jpg")}
                              style={{
                                height: responsiveHeight(3),
                                width: responsiveWidth(12),
                                marginVertical: responsiveHeight(2),
                              }}
                            />
                          </TouchableOpacity>
                          <View style={styles.searchContainer}>
                            <FontAwesome name="search" size={18} color="grey" />
                            <TextInput
                              style={styles.searchInput}
                              placeholder="Search"
                              placeholderTextColor="grey"
                            />
                            <AntDesign
                              name="addusergroup"
                              size={21}
                              color="grey"
                            />
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: "row",
                            flexWrap: "wrap",
                          }}
                        >
                          <FlatList
                            data={userData}
                            // horizontal={true}
                            style={{ flexWrap: "wrap" }}
                            numColumns={3}
                            renderItem={({ item, index }) => (
                              <TouchableOpacity
                                style={{
                                  justifyContent: "space-evenly",
                                  alignItems: "center",
                                  marginVertical: responsiveHeight(1.5),
                                  marginHorizontal: responsiveWidth(8),
                                }}
                              >
                                <Image
                                  source={{ uri: item.profile }}
                                  style={{
                                    height: responsiveHeight(8),
                                    width: responsiveWidth(16),
                                    borderRadius: 50,
                                  }}
                                />
                                <Text
                                  style={{
                                    marginVertical: responsiveHeight(1),
                                  }}
                                >
                                  {item.name}
                                </Text>
                              </TouchableOpacity>
                            )}
                          />
                        </View>
                      </View>
                    </View>
                  </Modal>
                  <View
                    style={{
                      width: responsiveWidth(68),
                      alignItems: "flex-end",
                    }}
                  >
                    <TouchableOpacity onPress={handleMute}>
                      <Image
                        source={
                          isMute
                            ? require("../assets/muteNew.png")
                            : require("../assets/unMuteNew.png")
                        }
                        style={{
                          height: responsiveHeight(3),
                          width: responsiveWidth(6),
                          bottom: responsiveHeight(4),
                          right: responsiveWidth(1.5),
                        }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleSave(item.id)}>
                      <Image
                        source={
                          item.isSaved
                            ? require("../assets/save.jpg")
                            : require("../assets/saveed.jpg")
                        }
                        style={{
                          height: responsiveHeight(5),
                          width: responsiveWidth(10),
                          bottom: responsiveHeight(2),
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    marginLeft: responsiveWidth(3.5),
                    marginBottom: responsiveHeight(2),
                  }}
                >
                  <Text>{randomLikes} likes</Text>
                  <Text>
                    {item.name}
                    {item.comment ||
                      " There are no passengers on spaceship earth. We are all crew."}
                  </Text>
                  <Text style={{ color: "grey", fontSize: 13 }}>
                    View all {randomComments} comments
                  </Text>
                  <Text style={{ color: "grey", fontSize: 12 }}>
                    {randomHoursAgo} hours ago. see translation
                  </Text>
                </View>
              </View>
            );
          }
        }}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: responsiveWidth(100),
    height: responsiveHeight(55),
    marginVertical: responsiveHeight(1),
  },
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    marginTop: responsiveHeight(1),
  },
  itemContainer: {
    marginVertical: responsiveHeight(0.8),
  },
  profileContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
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
  video: {
    alignSelf: "center",
    width: responsiveWidth(100),
    height: responsiveHeight(70),
  },
  modalView: {
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  modalContainer: {
    height: responsiveHeight(60),
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
  playPauseIcons: {
    height: responsiveHeight(5),
    width: responsiveWidth(10),
  },
  circularBackground: {
    width: 100,
    height: 100,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    position: "absolute",
    bottom: responsiveHeight(32.5),
    left: responsiveWidth(39),
  },
  modalCommentContainer: {
    height: responsiveHeight(80),
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
  searchContainer: {
    marginVertical: responsiveHeight(1),
    marginHorizontal: responsiveWidth(5),
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#EBEBEB",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  searchInput: {
    width: responsiveWidth(70),
    height: responsiveHeight(3),
    paddingLeft: responsiveWidth(5),
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
  },
  modalShareContainer: {
    height: responsiveHeight(53),
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
});
