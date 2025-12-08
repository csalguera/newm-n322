import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "../auth/AuthContext";
import { View, ActivityIndicator } from "react-native";
import { PaperProvider } from "react-native-paper";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import AlertProvider from "../components/AlertProvider";
import { colors } from "../styles/theme";

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
    <PaperProvider>
      <ActionSheetProvider
        useNativeDriver
        defaultSeparatorStyle={{ backgroundColor: colors.border }}
      >
        <AuthProvider>
          <AlertProvider>
            <Gate>
              <Stack screenOptions={{ headerShown: false }} />
            </Gate>
          </AlertProvider>
        </AuthProvider>
      </ActionSheetProvider>
    </PaperProvider>
  );
};

export default RootLayout;
