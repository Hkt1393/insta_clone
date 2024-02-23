import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Home";
import Search from "./Search";
import AddPost from "./AddPost";
import Reel from "./Reel";
import Profile from "./Profile";
import Notification from "./Notification";
import { StyleSheet, Text, View, Image } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={{
        style: { borderTopWidth: 0 },
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: "white" },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={
                focused
                  ? require("../assets/homefocused.jpg")
                  : require("../assets/homeUnfocused.jpg")
              }
              style={{
                width: responsiveWidth(6),
                height: responsiveHeight(3),
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/search.jpg")}
              style={{
                width: responsiveWidth(8),
                height: responsiveHeight(4),
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AddPost"
        component={AddPost}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/addPost.jpg")}
              style={{
                width: responsiveWidth(7),
                height: responsiveHeight(3.5),
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Reel"
        component={Reel}
        options={{
          headerShown: false,
          showLabel: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/reel.jpg")}
              style={{
                width: responsiveWidth(7),
                height: responsiveHeight(3),
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/status/image1.jpg")}
              style={{
                width: responsiveWidth(6),
                height: responsiveHeight(3),
                borderRadius: 25,
                borderWidth: focused ? 2 : 0,
                borderColor: "black",
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
