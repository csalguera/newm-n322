// modules
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// screens
import HomeScreen from '../screens/HomeScreen'
import ResourcesScreen from '../screens/ResourcesScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Resources' component={ResourcesScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default Tabs