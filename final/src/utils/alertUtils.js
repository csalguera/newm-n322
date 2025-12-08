/**
 * Alert utility for React Native Paper Dialog
 * Provides a centralized way to show alerts with consistent styling
 */

let alertRef = null;

export const setAlertRef = (ref) => {
  alertRef = ref;
};

export const showAlert = ({
  title = "",
  message = "",
  buttons = [{ label: "OK", onPress: () => {} }],
  type = "info", // 'info', 'success', 'error', 'warning'
}) => {
  if (alertRef) {
    alertRef.show({
      title,
      message,
      buttons,
      type,
    });
  }
};

export const showConfirm = ({
  title = "Confirm",
  message = "Are you sure?",
  onConfirm = () => {},
  onCancel = () => {},
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}) => {
  if (alertRef) {
    alertRef.show({
      title,
      message,
      buttons: [
        {
          label: cancelLabel,
          onPress: onCancel,
          style: "cancel",
        },
        {
          label: confirmLabel,
          onPress: onConfirm,
          style: "destructive",
        },
      ],
      type: "info",
    });
  }
};
