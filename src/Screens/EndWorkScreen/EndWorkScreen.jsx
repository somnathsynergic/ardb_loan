import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
  PixelRatio,
  RefreshControl, SafeAreaView
} from "react-native"
import { useCallback, useContext, useEffect, useState } from "react"
import CustomHeader from "../../Components/CustomHeader"
import { COLORS, colors } from "../../Resources/colors"
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from "react-native-table-component"
import ButtonComponent from "../../Components/ButtonComponent"
import MpinComponent from "../../Components/MpinComponent"
import { AppStore } from "../../Context/AppContext"
import axios from "axios"
import { REACT_APP_BASE_URL } from "../../Config/config"
import { address } from "../../Routes/addresses"
import { StackActions, useFocusEffect } from "@react-navigation/native"
import { ActivityIndicator } from "react-native"

const EndWorkScreen = ({ navigation }) => {
  const [isButtonEnabled, setIsButtonEnabled] = useState(() => false)
  const [endScreenPassword, setEndScreenPassword] = useState(() => "")
  const [isLoading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const {
    userId,
    agentName,
    passcode,
    deviceId,
    bankId,
    branchCode,
    totalCollection,
    receiptNumber,
    maximumAmount,
    transDt,
    setTotalCollection,
    allowCollectionDays,
    login,
    getTotalDepositAmount,
  } = useContext(AppStore)
  console.log("transDt", transDt)
  const tableData = [
    ["Agent Code", userId],
    ["Agent Name", agentName],
    ["Branch Code", branchCode],
    ["Allowed Days", allowCollectionDays],
    // ["Send Date", transDt!=NaN && transDt!=null && transDt!=undefined? transDt?.toISOString().slice(0, 10):''],
    ["Max Collection", maximumAmount],
    ["Total Collection", totalCollection],
    ["Remaining Collection", maximumAmount - totalCollection],
  ]

  const endCollection = async () => {
    setLoading(true)
    onRefresh()
    const obj = {
      user_id: userId,
      password: passcode,
      device_id: deviceId,
      ardb_id: bankId,
      branch_code: branchCode,
      supervisor_code: userId,
      coll_flag: "Y",
    }
    console.log("XXX===========DDDDD", obj)
    await axios
      .post(address.END_COLLECTION, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        setLoading(false)

        // console.log("###### Preview: ", res.data)
        if (res.data.status) {
          alert("Your work has been submitted.")
          ToastAndroid.showWithGravityAndOffset(
            "Your work has been submitted.",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50,
          )
          setIsButtonEnabled(!isButtonEnabled)
          console.log("IF vtbstgubkui", res.data)
        } else {
          setLoading(false)

          alert(res?.data?.error)
          console.log("FI vtbstgubkui", res.data)
        }
      })
      .catch(err => {
        setLoading(false)

        console.log("############", err)
        alert("Some error while ending work.")
        ToastAndroid.showWithGravityAndOffset(
          "Some error while ending work.",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50,
        )
      })
  }

  const handleEndWorkButton = () => {
    try {
      if (endScreenPassword === passcode) {
        endCollection()
        // setIsButtonEnabled(true)
        setEndScreenPassword("")
      } else {
        alert("Invalid Password")
        setEndScreenPassword("")
      }
    } catch (error) {
      console.log(error)
      setEndScreenPassword("")
    }
  }

  // {
  //   <View style={styles.logoContainer}>
  //       <View style={{ width: '100%' }}>
  //         {/* Wellcome gretting */}
  //         <Text style={styles.grettingText}>Welcome To {'Data Bank'}</Text>
  //         {/* manual text */}
  //         <Text style={styles.manual}>Hello,{agentName}</Text>
  //       </View>
  //     </View>
  // } after CustomerHeader

  const popAction = StackActions.popToTop()
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    login()
    getTotalDepositAmount()
    setTimeout(() => {
      setRefreshing(false)
      login()
    }, 2000)
    navigation.dispatch(popAction)
  }, [])
  useEffect(() => {
    onRefresh()
    login()
  }, [])
  useFocusEffect(
    useCallback(() => {
      setRefreshing(true)
      getTotalDepositAmount()
      setTimeout(() => {
        setRefreshing(false)
        login()
      }, 2000)

      navigation.dispatch(popAction)

      return () => {
        // alert('Screen was unfocused')
        // // Useful for cleanup functions
      }
    }, []),
  )

  return (
    // <View style={{ flex: 1 }}>
    //   <CustomHeader />

    //   <View style={styles.container}>
    //     <View
    //       style={{
    //         padding: 10,
    //         backgroundColor: COLORS.lightScheme.onPrimary,
    //         margin: 20,
    //         borderRadius: 10,
    //         justifyContent: "center",
    //         alignContent: "center",
    //       }}>
    //       <ScrollView
    //         keyboardShouldPersistTaps="handled"
    //         refreshControl={
    //           <RefreshControl
    //             refreshing={refreshing}
    //             color={COLORS.lightScheme.primary}
    //             onRefresh={onRefresh}
    //           />
    //         }>
    //         <Text style={styles.todayCollection}>Today's Collections</Text>
    //         <Table
    //           borderStyle={{
    //             borderWidth: 5,
    //             borderColor: COLORS.lightScheme.primary,
    //           }}
    //           style={{ backgroundColor: COLORS.lightScheme.onPrimary }}>
    //           <Rows data={tableData} textStyle={styles.text} />
    //         </Table>
    //         <MpinComponent
    //           value={endScreenPassword}
    //           handleChange={setEndScreenPassword}
    //         />
    //         <ButtonComponent
    //           title={
    //             !isLoading ? (
    //               "End Work"
    //             ) : (
    //               <ActivityIndicator color={COLORS.lightScheme.primary} />
    //             )
    //           }
    //           customStyle={{ marginTop: 10, width: "80%", marginLeft: 30 }}
    //           handleOnpress={handleEndWorkButton}
    //           disabled={isLoading}
    //         />
    //       </ScrollView>
    //     </View>
    //   </View>
    // </View>
    // return (
  // <SafeAreaView style={styles.container}>
  //   <CustomHeader />
  //   <ScrollView 
  //     style={styles.scrollView}
  //     contentContainerStyle={styles.content}
  //     refreshControl={
  //       <RefreshControl
  //         refreshing={refreshing}
  //         colors={[COLORS.lightScheme.primary]}
  //         onRefresh={onRefresh}
  //       />
  //     }
  //     keyboardShouldPersistTaps="handled"
  //     showsVerticalScrollIndicator={false}
  //   >
  //     {/* Professional Header */}
  //     <Text style={styles.headerTitle}>End Your Day</Text>
  //     <Text style={styles.headerSubtitle}>Review collections & secure checkout</Text>

  //     {/* Today's Collections Card */}
  //     <View style={styles.summaryCard}>
  //       <Text style={styles.cardTitle}>Today's Summary</Text>
  //       <Table
  //         borderStyle={{
  //           borderWidth: 2,
  //           borderColor: COLORS.lightScheme.primary,
  //           borderRadius: 16,
  //         }}
  //         style={styles.table}
  //       >
  //         <Rows data={tableData} textStyle={styles.tableText} />
  //       </Table>
  //     </View>

  //     {/* Secure PIN Card */}
  //     <View style={[styles.pinCard, styles.elevatedCard]}>
  //       <Text style={styles.cardTitle}>Verify Completion</Text>
  //       <View style={styles.pinContainer}>
  //         <MpinComponent
  //           value={endScreenPassword}
  //           handleChange={setEndScreenPassword}
  //         />
  //       </View>
  //     </View>

  //     {/* Action Buttons */}
  //     <View style={styles.buttonSection}>
  //       <ButtonComponent
  //         title={isLoading ? "Completing..." : "End Work"}
  //         customStyle={styles.endButton}
  //         handleOnpress={handleEndWorkButton}
  //         disabled={isLoading || !endScreenPassword}
  //       />
  //     </View>
  //   </ScrollView>

  //   {/* Loading Overlay */}
  //   {isLoading && (
  //     <View style={styles.loadingOverlay}>
  //       <ActivityIndicator size="large" color={COLORS.lightScheme.primary} />
  //       <Text style={styles.loadingText}>Finalizing your day...</Text>
  //     </View>
  //   )}
  // </SafeAreaView>

// return (
  <SafeAreaView style={styles.container}>
    <CustomHeader />
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          colors={[COLORS.lightScheme.primary]}
          onRefresh={onRefresh}
        />
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.headerTitle}>End Your Day</Text>
      <Text style={styles.headerSubtitle}>Review & secure checkout</Text>

      {/* Today's Collections - Cards Instead of Table */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>Today's Collections</Text>
        
        {/* Convert your tableData to cards */}
        <View style={styles.metricCards}>
          {tableData.map((row, index) => (
            <View key={index} style={styles.metricCard}>
              <Text style={styles.metricLabel}>{row[0]}</Text>
              <Text style={styles.metricValue}>{row[1]}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Secure PIN */}
      <View style={styles.pinCard}>
        <Text style={styles.cardTitle}>Security Verification</Text>
        <View style={styles.pinContainer}>
          <MpinComponent
            value={endScreenPassword}
            handleChange={setEndScreenPassword}
          />
        </View>
      </View>

      {/* End Work Button */}
      <View style={styles.buttonSection}>
        <ButtonComponent
          title={isLoading ? "Completing..." : "End Work"}
          customStyle={styles.endButton}
          handleOnpress={handleEndWorkButton}
          disabled={isLoading || !endScreenPassword}
        />
      </View>
    </ScrollView>

    {isLoading && (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator size="large" color={COLORS.lightScheme.primary} />
        <Text style={styles.loadingText}>Finalizing day...</Text>
      </View>
    )}
  </SafeAreaView>
);

  // )
}

export default EndWorkScreen

// const styles = StyleSheet.create({
//   // logoContainer: {
//   //   flex: 2,
//   //   backgroundColor: COLORS.darkScheme.onSurface,
//   //   borderBottomLeftRadius: 50,
//   //   borderBottomRightRadius: 50,
//   //   flexDirection: 'row',
//   //   justifyContent: 'space-between',
//   //   alignItems: 'center',
//   //   paddingHorizontal: 20,
//   // },
//   // grettingText: {
//   //   fontSize: 20,
//   //   color: COLORS.lightScheme.primary,
//   //   letterSpacing: 1,
//   //   fontWeight: '900',
//   //   alignSelf: 'center',
//   // },
//   // manual: {
//   //   fontSize: 16,
//   //   color: COLORS.darkScheme.surface,
//   //   letterSpacing: 1,
//   //   fontWeight: '900',
//   //   alignSelf: 'center',
//   // },
//   text: {
//     margin: 6,
//     color: COLORS.lightScheme.onPrimaryContainer,
//     fontWeight: "400",
//     fontSize: 18,
//     letterSpacing: 1,
//   },
//   todayCollection: {
//     backgroundColor: COLORS.lightScheme.primary,
//     color: COLORS.lightScheme.onPrimary,
//     fontWeight: "600",
//     textAlign: "center",
//     fontSize: PixelRatio.roundToNearestPixel(22),
//     padding: PixelRatio.roundToNearestPixel(5),
//     marginBottom: 10,
//     borderBottomLeftRadius: 10,
//     borderBottomRightRadius: 10,
//   },
// })

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightScheme.surfaceVarient },
  scrollView: { flex: 1 },
  content: { padding: 24, paddingBottom: 60 },

  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.lightScheme.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.lightScheme.onBackground + 'BB',
    textAlign: 'center',
    marginBottom: 32,
  },

  // Summary Section
  summarySection: { marginBottom: 32 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.lightScheme.primary,
    marginBottom: 20,
    paddingBottom: 12,
  },
  metricCards: {
    gap: 12,
  },
  metricCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightScheme.onPrimary,
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  metricLabel: {
    fontSize: 13,
    color: COLORS.lightScheme.onBackground + 'AA',
    fontWeight: '500',
    flex: 1.2,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.lightScheme.primary,
    textAlign: 'right',
    flex: 0.8,
  },

  // PIN Card
  pinCard: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.lightScheme.primary + '20',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.lightScheme.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  pinContainer: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 16,
    padding: 16,
  },

  buttonSection: { paddingHorizontal: 24 },
  endButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
  },

  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.98)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.lightScheme.onBackground,
  },
});


