import { View, Text, StyleSheet } from "react-native";

const DetailsScreen = ({ route }) => {
  const { fName, lName, age, major } = route.params || {};

  if (!fName || !lName || !age || !major) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Details</Text>
        <Text>There is currently no data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details</Text>
      <Text>First Name: {fName}</Text>
      <Text>Last Name: {lName}</Text>
      <Text>Age: {age}</Text>
      <Text>Major: {major}</Text>
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

export default DetailsScreen;
