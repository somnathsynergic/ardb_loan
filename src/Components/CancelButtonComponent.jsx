import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PixelRatio,
} from "react-native"
import React from "react"
// import LinearGradient from 'react-native-linear-gradient';
import { COLORS, colors } from "../Resources/colors"
import { SCREEN_HEIGHT } from "react-native-normalize"

const CancelButtonComponent = ({
  title,
  disabled = false,
  handleOnpress,
  customStyle,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={handleOnpress}
      style={[
        {
          backgroundColor: disabled
            ? COLORS.darkScheme.secondary
            : COLORS.lightScheme.primary,
          borderColor: COLORS.lightScheme.primary,
          borderWidth: 1.5,
        },
        { ...styles.container, ...customStyle },{ height: SCREEN_HEIGHT * 0.05 }
      ]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

export default CancelButtonComponent

const styles = StyleSheet.create({
  container: {
    borderRadius: PixelRatio.roundToNearestPixel(12),
    padding: 10,
    borderColor: COLORS.lightScheme.primary,
    border: 0.5,
    elevation: 2,
    backgroundColor:'white'
  },
  text: {
    color: COLORS.lightScheme.primary,
    fontSize: PixelRatio.roundToNearestPixel(15),
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1,
  },
})
