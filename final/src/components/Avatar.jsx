import { Image, Text, View } from "react-native";

// Reusable avatar with optional image and initial fallback
export default function Avatar({
  uri,
  name = "",
  size = 50,
  borderColor = "#ddd",
  borderWidth = 1,
  placeholderBg = "#e9e9e9",
  textColor = "#555",
  style,
}) {
  const firstLetter = (name || "").trim().charAt(0).toUpperCase() || "?";
  const baseStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth,
    borderColor,
  };

  if (uri) {
    return <Image source={{ uri }} style={[baseStyle, style]} />;
  }

  return (
    <View
      style={[
        baseStyle,
        {
          backgroundColor: placeholderBg,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          fontSize: size * 0.36,
          fontWeight: "700",
          color: textColor,
        }}
      >
        {firstLetter}
      </Text>
    </View>
  );
}
