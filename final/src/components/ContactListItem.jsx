import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Avatar from "./Avatar";

export default function ContactListItem({ name, number, imageUri, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Avatar
        uri={imageUri}
        name={name}
        size={50}
        borderColor="#ddd"
        borderWidth={1}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contact}>{name}</Text>
        <Text style={styles.contactNumber}>{number}</Text>
      </View>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  contactInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  contact: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  contactNumber: { fontSize: 16, color: "#666" },
  arrow: { fontSize: 24, color: "#06c", marginLeft: 12 },
});
