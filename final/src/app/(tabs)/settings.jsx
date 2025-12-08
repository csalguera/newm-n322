import { View, Text, Button, StyleSheet } from "react-native";
import { useAuth } from "../../auth/AuthContext";

const Settings = () => {
  const { user, signOut } = useAuth();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={{ marginBottom: 12 }}>Signed in as {user?.email}</Text>
      <Button title="Sign Out" onPress={signOut} />
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
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },
});

export default Settings;
