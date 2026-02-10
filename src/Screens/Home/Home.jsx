// import {
//   StyleSheet,
//   PixelRatio,
//   ScrollView,
//   RefreshControl,
//   TouchableOpacity,
// } from "react-native"
// import { StackActions, useFocusEffect } from "@react-navigation/native"
import {  useContext,  } from "react"
// import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
// import { icon } from "../../Resources/Icons"
import { Table, Rows, Row } from "react-native-table-component"
// import { COLORS, colors } from "../../Resources/colors"
// import CustomHeader from "../../Components/CustomHeader"
// import { AppStore } from "../../Context/AppContext"
import { Button } from "react-native"
import mainNavigationRoutes from "../../Routes/NavigationRoutes"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import FindAccountScreen from "../FindAccountScreen/FindAccountScreen"
import FindLoanAccountScreen from "../FindAccountScreen/FindLoanAccountScreen"
import FindRDAccount from "../FindAccountScreen/FindRDAccount"
// import { useIsFocused } from '@react-navigation/native';
// const Home = ({ navigation }) => {
//   const {
//     userId,
//     agentName,
//     bankName,
//     branchName,
//     totalCollection,
//     getTotalDepositAmount,
//     login,
//     isLoan,
//     isRD,
//     isDaily,
//   } = useContext(AppStore)

//   const [currentDateTime, setCurrentDateTime] = useState(new Date())

//   const [refreshing, setRefreshing] = useState(false)
//   // console.log('three options: '+isLoan,isDaily,isRD)
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentDateTime(new Date())
//     }, 1000)
//     return () => clearInterval(timer)
//   }, [])

//   let bank = [[bankName]]
//   // useEffect(())
//   let tableData = [
//     // ["Bank", bankName],
//     ["Branch", branchName],
//     ["Agent Code", userId],
//     ["Agent Name", agentName],
//     ["Date", currentDateTime.toLocaleDateString("en-GB")],
//     ["Time", currentDateTime.toLocaleTimeString("en-GB")],
//     ["Total Collection", totalCollection.toFixed(2)],
//   ]

//   const onRefresh = useCallback(() => {
//     setRefreshing(true)
//     getTotalDepositAmount()
//     setTimeout(() => {
//       setRefreshing(false)
//       login()
//     }, 2000)
//   }, [])

//   const popAction = StackActions.popToTop()

//   useFocusEffect(
//     useCallback(() => {
//       // alert('Screen was focused')
//       setRefreshing(true)
//       getTotalDepositAmount()
//       setTimeout(() => {
//         setRefreshing(false)
//         login()
//       }, 2000)

//       navigation.dispatch(popAction)

//       return () => {
//         // alert('Screen was unfocused')
//         // // Useful for cleanup functions
//       }
//     }, []),
//   )

//   async function printAgentInfo() {
//     try {
//       await BluetoothEscposPrinter.printerAlign(
//         BluetoothEscposPrinter.ALIGN.CENTER,
//       )
//       await BluetoothEscposPrinter.printText(bankName, { align: "center" })
//       await BluetoothEscposPrinter.printText("\r\n", {})
//       await BluetoothEscposPrinter.printText(branchName, { align: "center" })
//       await BluetoothEscposPrinter.printText("\r\n", {})

//       await BluetoothEscposPrinter.printText("AGENT INFORMATION", {
//         align: "center",
//       })

//       await BluetoothEscposPrinter.printText("\r", {})
//       await BluetoothEscposPrinter.printText(
//         "-------------------------------",
//         {},
//       )
//       await BluetoothEscposPrinter.printText("\r\n", {})

//       await BluetoothEscposPrinter.printColumn(
//         [30],
//         [BluetoothEscposPrinter.ALIGN.LEFT],
//         ["Agent Name: " + agentName],
//         {},
//       )

//       await BluetoothEscposPrinter.printColumn(
//         [30],
//         [BluetoothEscposPrinter.ALIGN.LEFT],
//         ["Agent Code: " + userId],
//         {},
//       )

//       await BluetoothEscposPrinter.printColumn(
//         [30],
//         [BluetoothEscposPrinter.ALIGN.LEFT],
//         ["Date: " + currentDateTime.toLocaleDateString("en-GB")],
//         {},
//       )

//       await BluetoothEscposPrinter.printText("\r\n", {})

//       await BluetoothEscposPrinter.printColumn(
//         [40],
//         [BluetoothEscposPrinter.ALIGN.LEFT],
//         ["Total Collection: " + totalCollection + "/-"],
//         {},
//       )

//       await BluetoothEscposPrinter.printText("\r", {})

//       await BluetoothEscposPrinter.printBarCode(
//         "My String Decode",
//         BluetoothEscposPrinter.BARCODETYPE.JAN13,
//         3,
//         120,
//         0,
//         2,
//       )
//       await BluetoothEscposPrinter.printText("\r", {})

//       // await BluetoothEscposPrinter.printQRCode("My String Decode", 280, BluetoothEscposPrinter.ERROR_CORRECTION.L)

//       // await BluetoothEscposPrinter.printText("\r\n", {})
//       await BluetoothEscposPrinter.printText(
//         "---------------X---------------",
//         {},
//       )

//       await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {})
//       // await BluetoothEscposPrinter.printQRCode("Something", 25, 3)
//     } catch (e) {
//       // console.log(e.message || "ERROR")
//       alert("Printer is not connected. Connect it from Settings.")
//     }
//   }
//   const Stack = createNativeStackNavigator()

//   return (
//     <>
//       {/* <Stack.Navigator screenOptions={{ headerShown: false }}>
//      <Stack.Screen
//           name={mainNavigationRoutes.home}
//           component={}
//         />
//         <Stack.Screen
//           name={mainNavigationRoutes.findAccount}
//           component={FindAccountScreen}
//         />
//         <Stack.Screen
//           name={mainNavigationRoutes.findLoanAccount}
//           component={FindLoanAccountScreen}
//         />
//         <Stack.Screen
//           name={mainNavigationRoutes.findRDAccount}
//           component={FindRDAccount}
//         />
//       </Stack.Navigator> */}
//       <View style={{ flex: 1 }}>
//         <CustomHeader />

//         <View style={styles.logoContainer}>
//           <View style={{ width: "100%" }}>
//             {/* Welcome gretting */}
//             <Text style={styles.grettingText}>Welcome To {"Data Bank"}</Text>
//             {/* manual text */}
//             <Text style={styles.manual}>Hello, {agentName}</Text>
//           </View>
//         </View>

//         <View
//           style={{
//             flex: 4,
//             padding: 10,
//             backgroundColor: COLORS.lightScheme.background,
//             margin: 20,
//             borderRadius: 10,
//           }}>
//           <ScrollView
//             refreshControl={
//               <RefreshControl
//                 refreshing={refreshing}
//                 color={COLORS.lightScheme.primary}
//                 onRefresh={onRefresh}
//               />
//             }>
//             <Text style={styles.todayCollection}>Agent Information</Text>
//             <Table
//               borderStyle={{
//                 borderWidth: 2,
//                 borderColor: COLORS.lightScheme.primary,
//                 borderRadius: 15,
//               }}
//               style={{
//                 backgroundColor: COLORS.lightScheme.background,
//               }}>
//               <Row data={bank} textStyle={styles.bnk} />
//               <Rows data={tableData} textStyle={styles.text} />
//             </Table>

//             <View style={styles.options}>
//               {!isDaily && (
//                 <TouchableOpacity
//                 disabled={!isDaily}
//                 style={styles.cardContainer}
//                 onPress={() => navigation.navigate("Daily_Navigation")}>
//                 {/* Icon */}
//                 {icon.daily(
//                   isDaily
//                     ? COLORS.lightScheme.primary
//                     : COLORS.lightScheme.secondary,
//                   25,
//                 )}

//                 {/* label */}
//                 <Text style={isDaily ? styles.label : styles.disabledContainer}>
//                   {" "}
//                   Daily{" "}
//                 </Text>
//               </TouchableOpacity>)}
//               <TouchableOpacity
//                 disabled={!isLoan}
//                 onPress={() => navigation.navigate("Loan_Navigation")}
//                 style={styles.cardContainer}>
//                 {/* Icon */}
//                 {icon.giver(
//                   isLoan
//                     ? COLORS.lightScheme.primary
//                     : COLORS.lightScheme.secondary,
//                   25,
//                 )}

//                 {/* label */}
//                 <Text style={isLoan ? styles.label : styles.disabledContainer}>
//                   {" "}
//                   Loan{" "}
//                 </Text>
//               </TouchableOpacity>
//               {!isRD && (<TouchableOpacity
//                 disabled={!isRD}
//                 onPress={() => navigation.navigate("RD_Navigation")}
//                 style={styles.cardContainer}>
//                 {/* Icon */}
//                 {icon.loop(
//                   isRD
//                     ? COLORS.lightScheme.primary
//                     : COLORS.lightScheme.secondary,
//                   25,
//                 )}

//                 {/* label */}
//                 <Text style={isRD ? styles.label : styles.disabledContainer}>
//                   {" "}
//                   RD{" "}
//                 </Text>
//               </TouchableOpacity>)}
//             </View>
//           </ScrollView>
//           {/* <View style={styles.printAgent}>
//             <Button
//               title="Print"
//               color={COLORS.lightScheme.tertiary}
//               onPress={printAgentInfo}
//             />
//           </View> */}
//         </View>
//       </View>
//     </>
//   )
// }

// export default Home

// const styles = StyleSheet.create({
//   head: { height: 40, backgroundColor: "#f1f8ff" },
//   text: {
//     margin: 6,
//     color: COLORS.lightScheme.onPrimaryContainer,
//     fontWeight: "400",
//     fontSize: 18,
//   },
//   card: {
//     border: COLORS.lightScheme.primary,
//     borderWidth: 1,
//   },
//   bnk: {
//     margin: 6,
//     color: COLORS.lightScheme.primary,
//     fontWeight: "900",
//     fontSize: 18,
//   },
//   logoContainer: {
//     flex: 2,
//     backgroundColor: COLORS.lightScheme.primary,
//     borderBottomLeftRadius: 50,
//     borderBottomRightRadius: 50,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   grettingText: {
//     fontSize: 20,
//     color: COLORS.lightScheme.onPrimary,
//     letterSpacing: 1,
//     fontWeight: "900",
//     alignSelf: "center",
//   },
//   manual: {
//     fontSize: 16,
//     color: COLORS.lightScheme.onPrimary,
//     letterSpacing: 1,
//     fontWeight: "900",
//     alignSelf: "center",
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
//   printAgent: {
//     margin: 5,
//     paddingTop: 3,
//   },
//   cardContainer: {
//     backgroundColor: COLORS.lightScheme.onPrimary,
//     alignItems: "center",
//     width: "25%",
//     height: 70, //
//     padding: 6,
//     paddingTop: 20,
//     margin: 5,
//     paddingBottom: 5,
//     marginTop: 10,
//     paddingHorizontal: 10,
//     borderRadius: 10,
//     justifyContent: "center",
//     borderColor: COLORS.lightScheme.primary,
//     borderWidth: 3,
//     elevation: 30,
//   },
//   label: {
//     color: COLORS.lightScheme.primary,
//     padding: 10,
//     textAlign: "center",
//     fontSize: PixelRatio.roundToNearestPixel(13),
//     fontWeight: "bold",
//   },
//   options: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: {
//     textAlign: "center",
//     fontSize: 20,
//     fontWeight: "900",
//     color: COLORS.lightScheme.tertiaryContainer,
//     // alignSelf: 'center',
//     letterSpacing: 4,
//     backgroundColor: COLORS.lightScheme.primary,
//     paddingHorizontal: 15,
//     paddingVertical: 5,
//     borderTopLeftRadius: 100,
//     borderBottomRightRadius: 100,
//   },
//   disabledContainer: {
//     color: "gray",
//   },
// })



import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, StyleSheet, SafeAreaView, PixelRatio } from 'react-native';
import { Card, FAB } from 'react-native-paper'; // npm i react-native-paper
import CustomHeader from '../../Components/CustomHeader';
import { AppStore } from "../../Context/AppContext";
import { useFocusEffect } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import BluetoothEscposPrinter from 'react-native-bluetooth-escpos-printer'; // Your printer
import { COLORS, colors } from "../../Resources/colors";
import { icon } from '../../Resources/Icons'; // Your icon util

const Home = ({ navigation }) => {
  const {
    userId, agentName, bankName, branchName, totalCollection,
    getTotalDepositAmount, login, isLoan, isRD, isDaily,
  } = useContext(AppStore);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getTotalDepositAmount();
    setTimeout(() => { setRefreshing(false); login(); }, 2000);
  }, [getTotalDepositAmount, login]);

  useFocusEffect(
    useCallback(() => {
      setRefreshing(true);
      getTotalDepositAmount();
      setTimeout(() => { setRefreshing(false); login(); }, 2000);
      navigation.dispatch(StackActions.popToTop());
    }, [])
  );

  // printAgentInfo unchanged
  async function printAgentInfo() {
    try {
      await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
      await BluetoothEscposPrinter.printText(bankName + '\r\n' + branchName + '\r\n', { align: 'center' });
      await BluetoothEscposPrinter.printText('AGENT INFORMATION\r\n-------------------------------\r\n', {});
      await BluetoothEscposPrinter.printColumn([30], [BluetoothEscposPrinter.ALIGN.LEFT], [`Agent Name: ${agentName}`], {});
      await BluetoothEscposPrinter.printColumn([30], [BluetoothEscposPrinter.ALIGN.LEFT], [`Agent Code: ${userId}`], {});
      await BluetoothEscposPrinter.printColumn([30], [BluetoothEscposPrinter.ALIGN.LEFT], [`Date: ${currentDateTime.toLocaleDateString('en-GB')}`], {});
      await BluetoothEscposPrinter.printColumn([40], [BluetoothEscposPrinter.ALIGN.LEFT], [`Total Collection: ${totalCollection}/-`], {});
      await BluetoothEscposPrinter.printBarCode('My String Decode', BluetoothEscposPrinter.BARCODETYPE.JAN13, 3, 120, 0, 2);
      await BluetoothEscposPrinter.printText('---------------X---------------\r\n\r\n\r\n', {});
    } catch (e) {
      alert('Printer not connected. Connect from Settings.');
    }
  }

  const navData = [
    { label: 'Daily', active: isDaily,  nav: 'Daily_Navigation' },
    { label: 'Loan', active: isLoan, nav: 'Loan_Navigation' },
    { label: 'RD', active: isRD,  nav: 'RD_Navigation' },
  ];

  return (
 <SafeAreaView style={styles.container}>
  <CustomHeader />
  <ScrollView  contentContainerStyle={styles.scrollContent}>
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.greeting}>Welcome To HARDB</Text>
        <Text style={styles.agentName}>Hello, {agentName?.split(' ')[0]}</Text>
      </View>
      <View style={styles.clockPill}>
        <Text style={styles.clock}>{currentDateTime.toLocaleDateString('en-GB')}</Text>
        <Text style={styles.time}>{currentDateTime.toLocaleTimeString('en-GB')}</Text>
      </View>
    </View>

    {/* Metrics - View as Card */}
    <View style={styles.metricsContainer}>
      <View style={[styles.metricCard,{ backgroundColor: COLORS.lightScheme.secondary }]}>
        {/* <Text style={styles.metricIcon}>🏢</Text> */}
        <Text style={styles.metricLabel}>Branch</Text>
        <Text style={styles.metricValue}>{branchName}</Text>
      </View>
      <View style={[styles.metricCard,{ backgroundColor: COLORS.lightScheme.onPrimaryContainer }]}>
        {/* <Text style={styles.metricIcon}>👤</Text> */}
        <Text style={styles.metricLabel}>Supervisor Code</Text>
        <Text style={styles.metricValue}>{userId}</Text>
      </View>
      <View style={[styles.metricCard,{ backgroundColor: COLORS.lightScheme.tertiary }]}>
        {/* <Text style={styles.metricIcon}>💰</Text> */}
        <Text style={styles.metricLabel}>Total Collection</Text>
        <Text style={styles.metricValue}>₹{totalCollection.toFixed(2)}</Text>
      </View>
    </View>

    <Text style={styles.sectionTitle}>Quick Actions</Text>
    <View style={styles.navContainer}>
      {isDaily && (
        <TouchableOpacity style={styles.navCard} activeOpacity={0.8} onPress={() => navigation.navigate('Daily_Navigation')}>
          <View style={[styles.navIcon, styles.navIconActive]}>
            {icon.daily(COLORS.lightScheme.primary, 30)}
          </View>
          <Text style={styles.navLabel}>Daily</Text>
        </TouchableOpacity>
      )}
      
      {isLoan && (
        <TouchableOpacity style={styles.navCard} activeOpacity={0.8} onPress={() => navigation.navigate('Loan_Navigation')}>
          <View style={[styles.navIcon, styles.navIconActive]}>
        <Text style={styles.metricIcon}>💰</Text>

          </View>
          <Text style={styles.navLabel}>Loan</Text>
        </TouchableOpacity>
      )}
     
      {isRD && (
        <TouchableOpacity style={styles.navCard} activeOpacity={0.8} onPress={() => navigation.navigate('RD_Navigation')}>
          <View style={[styles.navIcon, styles.navIconActive]}>
            {icon.loop(COLORS.lightScheme.primary, 30)}
          </View>
          <Text style={styles.navLabel}>RD</Text>
        </TouchableOpacity>
      )}
      
    </View>
  </ScrollView>
  
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightScheme.background },
  scrollContent: { flexGrow: 1, padding: 20 },
  header: {
    backgroundColor: COLORS.lightScheme.primary,
    borderRadius: 15,
    padding: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  headerContent: { flex: 1 },
  greeting: { fontSize: 22, color: COLORS.lightScheme.onPrimary, fontWeight: '800', letterSpacing: 1 },
  agentName: { fontSize: 18, color: COLORS.lightScheme.onPrimary, fontWeight: '600', marginTop: 5 },
  clockPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  clock: { fontSize: 14, color: 'white', fontWeight: '600' },
  time: { fontSize: 20, color: 'white', fontWeight: 'bold' },
  metricsContainer: { flexDirection: 'row', gap: 15, marginBottom: 30, flexWrap: 'wrap' },
  metricCard: {
    flex: 1,
    minWidth: 140,
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  metricIcon: { fontSize: 24, marginBottom: 5 },
  metricLabel: { fontSize: 14, color: 'white', opacity: 0.7, marginBottom: 5, textAlign: 'center' },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: COLORS.lightScheme.onPrimary, textAlign: 'center' },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color:COLORS.lightScheme.secondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  navContainer: { flexDirection: 'row', justifyContent: 'space-evenly', flexWrap: 'wrap', gap: 15 },
  navCard: {
    width: 110,
    height: 120,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    borderWidth: 3,
    borderColor: COLORS.lightScheme.tertiary,
  },
  navCardDisabled: { elevation: 2, shadowOpacity: 0.1, borderColor: 'gray', backgroundColor: '#f0f0f0' },
  navIcon: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 12, backgroundColor: 'rgba(255,255,255,0.2)' },
  navIconActive: { backgroundColor: 'white' },
  navIconDisabled: { backgroundColor: 'gray' },
  navLabel: { fontSize: 16, fontWeight: 'bold', color: COLORS.lightScheme.primary, textAlign: 'center' },
  navLabelDisabled: { color: 'gray' },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.lightScheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: { fontSize: 24, color: COLORS.lightScheme.onPrimary },
});

export default Home;
