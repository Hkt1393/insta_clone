import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function Login({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Username:", username);
    console.log("Password:", password);
  };
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
  const auth = getAuth();

  const handleAuthentication = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;
      console.log("Successfully signed in with user:", user.uid);
      navigation.navigate("Main");
    } catch (error) {
      Alert.alert("Wrong Email/Password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text>English(India)</Text>
      </View>
      <View
        style={{
          height: responsiveHeight(26),
          justifyContent: "center",
          width: responsiveWidth(100),
          alignItems: "center",
        }}
      >
        <Image source={require("./assets/logo.jpg")} style={styles.logo} />
      </View>
      <View style={styles.inputview}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#B6BFC3"
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          placeholderTextColor="#B6BFC3"
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleAuthentication}
        >
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin}>
          <Text style={{ fontSize: responsiveFontSize(2) }}>
            Forgotten Password ?
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          height: responsiveHeight(33),
        }}
      >
        <TouchableOpacity style={styles.createButton} onPress={handleLogin}>
          <Text style={{ color: "#0064E0", fontSize: responsiveFontSize(2) }}>
            Create new account
          </Text>
        </TouchableOpacity>
        <Image source={require("./assets/meta.png")} style={styles.meta} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    height: responsiveHeight(17),
    width: responsiveWidth(100),
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: responsiveWidth(90),
    height: responsiveHeight(7),
    borderColor: "#B6BFC3",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
    paddingLeft: 10,
  },
  loginButton: {
    width: responsiveWidth(90),
    height: responsiveHeight(5),
    marginVertical: responsiveHeight(2),
    backgroundColor: "#0064E0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    width: responsiveWidth(90),
    height: responsiveHeight(5),
    marginVertical: responsiveHeight(2),
    backgroundColor: "white",
    borderColor: "#0064E0",
    borderWidth: 1,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: responsiveFontSize(2),
  },
  logo: {
    height: responsiveHeight(7),
    width: responsiveWidth(14),
  },
  meta: {
    height: responsiveHeight(4),
    width: responsiveWidth(8),
  },
});
