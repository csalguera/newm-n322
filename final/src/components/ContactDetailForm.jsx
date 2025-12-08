import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Avatar from "./Avatar";

export default function ContactDetailForm({
  firstName,
  lastName,
  contactNumber,
  imageUri,
  onFirstNameChange,
  onLastNameChange,
  onNumberChange,
  onPickImage,
  onRemoveImage,
  onSave,
  onDelete,
  onCancel,
}) {
  return (
    <View style={styles.formCard}>
      <View style={styles.imagePreview}>
        <TouchableOpacity onPress={onPickImage} activeOpacity={0.8}>
          <Avatar
            uri={imageUri}
            name={`${firstName} ${lastName}`}
            size={120}
            borderColor="#06c"
            borderWidth={2}
          />
        </TouchableOpacity>
        {imageUri ? (
          <TouchableOpacity style={styles.removeImage} onPress={onRemoveImage}>
            <Text style={styles.removeImageText}>✕</Text>
          </TouchableOpacity>
        ) : null}
        <Text style={styles.tapHint}>Tap avatar to add/change photo</Text>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First name"
            value={firstName}
            onChangeText={onFirstNameChange}
            autoCapitalize="words"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last name"
            value={lastName}
            onChangeText={onLastNameChange}
            autoCapitalize="words"
          />
        </View>
      </View>

      <Text style={styles.label}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Contact number"
        value={contactNumber}
        onChangeText={onNumberChange}
        keyboardType="phone-pad"
      />

      <View style={styles.buttonContainer}>
        <Button title="Save Changes" onPress={onSave} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Text style={styles.deleteButtonText}>Delete Contact</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onCancel} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    gap: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
  },
  imagePreview: {
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  tapHint: {
    marginTop: 8,
    color: "#666",
    fontSize: 12,
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
  row: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: "#c00",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
