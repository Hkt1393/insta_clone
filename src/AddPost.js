import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import {
  Entypo,
  MaterialIcons,
  SimpleLineIcons,
} from "react-native-vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function AddPost() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchImagesFromCameraRoll();
  }, []);

  const fetchImagesFromCameraRoll = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 50,
      });
      setImages(assets);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelectedImage = (image) => {
    setSelectedImage(image);
  };

  const handleNavigation = () => {
    navigation.navigate("Home");
  };

  const handleNavigationToNextPage = () => {
    if (selectedImage) {
      navigation.navigate("Next", { selectedImage });
    } else {
      Alert.alert("Error", "Please select an image before proceeding.");
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: responsiveWidth(3),
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={handleNavigation}>
            <Entypo name="cross" size={22} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginLeft: responsiveWidth(2),
            }}
          >
            New post
          </Text>
        </View>
        <TouchableOpacity onPress={handleNavigationToNextPage}>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "#0195F7" }}>
            Next
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.upperHalf}>
        {selectedImage && (
          <Image
            source={{ uri: selectedImage.uri }}
            style={styles.selectedImage}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          height: responsiveHeight(5),
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: responsiveWidth(5),
            width: responsiveWidth(35),
          }}
        >
          <Text style={{ fontSize: responsiveFontSize(2) }}>Recents</Text>
          <Entypo
            name="chevron-thin-down"
            size={14}
            color="black"
            style={{ marginLeft: responsiveWidth(2) }}
          />
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            width: responsiveWidth(65),
            paddingHorizontal: responsiveWidth(5),
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "grey",
              borderRadius: 20,
              paddingHorizontal: responsiveWidth(2),
              height: responsiveHeight(2.8),
            }}
          >
            <MaterialIcons name="photo-library" size={16} color="white" />
            <Text
              style={{
                marginLeft: responsiveWidth(3),
                color: "white",
                fontSize: responsiveFontSize(1.5),
              }}
            >
              SELECT MULTIPLE
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              height: responsiveHeight(2.5),
              width: responsiveWidth(5),
              borderRadius: 50,
              backgroundColor: "grey",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: responsiveWidth(5),
            }}
          >
            <SimpleLineIcons name="camera" size={12} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.lowerHalf}>
        <ScrollView>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageItem}>
                <TouchableOpacity onPress={() => handleSelectedImage(image)}>
                  <Image source={{ uri: image.uri }} style={styles.image} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  upperHalf: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: responsiveHeight(1),
  },
  lowerHalf: {
    height: responsiveHeight(40),
  },
  selectedImage: {
    height: responsiveHeight(36),
    width: responsiveWidth(100),
  },
  imageItem: {
    margin: responsiveWidth(0.5),
    alignItems: "center",
  },
  image: {
    height: responsiveHeight(14),
    width: responsiveWidth(24),
  },
});
