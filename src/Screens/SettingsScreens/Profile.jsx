import { FlatList, Image, StyleSheet, Text, View,ScrollView } from "react-native"
import { useContext } from "react"
import { COLORS, colors } from "../../Resources/colors"
import CustomHeader from "../../Components/CustomHeader"
import { Table, Rows } from "react-native-table-component"
import { icon } from "../../Resources/Icons"
import { AppStore } from "../../Context/AppContext"
const Profile = () => {
  const { userId, agentName, agentEmail, agentPhoneNumber, maximumAmount } =
    useContext(AppStore)

  const tableData = [
    ["Agent Code", userId],
    // ['Agent Name', agentName],
    ["Email", agentEmail],
    ["Mobile No.", agentPhoneNumber],
    ["Maximum Limit (₹)", maximumAmount],
  ]
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.introText}>
            <Text style={styles.greeting}>{`Hello, ${agentName}!`}</Text>
          </View>
        </View>
        {/* <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://cdn.pixabay.com/photo/2015/03/04/22/35/avatar-659651_640.png",
            }}
            style={styles.avatar}
          />
        </View> */}
      </View>

      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Supervisor Code</Text>
            <Text style={styles.value}>{userId}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.profileRow}>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{agentEmail}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.profileRow}>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Mobile No.</Text>
            <Text style={styles.value}>{agentPhoneNumber}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.profileRow}>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Maximum Limit</Text>
            <Text style={styles.value}>{maximumAmount}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: COLORS.lightScheme.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  logoContainer: {
    backgroundColor: COLORS.lightScheme.primary,
    borderBottomRightRadius: 32,
    borderBottomLeftRadius: 32,
    height: 140,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  introText: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent:'flex-start'
  },
  greeting: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.lightScheme.onPrimary,
    lineHeight: 28,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -80,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: COLORS.lightScheme.background,
    backgroundColor: COLORS.lightScheme.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 32,
    backgroundColor: COLORS.lightScheme.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    flex: 1,
  },
  profileItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.lightScheme.onSurfaceVariant,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.lightScheme.primary,
    lineHeight: 24,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.lightScheme.outlineVariant,
    marginHorizontal: -24,
  },
})
