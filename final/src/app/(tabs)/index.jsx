import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
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
import ContactForm from "../../components/ContactForm";
import ContactListItem from "../../components/ContactListItem";

const formatPhone = (value = "") => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const digitsOnly = (value = "") => value.replace(/\D/g, "");
const getDisplayName = (item = {}) => {
  const first = (item.firstName || "").trim();
  const last = (item.lastName || "").trim();
  const combined = `${first} ${last}`.trim();
  if (combined) return combined;
  if (item.name) return item.name;
  return "Unnamed";
};

export default function ContactsList() {
  const router = useRouter();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "contacts"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) =>
      setItems(
        snap
          .docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => getDisplayName(a).localeCompare(getDisplayName(b)))
      )
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
    const first = firstName.trim();
    const last = lastName.trim();
    if (!first || !last || !user) {
      Alert.alert("Missing info", "Please enter a first and last name.");
      return;
    }

    const digits = digitsOnly(contactNumber);
    if (digits.length !== 10) {
      Alert.alert("Invalid number", "Please enter a 10-digit phone number.");
      return;
    }

    const formattedNumber = formatPhone(digits);
    const fullName = `${first} ${last}`.trim();

    await addDoc(collection(db, "contacts"), {
      firstName: first,
      lastName: last,
      name: fullName, // backward compatible display field
      number: formattedNumber,
      imageUri: imageUri || null,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });

    setFirstName("");
    setLastName("");
    setContactNumber("");
    setImageUri(null);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Your Contacts</Text>
        <View style={styles.toggleRow}>
          <Button
            title={showForm ? "Hide Form" : "Create Contact"}
            onPress={() => setShowForm((prev) => !prev)}
          />
        </View>

        {showForm && (
          <ContactForm
            firstName={firstName}
            lastName={lastName}
            contactNumber={contactNumber}
            imageUri={imageUri}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onNumberChange={(text) => setContactNumber(formatPhone(text))}
            onPickImage={pickImage}
            onRemoveImage={() => setImageUri(null)}
            onSubmit={addContact}
            submitLabel="Add Contact"
          />
        )}

        <FlatList
          style={{ marginTop: 16 }}
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContactListItem
              name={getDisplayName(item)}
              number={formatPhone(item.number || "")}
              imageUri={item.imageUri}
              onPress={() =>
                router.push(`/(tabs)/contact-detail?id=${item.id}`)
              }
            />
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
  toggleRow: { marginTop: 4, alignItems: "flex-start" },
  subtle: { color: "#666", marginTop: 8 },
});
