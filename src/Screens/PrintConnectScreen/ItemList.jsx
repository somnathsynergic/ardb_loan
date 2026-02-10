import { TouchableOpacity, Text, View, StyleSheet } from "react-native"
import React from "react"
import { COLORS } from "../../Resources/colors"

const ItemList = ({
  label,
  value,
  onPress,
  connected,
  actionText,
  color = COLORS.lightScheme.primary,
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{label || "UNKNOWN"}</Text>
        <Text>{value}</Text>
      </View>
      {connected && <Text style={styles.connected}>Connect</Text>}
      {!connected && (
        <TouchableOpacity onPress={onPress} style={styles.button(color)}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default ItemList

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.lightScheme.surface,
    marginBottom: 12,
    padding: 12,
    borderRadius: 4,
  },
  label: { fontWeight: "bold" },
  connected: { fontWeight: "bold", color: COLORS.lightScheme.primary },
  button: color => ({
    backgroundColor: color,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
  }),
  actionText: { color: "white" },
})
