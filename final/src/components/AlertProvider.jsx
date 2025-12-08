import { useState, useEffect } from "react";
import { Portal } from "react-native-paper";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  InteractionManager,
} from "react-native";
import { colors, spacing, borderRadius, typography } from "../styles/theme";
import { setAlertRef } from "../utils/alertUtils";

export const AlertProvider = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [alertData, setAlertData] = useState({
    title: "",
    message: "",
    buttons: [],
    type: "info",
  });

  const showAlert = (data) => {
    setAlertData({
      title: data.title || "",
      message: data.message || "",
      buttons: data.buttons || [{ label: "OK", onPress: () => {} }],
      type: data.type || "info",
    });
    setVisible(true);
  };

  const hideAlert = () => {
    setVisible(false);
  };

  const getAlertColor = () => {
    switch (alertData.type) {
      case "success":
        return colors.success;
      case "error":
        return colors.error;
      case "warning":
        return colors.warning;
      case "info":
      default:
        return colors.info;
    }
  };

  const getButtonColor = (style) => {
    if (style === "destructive") return colors.error;
    if (style === "cancel") return colors.textSecondary;
    return colors.primary;
  };

  const handleButtonPress = (button) => {
    hideAlert();
    if (button.onPress) {
      // Wait for all interactions to complete before executing onPress
      InteractionManager.runAfterInteractions(() => {
        button.onPress();
      });
    }
  };

  // Set the ref for external access
  useEffect(() => {
    setAlertRef({ show: showAlert, hide: hideAlert });
  }, []);

  const alertColor = getAlertColor();

  return (
    <>
      {children}
      <Portal>
        <Modal
          visible={visible}
          transparent
          animationType="fade"
          onRequestClose={hideAlert}
        >
          <View style={styles.overlay}>
            <View style={styles.dialog}>
              {/* Color indicator bar */}
              <View
                style={[styles.colorBar, { backgroundColor: alertColor }]}
              />

              <View style={styles.content}>
                {/* Title */}
                {alertData.title && (
                  <Text style={styles.title}>{alertData.title}</Text>
                )}

                {/* Message */}
                {alertData.message && (
                  <Text style={styles.message}>{alertData.message}</Text>
                )}
              </View>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {alertData.buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.button,
                      button.style === "cancel" && styles.cancelButton,
                    ]}
                    onPress={() => handleButtonPress(button)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        { color: getButtonColor(button.style) },
                      ]}
                    >
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  dialog: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    width: "100%",
    maxWidth: 400,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: "hidden",
  },
  colorBar: {
    height: 4,
    width: "100%",
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  message: {
    ...typography.body,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 21,
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    minHeight: 56,
  },
  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.lg,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  cancelButton: {
    borderRightWidth: 0,
  },
  buttonText: {
    ...typography.labelLg,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AlertProvider;
