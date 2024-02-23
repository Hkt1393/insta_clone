import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Header from "./src/Header";
import Stories from "./src/Stories";
import Post from "./src/Post";
import {
  responsiveHeight,
  responsiveFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from "react-native-responsive-dimensions";

export default function Home() {
  return (
    <View style={styles.container}>
      <Header />
      <Stories />
      <Post />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    height: responsiveHeight(100),
    width: responsiveWidth(100),
  },
});
