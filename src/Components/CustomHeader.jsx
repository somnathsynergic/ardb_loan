import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native"
import React, { useContext, useState } from "react"
import { COLORS, colors } from "../Resources/colors"
import { icon } from "../Resources/Icons"
import { useNavigation } from "@react-navigation/native"
import mainNavigationRoutes from "../Routes/NavigationRoutes"
import { AppStore } from "../Context/AppContext"
import HeaderIcon from "../Resources/Images/logo.png"
import DeviceInfo from "react-native-device-info"

const CustomHeader = () => {
  const [isImageLoad, setIsImageLoad] = useState(true)

  const { isLogin, setIsLogin, logout } = useContext(AppStore)

  const navigation = useNavigation()
  let version = DeviceInfo.getVersion()

  const handleLogOut = () => {
    Alert.alert("Logging out", "Are you sure you want to log out?", [
      {
        text: "No",
        onPress: () => console.log("Cancel Pressed"),
        style: 'red',
      },
      {
        text: "Yes",
        onPress: () => {
          logout()
          console.log(isLogin)
          navigation.navigate(mainNavigationRoutes.login)
        },
      },
    ])
  }
  return (
    <View style={styles.container}>
      <Text ></Text>
      {isImageLoad && (
        <Image
          source={HeaderIcon}
          style={styles.image}
          resizeMode="contain"
          onError={err => setIsImageLoad(false)}
        />
      )}
      {!isImageLoad && (
        <Text style={{ color: COLORS.lightScheme.onBackground }}>
          ARDB
        </Text>
      )}
      <Pressable onPress={handleLogOut}>
        {icon.logout(COLORS.lightScheme.error)}
      </Pressable>
    </View>
  )
}

export default CustomHeader

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightScheme.surface,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOffset: { width: 5, height: 20 },
    // shadowOpacity: 1.5,
    // shadowRadius: 2,
    elevation: 2,
  },
  image: {
    height: 50,
    width: 50,
    marginLeft: 30,
    marginTop:10
  },
})
