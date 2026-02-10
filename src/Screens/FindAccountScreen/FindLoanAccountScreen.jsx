import {
  ActivityIndicator,
  AppState,
  ScrollView,
  StyleSheet,
  Text,
  View, SafeAreaView, FlatList, TouchableOpacity
} from "react-native"
import { useCallback, useContext, useEffect, useState } from "react"
import CustomHeader from "../../Components/CustomHeader"
import { COLORS, colors } from "../../Resources/colors"
import InputComponent from "../../Components/InputComponent"
import SearchCard from "../../Components/SearchCard"
import axios from "axios"
import { REACT_APP_BASE_URL } from "../../Config/config"
import { address } from "../../Routes/addresses"
import { AppStore } from "../../Context/AppContext"
import { useFocusEffect } from "@react-navigation/native"
import { SCREEN_WIDTH } from "react-native-normalize"
import { icon } from "../../Resources/Icons"

const FindLoanAccountScreen = ({ navigation }) => {
  const [searchValue, changeSearchValue] = useState(() => "")
  const [userBankDetails, setUserBankDetails] = useState(() => [])
  const [isLoading, setIsLoading] = useState(false)

  const { userId, bankId, branchCode } = useContext(AppStore)

  function handleAccountSearch() {
    if (!searchValue) {
      return
    }
    fetchBankDetails()
  }

  const debounce = func => {
    let timer
    return function (...args) {
      const context = this
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        func.apply(context, args)
      }, 2000)
    }
  }

  // useEffect(() => {
  //   handleAccountSearch()
  //   console.log(userBankDetails)
  // }, [searchValue])

  useEffect(() => {
    debounce(fetchBankDetails)()
  }, [searchValue])

  const fetchBankDetails = async () => {
    setIsLoading(true)
    const obj = {
      ardb_id: bankId,
      branch_code: branchCode,
      supervisor_code: userId,
      account_number: searchValue,
      flag: "L",
    }
    console.log(bankId, branchCode, userId, searchValue)
    console.log(userBankDetails,obj)

    await axios
      .post(address.SEARCH_ACCOUNT, obj, {
        headers: {
          Accept: "application/json",
        },
      })
      .then(res => {
        setIsLoading(false)
        console.log("bank details", res?.data?.success?.msg)
        if(res?.data?.success?.suc)
        setUserBankDetails(res?.data?.success?.msg)
        setIsLoading(false)
      })
      .catch(err => {
        setIsLoading(false)

        setUserBankDetails([])
        console.log(err?.response?.data)
      })
  }

  useFocusEffect(
    useCallback(() => {
      // alert('Screen was focused')
      return () => {
        // alert('Screen was unfocused')
        // // Useful for cleanup functions
        changeSearchValue("")
        setUserBankDetails([])
        setIsLoading(false)
      }
    }, []),
  )

  return (
    // <View>
    //   <CustomHeader />
    //   <View style={styles.container}>
    //     {/* Account Cards */}
    //     <Text style={styles.title}>Loan</Text>
    //     {isLoading && (
    //       <ActivityIndicator
    //         color={COLORS.lightScheme.primary}
    //         style={styles.loading}
    //         size={"large"}
    //       />
    //     )}
    //     <ScrollView
    //       style={{ maxHeight: "60%" }}
    //       keyboardShouldPersistTaps="handled">
    //       {userBankDetails &&
    //         !isLoading &&
    //         userBankDetails?.map((props, index) => {
    //           console.log("========================", props)
    //           return (
    //             <SearchCard
    //               item={props}
    //               index={index}
    //               navigation={navigation}
    //               key={index}
    //               flag={"L"}
    //             />
    //           )
    //         })}
    //     </ScrollView>
    //     {/* Search Component */}
    //     <View style={styles.searchContainer}>
    //       <InputComponent
    //         label={"Account No. / Name"}
    //         placeholder={"Enter Account No. / Name"}
    //         value={searchValue}
    //         handleChange={changeSearchValue}
    //         autoFocus={false}
    //       />
    //     </View>
    //   </View>
    // </View>
  //   <SafeAreaView style={styles.container}>
  //   <CustomHeader />
  //   <View style={styles.content}>
  //     {/* Professional Title */}
  //     <Text style={styles.title}>Loan Accounts</Text>
      
  //     {/* Loading Overlay */}
  //     {isLoading && (
  //       <View style={styles.loadingOverlay}>
  //         <ActivityIndicator color={COLORS.lightScheme.primary} size="large" />
  //         <Text style={styles.loadingText}>Loading accounts...</Text>
  //       </View>
  //     )}

  //     {/* Results List */}
  //     <View style={styles.listContainer}>
  //       <ScrollView 
  //         keyboardShouldPersistTaps="handled"
  //         showsVerticalScrollIndicator={false}
  //         contentContainerStyle={styles.scrollContent}
  //       >
  //         {userBankDetails?.map((props, index) => (
  //           <SearchCard
  //             item={props}
  //             index={index}
  //             navigation={navigation}
  //             key={props.account_number || index} // Better key
  //             flag="L"
  //           />
  //         ))}
  //         {userBankDetails?.length === 0 && !isLoading && (
  //           <View style={styles.emptyState}>
  //             <Text style={styles.emptyText}>No loan accounts found</Text>
  //             <Text style={styles.emptySubtext}>Start searching above</Text>
  //           </View>
  //         )}
  //       </ScrollView>
  //     </View>

  //     {/* Floating Search Bar */}
  //     <View style={styles.searchContainer}>
  //       <InputComponent
  //         label="Account No. / Name"
  //         placeholder="Search loan accounts..."
  //         value={searchValue}
  //         handleChange={changeSearchValue}
  //         autoFocus={false}
  //         icon="magnify" // Add search icon if supported
  //       />
  //     </View>
  //   </View>
  // </SafeAreaView>

  // return (
  // <SafeAreaView style={styles.container}>
  //   <CustomHeader />
    
  //   {/* Sticky Search Bar */}
  //   <View style={styles.searchHeader}>
  //     <Text style={styles.pageTitle}>Loan Accounts</Text>
  //     <View style={styles.searchBar}>
  //       <View style={styles.searchIcon} />
  //       <InputComponent
  //         placeholder="Search Account No. or Name"
  //         value={searchValue}
  //         handleChange={changeSearchValue}
  //         containerStyle={styles.searchInput}
  //         autoFocus={false}
  //       />
  //       {searchValue ? (
  //         <TouchableOpacity onPress={() => changeSearchValue('')} style={styles.clearButton}>
  //           <Text style={styles.clearText}>Clear</Text>
  //         </TouchableOpacity>
  //       ) : null}
  //     </View>
      
  //     {/* Results Counter */}
  //     {!isLoading && (
  //       <View style={styles.resultsCounter}>
  //         <Text style={styles.resultsText}>
  //           {userBankDetails?.length || 0} {userBankDetails?.length === 1 ? 'account' : 'accounts'} found
  //         </Text>
  //       </View>
  //     )}
  //   </View>

  //   {/* Main Results Area */}
  //   <View style={styles.resultsContainer}>
  //     {isLoading ? (
  //       <View style={styles.skeletonContainer}>
  //         {[1,2,3].map((i) => (
  //           <View key={i} style={styles.skeletonCard} />
  //         ))}
  //       </View>
  //     ) : userBankDetails?.length ? (
  //       <FlatList
  //         data={userBankDetails}
  //         renderItem={({ item, index }) => (
  //           <SearchCard
  //             item={item}
  //             index={index}
  //             navigation={navigation}
  //             flag="L"
  //           />
  //         )}
  //         keyExtractor={(item, index) => item.account_number || index.toString()}
  //         showsVerticalScrollIndicator={false}
  //         contentContainerStyle={styles.listContent}
  //         keyboardShouldPersistTaps="handled"
  //       />
  //     ) : (
  //       <View style={styles.emptyState}>
  //         <View style={styles.emptyIcon} />
  //         <Text style={styles.emptyTitle}>No Results Found</Text>
  //         <Text style={styles.emptySubtitle}>
  //           Try adjusting your search terms or check account details
  //         </Text>
  //         <TouchableOpacity style={styles.emptyAction} onPress={() => changeSearchValue('')}>
  //           <Text style={styles.emptyActionText}>Clear Search</Text>
  //         </TouchableOpacity>
  //       </View>
  //     )}
  //   </View>
  // </SafeAreaView>
  // return (
  <SafeAreaView style={styles.container}>
    <CustomHeader />
    
    {/* Sticky Search Bar */}
    <View style={styles.searchHeader}>
      <Text style={styles.pageTitle}>Loan Accounts</Text>
      <View style={styles.searchBar}>
        {/* Pure View "Search Icon" */}
        {/* <View style={styles.searchIconView} /> */}
        {/* <Text> {({ color, size }) => icon.giver(color, 30)}</Text> */}
                    {icon.Find(COLORS.lightScheme.primary, 30)}
        
        <InputComponent
          placeholder="Search Account No. or Name"
          value={searchValue}
          handleChange={changeSearchValue}
          containerStyle={styles.searchInput}
          autoFocus={false}
        />
        {searchValue ? (
          <TouchableOpacity onPress={() => changeSearchValue('')} style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      
      {/* Results Counter */}
      {!isLoading && (
        <View style={styles.resultsCounter}>
          <Text style={styles.resultsText}>
            {userBankDetails?.length || 0} account{userBankDetails?.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}
    </View>

    {/* Main Results */}
    <View style={styles.resultsContainer}>
      {isLoading ? (
        <View style={styles.skeletonContainer}>
          {[1,2,3].map((i) => (
            <View key={i} style={styles.skeletonCard} />
          ))}
        </View>
      ) : userBankDetails?.length ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
        >
          {userBankDetails.map((props, index) => (
            <SearchCard
              key={props.account_number || index}
              item={props}
              index={index}
              navigation={navigation}
              flag="L"
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          {/* Pure View "Icon" */}
          {/* <View style={styles.emptyIconView} /> */}
          <Text style={styles.emptyTitle}>No Results Found</Text>
          <Text style={styles.emptySubtitle}>
            Try different search terms or check spelling
          </Text>
          <TouchableOpacity 
            style={styles.emptyAction} 
            onPress={() => changeSearchValue('')}
          >
            <Text style={styles.emptyActionText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  </SafeAreaView>
);

// );

  // )
}

export default FindLoanAccountScreen

// const styles = StyleSheet.create({
// container: {
//     flex: 1,
//     backgroundColor: COLORS.lightScheme.background,
//   },
//   content: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '800',
//     color: COLORS.lightScheme.onPrimary,
//     textAlign: 'center',
//     backgroundColor: COLORS.lightScheme.primary,
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 25,
//     marginBottom: 25,
//     elevation: 6,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 12,
//   },
//   listContainer: {
//     flex: 1,
//     marginBottom: 20,
//   },
//   scrollContent: {
//     paddingBottom: 15,
//     gap: 8, // Consistent card spacing
//   },
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(255,255,255,0.9)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 1000,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: COLORS.lightScheme.onBackground,
//     fontWeight: '600',
//   },
//   emptyState: {
//     alignItems: 'center',
//     paddingVertical: 60,
//     paddingHorizontal: 20,
//   },
//   emptyText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: COLORS.lightScheme.onBackground,
//     marginBottom: 8,
//   },
//   emptySubtext: {
//     fontSize: 14,
//     color: COLORS.lightScheme.onBackground + '99', // 60% opacity
//   },
//   searchContainer: {
//     position: 'absolute',
//     bottom: 20,
//     left: 20,
//     right: 20,
//     backgroundColor: COLORS.lightScheme.onPrimary,
//     borderRadius: 20,
//     padding: 8,
//     elevation: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.18,
//     shadowRadius: 16,
//     borderWidth: 1,
//     borderColor: COLORS.lightScheme.primary + '22',
//   },
// })

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.lightScheme.background,
//   },

//   // Sticky Header (100px total height)
//   searchHeader: {
//     backgroundColor: COLORS.lightScheme.onPrimary,
//     padding: 20,
//     paddingTop: 16,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//   },
//   pageTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: COLORS.lightScheme.primary,
//     marginBottom: 16,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.lightScheme.background,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     height: 48,
//     borderWidth: 1,
//     borderColor: COLORS.lightScheme.primary + '20',
//   },
//   searchIcon: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     backgroundColor: COLORS.lightScheme.primary + '20',
//     marginRight: 12,
//   },
//   searchInput: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     height: 48,
//     fontSize: 8
//   },
//   clearButton: {
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//   },
//   clearText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: COLORS.lightScheme.primary,
//   },
//   resultsCounter: {
//     marginTop: 12,
//     paddingVertical: 8,
//   },
//   resultsText: {
//     fontSize: 14,
//     color: COLORS.lightScheme.onBackground + 'B0',
//     fontWeight: '500',
//   },

//   // Results Area
//   resultsContainer: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 12,
//   },
//   listContent: {
//     paddingBottom: 40,
//   },

//   // Skeleton Loading
//   skeletonContainer: {
//     gap: 16,
//     paddingVertical: 20,
//   },
//   skeletonCard: {
//     height: 72,
//     backgroundColor: COLORS.lightScheme.onPrimary,
//     borderRadius: 16,
//     elevation: 2,
//   },

//   // Empty State
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 80,
//     paddingHorizontal: 40,
//   },
//   emptyIcon: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: COLORS.lightScheme.primary + '10',
//     marginBottom: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: COLORS.lightScheme.primary,
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   emptySubtitle: {
//     fontSize: 16,
//     color: COLORS.lightScheme.onBackground + '99',
//     textAlign: 'center',
//     lineHeight: 22,
//     marginBottom: 24,
//   },
//   emptyAction: {
//     backgroundColor: COLORS.lightScheme.primary,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
//   },
//   emptyActionText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 15,
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightScheme.background,
  },

  // Sticky Header
  searchHeader: {
    backgroundColor: COLORS.lightScheme.onPrimary,
    padding: 20,
    paddingTop: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginTop:10
  },
  pageTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.lightScheme.primary,
    marginBottom: 16,
    marginHorizontal:SCREEN_WIDTH/4,
    letterSpacing:2
  },
  
  // Search Bar with Pure View Icon
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: COLORS.lightScheme.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    // borderWidth: 1,
    // borderColor: COLORS.lightScheme.primary + '20',
  },
  searchIconView: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.lightScheme.primary + '25',
    marginRight: 12,
    padding: 4,
  },
  searchInput: {
    flex: 1,
    backgroundColor: 'transparent',
    height:68,
    borderWidth:0,
    padding:15,
    fontSize:8
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.lightScheme.primary,
  },
  resultsCounter: {
    marginTop: 12,
    paddingVertical: 4,
  },
  resultsText: {
    fontSize: 15,
    color: COLORS.lightScheme.onBackground + 'B0',
    fontWeight: '500',
  },

  // Results Area
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  listContent: {
    paddingBottom: 60,
    gap: 12,
  },

  // Skeleton Loading (Pure Views)
  skeletonContainer: {
    gap: 12,
    paddingVertical: 20,
  },
  skeletonCard: {
    height: 76,
    backgroundColor: COLORS.lightScheme.onPrimary,
    borderRadius: 16,
    elevation: 2,
  },

  // Empty State with Pure View Icon
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 48,
  },
  emptyIconView: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.lightScheme.primary + '12',
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.lightScheme.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.lightScheme.onBackground + '88',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  emptyAction: {
    backgroundColor: COLORS.lightScheme.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
  },
  emptyActionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});


