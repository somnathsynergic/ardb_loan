import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  PixelRatio,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid, SafeAreaView
} from "react-native"
import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { address } from "../../Routes/addresses"
import { Row, Rows, Table } from "react-native-table-component"
import CustomHeader from "../../Components/CustomHeader"
import { COLORS } from "../../Resources/colors"
import { AppStore } from "../../Context/AppContext"
import { Dropdown } from "react-native-element-dropdown"

export default function LastFiveTnxReport() {
  const { userId, bankId, branchCode } = useContext(AppStore)
  const [lastFiveData, setLastFiveData] = useState(() => [])
  const [focusDrop, setFocusDrop] = useState(() => false)
  const [showModal, setShowModal] = useState(() => false)
  const [accountType, setAccountType] = useState(() => "L")
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const tableHead = ["Date", "Acc No", "Name", "Dep Amt"]
  let tableData = lastFiveData

  const getLastFiveTnx = async () => {
    setIsLoading(true)
    setIsDisabled(true)
    await axios
      .post(
        address.LAST_FIVE_TRANSACTIONS,
        {
          ardb_id: bankId,
          branch_code: branchCode,
          supervisor_code: userId,
          account_type: accountType,
        },
        {
          headers: {
            Accept: "application/json",
          },
        },
      )
      .then(res => {
        // setLastFiveData(res.data.data.msg)
        res.data.data.msg.forEach((item, i) => {
          let row = [
            new Date(item.transaction_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }),
            item.account_number,
            item.account_holder_name,
            item.deposit_amount,
          ]
          console.log("dfasjhgfisgyaf", row)

          tableData.push(...[row])
          setIsLoading(false)
          setIsDisabled(false)
        })
        if (tableData.length == 0) {
          ToastAndroid.showWithGravityAndOffset(
            "No data found!",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50,
          )
        }

        setLastFiveData(tableData)
      })
  }

  const handleSubmit = () => {
    tableData = []
    getLastFiveTnx()
  }
  const renderLabel = () => {
    if (accountType || focusDrop) {
      return (
        <Text style={[styles.label, focusDrop && { color: "blue" }]}>
          Select type
        </Text>
      )
    }
    return null
  }
  const data = [
    // { label: "Daily", value: "D" },
    { label: "Loan", value: "L" },
    // { label: "RD", value: "R" },
  ]
  //   useEffect(() => {
  //     tableData = []
  //     getLastFiveTnx()
  //   }, [])

  // return (
  //   <View style={{ flex: 1 }}>
  //     <CustomHeader />
  //     <View
  //       style={{
  //         flex: 4,
  //         padding: 10,
  //         backgroundColor: COLORS.lightScheme.background,
  //         margin: 20,
  //         borderRadius: 10,
  //       }}>
  //       <Text style={styles.todayCollection}>Last Five Transactions</Text>
  //       <View style={styles.dropdownContainer}>
  //         {renderLabel()}
  //         <Dropdown
  //           style={[styles.dropdown, focusDrop && { borderColor: "blue" }]}
  //           placeholderStyle={styles.placeholderStyle}
  //           selectedTextStyle={styles.selectedTextStyle}
  //           inputSearchStyle={styles.inputSearchStyle}
  //           iconStyle={styles.iconStyle}
  //           data={data}
  //           search
  //           maxHeight={300}
  //           labelField="label"
  //           valueField="value"
  //           placeholder={!focusDrop ? "Select type" : "..."}
  //           searchPlaceholder="Search..."
  //           value={accountType}
  //           onFocus={() => setFocusDrop(true)}
  //           onBlur={() => setFocusDrop(false)}
  //           onChange={item => {
  //             setIsDisabled(false)

  //             setAccountType(item.value)
  //             setFocusDrop(false)
  //           }}
  //           // renderLeftIcon={() => (
  //           //   <AntDesign
  //           //     style={styles.icon}
  //           //     color={isFocus ? 'blue' : 'black'}
  //           //     name="Safety"
  //           //     size={20}
  //           //   />
  //           // )}
  //         />
  //       </View>
  //       <View>
  //         <TouchableOpacity
  //           disabled={isDisabled || isLoading}
  //           onPress={() => handleSubmit()}
  //           style={isDisabled ? styles.disabledContainer : styles.dateButton}>
  //           {isLoading ? (
  //             <ActivityIndicator
  //               color={COLORS.lightScheme.primary}
  //               size={"large"}></ActivityIndicator>
  //           ) : (
  //             <Text style={styles.btnlabel}>SUBMIT</Text>
  //           )}
  //         </TouchableOpacity>
  //       </View>

  //       <ScrollView>
  //         {tableData.length != 0 && (
  //           <Table
  //             borderStyle={{
  //               borderWidth: 2,
  //               borderColor: COLORS.lightScheme.secondary,
  //               borderRadius: 10,
  //             }}
  //             style={{ backgroundColor: COLORS.lightScheme.background }}>
  //             <Row data={tableHead} textStyle={styles.head} />
  //             <Rows data={tableData} textStyle={styles.text} />
  //           </Table>
  //         )}
  //       </ScrollView>
  //       {/* <View>
  //         <TouchableOpacity
  //           onPress={() => printReceipt()}
  //           style={styles.dateButton}>
  //           <Text>Print</Text>
  //         </TouchableOpacity>
  //       </View> */}
  //     </View>
  //   </View>
  // )
  return (
  <SafeAreaView style={styles.container}>
    <CustomHeader />
    <ScrollView 
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Report Header */}
      <View style={styles.header}>
        <Text style={styles.reportTitle}>Last 5 Transactions</Text>
        
        {/* Account Type Filter */}
        <View style={styles.dropdownSection}>
          <Text style={styles.sectionLabel}>Filter by Account Type</Text>
          <View style={styles.dropdownContainer}>
            {renderLabel()}
            <Dropdown
              style={[styles.dropdown, focusDrop && styles.dropdownFocused]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={data}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={!focusDrop ? "Select account type" : "..."}
              searchPlaceholder="Search type..."
              value={accountType}
              onFocus={() => setFocusDrop(true)}
              onBlur={() => setFocusDrop(false)}
              onChange={item => {
                setIsDisabled(false)
                setAccountType(item.value)
                setFocusDrop(false)
              }}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          disabled={isDisabled || isLoading}
          onPress={handleSubmit}
          style={[
            styles.submitButton,
            (isDisabled || isLoading) && styles.submitButtonDisabled
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Load Transactions</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Section */}
      {tableData.length > 0 && (
        <View style={styles.resultsCard}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {tableData.length} of 5 Transactions
            </Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Recent</Text>
            </View>
          </View>

          {/* Transaction Table */}
          <Table
            borderStyle={{
              borderWidth: 1,
              borderColor: COLORS.lightScheme.primary + '20',
              borderRadius: 16,
            }}
            style={styles.transactionTable}
          >
            <Row data={tableHead} textStyle={styles.tableHead} />
            <Rows data={tableData} textStyle={styles.tableRow} />
          </Table>
        </View>
      )}
    </ScrollView>
  </SafeAreaView>
);

}

// const styles = StyleSheet.create({
//   dateWrapper: {
//     flex: 1,
//     justifyContent: "space-evenly",
//     alignItems: "center",
//     flexDirection: "row",
//     margin: 20,
//   },
//   dateButton: {
//     width: "40%",
//     height: 40,
//     borderWidth: 2,
//     borderColor: COLORS.lightScheme.primary,
//     backgroundColor: COLORS.lightScheme.primary,
//     margin: 15,
//     borderRadius: 30,
//     alignSelf: "center",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   text: {
//     margin: 6,
//     color: COLORS.lightScheme.onBackground,
//     fontWeight: "400",
//     fontSize: 10,
//   },
//   head: {
//     margin: 6,
//     color: COLORS.lightScheme.onBackground,
//     fontWeight: "900",
//     fontSize: 10,
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
//   footerText: {
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   dropdownContainer: {
//     backgroundColor: "white",
//     padding: 16,
//   },
//   dropdown: {
//     height: 50,
//     borderColor: "gray",
//     borderWidth: 0.5,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//   },
//   icon: {
//     marginRight: 5,
//   },
//   disabledContainer: {
//     width: "40%",
//     height: 40,
//     borderWidth: 2,
//     borderColor: "lightgray",
//     backgroundColor: "lightgray",
//     margin: 15,
//     borderRadius: 30,
//     alignSelf: "center",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   btnlabel: {
//     color: "white",
//     fontWeight: "bold",
//   },
// })

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightScheme.background },
  content: { padding: 24, paddingBottom: 40 },

  // Header
  header: { marginBottom: 32 },
  reportTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.lightScheme.primary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },

  // Dropdown Section
  dropdownSection: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.lightScheme.primary,
    marginBottom: 12,
  },
  dropdownContainer: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  dropdown: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  dropdownFocused: {
    borderWidth: 2,
    borderColor: COLORS.lightScheme.primary,
  },
  placeholderStyle: { fontSize: 16, color: COLORS.lightScheme.onBackground + 'AA' },
  selectedTextStyle: { fontSize: 16, fontWeight: '600', color: COLORS.lightScheme.primary },
  inputSearchStyle: { fontSize: 16, padding: 12 },
  iconStyle: { width: 20, height: 20 },

  // Submit Button
  submitButton: {
    backgroundColor: COLORS.lightScheme.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: COLORS.lightScheme.primary + '60' },
  submitButtonText: { color: 'white', fontSize: 16, fontWeight: '700' },

  // Results Card
  resultsCard: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 24,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    marginTop: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.lightScheme.primary,
  },
  badge: {
    backgroundColor: COLORS.lightScheme.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.lightScheme.primary,
  },

  // Transaction Table
  transactionTable: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableHead: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.lightScheme.primary,
    textAlign: 'center',
    backgroundColor: COLORS.lightScheme.primary + '10',
  },
  tableRow: {
    fontSize: 12,
    fontWeight: '600',
     padding:10,
    textAlign: 'center',
    color: COLORS.lightScheme.onBackground,
  },
});

