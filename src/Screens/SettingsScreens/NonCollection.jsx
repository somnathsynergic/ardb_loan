import { useContext, useState } from "react"
import {
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid, SafeAreaView
} from "react-native"
import { AppStore } from "../../Context/AppContext"
import CustomHeader from "../../Components/CustomHeader"
import { COLORS } from "../../Resources/colors"
import { Table, Rows, Row } from "react-native-table-component"
import axios from "axios"
import { address } from "../../Routes/addresses"
import { useEffect } from "react"
import { ActivityIndicator } from "react-native"
import { Dropdown } from "react-native-element-dropdown"

const NonCollection = () => {
  const { userId, bankId, branchCode } = useContext(AppStore)
  const [accountType, setAccountType] = useState(() => "L")
  const [focusDrop, setFocusDrop] = useState(() => false)
  const [nonCollectionReport, setNonCollectionReport] = useState(() => [])
  const [isDisabled, setIsDisabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // const [loading, setLoading] = useState(() => true)
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
  const tableHead = ["Sl No.", "A/c No.", "Name", "Phone"]
  let tableData = nonCollectionReport

  const getNonCollectionReport = async () => {
    setIsLoading(true)
    setIsDisabled(true)
    const obj = {
      ardb_id: bankId,
      branch_code: branchCode,
      supervisor_code: userId,
      account_type: accountType,
    }
    await axios
      .post(address.NON_COLLECTON_REPORT, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        setIsLoading(false)

        res.data.success.msg.forEach((item, i) => {
          let rowArr = [
            i + 1,
            item.account_number,
            item.customer_name,
            item.mobile_no,
          ]
          console.log("NONNNNN COLLLLL ITEMMM TABLEEE=====", rowArr)
          tableData.push(...[rowArr])
        })
        if (tableData.length == 0) {
          setIsDisabled(false)
          // setLoading(false)
          ToastAndroid.showWithGravityAndOffset(
            "No data found!",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50,
          )
        }
        console.log("++++++ TABLE DATA ++++++++", tableData)
        setNonCollectionReport(tableData)
        // setLoading(false)
        setIsDisabled(false)
      })
      .catch(err => {
        setIsLoading(false)
        setIsDisabled(false)

        ToastAndroid.showWithGravityAndOffset(
          "Error occurred in the server",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50,
        )
        console.log(err)
      })
  }

  useEffect(() => {
    tableData = []
    // getNonCollectionReport()
  }, [])
  const handleSubmit = () => {
    tableData = []
    getNonCollectionReport()
  }
  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", tableData)
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
  //       <Text style={styles.todayCollection}>Non Collection Report</Text>
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

  //             {/* {loading ? (
  //               ''
  //               <ActivityIndicator animating={true} />
  //             ) : (
  //               <Rows data={tableData} textStyle={styles.text} />
  //             )
              
  //             } */}
  //           </Table>
  //         )}
  //       </ScrollView>
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
        <Text style={styles.reportTitle}>Non Collection Report</Text>
        
        {/* Warning Badge */}
        <View style={styles.warningBadge}>
          <Text style={styles.warningText}>⚠️ Accounts Due for Collection</Text>
        </View>

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
            <Text style={styles.submitButtonText}>Find Due Accounts</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Section */}
      {tableData.length > 0 && (
        <View style={styles.resultsCard}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsTitle}>
              {tableData.length} Accounts Due
            </Text>
            <View style={styles.dueBadge}>
              <Text style={styles.dueBadgeText}>Action Required</Text>
            </View>
          </View>

          {/* Non-Collection Table */}
          <Table
            borderStyle={{
              borderWidth: 1,
              borderColor: '#fee2e2',
              borderRadius: 16,
            }}
            style={styles.nonCollectionTable}
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

export default NonCollection

// const styles = StyleSheet.create({
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
//   btnlabel: {
//     color: "white",
//     fontWeight: "bold",
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
    marginBottom: 12,
    letterSpacing: -0.4,
  },

  // Warning Badge
  warningBadge: {
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#f59e0b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
    marginBottom: 24,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d97706',
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
  dropdown: { borderWidth: 0, backgroundColor: 'transparent' },
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
    color: '#dc2626',
  },
  dueBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#f87171',
  },
  dueBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
  },

  // Non-Collection Table (Red Theme)
  nonCollectionTable: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
  },
  tableHead: {
    fontSize: 14,
    fontWeight: '800',
    color: '#dc2626',
    textAlign: 'center',
    backgroundColor: '#fef2f2',
  },
  tableRow: {
     fontSize: 12,
    fontWeight: '600',
    padding:10,
    textAlign: 'center',
    color: COLORS.lightScheme.onBackground,
  },
});

