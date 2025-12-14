// AuthScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config";
import { useNavigation } from '@react-navigation/native';


export default function AuthScreen() {
  const navigation = useNavigation();
  const [mode, setMode] = useState("login"); // 'login' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const doLogin = async () => {
    //console.log('login')
    try {
      if (!email || !password) return alert("Missing", "Email and password required");
      //console.log(email, password)
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigation.navigate('Home')
    } catch (e) {
      alert("Login failed", e.message);
    }
  };

  const doSignup = async () => {
    console.log(email, password)
    try {
      if (!email || !password) return alert("Missing", "Email and password required");
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home')
    } catch (e) {
      alert('Signup failed + e.message');
    }
  };

  const doReset = async () => {
    try {
      if (!email) return alert("Missing", "Enter your email to reset password");
      await sendPasswordResetEmail(auth, email.trim());
      alert("Check your inbox", "Password reset email sent.");
    } catch (e) {
      alert("Reset failed", e.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: "600", marginBottom: 12 }}>
        {mode === "login" ? "Log in" : "Sign up"}
      </Text>

      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 12,
          padding: 12,
        }}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 12,
          padding: 12,
        }}
      />

      {mode === "login" ? (
        <Pressable
          onPress={doLogin}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#2c6bed" : "#2962ff",
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
          })}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Log in</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={doSignup}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#2c6bed" : "#2962ff",
            padding: 14,
            borderRadius: 12,
            alignItems: "center",
          })}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>Create account</Text>
        </Pressable>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 4 }}>
        <Pressable onPress={() => setMode(mode === "login" ? "signup" : "login")}>
          <Text style={{ color: "#2962ff" }}>
            {mode === "login" ? "Create an account" : "Have an account? Log in"}
          </Text>
        </Pressable>

        <Pressable onPress={doReset}>
          <Text style={{ color: "#2962ff" }}>Forgot password?</Text>
        </Pressable>
      </View>
    </View>
  );
}
