import { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../../auth/AuthContext";
import { auth } from "../../firebase/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const SignIn = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) router.replace("/(tabs)");
  }, [user]);

  const onSignIn = async () => {
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      setError(error.message);
    }
  };

  const onSignUp = async () => {
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TextInput
        style={styles.input}
        placeholder="email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
        <Button title="Sign In" onPress={onSignIn} />
        <Button title="Create Account" onPress={onSignUp} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  error: {
    color: "#c00",
    marginTop: 6,
  },
});

export default SignIn;
