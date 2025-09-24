// modules
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// screens
import HomeScreen from '../screens/HomeScreen'

const Tab = createBottomTabNavigator()

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} />
    </Tab.Navigator>
  )
}

export default Tabs