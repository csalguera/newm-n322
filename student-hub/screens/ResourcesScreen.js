// modules
import { View, Text, StyleSheet } from "react-native";

const ResourcesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resources Screen</Text>
      <Text>This is the Resources Screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
});

export default ResourcesScreen;
