import { View, Text, StyleSheet } from "react-native";

const DetailsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details</Text>
    </View>
  )
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

export default DetailsScreen;
