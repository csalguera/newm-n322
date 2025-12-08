import { Tabs, Redirect } from "expo-router";
import { useAuth } from "../../auth/AuthContext";

const TabsLayout = () => {
  const { user, loading } = useAuth();
  if (!loading && !user) return <Redirect href="/(auth)/sign-in" />;
  return (
    <Tabs screenOptions={{ headerTitleAlign: "center" }}>
      <Tabs.Screen name="index" options={{ title: "Contacts" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
};

export default TabsLayout;
