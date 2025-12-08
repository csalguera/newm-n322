import { useEffect, useState } from "react";
import {
  View,
  Text,
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
import { colors, spacing, borderRadius, typography } from "../../styles/theme";
import { formatPhoneNumber, isValidPhoneNumber } from "../../utils/phoneUtils";
import { getContactDisplayName } from "../../utils/contactUtils";

export default function ContactsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "contacts"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snapshot) =>
      setContacts(
        snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) =>
            getContactDisplayName(a).localeCompare(getContactDisplayName(b))
          )
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

    if (!isValidPhoneNumber(contactNumber)) {
      Alert.alert("Invalid number", "Please enter a 10-digit phone number.");
      return;
    }

    const formattedNumber = formatPhoneNumber(contactNumber);
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
        <View style={styles.header}>
          <Text style={styles.title}>Your Contacts</Text>
          <Text style={styles.subtitle}>{contacts.length} contacts</Text>
        </View>

        <TouchableOpacity
          style={[styles.createButton, showForm && styles.createButtonActive]}
          onPress={() => setShowForm((prev) => !prev)}
        >
          <Text style={styles.createButtonText}>
            {showForm ? "Hide Form" : "+ Create Contact"}
          </Text>
        </TouchableOpacity>

        {showForm && (
          <ContactForm
            firstName={firstName}
            lastName={lastName}
            contactNumber={contactNumber}
            imageUri={imageUri}
            onFirstNameChange={setFirstName}
            onLastNameChange={setLastName}
            onNumberChange={(text) => setContactNumber(formatPhoneNumber(text))}
            onPickImage={pickImage}
            onRemoveImage={() => setImageUri(null)}
            onSubmit={addContact}
            submitLabel="Add Contact"
          />
        )}

        <FlatList
          style={styles.list}
          data={contacts}
          keyExtractor={(contact) => contact.id}
          renderItem={({ item }) => (
            <ContactListItem
              name={getContactDisplayName(item)}
              number={formatPhoneNumber(item.number || "")}
              imageUri={item.imageUri}
              onPress={() =>
                router.push(`/(tabs)/contact-detail?id=${item.id}`)
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No contacts yet</Text>
              <Text style={styles.emptySubtitle}>
                Create one to get started
              </Text>
            </View>
          }
          scrollEnabled={false}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + spacing.xl,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  createButton: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  createButtonActive: {
    backgroundColor: colors.primaryDark,
  },
  createButtonText: {
    ...typography.bodyMedium,
    color: colors.white,
    fontWeight: "700",
  },
  list: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.h4,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textTertiary,
  },
});
