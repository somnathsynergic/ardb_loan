import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Alert,
  Pressable,
  ToastAndroid,
  Image,
  TouchableOpacity, SafeAreaView
} from "react-native"
import { Card } from 'react-native-paper';
import { useContext, useState, useEffect, useCallback } from "react"
import axios from "axios"
import { COLORS, colors } from "../../Resources/colors"
import CustomHeader from "../../Components/CustomHeader"
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from "react-native-table-component"
import { RadioButton } from 'react-native-paper';
import InputComponent from "../../Components/InputComponent"
import ButtonComponent from "../../Components/ButtonComponent"
import mainNavigationRoutes from "../../Routes/NavigationRoutes"
import { AppStore } from "../../Context/AppContext"
import { StackActions, useFocusEffect } from "@react-navigation/native"
import CancelButtonComponent from "../../Components/CancelButtonComponent"
import { address } from "../../Routes/addresses"
import { SCREEN_WIDTH } from "react-native-normalize";

// const LoanAccountDetailsScreen = ({ navigation, route }) => {
//   const [collectionMoney, setCollectionMoney] = useState(() => 0)
//   const {
//     modifiedAt,
//     todayDateFromServer,
//     holidayLock,
//     getFlagsRequest,
//     collectionFlag,
//     endFlag,
//     transDt,
//     allowCollectionDays,
//     userId,
//     bankId,
//     branchCode,
//   } = useContext(AppStore)

//   const { item } = route.params

//   const [lastTnxDate, setLastTnxDate] = useState(() => "")
//   const elementButton = (value) => (
//       <TouchableOpacity onPress={() => this._alertIndex(value)}>
//         <View style={styles.btn}>
//           <Text style={styles.btnText}>button</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   const tableData = [
//     [
//       "Account Type",
//       item?.acc_type == "D"
//         ? "Daily"
//         : item?.acc_type == "R"
//         ? "RD"
//         : item?.acc_type == "L"
//         ? "Loan"
//         : "",
//     ],
//     ["Account No.", item?.account_number],
//     ["Name", item?.customer_name],
//     // ["Mobile No.", item?.mobile_no],
//     ["Disbursement Amt.", item?.mobile_no],
//     ["Disbursement date", new Date(item?.opening_date).toLocaleDateString("en-GB")],
//     [
//       "Last Intt. Calc. Date",
//       lastTnxDate
//         ? new Date(lastTnxDate).toLocaleDateString("en-GB")
//         : "No available date",
//     ],
//     ["Current Intt. Rate", <View style={{flexDirection: 'row', alignItems: 'center'}}><Text style={styles.text}>{item?.current_balance}</Text><TouchableOpacity onPress={() => {}} style={{marginLeft: 10}}><Image source={require('../../Resources/Images/Icons/visible.png')} style={{width: 25, height: 25}} /></TouchableOpacity></View>],
//     ["Balance", <View style={{flexDirection: 'row', alignItems: 'center'}}><Text style={styles.text}>{item?.current_balance}</Text><TouchableOpacity onPress={() => {}} style={{marginLeft: 10}}><Image source={require('../../Resources/Images/Icons/visible.png')} style={{width: 25, height: 25}} /></TouchableOpacity></View>],
//     ["Total Demand", <View style={{flexDirection: 'row', alignItems: 'center'}}><Text style={styles.text}>{item?.current_balance}</Text><TouchableOpacity onPress={() => {}} style={{marginLeft: 10}}><Image source={require('../../Resources/Images/Icons/visible.png')} style={{width: 25, height: 25}} /></TouchableOpacity></View>],
//   ]

//   const getLastTnxDate = async () => {
//     const obj = {
//       bank_id: bankId,
//       branch_code: branchCode,
//       agent_code: userId,
//       account_number: item?.account_number,
//       flag: "L",
//     }

//     console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOO", obj)

//     await axios
//       .post(address.LAST_TNX_DATE, obj, {
//         headers: {
//           Accept: "application/json",
//         },
//       })
//       .then(res => {
//         setLastTnxDate(
//           res?.data?.success?.length !== 0
//             ? res?.data?.success?.msg[0]?.last_trns_dt?.toString()
//             : "",
//         )

//         // {"status": true, "success": []}
//         console.log(
//           ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",
//           res?.data?.success?.msg[0]?.last_trns_dt,
//         )
//       })
//       .catch(err => {
//         console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<", err)
//       })
//   }

//   useEffect(() => {
//     getLastTnxDate()
//   }, [])

//   useEffect(() => {
//     getFlagsRequest()
//   }, [])
//   const checkDayLock = () => {
//     let currentDate = new Date(todayDateFromServer.toISOString().slice(0, 10))
//     console.log("CURRRRR DATEE", currentDate)
//     let trans_dt = new Date(transDt.toISOString().slice(0, 10))
//     console.log("MODDDD DATEsssssss", trans_dt)
//     let newTrans_dt = trans_dt.setDate(
//       trans_dt.getDate() + parseInt(allowCollectionDays),
//     )
//     newTrans_dt = new Date(newTrans_dt).toISOString().slice(0, 10)
//     // console.log('NNNNEEEWWWWW TRANCE DT', new Date(newTrans_dt).toISOString().slice(0, 10), trans_dt);

//     var date_dif = Math.abs(new Date() - new Date(transDt))
//     date_dif = date_dif / (1000 * 60 * 60 * 24)
//     // console.log('Police case kore6ile', date_dif, 'llala', allowCollectionDays);

//     // let afterAddingHolidayLockDays = modifiedAtDate.getDate() + 1
//     // newModifiedDate.setDate(modifiedAtDate.getDate() + holidayLock)
//     // console.log("HOLIIIIDDDAAAAYYYYY _+++++++>>>", holidayLock)

//     // return newTrans_dt >= currentDate
//     return date_dif < allowCollectionDays
//   }
//   const handlePreviewData = () => {
//     if (!collectionMoney || collectionMoney <= 0) {
//       ToastAndroid.showWithGravityAndOffset(
//         "Invalid Ammount",
//         ToastAndroid.SHORT,
//         ToastAndroid.CENTER,
//         25,
//         50,
//       )
//       return
//     }
//     // setCollectionMoney(0)
//     navigation.navigate(mainNavigationRoutes.loanAccountPreview, {
//       item: item,
//       money: collectionMoney,
//     })
//   }

//   const checkHolidayLock = () => {
//     let currentDate = new Date(todayDateFromServer.toISOString().slice(0, 10))
//     console.log("CURRRRR DATEE", currentDate)
//     let modifiedAtDate = new Date(modifiedAt.toISOString().slice(0, 10))
//     console.log("MODDDD DATE", modifiedAtDate)
//     let newModifiedDate = new Date()

//     // let afterAddingHolidayLockDays = modifiedAtDate.getDate() + 1
//     newModifiedDate.setDate(modifiedAtDate.getDate() + holidayLock)
//     console.log("HOLIIIIDDDAAAAYYYYY _+++++++>>>", holidayLock)

//     return newModifiedDate >= currentDate
//   }

//   // console.log("CHECKKK HOLIDAAAY LOCKKK fun()", checkHolidayLock())

//   const checkIsCollectionEnded = () => {
//     if (collectionFlag == "Y" && endFlag == "N") return false
//     else if (collectionFlag == "N" && endFlag == "Y") return true
//   }

//   console.log("CHECKKK COLLL ENDEDDD ========>>>>>", checkIsCollectionEnded())
//   // getLastTnxDate()

//   return (
//     <View>
//       <CustomHeader />
//       <View
//         style={{
//           backgroundColor: COLORS.lightScheme.background,
//           height: "100%",
//           padding: 10,
//         }}>
//         <ScrollView keyboardShouldPersistTaps={"handled"}>
//           <Text style={styles.info}>Loan Account Info</Text>
//           {/* Table Component */}
//           <View style={styles.tableConatiner}>
//             <Table
//               borderStyle={{
//                 borderWidth: 5,
//                 borderColor: COLORS.lightScheme.primary,
//               }}
//               style={{ backgroundColor: COLORS.lightScheme.onPrimary }}>
//               <Rows data={tableData} textStyle={styles.text} />
//             </Table>
//           </View>
//           {/* Input Field */}
//           <View style={styles.inputContainer}>
//             <InputComponent
//               keyboardType={"numeric"}
//               placeholder={"Enter Valid Amount"}
//               label={"Collection Amount"}
//               value={collectionMoney}
//               handleChange={money => {
//                 if (/^\d*\.?\d*$/.test(money)) {
//                   setCollectionMoney(money)
//                 }
//               }}
//               autoFocus={true}
//             />
//             <View style={styles.buttonContainer}>
//               <CancelButtonComponent
//                 title={"Back"}
//                 customStyle={{
//                   marginTop: 10,
//                   marginRight: 10,
//                   backgroundColor: "white",
//                   colors: "red",
//                   width: "40%",
//                 }}
//                 handleOnpress={() => {
//                   setCollectionMoney(0)
//                   navigation.goBack()
//                 }}
//               />

//               {!checkIsCollectionEnded() && checkDayLock() ? (
//                 <ButtonComponent
//                   title={"Preview / Save"}
//                   customStyle={{ marginTop: 10, width: "50%" }}
//                   handleOnpress={handlePreviewData}
//                 />
//               ) : (
//                 <ButtonComponent
//                   title={"Preview / Save"}
//                   customStyle={{ marginTop: 10, width: "50%" }}
//                   handleOnpress={handlePreviewData}
//                   disabled={true}
//                 />
//               )}

//               {/* <ButtonComponent
//               title={'Preview / Save'}
//               customStyle={{ marginTop: 10, width: '60%' }}
//               handleOnpress={handlePreviewData}
//             /> */}
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   )
// }

// export default LoanAccountDetailsScreen

// const styles = StyleSheet.create({
//   // text: {
//   //   margin: 6,
//   //   color: COLORS.lightScheme.onBackground,
//   //   fontWeight: '400',
//   //   fontSize: 18,
//   // },
//   text: {
//     margin: 6,
//     color: COLORS.lightScheme.onBackground,
//     fontWeight: "400",
//     fontSize: 18,
//   },
//   head: {
//     margin: 6,
//     color: COLORS.lightScheme.onBackground,
//     fontWeight: "900",
//     fontSize: 12,
//   },
//   info: {
//     color: COLORS.lightScheme.onPrimary,
//     textAlign: "center",
//     fontSize: 22,
//     letterSpacing: 5,
//     backgroundColor: COLORS.lightScheme.primary,
//     borderRadius: 5,
//     marginBottom: 5,
//     paddingVertical: 5,
//     fontWeight: "600",
//     borderBottomLeftRadius: 12,
//     borderBottomRightRadius: 12,
//   },
//   inputContainer: {
//     padding: 20,
//     marginVertical: 10,
//     // padding: 10,
//     backgroundColor: COLORS.lightScheme.onPrimary,
//     borderRadius: 20,
//     borderColor: COLORS.lightScheme.primary,
//     borderWidth: 0.8,
//     elevation: 10,
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//   },
//   tableConatiner: {
//     padding: 10,
//     backgroundColor: COLORS.lightScheme.onPrimary,
//     borderRadius: 5,
//   },
// })

const LoanAccountDetailsScreen = ({ navigation, route }) => {
  const [collectionMoney, setCollectionMoney] = useState(0);
  const [isVisible, setIsVisible] = useState({ balance: false, interest: false, demand: false });
  const [accInfo, setAccInfo] = useState([])
  const [checked, setChecked] = useState('N');
  const [updatedSendDt,setUpdatedSendDt] = useState('')
  const {
    modifiedAt, todayDateFromServer, holidayLock, getFlagsRequest,
    collectionFlag, endFlag, transDt, allowCollectionDays, userId, bankId, branchCode,send_dt
  } = useContext(AppStore);
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const marchDate = currentMonth > 2 ? `${currentYear + 1}-03-31` : `${currentYear}-03-31`;
  const { item } = route.params;
  const [lastTnxDate, setLastTnxDate] = useState("");
  const [calculatedIntt, setCalculatedIntt] = useState({curr_intt_calculated: 0, curr_intt_demand_calculated: 0, ovd_intt_calculated: 0, ovd_intt_demand_calculated: 0, penal_intt_calculated: 0, penal_intt_demand_calculated: 0});
  const calc_intt = (dt)=>{
    const obj = {
    ardb_id: bankId,
    branch_code: branchCode,
    supervisor_code: userId,
    product_id: item?.product_id,
    collection_start_dt: send_dt,
    calculate_dt: dt
}

axios.post(address.CALC_INTT, obj, ).then(res=>{console.log('INTT CALC RES====', res?.data); setCalculatedIntt(res?.data?.success?.msg)}).catch(err=>{console.log('INTT CALC ERR====', err)})
  }
  const hardCodedData = [
    { label: 'Curr. Prn. ', value: '₹' + accInfo[0]?.curr_prn || 0 },
    { label: 'Curr. Intt.', value: '₹' + accInfo[0]?.curr_intt || 0 },
    { label: 'Ovd. Prn.', value: '₹' + accInfo[0]?.ovd_prn || 0 },
    { label: 'Ovd. Intt.', value: '₹' + accInfo[0]?.ovd_intt || 0 },
    { label: 'Penal Intt.', value: '₹' + accInfo[0]?.penal_intt || 0 },
    { label: 'Other Charges', value: '₹' + accInfo[0]?.other_charges || 0 }
  ];
  useEffect(() => {
    if(checked=='T'){
      setUpdatedSendDt(new Date().toISOString().slice(0,10))
      calc_intt(new Date().toISOString().slice(0,10))
    }else{
      if(new Date().getMonth()>3){
        setUpdatedSendDt((new Date().getFullYear()+1).toString()+'-03-'+'31')
        calc_intt((new Date().getFullYear()+1).toString()+'-03-'+'31')
      }else{
        setUpdatedSendDt(new Date().getFullYear().toString()+'-03-'+'31')
        calc_intt(new Date().getFullYear().toString()+'-03-'+'31')
      }

    }
  }, [checked]);
  const hardCodedTotalDemandData = [
    { label: 'Curr. Prn.', value: '₹' + accInfo[0]?.curr_prn_demand || 0 },
    { label: 'Curr. Intt.', value: '₹' + accInfo[0]?.curr_intt_demand || 0 },

    { label: 'Ovd. Prn.', value: '₹' + accInfo[0]?.ovd_prn_demand || 0 },
    { label: 'Ovd. Intt.', value: '₹' + accInfo[0]?.ovd_intt_demand || 0 },
    { label: 'Penal Intt.', value: '₹' + accInfo[0]?.penal_intt_demand || 0 },
  ];
  const hardCodedCurrInttRateData = [
    { label: 'Ovd. Intt. Rate', value: accInfo[0]?.ovd_intt_rate + '%' || 0 },
    { label: 'Penal Intt. Rate', value: accInfo[0]?.penal_intt_rate + '%' || 0 },
  ];
  // Fixed tableData as key-value pairs for cards
  const accountData = [
    { label: "Account Type", value: item?.acc_type === "D" ? "Daily" : item?.acc_type === "R" ? "RD" : item?.acc_type === "L" ? "Loan" : "" },
    { label: "Account No.", value: item?.product_id },
    { label: "Name", value: item?.cust_name },
    { label: "Disbursement Amt.", value: '₹' + accInfo[0]?.disb_amt }, // Fixed field
    { label: "Disbursement Date", value: item?.disb_dt ? new Date(item.disb_dt).toLocaleDateString("en-GB") : "" },
    // { label: "Last Intt. Calc. Date", value: accInfo[0]?.last_intt_calc_dt ? new Date(accInfo[0]?.last_intt_calc_dt).toLocaleDateString("en-GB") : "No available date" },
    { label: "Current Intt. Rt.", value: accInfo[0]?.curr_intt_rate + '%', isSecure: true }, // Fixed field
    { label: "Balance", value: '₹' + item?.current_balance, isSecure: true },
    { label: "Total Demand", value: '₹' + item?.current_demand, isSecure: true },
  ];

  // getLastTnxDate function (unchanged)
  const getLastTnxDate = async () => {
    const obj = { ardb_id: bankId, branch_code: branchCode, supervisor_code: userId, account_number: item?.product_id, flag: "L" };
    try {
      const res = await axios.post(address.LAST_TNX_DATE, obj, { headers: { Accept: "application/json" } });
      setLastTnxDate(res?.data?.success?.length !== 0 ? res?.data?.success?.msg[0]?.last_trns_dt?.toString() : "");
    } catch (err) {
      console.log("Error:", err);
    }
  };
  const accountInfo = async () => {
    const obj = { ardb_id: bankId, branch_code: branchCode, supervisor_code: userId, account_number: item?.product_id };
    try {
      const res = await axios.post(address.ACCOUNT_INFO, obj, { headers: { Accept: "application/json" } });
      console.log('RES========', res)
      setAccInfo(res?.data?.msg?.length !== 0 ? res?.data?.success?.msg : []);
    } catch (err) {
      console.log("Error:", err);
    }
  }
  useEffect(() => { getLastTnxDate(); getFlagsRequest(); accountInfo(); console.log(send_dt) }, []);

  // checkDayLock, checkHolidayLock, checkIsCollectionEnded (unchanged)
  const checkDayLock = () => {
    const date_dif = Math.abs(new Date() - new Date(transDt)) / (1000 * 60 * 60 * 24);
    return date_dif < allowCollectionDays;
  };
  const checkHolidayLock = () => {
    const currentDate = new Date(todayDateFromServer.toISOString().slice(0, 10));
    const modifiedAtDate = new Date(modifiedAt.toISOString().slice(0, 10));
    const newModifiedDate = new Date();
    newModifiedDate.setDate(modifiedAtDate.getDate() + holidayLock);
    return newModifiedDate >= currentDate;
  };
  const checkIsCollectionEnded = () => collectionFlag === "Y" && endFlag === "N" ? false : collectionFlag === "N" && endFlag === "Y" ? true : true;

  const handlePreviewData = () => {
    if (!collectionMoney || collectionMoney <= 0) {
      ToastAndroid.showWithGravityAndOffset("Invalid Amount", ToastAndroid.SHORT, ToastAndroid.CENTER, 25, 50);
      return;
    }
    navigation.navigate('loanAccountPreview', { item, money: collectionMoney,ac_info:JSON.stringify(accInfo),intt_calc_flag: checked!='N'?'Y':'N',send_dt:send_dt,updatedSendDt:updatedSendDt,calculatedIntt: JSON.stringify(calculatedIntt) });
  };

  const toggleVisibility = (key) => {
    if (key === 'balance' || key === 'total demand' || key === 'current intt. rt.')
      setIsVisible(prev => ({ ...prev, [key]: !prev[key] }));

  }

  const renderDataRow = (dataItem, index) => (
    <Card key={index} style={styles.dataCard} onPress={() => toggleVisibility(dataItem.label.toLowerCase())}>
      <View style={styles.row}>
        <Text style={styles.label}>{dataItem.label}</Text>
        <View style={styles.valueContainer}>
          {dataItem.label.toLowerCase() !== 'balance' && dataItem.label.toLowerCase() !== 'current intt. rt.' && dataItem.label.toLowerCase() !== 'total demand' && <Text style={styles.value} numberOfLines={1}>
            {/* {dataItem.isSecure && !isVisible[dataItem.label.toLowerCase()] ? '**** **** ****' : dataItem.value} */}
            {dataItem.value}

          </Text>}
          {dataItem.isSecure && (
            <TouchableOpacity onPress={() => toggleVisibility(dataItem.label.toLowerCase())} style={[styles.eyeIcon, { marginLeft: SCREEN_WIDTH * 0.3 }]}>
              {/* <View style={[styles.valueContainer,{marginLeft:50}]}> */}
              <Text style={styles.value}>{dataItem.value}</Text>
              {/* </View> */}
              {!isVisible[dataItem.label.toLowerCase()] && <Image source={require('../../Resources/Images/Icons/down.png')} style={styles.icon} />}
              {isVisible[dataItem.label.toLowerCase()] && <Image source={require('../../Resources/Images/Icons/up.png')} style={styles.icon} />}
            </TouchableOpacity>
          )}
        </View>
      </View>
      {dataItem.label.toLowerCase() === 'balance' && isVisible[dataItem.label.toLowerCase()] && hardCodedData.map((dataItem, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.label}>{dataItem.label}</Text>
          <View style={[styles.valueContainer, { marginLeft: 50 }]}>
            <Text style={styles.value}>{dataItem.value}</Text>
          </View>
        </View>
      ))}
      {dataItem.label.toLowerCase() === 'total demand' && isVisible[dataItem.label.toLowerCase()] && hardCodedTotalDemandData.map((dataItem, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.label}>{dataItem.label}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{dataItem.value}</Text>
          </View>
        </View>
      ))}
      {dataItem.label.toLowerCase() === 'current intt. rt.' && isVisible[dataItem.label.toLowerCase()] && hardCodedCurrInttRateData.map((dataItem, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.label}>{dataItem.label}</Text>
          <View style={styles.valueContainer}>
            <Text style={styles.value}>{dataItem.value}</Text>
          </View>
        </View>
      ))}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Loan Account Info. </Text>
        <View style={styles.dataContainer}>
          {accountData.map((dataItem, index) => renderDataRow(dataItem, index))}
        </View>
         <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, backgroundColor: COLORS.lightScheme.primary, borderRadius: 40, padding: 10 }}>
            {new Date().toISOString().slice(0, 10) > send_dt && <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'center', marginRight: 20 }}>
              <RadioButton
                value="T"
                status={checked === 'T' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('T')}
                color={COLORS.lightScheme.onPrimary}
                uncheckedColor={COLORS.lightScheme.onPrimary}

              />
              <Text style={{ fontSize: 16, color: COLORS.lightScheme.onPrimary }}>Till Today </Text>
            </View>}

             {(new Date().toISOString().slice(0, 10) > send_dt || new Date().toISOString().slice(0, 10) === send_dt) && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="L"
                status={checked === 'L' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('L')}
                color={COLORS.lightScheme.onPrimary}
                uncheckedColor={COLORS.lightScheme.onPrimary}
              />
              <Text style={{ fontSize: 16, color: COLORS.lightScheme.onPrimary }}>Till 31st. March </Text>
            </View>}
          </View>
        <View style={styles.inputContainer}>
          <Text style={styles.intt_calc}>Interest Calculated Upto: {new Date(accInfo[0]?.last_intt_calc_dt).toLocaleDateString("en-GB")} </Text>

         
          <InputComponent
            keyboardType="numeric"
            placeholder="Enter Valid Amount"
            label="Collection Amount"
            value={collectionMoney}
            handleChange={money => /^\d*\.?\d*$/.test(money) && setCollectionMoney(money)}
            autoFocus
          />
          <View style={styles.buttonContainer}>
            <CancelButtonComponent
              title="Back"
              customStyle={{ marginTop: 10, marginRight: 10, backgroundColor: "white", width: "40%" }}
              handleOnpress={() => { setCollectionMoney(0); navigation.goBack(); }}
            />
            <ButtonComponent
              title="Preview / Save"
              customStyle={{ marginTop: 10, width: "50%" }}
              handleOnpress={handlePreviewData}
              disabled={checkIsCollectionEnded() || !checkDayLock()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightScheme.background },
  scrollContent: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.lightScheme.primary,
    textAlign: 'center',
    // backgroundColor: COLORS.lightScheme.primary,
    borderRadius: 20,
    paddingVertical: 15,
    marginBottom: 20,
    // elevation: 5,
    letterSpacing: 3,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 8,
  },
  dataContainer: { gap: 12, marginBottom: 30 },
  dataCard: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  label: { fontSize: 13, fontWeight: '600', color: 'gray', flex: 1 },
  valueContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', minWidth: 120 },
  value: { fontSize: 13, fontWeight: 'bold', color: COLORS.lightScheme.primary, marginRight: 10 },
  eyeIcon: { padding: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'right', marginleft: 10 },
  icon: { width: 20, height: 20, tintColor: COLORS.lightScheme.primary },
  inputContainer: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-evenly' },
  intt_calc: { color: COLORS.lightScheme.tertiary, marginHorizontal: 'auto', marginVertical: 20 }
});

export default LoanAccountDetailsScreen;
