import { StyleSheet, Text, ToastAndroid, View, SafeAreaView, ScrollView } from "react-native"
import { useContext, useState } from "react"
import MpinComponent from "../../Components/MpinComponent"
import ButtonComponent from "../../Components/ButtonComponent"
import CustomHeader from "../../Components/CustomHeader"
import { COLORS, colors } from "../../Resources/colors"
import { AppStore } from "../../Context/AppContext"
import axios from "axios"
import { REACT_APP_BASE_URL } from "../../Config/config"
import { address } from "../../Routes/addresses"

const ChangePin = () => {
  const { userId, deviceId, bankId, branchCode, logout } = useContext(AppStore)

  const [passCode, changePasscode] = useState(() => "")
  const [newPassCode, setNewPassCode] = useState(() => "")
  const [confirmNewPasscode, setConfirmNewPasscode] = useState(() => "")

  const handleChangePassword = async () => {
    if (newPassCode !== confirmNewPasscode) {
      ToastAndroid.showWithGravityAndOffset(
        "Confirm Password must be same as New Passowrd.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      )
      changePasscode("")
      setNewPassCode("")
      setConfirmNewPasscode("")
    } else if (
      passCode == "" ||
      newPassCode == "" ||
      confirmNewPasscode == "" ||
      passCode.length !== 4 ||
      newPassCode.length !== 4 ||
      confirmNewPasscode.length !== 4
    ) {
      ToastAndroid.showWithGravityAndOffset(
        "Fill Pin Numbers properly.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      )
      changePasscode("")
      setNewPassCode("")
      setConfirmNewPasscode("")
    } else {
      const obj = {
        device_id: deviceId,
        user_id: userId,
        password: newPassCode,
        confirm_password: confirmNewPasscode,
        old_password: passCode,
        ardb_id: bankId,
        branch_code: branchCode,
      }

      await axios
        .post(address.CHANGE_PIN, obj, {
          headers: {
            Accept: "application/json",
          },
        })
        .then(res => {
          if (res.data.status) {
            ToastAndroid.showWithGravityAndOffset(
              res.data.success,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
              25,
              50,
            )
            changePasscode("")
            setNewPassCode("")
            setConfirmNewPasscode("")
            logout()
          } else {
            ToastAndroid.showWithGravityAndOffset(
              "Wrong Credentials...",
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
              25,
              50,
            )
            changePasscode("")
            setNewPassCode("")
            setConfirmNewPasscode("")
          }
        })
        .catch(err => {
          console.log("CHANGE PINNN SCREENNNN", err)
          ToastAndroid.showWithGravityAndOffset(
            err.response.data,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
            25,
            50,
          )
          changePasscode("")
          setNewPassCode("")
          setConfirmNewPasscode("")
        })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.reportTitle}>Change M-PIN</Text>
        </View>

        {/* Change PIN Card */}
        <View style={styles.changePinCard}>
          <Text style={styles.cardTitle}>Enter Your Details</Text>
          <View style={styles.pinInputs}>
            <View style={styles.pinContainer}>
              <Text style={styles.pinLabel}>Old PIN</Text>
              <MpinComponent value={passCode} handleChange={changePasscode} />
            </View>
            <View style={styles.pinContainer}>
              <Text style={styles.pinLabel}>New PIN</Text>
              <MpinComponent
                value={newPassCode}
                handleChange={setNewPassCode}
              />
            </View>
            <View style={styles.pinContainer}>
              <Text style={styles.pinLabel}>Confirm PIN</Text>
              <MpinComponent
                value={confirmNewPasscode}
                handleChange={setConfirmNewPasscode}
              />
            </View>
          </View>
          <ButtonComponent
            title={"CHANGE NOW"}
            customStyle={styles.changeButton}
            handleOnpress={handleChangePassword}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ChangePin

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

  // Change PIN Card
  changePinCard: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 24,
    padding: 24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.lightScheme.primary,
    textAlign: 'center',
    marginBottom: 24,
  },
  pinInputs: { gap: 20 },
  pinContainer: { alignItems: 'center' },
  pinLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.lightScheme.primary,
    marginBottom: 8,
  },

  // Change Button
  changeButton: {
    marginTop: 32,
    width: '100%',
    backgroundColor: COLORS.lightScheme.primary,
    borderRadius: 12,
    paddingVertical: 14,
  },
})
