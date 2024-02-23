import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { AntDesign } from "react-native-vector-icons";
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "./Config";

export default function Next({ route }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [upLoading, setUploading] = useState(false);
  const [comment, setComment] = useState("");

  const navigation = useNavigation();

  if (route && route.params && route.params.selectedImage) {
    const { selectedImage } = route.params;

    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    const createFirestoreUser = async (downloadURL) => {
      const userCollection = firebase.firestore().collection("user");

      const latestId = await getLatestId(userCollection);

      const newId = latestId + 1;

      userCollection
        .add({
          name: "Alexander",
          post: downloadURL,
          isFocused: false,
          isSaved: false,
          profile:
            "https://images.unsplash.com/photo-1694930103783-4c17887c1a13?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w1MTM2OTF8MHwxfHJhbmRvbXx8fHx8fHx8fDE2OTY5MTg2Nzd8&ixlib=rb-4.0.3&q=80&w=1080",
          type: "image",
          id: newId,
          comment: comment,
        })
        .then((docRef) => {
          console.log("User added to Firestore with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding user to Firestore: ", error);
        });
    };

    const getLatestId = (collection) => {
      return collection
        .orderBy("id", "desc")
        .limit(1)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size === 0) {
            return 10;
          } else {
            const latestDoc = querySnapshot.docs[0].data();
            return latestDoc.id;
          }
        })
        .catch((error) => {
          console.error("Error fetching latest ID:", error);
          return null;
        });
    };

    const handleBackNavigation = () => {
      navigation.navigate("AddPost");
    };

    const uploadImageToFirebaseStorage = async () => {
      setUploading(true);
      const response = await fetch(selectedImage.uri);
      const blob = await response.blob();
      const filename = selectedImage.uri.substring(
        selectedImage.uri.lastIndexOf("/") + 1
      );
      const ref = firebase.storage().ref().child(`/images/${filename}`);

      try {
        const snapshot = await ref.put(blob);
        const downloadURL = await snapshot.ref.getDownloadURL();
        console.log("Image uploaded successfully!");
        console.log("Download URL: ", downloadURL);

        createFirestoreUser(downloadURL);

        setUploading(false);
        Alert.alert("Photo Upload Successfully!");

        navigation.navigate("Home");
      } catch (error) {
        console.error("Error uploading image to Firebase Storage: ", error);
        setUploading(false);
      }
    };

    return (
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: responsiveWidth(5),
            alignItems: "center",
            height: responsiveHeight(5),
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={handleBackNavigation}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: responsiveFontSize(2),
                marginLeft: responsiveWidth(5),
              }}
            >
              New Post
            </Text>
          </View>
          <TouchableOpacity onPress={uploadImageToFirebaseStorage}>
            <Text style={{ color: "#0195F7", fontSize: responsiveFontSize(2) }}>
              Share
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: responsiveWidth(5.5),
            marginVertical: responsiveHeight(2),
          }}
        >
          <Image source={{ uri: selectedImage.uri }} style={styles.img} />
          <TextInput
            placeholder="Write a caption"
            placeholderTextColor="lightgrey"
            style={{
              width: responsiveWidth(80),
              paddingHorizontal: responsiveWidth(5),
            }}
            value={comment}
            onChangeText={(text) => setComment(text)}
          />
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.miniContainer}>
          <TouchableOpacity>
            <Text>Add location</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.miniContainer}>
          <TouchableOpacity>
            <Text>Tag people</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.miniContainer}>
          <TouchableOpacity>
            <Text>Add Music</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.horizontalLine}></View>
        <View style={styles.miniContainer}>
          <TouchableOpacity>
            <Text>Also post to</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.miniContainer}>
          <Text>Share to Facebook</Text>
          <Switch
            trackColor={{ false: "grey", true: "grey" }}
            thumbColor={isEnabled ? "#0195F7" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <TouchableOpacity style={styles.miniContainer}>
          <Text>Advanced setting</Text>
          <AntDesign
            name="right"
            size={16}
            color="grey"
            style={{ marginRight: responsiveWidth(3.5) }}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  img: {
    height: responsiveHeight(8),
    width: responsiveWidth(15),
  },
  horizontalLine: {
    borderWidth: 0.2,
    borderColor: "lightgrey",
    width: responsiveWidth(100),
    alignSelf: "center",
    marginVertical: responsiveHeight(0.5),
  },
  miniContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(4),
    height: responsiveHeight(5),
  },
});
