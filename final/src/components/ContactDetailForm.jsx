import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Avatar from "./Avatar";
import { colors, spacing, borderRadius, typography } from "../styles/theme";

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
            borderColor={colors.primary}
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
            placeholderTextColor={colors.textTertiary}
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
            placeholderTextColor={colors.textTertiary}
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
        placeholderTextColor={colors.textTertiary}
        value={contactNumber}
        onChangeText={onNumberChange}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.saveButton} onPress={onSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteButtonText}>Delete Contact</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    gap: spacing.lg,
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagePreview: {
    alignItems: "center",
    marginBottom: spacing.sm,
    position: "relative",
  },
  tapHint: {
    marginTop: spacing.md,
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  removeImage: {
    position: "absolute",
    top: 4,
    right: 40,
    backgroundColor: colors.error,
    borderRadius: borderRadius.full,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  label: {
    ...typography.bodySmMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.white,
  },
  saveButton: {
    backgroundColor: colors.success,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  saveButtonText: {
    color: colors.white,
    ...typography.bodyMedium,
    fontWeight: "700",
  },
  deleteButton: {
    backgroundColor: colors.error,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  deleteButtonText: {
    color: colors.white,
    ...typography.bodyMedium,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: colors.gray200,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  cancelButtonText: {
    color: colors.textPrimary,
    ...typography.bodyMedium,
    fontWeight: "700",
  },
});
