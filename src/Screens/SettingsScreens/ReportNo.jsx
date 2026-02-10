import { useContext, useState } from "react"
import {
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from "react-native"
// import DateTimePickerModal from "react-native-modal-datetime-picker"
import { AppStore } from "../../Context/AppContext"
import CustomHeader from "../../Components/CustomHeader"
import { COLORS, colors } from "../../Resources/colors"
import { Table, Rows, Row } from "react-native-table-component"
import axios from "axios"
import { REACT_APP_BASE_URL } from "../../Config/config"
import DropdownComponent from "../../Components/DropdownComponent"
// import DateRangePicker from '../../Components/DateRangePicker'
// import Calandar from "react-native-calendars/src/calendar"
// import Calendar from "react-native-calendar-range-picker"
import CalendarPicker from "react-native-calendar-picker"
import { Dropdown } from "react-native-element-dropdown"
import { address } from "../../Routes/addresses"
import React from 'react'

function ReportNo() {
  const { userId, bankId, branchCode } = useContext(AppStore)

  // const [startingDate, setStartingDate] = useState(() => "From Date") // date in yyyy-mm-dd
  // const [endingDate, setEndingDate] = useState(() => "To Date") // date in yyyy-mm-dd

  // const [isStartingDatePickerVisible, setIsStartingDatePickerVisible] = useState(() => false)
  // const [isEndingDatePickerVisible, setIsEndingDatePickerVisible] = useState(() => false)
  // const [isDisabled,setIsDisabled] = useState(true)

  const [typeWiseReportArray, setTypeWiseReportArray] = useState(() => [])
  const [accountType, setAccountType] = useState(() => "L")
  const [isLoading, setIsLoading] = useState(false)

  const [showModal, setShowModal] = useState(() => false)
  const [selectedStartDate, setSelectedStartDate] = useState(() => new Date())
  const [selectedEndDate, setSelectedEndDate] = useState(() => new Date())
  const [isDisabled, setIsDisabled] = useState(false)

  const [focusDrop, setFocusDrop] = useState(() => false)

  const [totalAmount, setTotalAmount] = useState(() => 0)

  const startDate = selectedStartDate
    ? selectedStartDate.toISOString().slice(0, 10)
    : ""
  const endDate = selectedEndDate
    ? selectedEndDate.toISOString().slice(0, 10)
    : ""

  const onDateChange = (date, type) => {
    if (type === "END_DATE") {
      setSelectedEndDate(date)
      setShowModal(false)
    } else {
      setSelectedStartDate(date)
      setSelectedEndDate(null)
    }
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

  // const showStartingDatePicker = () => {
  //   setIsStartingDatePickerVisible(true)
  // }

  // const showEndingDatePicker = () => {
  //   setIsEndingDatePickerVisible(true)
  // }

  // const hideStartingDatePicker = () => {
  //   setIsStartingDatePickerVisible(false)
  // }

  // const hideEndingDatePicker = () => {
  //   setIsEndingDatePickerVisible(false)
  // }

  // const handleConfirmPickedFromDate = date => {
  //   console.warn("PICKED DATE >>>>>>>>>>>", date)
  //   const modifiedFromDate = new Date(date).toISOString().slice(0, 10)
  //   setStartingDate(modifiedFromDate)
  //   hideStartingDatePicker()
  // }

  // const handleConfirmPickedToDate = date => {
  //   console.warn("PICKED DATE >>>>>>>>>>>", date)
  //   const modifiedToDate = new Date(date).toISOString().slice(0, 10)
  //   setEndingDate(modifiedToDate)
  //   hideEndingDatePicker()
  // }

  const data = [
    // { label: "Daily", value: "D" },
    { label: "Loan", value: "L" },
    // { label: "RD", value: "R" },
  ]

  const tableHead = ["Sl No.", "Date", "A/C Type", "A/c No.", "Name", "Amount"]
  let tableData = typeWiseReportArray

  const getReportsTypeScroll = async () => {
    setIsLoading(true)
    setIsDisabled(true)
    const obj = {
      ardb_id: bankId,
      branch_code: branchCode,
      supervisor_code: userId,
      from_date: startDate,
      to_date: endDate,
      account_type: accountType,
    }
    let totalDepositedAmount = 0
    await axios
      .post(address.NO_WISE_REPORT, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        setIsLoading(false)
        setIsDisabled(false)
        res.data.success.msg.forEach((item, i) => {
          let rowArr = [
            i + 1,
            new Date(item.transaction_date).toLocaleDateString("en-GB"),
            item.product_code,
            item.account_number,
            item.account_holder_name,
            item.deposit_amount,
          ]
          totalDepositedAmount += item.deposit_amount
          console.log("ITEMMM TABLEEE=====", rowArr)
          tableData.push(...[rowArr])
        })

        setTotalAmount(totalDepositedAmount)
        console.log("++++++ TABLE DATA ++++++++", tableData)
        setTypeWiseReportArray(tableData)

        if (tableData.length === 0) {
          setIsLoading(false)
          setIsDisabled(false)
          ToastAndroid.showWithGravityAndOffset(
            "No data found!",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50,
          )
        }
      })
      .catch(err => {
        ToastAndroid.showWithGravityAndOffset(
          "Error occurred in the server",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50,
          setIsLoading(false),
          setIsDisabled(false),
        )
        console.log(err)
      })
  }

  const handleSubmit = () => {
    tableData = []
    getReportsTypeScroll()
  }

  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", tableData)

  console.log("###################", accountType)
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
          <Text style={styles.reportTitle}>No. Wise Report</Text>

          {/* Compact Date Range Picker */}
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={styles.datePickerCard}
            activeOpacity={0.9}
          >
            <View style={styles.dateRow}>
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>From</Text>
                <Text style={styles.dateValue}>
                  {new Date(startDate).toLocaleDateString("en-GB")}
                </Text>
              </View>
              <View style={styles.dateDivider} />
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>To</Text>
                <Text style={styles.dateValue}>
                  {new Date(endDate).toLocaleDateString("en-GB")}
                </Text>
              </View>
            </View>
            {/* <View style={styles.calendarIcon} /> */}
          </TouchableOpacity>

          {/* Account Type Dropdown */}
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
              <Text style={styles.submitButtonText}>Generate Report</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Results Section */}
        {tableData.length > 0 && (
          <View style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>{tableData.length} Records</Text>
            </View>

            {/* Professional Table */}
            <Table
              borderStyle={{
                borderWidth: 1,
                borderColor: COLORS.lightScheme.primary + '20',
                borderRadius: 16,
              }}
              style={styles.reportTable}
            >
              <Row data={tableHead} textStyle={styles.tableHead} />
              <Rows data={tableData} textStyle={styles.tableRow} />
            </Table>

            {/* Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* Calendar Modal */}
        <Modal visible={showModal} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.calendarCard}>
              <CalendarPicker
                width={350}
                height={400}
                startFromMonday={true}
                allowRangeSelection={true}
                todayBackgroundColor={COLORS.lightScheme.primary + '20'}
                selectedDayColor={COLORS.lightScheme.primary}
                selectedDayTextColor="#fff"
                onDateChange={onDateChange}
              />
              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ReportNo

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightScheme.surfaceVarient },
  content: { padding: 24, paddingBottom: 40 },

  // Header
  header: { marginBottom: 32 },
  reportTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.lightScheme.primary,
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.4,
  },

  // Date Picker Card
  datePickerCard: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 20,
    position: 'relative',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateItem: { flex: 0.48, alignItems: 'center' },
  dateLabel: {
    fontSize: 14,
    color: COLORS.lightScheme.onBackground + 'AA',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.lightScheme.primary,
  },
  dateDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.lightScheme.primary + '30',
  },
  calendarIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.lightScheme.primary + '20',
  },

  // Dropdown
  dropdownContainer: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 20,
  },
  dropdown: {
    height: 50,
    borderColor: COLORS.lightScheme.primary,
    // borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: '600', color: COLORS.lightScheme.primary
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdownFocused: {
    borderColor: COLORS.lightScheme.primary,
    elevation: 4,
  },

  // Submit Button
  submitButton: {
    backgroundColor: COLORS.lightScheme.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: COLORS.lightScheme.primary + '60',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },

  // Results Card
  resultsCard: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 24,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
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

  // Table
  reportTable: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHead: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.lightScheme.primary,
    textAlign: 'center',
    backgroundColor: COLORS.lightScheme.primary + '10',
  },
  tableRow: {
     fontSize: 10,
    fontWeight: '600',
    padding:10,
    textAlign: 'center',
    color: COLORS.lightScheme.onBackground,
  },

  // Total
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: COLORS.lightScheme.primary + '05',
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.lightScheme.primary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.lightScheme.primary,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarCard: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 24,
    padding: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    maxWidth: '90%',
  },
  modalClose: {
    backgroundColor: COLORS.lightScheme.primary,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
})
