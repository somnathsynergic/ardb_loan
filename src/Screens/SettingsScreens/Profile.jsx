import { FlatList, Image, StyleSheet, Text, View,ScrollView } from "react-native"
import LinearGradient from 'react-native-linear-gradient'
import { useContext } from "react"
import { COLORS, colors } from "../../Resources/colors"
import CustomHeader from "../../Components/CustomHeader"
import { Table, Rows } from "react-native-table-component"
import { icon } from "../../Resources/Icons"
import { AppStore } from "../../Context/AppContext"
const Profile = () => {
  const { userId, agentName, agentEmail, agentPhoneNumber, maximumAmount,allowCollectionDays } =
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
      <View style={{flex:1,justifyContent:'center',alignItems:'center', marginBottom:-60,marginTop:50}}>
        <Text style={{color:COLORS.lightScheme.primary,fontSize:30,fontWeight:'bold',textAlign:'center',letterSpacing:3}}>Profile</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.iconContainer}>
            {icon.Find(COLORS.lightScheme.primary, 24)}
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Supervisor</Text>
            <Text style={styles.value}>{agentName}</Text>
          </View>
        </View>

        <View style={styles.separator} />
         <View style={styles.profileRow}>
          <View style={styles.iconContainer}>
            {icon.profile(COLORS.lightScheme.primary, 24)}
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Supervisor Code</Text>
            <Text style={styles.value}>{userId}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.profileRow}>
          <View style={styles.iconContainer}>
            {icon.email(COLORS.lightScheme.primary, 24)}
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{agentEmail}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.profileRow}>
          <View style={styles.iconContainer}>
            {icon.phone(COLORS.lightScheme.primary, 24)}
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Mobile No.</Text>
            <Text style={styles.value}>{agentPhoneNumber}</Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.profileRow}>
          <View style={styles.iconContainer}>
            {icon.giver(COLORS.lightScheme.primary, 24)}
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Maximum Limit</Text>
            <Text style={styles.value}>{maximumAmount}</Text>
          </View>
        </View>
         <View style={styles.profileRow}>
          <View style={styles.iconContainer}>
            {icon.giver(COLORS.lightScheme.primary, 24)}
          </View>
          <View style={styles.profileItem}>
            <Text style={styles.label}>Maximum Allowable Days</Text>
            <Text style={styles.value}>{allowCollectionDays}</Text>
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
    backgroundColor: COLORS.lightScheme.surfaceVarient,
   
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
  avatarWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: COLORS.lightScheme.background,
    backgroundColor: COLORS.lightScheme.surface,
  },
  card: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 32,
    backgroundColor: COLORS.lightScheme.surface,
    borderRadius: 20,
    padding: 24,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.08,
    // shadowRadius: 16,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    flex: 1,
  },
  iconContainer: {
     width: 45,
    height: 45,
    borderRadius: 30,
    alignItems: 'center',
    marginRight: 16,
    justifyContent: 'center',
        backgroundColor: COLORS.lightScheme.primary + '25',

  },
  profileItem: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: 'gray',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.lightScheme.primary,
    lineHeight: 24,
  },
  separator: {
    height: 5,
    backgroundColor: COLORS.lightScheme.primary,
    marginHorizontal: -24,
  },
})
