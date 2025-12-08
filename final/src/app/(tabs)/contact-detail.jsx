import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../auth/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import ContactDetailForm from "../../components/ContactDetailForm";
import { colors, spacing, borderRadius, typography } from "../../styles/theme";
import { formatPhoneNumber, isValidPhoneNumber } from "../../utils/phoneUtils";
import { splitFullName } from "../../utils/contactUtils";

export default function ContactDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;

    const fetchContact = async () => {
      try {
        const docRef = doc(db, "contacts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.ownerId === user.uid) {
            const first =
              data.firstName || splitFullName(data.name || "").first;
            const last = data.lastName || splitFullName(data.name || "").last;
            setFirstName(first || "");
            setLastName(last || "");
            setContactNumber(formatPhoneNumber(data.number || ""));
            setImageUri(data.imageUri || null);
          } else {
            Alert.alert(
              "Error",
              "You don't have permission to view this contact"
            );
            router.back();
          }
        } else {
          Alert.alert("Error", "Contact not found");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
        Alert.alert("Error", "Failed to load contact");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [user?.uid, id]);

  const pickImage = async () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const { status } =
              await ImagePicker.requestCameraPermissionsAsync();
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
        imageUri && {
          text: "Remove Photo",
          style: "destructive",
          onPress: () => setImageUri(null),
        },
        { text: "Cancel", style: "cancel" },
      ].filter(Boolean)
    );
  };

  const saveChanges = async () => {
    const first = firstName.trim();
    const last = lastName.trim();
    if (!first || !last || !user || !id) {
      Alert.alert("Missing info", "Please enter a first and last name.");
      return;
    }

    if (!isValidPhoneNumber(contactNumber)) {
      Alert.alert("Invalid number", "Please enter a 10-digit phone number.");
      return;
    }

    try {
      const formattedNumber = formatPhoneNumber(contactNumber);
      await updateDoc(doc(db, "contacts", id), {
        firstName: first,
        lastName: last,
        name: `${first} ${last}`.trim(),
        number: formattedNumber,
        imageUri: imageUri || null,
      });
      Alert.alert("Success", "Contact updated successfully");
      router.back();
    } catch (error) {
      console.error("Error updating contact:", error);
      Alert.alert("Error", "Failed to update contact");
    }
  };

  const deleteContact = () => {
    Alert.alert(
      "Delete Contact",
      "Are you sure you want to delete this contact?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "contacts", id));
              router.back();
            } catch (error) {
              console.error("Error deleting contact:", error);
              Alert.alert("Error", "Failed to delete contact");
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Edit Contact</Text>

        <ContactDetailForm
          firstName={firstName}
          lastName={lastName}
          contactNumber={contactNumber}
          imageUri={imageUri}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onNumberChange={(text) => setContactNumber(formatPhoneNumber(text))}
          onPickImage={pickImage}
          onRemoveImage={() => setImageUri(null)}
          onSave={saveChanges}
          onDelete={deleteContact}
          onCancel={() => router.back()}
        />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl + spacing.xl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.white,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
