import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../auth/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const formatPhone = (value = "") => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const digitsOnly = (value = "") => value.replace(/\D/g, "");

export default function ContactsList() {
  const router = useRouter();
  const { user } = useAuth();
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "contacts"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return unsub;
  }, [user?.uid]);

  const pickImage = async () => {
    Alert.alert("Select Image", "Choose an option", [
      {
        text: "Take Photo",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Permission needed", "Camera permission is required");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          });
          if (!result.canceled) {
            setImageUri(result.assets[0].uri);
          }
        },
      },
      {
        text: "Choose from Library",
        onPress: async () => {
          const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Permission needed",
              "Photo library permission is required"
            );
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          });
          if (!result.canceled) {
            setImageUri(result.assets[0].uri);
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const addContact = async () => {
    const trimmed = contactName.trim();
    if (!trimmed || !user) return;

    const digits = digitsOnly(contactNumber);
    if (digits.length !== 10) {
      Alert.alert("Invalid number", "Please enter a 10-digit phone number.");
      return;
    }

    const formattedNumber = formatPhone(digits);

    await addDoc(collection(db, "contacts"), {
      name: trimmed,
      number: formattedNumber,
      imageUri: imageUri || null,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });

    setContactName("");
    setContactNumber("");
    setImageUri(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Contacts</Text>

        {imageUri && (
          <View style={styles.imagePreview}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            <TouchableOpacity
              style={styles.removeImage}
              onPress={() => setImageUri(null)}
            >
              <Text style={styles.removeImageText}>✕</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="contact name"
            value={contactName}
            onChangeText={setContactName}
            autoCapitalize="words"
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="contact number"
            value={contactNumber}
            onChangeText={(text) => setContactNumber(formatPhone(text))}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.buttonRow}>
          <Button title="📷 Add Photo" onPress={pickImage} color="#666" />
          <View style={{ width: 8 }} />
          <Button title="Add Contact" onPress={addContact} />
        </View>

        <FlatList
          style={{ marginTop: 16 }}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                router.push(`/(tabs)/contact-detail?id=${item.id}`)
              }
            >
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>
                    {(item.name || "").trim().charAt(0).toUpperCase() || "?"}
                  </Text>
                </View>
              )}
              <View style={styles.contactInfo}>
                <Text style={styles.contact}>{item.name}</Text>
                <Text style={styles.contactNumber}>
                  {formatPhone(item.number || "")}
                </Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.subtle}>No contacts yet. Add one above ↑</Text>
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8 },
  buttonRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  subtle: { color: "#666", marginTop: 8 },
  imagePreview: {
    alignItems: "center",
    marginVertical: 12,
    position: "relative",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#06c",
  },
  removeImage: {
    position: "absolute",
    top: 0,
    right: "35%",
    backgroundColor: "#c00",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#e9e9e9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPlaceholderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#555",
  },
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
  },
  contact: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  contactNumber: { fontSize: 16, color: "#666" },
  arrow: { fontSize: 24, color: "#06c", marginLeft: 12 },
});
