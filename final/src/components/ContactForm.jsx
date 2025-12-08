import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Avatar from "./Avatar";

export default function ContactForm({
  firstName,
  lastName,
  contactNumber,
  imageUri,
  onFirstNameChange,
  onLastNameChange,
  onNumberChange,
  onPickImage,
  onRemoveImage,
  onSubmit,
  submitLabel = "Add Contact",
}) {
  return (
    <View style={styles.formCard}>
      <View style={styles.imagePreview}>
        <Avatar
          uri={imageUri}
          name={`${firstName} ${lastName}`}
          size={120}
          borderColor="#06c"
          borderWidth={2}
        />
        {imageUri ? (
          <TouchableOpacity style={styles.removeImage} onPress={onRemoveImage}>
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="first name"
          value={firstName}
          onChangeText={onFirstNameChange}
          autoCapitalize="words"
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="last name"
          value={lastName}
          onChangeText={onLastNameChange}
          autoCapitalize="words"
        />
      </View>

      <TextInput
        style={[styles.input, { marginTop: 8 }]}
        placeholder="phone number"
        value={contactNumber}
        onChangeText={onNumberChange}
        keyboardType="phone-pad"
      />

      <View style={styles.buttonRow}>
        <Button title="📷 Add Photo" onPress={onPickImage} color="#666" />
        <View style={{ width: 8 }} />
        <Button title={submitLabel} onPress={onSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#eee",
    gap: 12,
  },
  imagePreview: {
    alignItems: "center",
    marginBottom: 4,
    position: "relative",
  },
  removeImage: {
    position: "absolute",
    top: 4,
    right: 40,
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
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 },
  buttonRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
});
