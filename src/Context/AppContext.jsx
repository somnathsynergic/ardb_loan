import { createContext, useEffect, useState } from "react"
import axios from "axios"
import DeviceInfo from "react-native-device-info"
import { ToastAndroid } from "react-native"
import { REACT_APP_BASE_URL } from "../Config/config"
import { address } from "../Routes/addresses"

export const AppStore = createContext()

const AppContext = ({ children }) => {
  const [isLogin, setIsLogin] = useState(() => false)
  const [id, setId] = useState(() => 0)
  const [userId, setUserId] = useState(() => "")
  const [agentName, setAgentName] = useState(() => "")
  const [agentEmail, setAgentEmail] = useState(() => "")
  const [agentPhoneNumber, setAgentPhoneNumber] = useState(() => "")
  const [bankId, setBankId] = useState(() => 0)
  const [bankName, setBankName] = useState(() => "")
  const [branchName, setBranchName] = useState(() => "")
  const [branchCode, setBranchCode] = useState(() => "")
  const [deviceId, setDeviceID] = useState(() => DeviceInfo.getUniqueIdSync())
  const [ardbName,setArdbName] = useState(() => "")
  // const [deviceId, setDeviceID] = useState(() => "adac9523c863fb73")
  const [passcode, setPasscode] = useState(() => "")
  const [totalCollection, setTotalCollection] = useState(() => 0)
  const [receiptNumber, setReceiptNumber] = useState(() => 0)
  // const [holidayLock, setHolidayLock] = useState(() => 0)
  const [maximumAmount, setMaximumAmount] = useState(() => 0)
  const [send_dt,setSendDt] = useState(() => new Date())
  // allow_collection_days
  const [allowCollectionDays, setAllowCollectionDays] = useState(() => 0)
  const [secAmtType, setSecAmtType] = useState(() => "")
  const [printOp,setPrintOp] = useState(false)
  const [modifiedAt, setModifiedAt] = useState(() => new Date())
  const [transDt, setTransDt] = useState(() => new Date())
  const [isDaily, setisDaily] = useState(false)
  const [isLoan, setIsLoan] = useState(false)
  const [isRD, setIsRD] = useState(false)
  const [todayDateFromServer, setTodayDateFromServer] = useState(
    () => new Date(),
  )

  const [collectionFlag, setCollectionFlag] = useState("")
  const [endFlag, setEndFlag] = useState("")

  const [totalDepositedAmount, setTotalDepositedAmount] = useState(() => 0)

  const [next, setNext] = useState(() => false)

  useEffect(() => {
    const uniqueId = DeviceInfo.getUniqueIdSync()
    setDeviceID(uniqueId)
    console.log("UniqueID: ", uniqueId)
    console.log("DeviceID: ", deviceId)
    console.log("==========||||||| fdjgh")
  }, [])

  const login = async () => {
    const obj = {
      device_id: deviceId,
      user_id: userId,
      password: passcode || '1234',
    }

    console.log("OBJJJJJJ===>", obj)
    await axios
      .post(address.LOGIN, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
  console.log("dtdtdtdt", transDt, transDt)

        console.log("LOGIN RESPONSE: ", res?.data)
        if (res?.data?.status) {
          setIsLogin(true)
          setId(res?.data?.success?.user_data?.msg[0]?.id)
          setAgentName(res?.data?.success?.user_data?.msg[0]?.supervisor_name)
          setAgentEmail(res?.data?.success?.user_data?.msg[0]?.email_id)
          setAgentPhoneNumber(res?.data?.success?.user_data?.msg[0]?.phone_no)
          setBankId(res?.data?.success?.user_data?.msg[0]?.ardb_id)
          setBankName(res?.data?.success?.user_data?.msg[0]?.ardb_name)
          setBranchName(res?.data?.success?.user_data?.msg[0]?.branch_name)
          setBranchCode(res?.data?.success?.user_data?.msg[0]?.branch_code)
          setMaximumAmount(res?.data?.success?.user_data?.msg[0]?.max_amt)
          setPrintOp(res?.data?.success?.user_data?.msg[0]?.print_opt)

          setIsLoan(
            res?.data?.success?.ardb_acc_type[0]?.loan_flag == "Y"
              ? true
              : false,
          )
          setisDaily(
            res?.data?.success?.ardb_acc_type[0]?.dds_flag == "Y"
              ? true
              : false,
          )
          setIsRD(
            res?.data?.success?.ardb_acc_type[0]?.rd_flag == "Y" ? true : false,
          )
         
          setAllowCollectionDays(
            res?.data?.success?.user_data?.msg[0]?.allow_collection_days,
          )
          setSecAmtType(res?.data?.success?.user_data?.msg[0]?.sec_amt_type)

          setTotalCollection(
            res?.data?.success?.total_collection?.msg[0]?.total_collection,
          )

          setReceiptNumber(res?.data?.success?.setting?.suc > 0?res?.data?.success?.setting?.msg[0]?.receipt_no:'')
          setModifiedAt(
            res?.data?.success?.setting?.setting?.suc > 0 > 0
              ? new Date(res?.data?.success?.setting?.msg[0]?.modified_at)
              : new Date(),
          )
          setTransDt(
            res?.data?.success?.trans?.msg?.length > 0
              ? new Date(res?.data?.success?.trans?.msg[0]?.trans_dt)
              : new Date(),
          )
          console.log('END OF LOGIN')
          return true
        } else {
          setIsLogin(false)
          ToastAndroid.showWithGravityAndOffset(
            "Invalid Credentials",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50,
          )
          setPasscode("")
          return false
        }
      })
      .catch(err => {
        console.error("========>>>>>>>>", err?.response?.data)
        setIsLogin(false)
        setPasscode("")
        ToastAndroid.showWithGravityAndOffset(
          "Invalid Credentials",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50,
        )
        return false
      })
  }


  const nowDate = async () => {
    await axios
      .post(address.NOW_DATE)
      .then(res => {
        console.log("NOW DATE FROM SERVER: ", new Date(res?.data?.now_date))
        setTodayDateFromServer(new Date(res?.data?.now_date))
      })
      .catch(err => {
        ToastAndroid.showWithGravityAndOffset(
          "Error fetching TIME",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50,
        )
        console.error("Error: TTTTIIIMMMEEEEE", err)
      })
  }

  useEffect(() => {
    nowDate()
  }, [])

  const getUserId = async () => {
    const obj = { device_id: deviceId }
    console.log("OBJ for USER ID: ", address.MY_AGENT)
    await axios
      .post(address.MY_AGENT, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        console.log('ARDB NAME=====',res?.data?.success?.msg[0]?.ardb_name)
        setArdbName(res?.data?.success?.msg[0]?.ardb_name)
        console.log("User ID: ", res?.data?.success?.msg[0]?.user_id)
        setUserId(res?.data?.success?.msg[0]?.user_id)
      })
      .catch(err => {
        console.log("hehe")
        ToastAndroid.showWithGravityAndOffset(
          "Error fetching details",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50,
        )
        console.error("Error: ==========", err?.response?.data)
      })
  }

  const getFlagsRequest = async () => {
    const obj = { ardb_id: bankId, branch_code: branchCode, supervisor_code: userId }
    await axios
      .post(address.COLLECTION_CHECKED, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        setCollectionFlag(res?.data?.data?.msg[0]?.coll_flag)
        setEndFlag(res?.data?.data?.msg[0]?.end_flag)
        setSendDt(res?.data?.data?.msg[0]?.send_date)
        console.log("FLAGGGGGSSSS CF: ", res?.data?.data?.msg[0]?.coll_flag)
        console.log("FLAGGGGGSSSS EF: ", res?.data?.data?.msg[0]?.end_flag)
        console.log("FLAGGGGGSSSS SD: ", res?.data?.data?.msg[0]?.send_date)
      })
      .catch(err => {
        console.log("flags err", err)
        ToastAndroid.showWithGravityAndOffset(
          "Error COLLECTION CHECKED",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
          25,
          50,
        )
      })
  }

  const getTotalDepositAmount = async () => {
    const obj = { ardb_id: bankId, branch_code: branchCode, supervisor_code: userId }

    await axios
      .post(address.TOTAL_COLLECTION, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        console.log(res?.data?.success?.msg[0]?.deposit_amount)
        setTotalDepositedAmount(res?.data?.success?.msg[0]?.deposit_amount)
      })
  }

  const logout = () => {
    setIsLogin(false)
    setAgentName("")
    setAgentEmail("")
    setAgentPhoneNumber("")
    setPasscode("")
  }

  return (
    <AppStore.Provider
      value={{
        isLogin,
        setIsLogin,
        logout,
        id,
        userId,
        agentName,
        agentEmail,
        agentPhoneNumber,
        login,
        getUserId,
        deviceId,
        setDeviceID,
        passcode,
        setPasscode,
        next,
        setNext,
        bankId,
        bankName,
        branchName,
        branchCode,
        maximumAmount,
        totalCollection,
        receiptNumber,
        // holidayLock,
        modifiedAt,
        todayDateFromServer,
        getFlagsRequest,
        collectionFlag,
        endFlag,
        send_dt,
        allowCollectionDays,
        secAmtType,
        getTotalDepositAmount,
        totalDepositedAmount,
        isDaily,
        isLoan,
        isRD,
        transDt,
        printOp,
        setTotalCollection,
        ardbName
      }}>
      {children}
    </AppStore.Provider>
  )
}

export default AppContext
