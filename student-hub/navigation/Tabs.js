// modules
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// screens
import Stacks from './Stacks'
import ResourcesScreen from '../screens/ResourcesScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Tab = createBottomTabNavigator()

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name='Home' component={Stacks} options={{ headerShown: false }} />
      <Tab.Screen name='Resources' component={ResourcesScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default Tabs