import { StyleSheet, Image, View } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import Home from "../Screens/Home/Home"
import mainNavigationRoutes from "../Routes/NavigationRoutes"
import HomeTwo from "../Screens/Home/HomeTwo"
import { icon } from "../Resources/Icons"
import { COLORS, colors } from "../Resources/colors"
import FindAccountScreen from "../Screens/FindAccountScreen/FindAccountScreen"
import NotificationScreen from "../Screens/Notification/NotificationScreen"
import AccountFindNavigation from "./AccountFindNavigation"
import SettingsNavigation from "./SettingsNavigation"
import EndWork from "../Screens/SettingsScreens/EndWork"
import EndWorkScreen from "../Screens/EndWorkScreen/EndWorkScreen"
import HomeNavigation from "./HomeNavigation"

const Tab = createBottomTabNavigator()

const BottomNavigation = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: COLORS.lightScheme.onPrimary,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          tabBarActiveTintColor: COLORS.lightScheme.primary,
          tabBarInactiveTintColor: COLORS.lightScheme.outline,
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
        }}>
        <Tab.Screen
          name={"Home_Navigator"}
          options={{
            tabBarIcon: ({ color, size }) => icon.HomeFill(color, 30),
            headerShown: false,
          }}
          component={HomeNavigation}
        />

        {/* <Tab.Screen
          name={"FindAccountScreen"}
          options={{
            tabBarIcon: ({ color, size }) => icon.Find(color, 30),
            headerShown: false,
          }}
          component={AccountFindNavigation}
        /> */}

        <Tab.Screen
          name={"EndWorkScreen"}
          options={{
            tabBarIcon: ({ color, size }) => (
              <View style={styles.middleIcon}>
                {icon.end(COLORS.lightScheme.onPrimary, 30)}
              </View>
            ),
            headerShown: false,
          }}
          component={EndWorkScreen}
        />

        <Tab.Screen
          name="SettingScreens"
          component={SettingsNavigation}
          options={{
            tabBarIcon: ({ color, size }) => icon.settings(color, 30),
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </>
  )
}

export default BottomNavigation

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
  },
  middleIcon: {
    backgroundColor: COLORS.lightScheme.primary,
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
})
