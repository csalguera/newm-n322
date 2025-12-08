import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../auth/AuthContext";
import { View, ActivityIndicator } from "react-native";

const Gate = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }
  return children;
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <Gate>
        <Stack screenOptions={{ headerShown: false }} />
      </Gate>
    </AuthProvider>
  );
};

export default RootLayout;
