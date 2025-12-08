import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Avatar from "./Avatar";
import { colors, spacing, borderRadius, typography } from "../styles/theme";

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
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="First name"
          placeholderTextColor={colors.textTertiary}
          value={firstName}
          onChangeText={onFirstNameChange}
          autoCapitalize="words"
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Last name"
          placeholderTextColor={colors.textTertiary}
          value={lastName}
          onChangeText={onLastNameChange}
          autoCapitalize="words"
        />
      </View>

      <TextInput
        style={[styles.input, { marginTop: spacing.sm }]}
        placeholder="Phone number"
        placeholderTextColor={colors.textTertiary}
        value={contactNumber}
        onChangeText={onNumberChange}
        keyboardType="phone-pad"
      />

      <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
        <Text style={styles.submitButtonText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
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
    alignItems: "center",
    gap: spacing.md,
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
  submitButton: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginTop: spacing.md,
  },
  submitButtonText: {
    color: colors.white,
    ...typography.bodyMedium,
    fontWeight: "700",
  },
});
