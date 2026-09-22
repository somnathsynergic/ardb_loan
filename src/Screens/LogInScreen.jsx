import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
  Linking,
  ActivityIndicator, SafeAreaView
} from "react-native"
import { useState, useEffect, useContext, useCallback } from "react"
import { COLORS, colors } from "../Resources/colors"
import InputComponent from "../Components/InputComponent"
import { Strings } from "../Resources/Strings"
import ButtonComponent from "../Components/ButtonComponent"
import mainNavigationRoutes from "../Routes/NavigationRoutes"
import { AppStore } from "../Context/AppContext"
import SmoothPinCodeInput from "react-native-smooth-pincode-input"
import HeaderLogo from "../Resources/Images/logo.png"
import FooterLogo from "../Resources/Images/logo_cut.png"
import DeviceInfo from "react-native-device-info"
import axios from "axios"
import { address } from "../Routes/addresses"
import CancelButtonComponent from "../Components/CancelButtonComponent"
import { Dimensions } from "react-native"

const LogInScreen = ({ navigation }) => {
  const {
    isLogin,
    login,
    userId,
    agentName,
    getUserId,
    deviceId,
    setDeviceId,
    passcode,
    setPasscode,
    next,
    setNext,
    ardbName
  } = useContext(AppStore)

  const [latestAppVersion, setLatestAppVersion] = useState("")
  const [appDownloadLink, setAppDownloadLink] = useState("")
  const [updateStatus, setUpdateStatus] = useState("")
  const [isDisable, setDisable] = useState(false)
  var SCREEN_HEIGHT = Dimensions.get("screen").height
  var SCREEN_WIDTH = Dimensions.get("screen").width
  // useEffect(() => {
  //   console.log(passcode)
  // }, [passcode])

  const handlePressOnFirstScreen = () => {
    if (userId) {
      setNext(true)
    } else {
      setNext(false)
      ToastAndroid.showWithGravityAndOffset(
        "We encountered some error on server.",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
        25,
        50,
      )
    }
  }
  let version = DeviceInfo.getVersion()

  const [latestMajor, latestMinor, latestPatch] = latestAppVersion
    .split(".")
    .map(s => parseInt(s, 10))
  const [currentMajor, currentMinor, currentPatch] = version
    .split(".")
    .map(s => parseInt(s, 10))

  const getVersionFromWeb = async () => {
    await axios
      .post(
        address.GET_VERSION_DETAILS,
        { app_version: version },
        {
          headers: {
            Accept: "application/json",
          },
        },
      )
      .then(res => {
        setLatestAppVersion(res.data.data.app_version)
        setAppDownloadLink(res.data.data.app_download_link)
        // console.log(
        //   "fsdadgtreyhgtdhyrfujfyudx",
        //   res.data.data.app_download_link,
        // )
        // console.log("fsdadgtreyhgtdhysdfsdfsdrfujfyudx", res.data)
        setUpdateStatus(res.data.update_status)

        if (res.data.update_status == "Y") {
          showAlertUpdate(res.data.data.app_download_link)
        }
      })
  }

  useEffect(() => {
    getUserId()
    getVersionFromWeb()
  }, [])

  // console.log("skahlrcnsfytkuwhnf ", version)
  // console.log("skahlrcnsfytkuwhnf ", latestAppVersion)
  // console.log("skahlrcnsfytkuwhnf ", updateStatus)

  function showAlertUpdate(link) {
    Alert.alert("Found Update!", "Please update your app.", [
      { text: "Download", onPress: () => Linking.openURL(link) },
    ])
  }

  // 1 3 0 ========= 1 1 0

  return (
    // <View style={{ flex: 1, backgroundColor: COLORS.lightScheme.background }}>
    //   <View style={styles.logoContainer}>
    //     <Image source={HeaderLogo} style={styles.image} resizeMode="contain" />
    //     <View>
    //       {/* Wellcome gretting */}
    //       <Text style={styles.grettingText}>Welcome to {"Data Bank"}</Text>
    //       {/* manual text */}
    //       <Text style={styles.manual}>Login with your pin</Text>
    //     </View>
    //   </View>
    //   <View style={styles.mainContainer}>
    //     <View style={styles.logINcontainer}>
    //       {/* Title */}
    //       <Text style={styles.title}>LOGIN</Text>

    //       {!next && (
    //         <View>
    //           {/* DeviceId */}
    //           {!userId && (
    //             <InputComponent
    //               // handleChange={() => { }}
    //               value={deviceId ? deviceId : "Fetching ID..."}
    //               placeholder={Strings.loginPlaceHolder}
    //               label={"Device ID"}
    //               readOnly={true}
    //             />
    //           )}
    //           {/* Agent ID */}
    //           <InputComponent
    //             // handleChange={handlePressOnFirstScreen}
    //             value={userId ? userId : "Fetching ID..."}
    //             placeholder={`${userId}`}
    //             label={"Agent ID"}
    //             readOnly={true}
    //           />
    //           {/* <InputComponent
    //             // handleChange={handlePressOnFirstScreen}
    //             value={agentName ? agentName : "Fetching Username..."}
    //             placeholder={`${agentName}`}
    //             label={'Agent Name'}
    //             readOnly={true}
    //           /> */}

    //           <View style={styles.buttonContainer}>
    //             <ButtonComponent
    //               disabled={updateStatus == "Y" || !userId ? true : false}
    //               title={"Next"}
    //               handleOnpress={() => handlePressOnFirstScreen()}
    //               customStyle={{ width: "60%", marginTop: 10 }}
    //             />
    //           </View>

    //           {/* {updateStatus && (
    //             <View style={styles.buttonContainer}>
    //               <ButtonComponent
    //                 title={"Download Update"}
    //                 handleOnpress={() => {
    //                   showAlertUpdate()
    //                 }}
    //                 customStyle={{ width: "80%" }}
    //               />
    //             </View>
    //           )} */}
    //         </View>
    //       )}

    //       {next && (
    //         <View>
    //           {/* Passcode */}
    //           <View style={{ padding: 10, alignItems: "center" }}>
    //             <SmoothPinCodeInput
    //               autoFocus={true}
    //               placeholder="?"
    //               mask={
    //                 <View
    //                   style={{
    //                     width: 10,
    //                     height: 10,
    //                     borderRadius: 25,
    //                     backgroundColor: COLORS.lightScheme.primary,
    //                   }}></View>
    //               }
    //               maskDelay={1000}
    //               password={true}
    //               cellStyle={{
    //                 borderWidth: 1,
    //                 borderRadius: 5,
    //                 borderColor: COLORS.lightScheme.secondary,
    //               }}
    //               cellStyleFocused={null}
    //               value={passcode}
    //               onTextChange={code => {
    //                 setPasscode(code)
    //               }}
    //               onBackspace={() => {
    //                 // console.warn("hello")
    //               }}
    //             />
    //           </View>

    //           {/* Forgot Pin */}
    //           <TouchableOpacity
    //             onPress={() =>
    //               navigation.navigate(mainNavigationRoutes.forgotPasscode)
    //             }>
    //             <Text style={styles.resetText}>Forgot Pin?</Text>
    //           </TouchableOpacity>
    //           <View style={styles.buttonContainer}>
    //             <CancelButtonComponent
    //               title={"Back"}
    //               handleOnpress={() => {
    //                 setNext(!next)
    //                 setDisable(false)
    //               }}
    //               customStyle={{
    //                 marginTop: 10,
    //                 backgroundColor: "white",
    //                 colors: "red",
    //                 width: "40%",
    //               }}
    //             />
    //             <ButtonComponent
    //               disabled={isDisable || passcode.length != 4}
    //               title={
    //                 !isDisable ? (
    //                   "Submit"
    //                 ) : (
    //                   <ActivityIndicator color={COLORS.lightScheme.primary} />
    //                 )
    //               }
    //               handleOnpress={async () => {
    //                 setDisable(true)
    //                 let k = await login()
    //                 setDisable(false)
    //               }}
    //               customStyle={{ marginTop: 10, width: "40%" }}
    //             />
    //           </View>
    //         </View>
    //       )}
    //     </View>
    //   </View>
    // </View>

    // return (
    <SafeAreaView style={styles.container}>
      {/* Compact Hero Header - 140px */}
      {/* <View style={styles.heroHeader}> */}
      <View style={styles.heroHeader}>
        <Image source={HeaderLogo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.heroTitle}>{ardbName || 'Fetching ARDB...'}</Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Centered Login Card */}
        

        <View style={styles.centeredContainer}>
          {/* Step 1: Agent ID */}
          {!next ? (
            <>
            <View style={[styles.loginCard, { height: SCREEN_HEIGHT / 2.8,marginTop: -SCREEN_HEIGHT*0.1, }]}>
              <View style={styles.loginCardTitle}>
                <Text style={styles.loginCardTitleText}>Login</Text>
                </View>
              
              {/* <View style={styles.stepIndicator}>
                <View style={styles.stepActive} />
                <View style={styles.stepInactive} />
                
              </View> */}

              <Text style={styles.fieldLabel} >Device ID</Text>
              <InputComponent
                
                value={deviceId ? deviceId : "Fetching..."}
                readOnly={true}
                containerStyle={styles.compactInput}
              />
              
              <Text style={styles.fieldLabel}>Supervisor ID</Text>
              <InputComponent
                value={userId ? userId : "Fetching..."}
                readOnly={true}
                containerStyle={[styles.compactInput]}
              />
            
            </View>
             <View style={styles.buttonRow}>
              <ButtonComponent
                disabled={updateStatus === "Y" || !userId}
                title="Continue"
                handleOnpress={handlePressOnFirstScreen}
                customStyle={styles.primaryButton}
              />
              </View>
              </>
          ) : (
            /* Step 2: PIN */
            <View style={[styles.loginCard, { height: SCREEN_HEIGHT / 2.8 }]}>
              <View style={styles.loginCardTitle}>
                <Text style={styles.loginCardTitleText}>Enter PIN</Text>
                </View>
              {/* <View style={styles.stepIndicator}>
                <View style={styles.stepComplete} />
                <View style={styles.stepActive} />
              </View> */}

              <View style={styles.pinContainer}>
                <SmoothPinCodeInput
                  autoFocus={true}
                  placeholder="?"
                  mask={<View style={styles.pinMask} />}
                  maskDelay={1000}
                  password={true}
                  cellStyle={styles.pinCell}
                  cellStyleFocused={styles.pinCellFocused}
                  value={passcode}
                  onTextChange={setPasscode}
                />
              </View>

              {/* <TouchableOpacity style={styles.forgotLink}>
                <Text style={styles.forgotText}>Forgot PIN?</Text>
              </TouchableOpacity> */}

              <View style={styles.buttonRow}>
                <CancelButtonComponent
                  title="Back"
                  handleOnpress={() => {
                    setNext(false);
                    setDisable(false);
                  }}
                  customStyle={styles.secondaryButton}
                />
                <ButtonComponent
                  disabled={isDisable || passcode.length !== 4}
                  title={isDisable ? <ActivityIndicator size="small" color={COLORS.lightScheme.onPrimary} /> : "Login"}
                   handleOnpress={async () => {
                    setDisable(true)
                    let k = await login()
                    console.log('response KKKKKKK',k)
//                     if(k==true){
//                       setDisable(false)
//                       navigation.navigate('Home')
// }
                  }}
                  customStyle={styles.primaryButton}
                />
              </View>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={[styles.footer]}>
          <Text style={styles.stepTitle}>Powered by  </Text>
          <Image source={FooterLogo} style={[styles.image,{marginTop:30}]} resizeMode="contain" />
        </View>
      </View>
    </SafeAreaView>
  );

  // );

  // )
}

export default LogInScreen

// const styles = StyleSheet.create({
//   logoContainer: {
//     flex: 2,
//     backgroundColor: COLORS.lightScheme.primary,
//     borderBottomLeftRadius: 50,
//     borderBottomRightRadius: 50,
//     color: "white",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//   },
//   grettingText: {
//     fontSize: 18,
//     color: COLORS.lightScheme.onPrimary,
//     letterSpacing: 1,
//     fontWeight: "900",
//   },
//   manual: {
//     fontSize: 14,
//     color: COLORS.lightScheme.onPrimary,
//     letterSpacing: 1,
//     fontWeight: "900",
//     alignSelf: "center",
//   },

//   mainContainer: {
//     flex: 4,
//   },
//   logINcontainer: {
//     width: "100%",
//     backgroundColor: COLORS.lightScheme.background,

//     padding: PixelRatio.roundToNearestPixel(10),
//     borderRadius: PixelRatio.roundToNearestPixel(10),
//     shadowColor: COLORS.lightScheme.onTertiaryContainer,
//     shadowOffset: {
//       width: 0,
//       height: 12,
//     },
//     shadowOpacity: 0.58,
//     shadowRadius: 16.0,

//     elevation: 24,
//     position: "absolute",
//     bottom: 1,
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
//   buttonContainer: {
//     width: "100px",
//     marginVertical: 5,
//     padding: 5,
//     borderRadius: 5,
//     flexDirection: "row",
//     justifyContent: "space-around",
//   },
//   resetText: {
//     textAlign: "center",
//     color: COLORS.lightScheme.primary,
//     fontSize: 16,
//     alignSelf: "flex-end",
//     paddingHorizontal: 6,
//     letterSpacing: 1,
//     marginTop: 10,
//     fontWeight: "700",
//   },
//   image: {
//     width: 150,
//     height: 150,
//   },
// })


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.lightScheme.background },

  // Compact Hero (140px total)
  heroHeader: {
    height: 140,
    // backgroundColor: COLORS.lightScheme.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap:20
    // justifyContent: 'space-between',
    // elevation: 10,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.18,
    // shadowRadius: 16,
  },
  logo: { width: 85, height: 85 },
  heroTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.lightScheme.primary,
    letterSpacing: 5,
  },

  mainContent: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 24,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Compact Login Card
  loginCard: {
    
    // backgroundColor: COLORS.lightScheme.onPrimary,
    backgroundColor: COLORS.lightScheme.background,
    borderRadius: 20,
    padding: 28,
    // elevation: 6,
    shadowColor: '#000',
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 0.1,
    // shadowRadius: 18,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    
  },

  // Step Indicator
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  stepActive: {
    width: 12,
    height: 12,
    borderRadius: 14,
    backgroundColor: COLORS.lightScheme.primary,
  },
  stepComplete: {
    width: 12,
    height: 12,
    borderRadius: 14,
    backgroundColor: '#10b981',
  },
  stepInactive: {
    width: 12,
    height: 12,
    borderRadius: 14,
    backgroundColor: COLORS.lightScheme.primary + '30',
  },

  stepTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: 'gray',
    textAlign: 'center',
    marginTop: 24,
  },

  fieldLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.lightScheme.secondary,
    marginBottom: 8,
    marginTop: 20,
  },
  compactInput: {
    backgroundColor: COLORS.lightScheme.background,
    borderRadius: 14,
    marginBottom: 20,
  },

  // Compact PIN
  pinContainer: {  flexDirection: 'row', justifyContent: 'center',marginVertical:40 },
  pinCell: {
    borderWidth: 2,
    borderColor: '#C0BABC',
    borderRadius: 10,
    width: 48,
    height: 48,
    marginHorizontal: 26,
    marginVertical:56,

  },
  pinCellFocused: {
    borderColor: COLORS.lightScheme.primary,
    // backgroundColor: COLORS.lightScheme.primary + '08',
  },
  pinMask: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.lightScheme.primary,
    color:COLORS.lightScheme.primary

  },

  forgotLink: { alignItems: 'center', marginBottom: 24 },
  forgotText: {
    fontSize: 15,
    color: COLORS.lightScheme.primary,
    fontWeight: '600',
  },

  buttonRow: { flexDirection: 'row', paddingHorizontal:40,gap:12 },
  primaryButton: { flex: 1, height: 52, borderRadius: 14, marginVertical: 10 },
  secondaryButton: { flex: 1, height: 52, borderRadius: 14, marginVertical: 10 },
  image: {
    width: 40,
    height: 40,
  },
  loginCardTitle:{flexDirection:'row',alignItems:'center',justifyContent:'center'},
  loginCardTitleText:{fontSize:35,color:COLORS.lightScheme.secondary,letterSpacing:5}
});


