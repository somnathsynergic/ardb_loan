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
  ActivityIndicator, SafeAreaView
} from "react-native"
import { BluetoothEscposPrinter } from "react-native-bluetooth-escpos-printer"
import { AppStore } from "../../Context/AppContext"
import CustomHeader from "../../Components/CustomHeader"
import { COLORS, colors } from "../../Resources/colors"
import { Table, Rows, Row } from "react-native-table-component"
import axios from "axios"
import { REACT_APP_BASE_URL } from "../../Config/config"
import CalendarPicker from "react-native-calendar-picker"
import { address } from "../../Routes/addresses"
import { removeIndexes } from "../../Functions/removeIndexes"
import { Dropdown } from "react-native-element-dropdown"
import { table } from "console"
import { NodePath } from "@babel/core"
import NoData from "../../Components/NoData"

const DayTotalReportScreen = () => {
  const { userId, bankId, branchCode, agentName, bankName, branchName,printOp } =
    useContext(AppStore)

  // const [startingDate, setStartingDate] = useState(() => "From Date") // date in yyyy-mm-dd
  // const [endingDate, setEndingDate] = useState(() => "To Date") // date in yyyy-mm-dd

  const [selectedStartDate, setSelectedStartDate] = useState(() => new Date())
  const [selectedEndDate, setSelectedEndDate] = useState(() => new Date())
  const [isData, setIsData] = useState(true)
  const [accountType, setAccountType] = useState(() => "")
  const [focusDrop, setFocusDrop] = useState(() => false)
  const [showModal, setShowModal] = useState(() => false)
  const [isDisabled, setIsDisabled] = useState(false)
  // const [isStartingDatePickerVisible, setIsStartingDatePickerVisible] = useState(() => false)
  // const [isEndingDatePickerVisible, setIsEndingDatePickerVisible] = useState(() => false)

  const [dayTotalReportArray, setDayTotalReportArray] = useState(() => [])

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

  const tableHead = ["Date", "No. of Transactions", "Amount"]
  let tableData = dayTotalReportArray

  const getReportsDayScroll = async () => {
    setIsLoading(true)
    setIsDisabled(true)
    // console.log(isLoading)
    const obj = {
      ardb_id: bankId,
      branch_code: branchCode,
      supervisor_code: userId,
      from_date: startDate,
      to_date: endDate,
      //   account_type: accountType,
    }
    let totalCollectedAmount = 0
    await axios
      .post(address.DAY_TOTAL_REPORT, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        setIsLoading(false)
        setIsDisabled(false)

        res.data.success.msg.forEach((item, i) => {
          let rowArr = [
            new Date(item.trns_date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
            }),
            item.tot_col,
            item.tot_col_amt,
          ]
          totalCollectedAmount += item.tot_col_amt
          console.log("ITEMMM TABLEEE=====", rowArr)
          tableData.push(...[rowArr])
          // printReceipt(item.date, startDate, endDate, item.account_number, item.account_holder_name, item.deposit_amount)
        })
        if (tableData.length == 0) {
          console.log(tableData)
          ToastAndroid.showWithGravityAndOffset(
            "No data found!",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50,
          )
        }
        setTotalAmount(totalCollectedAmount)
        console.log("++++++ TABLE DATA ++++++++", tableData)
        setDayTotalReportArray(tableData)
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

  async function printReceipt() {
    if (printOp == 2) {

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

        await BluetoothEscposPrinter.printText(
          "-------------------------------\n",
          {},
        )

        await BluetoothEscposPrinter.printText("DAY TOTAL REPORT\r\n", {
          align: "center",
        })

        await BluetoothEscposPrinter.printText(
          `FROM: ${new Date(startDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}  TO: ${new Date(endDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}`,
          {
            align: "center",
          },
        )

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
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          // ["Date", "A/c No", "Amt"],
          ["Date", "Tnxs.", "Amt"],
          {},
        )

        await BluetoothEscposPrinter.printText(
          "-------------------------------\n",
          {},
        )

        const copiedTableData = [...tableData]
        console.log("TABLLLELEEEEE DDDAAATAAAA  CPPPYYY ", copiedTableData)

        let columnWidthsBody = [13, 12, 7]
        copiedTableData.forEach(async item => {
          let newItems = [...item]
          console.log("new itemsssssss", newItems)
          // const updatedItems = removeIndexes(newItems, [0, 2, 4])
          // const updatedItems = removeIndexes(newItems, [0, 1, 2])

          // updatedItems[2] = updatedItems[2].slice(0, 8)
          // let items = updatedItems.join(" ")
          // console.log("++==++ PRINTED ITEM", items)
          // console.log("++==++ PRINTED ITEM", updatedItems)
          await BluetoothEscposPrinter.printColumn(
            columnWidthsBody,
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.CENTER,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [
              newItems[0].toString(),
              newItems[1].toString(),
              newItems[2].toString(),
            ],
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
    } else if (printOp == 3) {
      try {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        await BluetoothEscposPrinter.printText(bankName, { align: "center" })
        await BluetoothEscposPrinter.printText("\r\n", {})
        await BluetoothEscposPrinter.printText(branchName, { align: "center" })
        await BluetoothEscposPrinter.printText("\r\n", {})
        await BluetoothEscposPrinter.printColumn(
          [15, 2, 31],
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
          [15, 2, 31],
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["Agent", ":", agentName],
          {},
        )

        await BluetoothEscposPrinter.printText(
          "------------------------------------------------\n",
          {},
        )

        await BluetoothEscposPrinter.printText("DAY TOTAL REPORT\r\n", {
          align: "center",
        })

        await BluetoothEscposPrinter.printText(
          `FROM: ${new Date(startDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}  TO: ${new Date(endDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}`,
          {
            align: "center",
          },
        )

        await BluetoothEscposPrinter.printText("\r", {})

        // await BluetoothEscposPrinter.printPic(logo, { width: 300, align: "center", left: 30 })

        await BluetoothEscposPrinter.printText(
          "------------------------------------------------",
          {},
        )
        await BluetoothEscposPrinter.printText("\r\n", {})

        let columnWidthsHeader = [16, 16, 16]
        await BluetoothEscposPrinter.printColumn(
          columnWidthsHeader,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          // ["Date", "A/c No", "Amt"],
          ["Date", "Tnxs.", "Amt"],
          {},
        )

        await BluetoothEscposPrinter.printText(
          "------------------------------------------------\n",
          {},
        )

        const copiedTableData = [...tableData]
        console.log("TABLLLELEEEEE DDDAAATAAAA  CPPPYYY ", copiedTableData)

        let columnWidthsBody = [13, 25, 10]
        copiedTableData.forEach(async item => {
          let newItems = [...item]
          console.log("new itemsssssss", newItems)
          // const updatedItems = removeIndexes(newItems, [0, 2, 4])
          // const updatedItems = removeIndexes(newItems, [0, 1, 2])

          // updatedItems[2] = updatedItems[2].slice(0, 8)
          // let items = updatedItems.join(" ")
          // console.log("++==++ PRINTED ITEM", items)
          // console.log("++==++ PRINTED ITEM", updatedItems)
          await BluetoothEscposPrinter.printColumn(
            columnWidthsBody,
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.CENTER,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [
              newItems[0].toString(),
              newItems[1].toString(),
              newItems[2].toString(),
            ],
            {},
          )
        })

        await BluetoothEscposPrinter.printText(
          "-------------------------------------------------\n",
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
          "--------------------X--------------------------",
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
  }
  async function printReceipt_posio() {
    if (printOp == 2) {
      try {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.RIGHT,
        )
        await BluetoothEscposPrinter.printText(bankName, { align: "center" })
        await BluetoothEscposPrinter.printText("\r\n", {})
        await BluetoothEscposPrinter.printText(branchName, { align: "center" })
        await BluetoothEscposPrinter.printText("\r\n", {})
        await BluetoothEscposPrinter.printColumn(
          [10, 2, 20],
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
          [10, 2, 20],
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["Agent", ":", agentName],
          {},
        )

        await BluetoothEscposPrinter.printText(
          "--------------------------------\n",
          {},
        )

        await BluetoothEscposPrinter.printText("DAY TOTAL REPORT\r\n", {
          align: "center",
        })

        await BluetoothEscposPrinter.printText(
          `FROM: ${new Date(startDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}  TO: ${new Date(endDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}`,
          {
            align: "center",
          },
        )

        await BluetoothEscposPrinter.printText("\r", {})

        await BluetoothEscposPrinter.printText(
          "--------------------------------",
          {},
        )
        await BluetoothEscposPrinter.printText("\r\n", {})

        let columnWidthsHeader = [10, 12, 10]
        await BluetoothEscposPrinter.printColumn(
          columnWidthsHeader,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["Date", "Tnxs.", "Amt"],
          {},
        )

        await BluetoothEscposPrinter.printText(
          "--------------------------------\n",
          {},
        )

        const copiedTableData = [...tableData]
        let columnWidthsBody = [13, 12, 7]
        copiedTableData.forEach(async item => {
          let newItems = [...item]
          await BluetoothEscposPrinter.printColumn(
            columnWidthsBody,
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.CENTER,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [
              newItems[0].toString(),
              newItems[1].toString(),
              newItems[2].toString(),
            ],
            {},
          )
        })

        await BluetoothEscposPrinter.printText(
          "--------------------------------\n",
          {},
        )

        await BluetoothEscposPrinter.printText(
          `TOTAL AMOUNT: ${totalAmount}\r\n`,
          {
            align: "center",
          },
        )
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
    } else if (printOp == 3) {
      try {
        await BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        )
        await BluetoothEscposPrinter.printText(bankName, { align: "center" })
        await BluetoothEscposPrinter.printText("\r\n", {})
        await BluetoothEscposPrinter.printText(branchName, { align: "center" })
        await BluetoothEscposPrinter.printText("\r\n", {})
        await BluetoothEscposPrinter.printColumn(
          [15, 2, 31],
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
          [15, 2, 31],
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["Agent", ":", agentName],
          {},
        )

        await BluetoothEscposPrinter.printText(
          "------------------------------------------------\n",
          {},
        )

        await BluetoothEscposPrinter.printText("DAY TOTAL REPORT\r\n", {
          align: "center",
        })

        await BluetoothEscposPrinter.printText(
          `FROM: ${new Date(startDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}  TO: ${new Date(endDate).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          })}`,
          {
            align: "center",
          },
        )

        await BluetoothEscposPrinter.printText("\r", {})

        await BluetoothEscposPrinter.printText(
          "------------------------------------------------",
          {},
        )
        await BluetoothEscposPrinter.printText("\r\n", {})

        let columnWidthsHeader = [16, 16, 16]
        await BluetoothEscposPrinter.printColumn(
          columnWidthsHeader,
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ["Date", "Tnxs.", "Amt"],
          {},
        )

        await BluetoothEscposPrinter.printText(
          "------------------------------------------------\n",
          {},
        )

        const copiedTableData = [...tableData]
        let columnWidthsBody = [13, 25, 10]
        copiedTableData.forEach(async item => {
          let newItems = [...item]
          await BluetoothEscposPrinter.printColumn(
            columnWidthsBody,
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.CENTER,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [
              newItems[0].toString(),
              newItems[1].toString(),
              newItems[2].toString(),
            ],
            {},
          )
        })

        await BluetoothEscposPrinter.printText(
          "-------------------------------------------------\n",
          {},
        )

        await BluetoothEscposPrinter.printText(
          `TOTAL AMOUNT: ${totalAmount}\r\n`,
          {
            align: "center",
          },
        )
        await BluetoothEscposPrinter.printText(
          "--------------------X--------------------------",
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
  }

  // useEffect(() => {
  //   tableData = []
  //   getReportsDayScroll()
  // }, [selectedEndDate])

  const handleSubmit = () => {
    tableData = []
    getReportsDayScroll()
  }

  // console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", tableData)
  return (
    // <View style={{ flex: 1 }}>
    //   <CustomHeader />
    //   <View
    //     style={{
    //       flex: 4,
    //       padding: 10,
    //       backgroundColor: COLORS.lightScheme.background,
    //       margin: 20,
    //       borderRadius: 10,
    //     }}>
    //     <Text style={styles.todayCollection}>Day Total Report</Text>
    //     <View style={styles.dateWrapper}>
    //       {/* <TouchableOpacity onPress={() => showStartingDatePicker()} style={styles.dateButton}>
    //         <Text>{startingDate}</Text>
    //       </TouchableOpacity>
    //       <TouchableOpacity onPress={() => showEndingDatePicker()} style={styles.dateButton}>
    //         <Text>{endingDate}</Text>
    //       </TouchableOpacity>
    //       <DateTimePickerModal
    //         isVisible={isStartingDatePickerVisible}
    //         mode="date"
    //         onConfirm={handleConfirmPickedFromDate}
    //         onCancel={hideStartingDatePicker}
    //       />
    //       <DateTimePickerModal
    //         isVisible={isEndingDatePickerVisible}
    //         mode="date"
    //         onConfirm={handleConfirmPickedToDate}
    //         onCancel={hideEndingDatePicker}
    //       /> */}

    //       {/* <TouchableOpacity onPress={() => setShowModal(true)} style={styles.dateButton}>
    //         <Text>Show Calendar</Text>
    //       </TouchableOpacity> */}
    //       <TouchableOpacity
    //         onPress={() => setShowModal(true)}
    //         style={{
    //           justifyContent: "space-around",
    //           flexDirection: "row",
    //           backgroundColor: "white",
    //           borderColor: COLORS.lightScheme.primary,
    //           borderWidth: 1,
    //           padding: 10,
    //           margin: 10,
    //           borderRadius: 10,
    //           height: 40,
    //           width: "100%",
    //         }}>
    //         {/* <Text>Show Calendar</Text> */}
    //         <Text
    //           style={{
    //             fontSize: 15,
    //             fontWeight: 500,
    //             color: COLORS.lightScheme.primary,
    //             fontWeight: "bold",
    //           }}>
    //           From: {new Date(startDate).toLocaleDateString("en-GB")}
    //         </Text>
    //         <Text
    //           style={{
    //             fontSize: 15,
    //             fontWeight: 500,
    //             color: COLORS.lightScheme.primary,
    //             fontWeight: "bold",
    //           }}>
    //           To: {new Date(endDate).toLocaleDateString("en-GB")}
    //         </Text>
    //       </TouchableOpacity>
    //       <Modal visible={showModal} animationType="fade">
    //         <View
    //           style={{
    //             flex: 1,
    //             backgroundColor: COLORS.lightScheme.onPrimary,
    //             margin: 20,
    //           }}>
    //           <CalendarPicker
    //             width={350}
    //             height={350}
    //             startFromMonday={true}
    //             allowRangeSelection={true}
    //             todayBackgroundColor="tomato"
    //             selectedDayColor="dodgerblue"
    //             selectedDayTextColor="#FFFFFF"
    //             onDateChange={onDateChange}
    //           />
    //         </View>
    //       </Modal>
    //     </View>
    //     {/* <View style={{justifyContent: "space-around", flexDirection: "row", backgroundColor: "coral", padding: 10, margin: 10, borderRadius: 10}}>
    //         <Text style={{ fontSize: 15, fontWeight: 500, color: COLORS.lightScheme.onPrimary, fontWeight: "bold" }}>From: {startDate}</Text>
    //         <Text style={{ fontSize: 15, fontWeight: 500, color: COLORS.lightScheme.onPrimary, fontWeight: "bold" }}>To: {endDate}</Text>
    //       </View> */}

    //     <View>
    //       <TouchableOpacity
    //         disabled={isDisabled || isLoading}
    //         onPress={() => handleSubmit()}
    //         style={isDisabled ? styles.disabledContainer : styles.dateButton}>
    //         {isLoading ? (
    //           <ActivityIndicator
    //             color={COLORS.lightScheme.primary}
    //             size={"large"}></ActivityIndicator>
    //         ) : (
    //           <Text style={styles.btnlabel}>SUBMIT</Text>
    //         )}
    //       </TouchableOpacity>
    //       {/* {isLoading && <ActivityIndicator color={COLORS.lightScheme.primary} size={'large'}></ActivityIndicator>} */}
    //     </View>
    //     <ScrollView>
    //       {/* <Text > {tableData.length}</Text>  */}
    //       {/* {tableData.length==0 && !isLoading && <NoData/>} */}
    //       {tableData.length != 0 && (
    //         <Table
    //           borderStyle={{
    //             borderWidth: 2,
    //             borderColor: COLORS.lightScheme.secondary,
    //             borderRadius: 10,
    //           }}
    //           style={{ backgroundColor: COLORS.lightScheme.background }}>
    //           <Row
    //             hidden={!tableData}
    //             data={tableHead}
    //             textStyle={styles.head}
    //           />

    //           <Rows data={tableData} textStyle={styles.text} />
    //         </Table>
    //       )}
    //     </ScrollView>
    //     <Text>Total Amount: {totalAmount}</Text>
    //     <TouchableOpacity
    //       disabled={tableData.length == 0}
    //       onPress={() => printReceipt()}
    //       style={
    //         tableData.length != 0 ? styles.dateButton : styles.disabledContainer
    //       }>
    //       <Text style={styles.btnlabel}>PRINT</Text>
    //     </TouchableOpacity>
    //   </View>
    // </View>
    // return (
  <SafeAreaView style={styles.container}>
    <CustomHeader />
    <ScrollView 
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      // refreshControl={
      //   <RefreshControl
      //     refreshing={refreshing}
      //     colors={[COLORS.lightScheme.primary]}
      //     onRefresh={onRefresh}
      //   />
      // }
      showsVerticalScrollIndicator={false}
    >
      {/* Report Header */}
      <View style={styles.header}>
        <Text style={styles.reportTitle}>Day Total Report</Text>
        
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
            <Text style={styles.resultsTitle}>{tableData.length} {tableData.length>1? 'Records':'Record'}</Text>
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
);

  // )
}

export default DayTotalReportScreen

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
//     borderColor: "white",
//     backgroundColor: COLORS.lightScheme.primary,
//     margin: 15,
//     borderRadius: PixelRatio.roundToNearestPixel(30),
//     alignSelf: "center",
//     justifyContent: "center",
//     alignItems: "center",
//     color: COLORS.lightScheme.primary,
//   },
//   text: {
//     margin: 6,
//     color: COLORS.lightScheme.onBackground,
//     fontWeight: "400",
//     fontSize: 10,
//   },
//   btnlabel: {
//     color: "white",
//     fontWeight: "bold",
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
//     borderColor: COLORS.lightScheme.primary,
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
//     borderRadius: PixelRatio.roundToNearestPixel(30),
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
    marginBottom: 24,
    letterSpacing: -0.4,
  },

  // Date Picker Card
  datePickerCard: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
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
    elevation: 6,
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
  printButtonDisabled: {
    backgroundColor: COLORS.lightScheme.primary + '50',
  },
  printButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },

  // Table
  reportTable: {
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
    fontSize: 12,
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
});

