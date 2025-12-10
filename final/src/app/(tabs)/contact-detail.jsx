import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Pressable,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../auth/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import ContactDetailForm from "../../components/ContactDetailForm";
import { colors, spacing, borderRadius, typography } from "../../styles/theme";
import { formatPhoneNumber, isValidPhoneNumber } from "../../utils/phoneUtils";
import { splitFullName } from "../../utils/contactUtils";
import { showAlert, showConfirm } from "../../utils/alertUtils";
import { uploadContactImage } from "../../utils/storageUtils";

export default function ContactDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { showActionSheetWithOptions } = useActionSheet();
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
            showAlert({
              title: "Error",
              message: "You don't have permission to view this contact",
              type: "error",
            });
            router.back();
          }
        } else {
          showAlert({
            title: "Error",
            message: "Contact not found",
            type: "error",
          });
          router.back();
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
        showAlert({
          title: "Error",
          message: "Failed to load contact",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [user?.uid, id]);

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

  const saveChanges = async () => {
    const first = firstName.trim();
    const last = lastName.trim();
    if (!first || !last || !user || !id) {
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

    try {
      const formattedNumber = formatPhoneNumber(contactNumber);
      let uploadedImageUri = imageUri || null;

      if (imageUri) {
        try {
          uploadedImageUri = await uploadContactImage(imageUri, user.uid);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          showAlert({
            title: "Image upload failed",
            message: "Could not upload the photo. Please try again.",
            type: "error",
          });
          return;
        }
      }

      await updateDoc(doc(db, "contacts", id), {
        firstName: first,
        lastName: last,
        name: `${first} ${last}`.trim(),
        number: formattedNumber,
        imageUri: uploadedImageUri,
      });
      showAlert({
        title: "Success",
        message: "Contact updated successfully",
        type: "success",
      });
      router.back();
    } catch (error) {
      console.error("Error updating contact:", error);
      showAlert({
        title: "Error",
        message: "Failed to update contact",
        type: "error",
      });
    }
  };

  const deleteContact = () => {
    showConfirm({
      title: "Delete Contact",
      message: "Are you sure you want to delete this contact?",
      cancelLabel: "Cancel",
      confirmLabel: "Delete",
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, "contacts", id));
          router.back();
        } catch (error) {
          console.error("Error deleting contact:", error);
          showAlert({
            title: "Error",
            message: "Failed to delete contact",
            type: "error",
          });
        }
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <Pressable onPress={Keyboard.dismiss} accessible={false}>
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
    </Pressable>
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
