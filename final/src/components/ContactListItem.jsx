import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Avatar from "./Avatar";
import { colors, spacing, typography } from "../styles/theme";

export default function ContactListItem({ name, number, imageUri, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Avatar
        uri={imageUri}
        name={name}
        size={56}
        borderColor={colors.border}
        borderWidth={0}
      />
      <View style={styles.contactInfo}>
        <Text style={styles.contact}>{name}</Text>
        <Text style={styles.contactNumber}>{number}</Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  contactInfo: {
    flex: 1,
    marginHorizontal: spacing.lg,
  },
  contact: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  contactNumber: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },
  arrow: {
    fontSize: 28,
    color: colors.textSecondary,
    marginLeft: spacing.md,
  },
});
