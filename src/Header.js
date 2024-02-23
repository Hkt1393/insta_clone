import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import Notification from "./Notification";
import { useNavigation } from "@react-navigation/native";

export default function Header() {
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const handleNavigation = () => {
    navigation.navigate("Notification");
  };

  const handleNavigationMessage = () => {
    navigation.navigate("Message");
  };
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={toggleModal}
        >
          <Image
            source={require("../assets/instaLogo.jpg")}
            style={styles.insta}
          />
          <Entypo name="chevron-down" size={16} />
        </TouchableOpacity>
      </View>
      <Modal transparent={true} visible={isModalVisible} animationType="fade">
        <View style={styles.modalView}>
          <View style={styles.modalConatiner}>
            <TouchableOpacity
              style={styles.modalTouchable}
              onPress={toggleModal}
            >
              <Text
                style={{ fontSize: responsiveFontSize(2), fontWeight: 600 }}
              >
                Following
              </Text>
              <Feather name="users" size={26} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalTouchable}
              onPress={toggleModal}
            >
              <Text
                style={{ fontSize: responsiveFontSize(2), fontWeight: 600 }}
              >
                Favorites
              </Text>
              <Feather name="star" size={26} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.rightContainer}>
        <TouchableOpacity onPress={handleNavigation}>
          <Image source={require("../assets/hrt.jpg")} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNavigationMessage}>
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeTxt}>11</Text>
          </View>
          <Image source={require("../assets/msg.jpg")} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(8),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  insta: {
    height: responsiveHeight(5),
    width: responsiveWidth(30),
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: responsiveWidth(25),
    justifyContent: "space-around",
  },
  icon: {
    height: responsiveHeight(6),
    width: responsiveWidth(12),
  },
  unreadBadge: {
    backgroundColor: "rgba(255, 0, 0, 1)",
    position: "absolute",
    height: responsiveHeight(2.1),
    width: responsiveWidth(5),
    borderRadius: responsiveWidth(40),
    left: "55%",
    top: responsiveHeight(1),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  unreadBadgeTxt: {
    color: "white",
    fontWeight: "bold",
    fontSize: responsiveFontSize(1.3),
  },
  modalTouchable: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  modalConatiner: {
    top: responsiveHeight(5.8),
    left: responsiveWidth(2),
    backgroundColor: "white",
    shadowColor: "black",
    elevation: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
    width: responsiveWidth(35),
    height: responsiveHeight(11),
    justifyContent: "space-around",
  },
});
