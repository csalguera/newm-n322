import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";
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
import { showAlert, showConfirm } from "../../utils/alertUtils";
import { uploadContactImage } from "../../utils/storageUtils";

export default function ContactsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const isWeb = Platform.OS === "web";

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

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Camera permission is required");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      const uri =
        Platform.OS === "web" && asset.base64
          ? `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}`
          : asset.uri;
      setImageUri(uri);
    }
  };

  const chooseFromLibrary = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Photo library permission is required");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      const uri =
        Platform.OS === "web" && asset.base64
          ? `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}`
          : asset.uri;
      setImageUri(uri);
    }
  };

  const pickImage = () => {
    const options = ["Take Photo", "Choose from Library", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        title: "Select Image",
        message: "Choose an option",
        textStyle: {
          fontSize: typography.body.fontSize,
          color: colors.textPrimary,
        },
        titleTextStyle: {
          fontSize: typography.h4.fontSize,
          fontWeight: typography.h4.fontWeight,
          color: colors.textPrimary,
        },
        messageTextStyle: {
          fontSize: typography.bodySm.fontSize,
          color: colors.textSecondary,
        },
        containerStyle: {
          borderTopLeftRadius: borderRadius.lg,
          borderTopRightRadius: borderRadius.lg,
          paddingBottom: spacing.lg,
        },
        separatorStyle: {
          backgroundColor: colors.border,
        },
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          takePhoto();
        } else if (selectedIndex === 1) {
          chooseFromLibrary();
        }
      }
    );
  };

  const addContact = async () => {
    const first = firstName.trim();
    const last = lastName.trim();
    if (!first || !last || !user) {
      showAlert({
        title: "Missing info",
        message: "Please enter a first and last name.",
        type: "error",
      });
      return;
    }

    if (!isValidPhoneNumber(contactNumber)) {
      showAlert({
        title: "Invalid number",
        message: "Please enter a 10-digit phone number.",
        type: "error",
      });
      return;
    }

    const formattedNumber = formatPhoneNumber(contactNumber);
    const fullName = `${first} ${last}`.trim();

    let uploadedImageUri = null;
    try {
      if (imageUri) {
        uploadedImageUri = await uploadContactImage(imageUri, user.uid);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      showAlert({
        title: "Image upload failed",
        message: "Could not upload the photo. Please try again.",
        type: "error",
      });
      return;
    }

    await addDoc(collection(db, "contacts"), {
      firstName: first,
      lastName: last,
      name: fullName, // backward compatible display field
      number: formattedNumber,
      imageUri: uploadedImageUri || null,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });

    setFirstName("");
    setLastName("");
    setContactNumber("");
    setImageUri(null);
  };

  const content = (
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
            onPress={() => router.push(`/(tabs)/contact-detail?id=${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No contacts yet</Text>
            <Text style={styles.emptySubtitle}>Create one to get started</Text>
          </View>
        }
        scrollEnabled={false}
      />
    </View>
  );

  if (isWeb) return content;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {content}
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
