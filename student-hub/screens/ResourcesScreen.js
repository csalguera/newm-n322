// modules
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ResourcesScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Resources Screen</Text>
      <Text>This is the Resources Screen.</Text>
      <Button
        title="View Student Details"
        onPress={() =>
          navigation.navigate("Details", {
            fName: "Carlos",
            lName: "Salguera",
            age: 29,
            major: "Computer Science",
          })
        }
      />
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
