import { useContext, useEffect, useState } from "react"
import {
  PixelRatio,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Modal,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native"
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import { AppStore } from "../../Context/AppContext"
import CustomHeader from "../../Components/CustomHeader"
import { COLORS } from "../../Resources/colors"
import { Table, Rows, Row, Col } from "react-native-table-component"
import axios from "axios"
import CalendarPicker from "react-native-calendar-picker"
import { address } from "../../Routes/addresses"
import { icon } from "../../Resources/Icons"

const DuplicateReceiptInner = ({ route }) => {
  const { item } = route.params

  const {
    userId,
    bankId,
    branchCode,
    bankName,
    branchName,
    agentName,
    todayDateFromServer,
    printOp,
  } = useContext(AppStore)

  const [duplicateReceipts, setDuplicateReceipts] = useState(() => [])

  const [loading, setLoading] = useState(() => true)

  const tableHead = ["Date", "Rcpt No", "Dep Amt", "Print"]
  let tableData = duplicateReceipts

  // const [lastTnxDate, setLastTnxDate] = useState(() => "")

  const getDuplicateReceipts = async () => {
    const obj = {
      ardb_id: bankId,
      branch_code: branchCode,
      supervisor_code: userId,
      account_number: item?.product_id,
      account_type: item?.acc_type,
    }
    console.log("obj" + obj)
    await axios
      .post(address.DUPLICATE_RECEIPT, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        res?.data?.success?.msg?.forEach((item, i) => {
          // console.log(
          //   "&&&&&&&&&&&&&&&&&&&&&&&&&$$$$$$$$$$$$$$$$$$$$$$$$$$$$$",
          //   item?.date,
          // )
          let rowArr = [
            new Date(item?.collected_dt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }) +
              ", " +
              new Date(item?.collected_dt).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            item.receipt_no,
            item.deposit_amount,
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Print Duplicate",
                  "Are you sure you want to Print?",
                  [
                    {
                      text: "No",
                      onPress: () => console.log("Cancel Pressed"),
                    },
                    {
                      text: "Print",
                      onPress: async () => {
                        await getLastTnxDate(item.receipt_no)
                        printReceipt(
                          // item.receipt_no,
                          // item.date,
                          // item.account_holder_name,
                          // item.account_number,
                          // item.account_type,
                          // item.deposit_amount,
                          item,
                        ).then(() => {
                          prevTnxDate = ""
                        })
                      },
                    },
                  ],
                )
              }}
              style={styles.dateButton}>
              {icon.printer(COLORS.lightScheme.primary, 30)}
            </TouchableOpacity>,
          ]
          console.log("ITEMMM TABLEEE=====", rowArr)
          tableData.push(...[rowArr])

          setLoading(false)
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
        console.log("++++++ TABLE DATA ++++++++", tableData)
        setDuplicateReceipts(tableData)
      })
      .catch(err => {
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

  let prevTnxDate = ""

  const getLastTnxDate = async rcptNo => {
    const obj = {
      ardb_id: bankId,
      branch_code: branchCode,
      supervisor_code: userId,
      account_number: item?.product_id,
      receipt_no: rcptNo,
      flag: item?.acc_type,
    }

    console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOO", obj)

    await axios
      .post(address.LAST_TNX_DATE, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", res?.data)
        console.log(
          ">>>>>>>>>>>>>jhgff>>>>>>>>>>>>>>>>>>",
          res?.data?.success?.msg[0]?.last_trns_dt,
        )

        // setLastTnxDate(
        //   res?.data?.success?.length !== 0
        //     ? res?.data?.success?.msg[0]?.last_trns_dt?.toString()
        //     : "",
        // )

        prevTnxDate = res?.data?.success?.msg[0]?.last_trns_dt

        // {"status": true, "success": []}
        // console.log(
        //   ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
        //   res?.data?.success?.msg[0]?.last_trns_dt,
        // )
      })
      .catch(err => {
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", err)
      })
  }

  // useEffect(() => {
  //   getLastTnxDate()
  // }, [])

  async function printReceipt(item) {
    if (printOp == 2) {
      console.log(item,'item')
      try {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        await BluetoothEscposPrinter.printText(bankName, { align: "center" })
        await BluetoothEscposPrinter.printText("\r\n", {})
        await BluetoothEscposPrinter.printText(branchName, { align: "center" })
        await BluetoothEscposPrinter.printText("\r\n", {})

        await BluetoothEscposPrinter.printText("DUPLICATE RECEIPT", {
          align: "center",
        })

        await BluetoothEscposPrinter.printText("\r", {})

        // await BluetoothEscposPrinter.printPic(logo, { width: 300, align: "center", left: 30 })

        await BluetoothEscposPrinter.printText(
          "-------------------------------",
          {},
        )
        await BluetoothEscposPrinter.printText("\r\n", {})

        let columnWidths = [11, 1, 18]

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["AGENT NAME", ":", agentName.toString()],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            "RCPT DATE",
            ":",
            (
              new Date(item?.collected_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              }) +
              ", " +
              new Date(item?.collected_at).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })
            ).toString(),
          ],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          // ["RCPT NO", ":", item?.receipt_no.toString().substring(0, 6)],
          ["RCPT NO", ":", item?.receipt_no?.toString().slice(-6)],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["ACC NO", ":", item?.account_number],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["NAME", ":", item?.account_holder_name],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            item?.account_type == "L" ? "PREV BAL" : "OPEN BAL",
            ":",
            item?.opening_curr_bal?.toString(),
          ],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["COLL AMT", ":", item?.deposit_amount.toString()],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            item?.account_type == "L" ? "CURR BAL" : "CLOSE BAL",
            ":",
            item?.closing_curr_bal.toString(),
          ],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            "PRV TNX DT",
            ":",
            prevTnxDate
              ? new Date(prevTnxDate)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })
                  .toString()
              : "No date.",
          ],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            "ACC OPN DT",
            ":",
            new Date(item?.opening_date)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
              .toString(),
          ],
          {},
        )

        await BluetoothEscposPrinter.printText(
          "---------------X---------------",
          {},
        )

        await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {})
      } catch (e) {
        console.log(e.message || "ERROR")
        // console.log( "ERROR")
        // ToastAndroid.showWithGravityAndOffset(
        //   "Printer not connected.",
        //   ToastAndroid.SHORT,
        //   ToastAndroid.CENTER,
        //   25,
        //   50,
        // )
      }
    } else if (printOp == 3) {
      console.log(item)
      try {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        await BluetoothEscposPrinter.printText(bankName, { align: "center" })
        await BluetoothEscposPrinter.printText("\r\n", {})
        await BluetoothEscposPrinter.printText(branchName, { align: "center" })
        await BluetoothEscposPrinter.printText("\r\n", {})

        await BluetoothEscposPrinter.printText("DUPLICATE RECEIPT", {
          align: "center",
        })

        await BluetoothEscposPrinter.printText("\r", {})

        // await BluetoothEscposPrinter.printPic(logo, { width: 300, align: "center", left: 30 })

        await BluetoothEscposPrinter.printText(
          "------------------------------------------------",
          {},
        )
        await BluetoothEscposPrinter.printText("\r\n", {})

        let columnWidths = [20, 2, 26]

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["AGENT NAME", ":", agentName.toString()],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            "RCPT DATE",
            ":",
            (
              new Date(item?.collected_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              }) +
              ", " +
              new Date(item?.collected_at).toLocaleTimeString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              })
            ).toString(),
          ],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          // ["RCPT NO", ":", item?.receipt_no.toString().substring(0, 6)],
          ["RCPT NO", ":", item?.receipt_no.toString().slice(-6)],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["ACC NO", ":", item?.account_number],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["NAME", ":", item?.account_holder_name],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            item?.account_type == "L" ? "PREV BAL" : "OPEN BAL",
            ":",
            item?.opening_bal.toString(),
          ],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["COLL AMT", ":", item?.deposit_amount.toString()],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            item?.account_type == "L" ? "CURR BAL" : "CLOSE BAL",
            ":",
            item?.closing_bal.toString(),
          ],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            "PRV TNX DT",
            ":",
            prevTnxDate
              ? new Date(prevTnxDate)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })
                  .toString()
              : "No date.",
          ],
          {},
        )

        await BluetoothEscposPrinter.printColumn(
          columnWidths,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          [
            "ACC OPN DT",
            ":",
            new Date(item?.opening_date)
              .toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "2-digit",
              })
              .toString(),
          ],
          {},
        )

        await BluetoothEscposPrinter.printText(
          "----------------------X----------------------",
          {},
        )

        await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {})
      } catch (e) {
        console.log(e.message || "ERROR")
        // console.log( "ERROR")
        // ToastAndroid.showWithGravityAndOffset(
        //   "Printer not connected.",
        //   ToastAndroid.SHORT,
        //   ToastAndroid.CENTER,
        //   25,
        //   50,
        // )
      }
    } else {
      ToastAndroid.showWithGravityAndOffset(
        "Invalid printer option selected.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      )
    }
  }
  // async function printReceipt(
  //   rcptNo,
  //   date,
  //   accHolderName,
  //   accNumber,
  //   accType,
  //   depAmt,
  // ) {
  //   try {
  //     await BluetoothEscposPrinter.printerAlign(
  //       BluetoothEscposPrinter.ALIGN.CENTER,
  //     )
  //     await BluetoothEscposPrinter.printText(bankName, { align: "center" })
  //     await BluetoothEscposPrinter.printText("\r\n", {})
  //     await BluetoothEscposPrinter.printText(branchName, { align: "center" })
  //     await BluetoothEscposPrinter.printText("\r\n", {})

  //     await BluetoothEscposPrinter.printText("DUPLICATE RECEIPT", {
  //       align: "center",
  //     })

  //     await BluetoothEscposPrinter.printText("\r", {})

  //     // await BluetoothEscposPrinter.printPic(logo, { width: 300, align: "center", left: 30 })

  //     await BluetoothEscposPrinter.printText(
  //       "-------------------------------",
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printText("\r\n", {})

  //     let columnWidths = [11, 1, 18]

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["AGENT NAME", ":", agentName.toString()],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       [
  //         "RCPT DATE",
  //         ":",
  //         (
  //           new Date(date).toLocaleDateString("en-GB", {
  //             day: "2-digit",
  //             month: "2-digit",
  //             year: "2-digit",
  //           }) +
  //           ", " +
  //           new Date(todayDateFromServer).toLocaleTimeString("en-GB", {
  //             hour: "2-digit",
  //             minute: "2-digit",
  //           })
  //         ).toString(),
  //       ],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["RCPT NO", ":", rcptNo.toString()],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["ACC NO", ":", accNumber.toString()],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["NAME", ":", accHolderName.toString()],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       ["COLL AMT", ":", depAmt.toString()],
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printColumn(
  //       columnWidths,
  //       [
  //         BluetoothEscposPrinter.ALIGN.LEFT,
  //         BluetoothEscposPrinter.ALIGN.CENTER,
  //         BluetoothEscposPrinter.ALIGN.RIGHT,
  //       ],
  //       [
  //         "ACC TYPE",
  //         ":",
  //         accType == "D"
  //           ? "Daily"
  //           : accType == "R"
  //           ? "RD"
  //           : accType == "L"
  //           ? "Loan"
  //           : "",
  //       ],
  //       {},
  //     )
  //     await BluetoothEscposPrinter.printText(
  //       "---------------X---------------",
  //       {},
  //     )

  //     await BluetoothEscposPrinter.printText("\r\n\r\n\r\n", {})
  //   } catch (e) {
  //     console.log(e.message || "ERROR")
  //     ToastAndroid.showWithGravityAndOffset(
  //       "Printer not connected.",
  //       ToastAndroid.SHORT,
  //       ToastAndroid.CENTER,
  //       25,
  //       50,
  //     )
  //   }
  // }

  // const handleSubmit = () => {
  //   tableData = []
  //   getDuplicateReceipts()
  // }

  useEffect(() => {
    tableData = []
    getDuplicateReceipts()
  }, [])

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
          <Text style={styles.reportTitle}>Duplicate Receipts</Text>
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
        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator color={COLORS.lightScheme.primary} size="large" />
            <Text style={styles.loadingText}>Loading duplicate receipts...</Text>
          </View>
        )}

        {/* Results Section */}
        {tableData.length > 0 && (
          <View style={styles.resultsCard}>
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>{tableData.length} Receipts</Text>
            </View>

            {/* Duplicate Receipts Table */}
            <Table
              borderStyle={{
                borderWidth: 1,
                borderColor: COLORS.lightScheme.primary + '20',
                borderRadius: 16,
              }}
              style={styles.duplicateTable}
            >
              <Row data={tableHead} textStyle={styles.tableHead} />
              <Rows data={tableData} textStyle={styles.tableRow} />
            </Table>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default DuplicateReceiptInner

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
    elevation: 4,
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

  // Duplicate Receipts Table
  duplicateTable: {
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
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.lightScheme.onBackground,
    textAlign: 'center',

  },

  // Print Button
  dateButton: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
})
