// modules
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// screens
import ResourcesScreen from "../screens/ResourcesScreen";
import DetailsScreen from "../screens/DetailsScreen";

const Stack = createNativeStackNavigator();

const ResourcesStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={ResourcesScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
};

export default ResourcesStack;
