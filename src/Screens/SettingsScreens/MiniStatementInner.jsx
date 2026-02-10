import { useContext, useState, useEffect } from "react"
import {
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Modal,
  ActivityIndicator, SafeAreaView
} from "react-native"
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import { AppStore } from "../../Context/AppContext"
import CustomHeader from "../../Components/CustomHeader"
import { COLORS } from "../../Resources/colors"
import { Table, Rows, Row, Col } from "react-native-table-component"
import axios from "axios"
import CalendarPicker from "react-native-calendar-picker"
import { address } from "../../Routes/addresses"
import { removeIndexes } from "../../Functions/removeIndexes"

const MiniStatementInner = ({ route }) => {
  const { item } = route.params
  console.log('item '+item.product_id)
  const { userId, bankId, branchCode, bankName, branchName, agentName } =
    useContext(AppStore)

  const [selectedStartDate, setSelectedStartDate] = useState(() => new Date())
  const [selectedEndDate, setSelectedEndDate] = useState(() => new Date())
  const [showModal, setShowModal] = useState(() => false)
  const [miniStatementArray, setMiniStatementArray] = useState(() => [])
  const [totalAmount, setTotalAmount] = useState(() => 0)
  const [isLoading, setIsLoading] = useState(false)
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

  const tableHead = ["Sl No.", "Date", "Collected Amt.", "Outstanding","Demand"]
  const accountDetailsTable = [[item?.customer_name], [item?.account_number]]
  let tableData = miniStatementArray

  const dateFormatters = dateData => {
    const originalDate = dateData
    const date = new Date(originalDate)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")

    const formattedDate = `${day}/${month}/${year}`
    console.log(formattedDate)
    return formattedDate
  }

  const getMiniStatement = async () => {
    setIsLoading(true)
    const obj = {
      ardb_id: bankId,
      branch_code: branchCode,
      supervisor_code: userId,
      account_number: item?.product_id,
      account_type: item?.acc_type,
      // from_date: startDate,
      // to_date: endDate,
    }
    let totalDepositedAmount = 0
    await axios
      .post(address.MINI_STATEMENT, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        setIsLoading(false)
        console.log(res?.data?.success?.msg)
        res?.data?.success?.msg?.forEach((item, i) => {
          let rowArr = [
            i + 1,
            new Date(item?.paid_dt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }),
            //dateFormatters(item.PAID_DT),
            item.paid_amt,
            item.remaining_balance,
            item.remaining_demand,
          ]
          totalDepositedAmount += item.paid_amt
          console.log("ITEMMM TABLEEE=====", rowArr)
          tableData.push(...[rowArr])
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
        setTotalAmount(totalDepositedAmount)
        console.log("++++++ TABLE DATA ++++++++", tableData)
        setMiniStatementArray(tableData)
      })
      .catch(err => {
        setIsLoading(false)

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

  async function printReceipt() {
    try {
      await BluetoothEscposPrinter.printerAlign(
        BluetoothEscposPrinter.ALIGN.CENTER,
      )
      await BluetoothEscposPrinter.printText(bankName, { align: "center" })
      await BluetoothEscposPrinter.printText("\r\n", {})
      await BluetoothEscposPrinter.printText(branchName, { align: "center" })
      await BluetoothEscposPrinter.printText("\r\n", {})
      await BluetoothEscposPrinter.printColumn(
        [10, 2, 18],
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        [
          "Date",
          ":",
          new Date()
            .toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            })
            .toString(),
        ],
        {},
      )
      await BluetoothEscposPrinter.printColumn(
        [10, 2, 18],
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["Agent", ":", agentName],
        {},
      )
      await BluetoothEscposPrinter.printColumn(
        [10, 2, 18],
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["Cus Name", ":", item.cust_name],
        {},
      )

      await BluetoothEscposPrinter.printColumn(
        [10, 2, 18],
        [
          BluetoothEscposPrinter.ALIGN.LEFT,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.RIGHT,
        ],
        ["Acc No", ":", item.product_id],
        {},
      )

      await BluetoothEscposPrinter.printText(
        "-------------------------------\n",
        {},
      )

      await BluetoothEscposPrinter.printText("MINI STATEMENT\n", {
        align: "center",
      })

      // await BluetoothEscposPrinter.printText(`FROM: ${new Date(startDate).toLocaleDateString("en-GB", {day: "2-digit", month: "2-digit", year: "2-digit"})}  TO: ${new Date(endDate).toLocaleDateString("en-GB", {day: "2-digit", month: "2-digit", year: "2-digit"})}`, {
      //   align: "center",
      // })

      await BluetoothEscposPrinter.printText("\r", {})

      // await BluetoothEscposPrinter.printPic(logo, { width: 300, align: "center", left: 30 })

      await BluetoothEscposPrinter.printText(
        "-------------------------------",
        {},
      )
      await BluetoothEscposPrinter.printText("\r\n", {})

      let columnWidthsHeader = [10, 10, 10]
      await BluetoothEscposPrinter.printColumn(
        columnWidthsHeader,
        [
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
          BluetoothEscposPrinter.ALIGN.CENTER,
        ],
        ["Date", "Coll Amt", "Outstanding","Demand"],
        {},
      )

      const copiedTableData = [...tableData]
      console.log("TABLLLELEEEEE DDDAAATAAAA  CPPPYYY ", copiedTableData)

      let columnWidthsBody = [30]
      copiedTableData.forEach(async item => {
        let newItems = [...item]
        console.log("new itemsssssss", newItems)
        const updatedItems = removeIndexes(newItems, [0])

        // updatedItems[2] = updatedItems[2].slice(0, 8)
        let items = updatedItems.join("     ")
        console.log("++==++ PRINTED ITEM", items)
        await BluetoothEscposPrinter.printColumn(
          columnWidthsBody,
          [BluetoothEscposPrinter.ALIGN.CENTER],
          [items.toString()],
          {},
        )
      })

      await BluetoothEscposPrinter.printText(
        "-------------------------------\n",
        {},
      )

      await BluetoothEscposPrinter.printText(
        `TOTAL AMOUNT: ${totalAmount}\r\n`,
        {
          align: "center",
        },
      )
      // await BluetoothEscposPrinter.printText("Total Receipts: " + totalReceipts + "\n", { align: "center" })
      // await BluetoothEscposPrinter.printText("Total Amount: " + total + "\n", { align: "center" })
      await BluetoothEscposPrinter.printText(
        "---------------X---------------",
        {},
      )

      await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {})
    } catch (e) {
      console.log(e.message || "ERROR")
      ToastAndroid.showWithGravityAndOffset(
        "Printer not connected.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      )
    }
  }

  useEffect(() => {
    getMiniStatement()
  }, [])

  // const handleSubmit = () => {
  //   tableData = []
  //   getMiniStatement()
  // }

  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", tableData)
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
          <Text style={styles.reportTitle}>Mini Statement</Text>
        </View>

        {/* Account Details Card */}
        <View style={styles.accountCard}>
          <Text style={styles.accountTitle}>Account Details</Text>
          <View style={styles.accountInfo}>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>Customer Name:</Text>
              <Text style={styles.accountValue}>{item?.cust_name}</Text>
            </View>
            <View style={styles.accountRow}>
              <Text style={styles.accountLabel}>Account Number:</Text>
              <Text style={styles.accountValue}>{item?.product_id}</Text>
            </View>
          </View>
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={COLORS.lightScheme.primary} size="large" />
            <Text style={styles.loadingText}>Loading mini statement...</Text>
          </View>
        )}

        {/* Results Section */}
        {tableData.length > 0 && (
          <View style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>{tableData.length} Transactions</Text>
              <TouchableOpacity
                disabled={tableData.length === 0}
                onPress={printReceipt}
                style={[
                  styles.printButton,
                  tableData.length === 0 && styles.printButtonDisabled
                ]}
              >
                <Text style={styles.printButtonText}>🖨️ Print</Text>
              </TouchableOpacity>
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

            {/* Total Amount */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>₹{totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default MiniStatementInner

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

  // Account Details Card
  accountCard: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 20,
  },
  accountTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.lightScheme.primary,
    marginBottom: 16,
  },
  accountInfo: { gap: 12 },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountLabel: {
    fontSize: 14,
    color: COLORS.lightScheme.onBackground + 'AA',
    flex: 1,
  },
  accountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.lightScheme.primary,
    flex: 1,
    textAlign: 'right',
  },

  // Loading Card
  loadingCard: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 20,
    padding: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.lightScheme.primary,
    marginTop: 12,
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
  printButton: {
    backgroundColor: COLORS.lightScheme.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  printButtonDisabled: { backgroundColor: COLORS.lightScheme.primary + '50' },
  printButtonText: { color: 'white', fontSize: 14, fontWeight: '600' },

  // Transaction Table
  transactionTable: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  tableHead: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.lightScheme.primary,
    textAlign: 'center',
    backgroundColor: COLORS.lightScheme.primary + '10',
  },
  tableRow: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.lightScheme.onBackground,
  },

  // Total Amount
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
})
