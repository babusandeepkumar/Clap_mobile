import {useRef} from 'react';
import { View,Image,Animated,StyleSheet,useColorScheme,ToastAndroid,Text,TouchableOpacity,StatusBar  } from 'react-native';
import { NavigationContainer, DefaultTheme,
  DarkTheme} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Components/Home';
import Search from './Components/Search_n';
import Preview from './Components/Preview';
import PaymentHistory from './Components/PaymentHistory';
import Queries from './Components/Queries';
import JailMonkey from 'jail-monkey'
import Payment from './Components/Payment';
import RNExitApp from 'react-native-exit-app';
import FastImage from 'react-native-fast-image';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from './assets/Config.json'
import Receipt from './Components/Receipt'
import Main from './Components/Main';
const App = () => {
  FastImage.clearDiskCache();
  FastImage.clearMemoryCache();
  FastImage.preload([
    {
        uri: 'https://allvy.com/CLAP_Mobile/bb.png',
        priority: FastImage.priority.high,
        cache:FastImage.cacheControl.immutable
    },
    {
      uri: 'https://allvy.com/CLAP_Mobile/logo.png',
      priority: FastImage.priority.high,
      cache:FastImage.cacheControl.immutable
  },
  {
    uri: 'https://allvy.com/CLAP_Mobile/cm.png',
    priority: FastImage.priority.high,
    cache:FastImage.cacheControl.immutable
},
{
  uri: 'https://allvy.com/CLAP_Mobile/suresh.png',
  priority: FastImage.priority.high,
  cache:FastImage.cacheControl.immutable
},
  {
    uri: Config.paymentres,
    priority: FastImage.priority.high,
    cache:FastImage.cacheControl.immutable
},
{
  uri: Config.paymentcom,
  priority: FastImage.priority.high,
  cache:FastImage.cacheControl.immutable
}
  ]);
  const scheme = useColorScheme();
  const Stack = createNativeStackNavigator();
  return (
    <>
    <StatusBar backgroundColor="#6082B6" barStyle="light-content" />
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme} >
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ orientation: 'portrait'}}>
      <Stack.Screen name="Splash" component={Splash} options={{headerShown:false}} />
      <Stack.Screen name="Home" component={Home}  options={{headerShown:false}}/>
      <Stack.Screen name="Main" component={Main}  options={{headerShown:false}}/>
      <Stack.Screen name="Onboard" component={Onboard}  options={{headerShown:false}}/>
      <Stack.Screen name="rcpt" component={Receipt}options={{
          headerTitle:'Get Payment History',
          headerBackVisible:true,
          headerTitleStyle:{
            color:'white',
            fontSize:18
          },
          headerStyle: {
            backgroundColor: '#6082B6',
         },
         
          }}/>
      <Stack.Screen name="PH" component={PaymentHistory} options={{
          headerTitle:'Get Payment History',
          headerBackVisible:true,
          headerTitleStyle:{
            color:'white',
            fontSize:18
          },
          headerStyle: {
            backgroundColor: '#6082B6',
         },
         
          }} />
          <Stack.Screen name="Qur" component={Queries} options={{
          headerTitle:'Any Queries/suggestions',
          headerBackVisible:true,
          headerTitleStyle:{
            color:'white',
            fontSize:18
          },
          headerStyle: {
            backgroundColor: '#6082B6',
         },
         
          }} />
           <Stack.Screen name="Payment" component={Payment} />
         <Stack.Screen name="Search" component={Search} options={{
          headerTitle:'Get Payment Details',
          headerBackVisible:true,
          headerTitleStyle:{
            color:'white',
            fontSize:18
          },
          headerStyle: {
            backgroundColor: '#6082B6',
         },
         
          }} />
           <Stack.Screen name="Preview" component={Preview} options={({ route }) => ({
          headerTitle:route.params.title,
          headerBackVisible:true,
          headerTitleStyle:{
            color:'white',
            fontSize:18
          },
          headerStyle: {
            backgroundColor: '#6082B6',
         },
         
          })} />

   
      </Stack.Navigator>
      </NavigationContainer>
      </>
  )
}

function Splash({navigation}){
 
  const showToast = () => {
    ToastAndroid.show('rooted devices not allowed !', ToastAndroid.SHORT);
  };
  const fadeAnim = useRef(new Animated.Value(0)).current;
  setTimeout(()=>{
   var test=JailMonkey.trustFall();
     Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true
    }).start();
    if(test){
      showToast();
      RNExitApp.exitApp();
    }else{

    //navigation.replace('Onbord'); 
    getData();
    }
   
  },6000);

  const getData = async () => {
    try {
      const ch=await AsyncStorage.getItem("hto");
      if(ch !=null){
      await AsyncStorage.setItem("hto",(parseInt(ch)+1).toString());
      }else{
        await AsyncStorage.setItem("hto","1");
      }
      const value = await AsyncStorage.getItem('@onboard')
      if(value !== null) {
        navigation.replace('Main')
      }else{
        navigation.replace('Onboard');
      }
    } catch(e) {
      navigation.replace('Onboard');
      console.log("something went wrong")
      // error reading value
    }
  }
  return(
    <>
     <View style={{backgroundColor:"white",flexDirection:"row",justifyContent:"space-between"}}>
      <View style={{justifyContent:"center",alignItems:"center"}}>
      <Image source={{uri:"https://allvy.com/CLAP_Mobile/cm.png"}} style={styles.img}/>
      {/* <View style={{paddingLeft:5,alignItems:"center"}}>
      <Text style={{color:"blue",fontSize:12}}>Sri. Y. S. Jaganmohan Reddy</Text>
      <Text style={{color:"green",fontSize:12}}>Hon'ble Chief Minister</Text>
      <Text style={{color:"green",fontSize:12}}>Gov of Andhra Pradesh.</Text>
      </View> */}
      </View>
      <View style={{justifyContent:"center",alignItems:"center"}}>
      <Image source={{ uri: "https://allvy.com/CLAP_Mobile/suresh.png" }} style={styles.img} />
      {/* <View style={{paddingRight:5,alignItems:"center"}}>
      <Text style={{color:"blue",fontSize:12}}>Sri. Audimulapu Suresh</Text>
      <Text style={{color:"green",fontSize:12}}>Hon'ble Minister for MA & UD</Text>
      <Text style={{color:"green",fontSize:12}}>Gov of Andhra Pradesh.</Text>
      </View> */}
      </View>
         
        
        </View>
      <View style={styles.splmain}>
       
        <Spl2/>
<Spl1/>
 {/* <View style={styles.top}></View> */}
       <View style={styles.bottom}></View>
       <View style={{flexDirection:"row",justifyContent:"center"}}>
        <View>
        <Text style={{color:"blue",marginTop:2}}>Powered by  </Text>
        </View>
        <View>
         <Image source={require("./images/allvy1.png")}  />
        </View>
      
       
       </View>
      </View>
      </>
    )

  }  

function Spl1(){
return(
<Image 
        source={require('./assets/city.gif')}  
        style={styles.spimgs1}
    />
)
}

function Spl2(){
  const fadeAnim = useRef(new Animated.Value(0)).current;
 
     Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 4000,
      useNativeDriver: true
    }).start();
  return(
    <Animated.View style={[styles.gif,
      {
        opacity: fadeAnim,
      },
    ]}>
       
     <Image source={require('./assets/splogo.png')} style={styles.spimgs}/>
    </Animated.View>
    
)
}

function Onboard({navigation}) {
  const setfnish =async()=>{
  await AsyncStorage.setItem("@onboard","true");
  navigation.replace("Main")
  }
  const Done = ({...props}) => (
    <TouchableOpacity
    {...props}
    >
    <Text style={{fontSize:16, marginHorizontal:20,color:'black'}}>Done</Text>
    </TouchableOpacity>
)
  return (
    <>
    <StatusBar backgroundColor="white" barStyle="light-content" />
  
    <Onboarding
  pages={[
    {
      backgroundColor: '#fff',
      image: <Image source={require('./images/n4.jpg')} />,
      title: '',
      subtitle: '',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={require('./images/n.png')} />,
      title: '',
      subtitle: '',
    },
    {
      backgroundColor: '#fff',
      image: <Image source={require('./images/n1.png')} />,
      title: '',
      subtitle: '',
    }
   
  ]}

  onSkip={()=>{setfnish()}}
  onDone={()=>{setfnish()}}
  DoneButtonComponent={Done}
  bottomBarColor="#fff" // Set the bottom color here

  containerStyles={{ flex: 1 }} // Ensure the swiper takes up the full screen height
  imageContainerStyles={{ flex: 1 }} // Make the image container take up the full screen height
  imageStyles={{ flex: 1, width: '100%', resizeMode: 'stretch' }} 
      />
        </>
  )
}

export default App

const styles = StyleSheet.create({
  img:{
      marginTop:10,
    width:170,
    height:150,
  },
  splmain:{
    backgroundColor:'white',
    height:'100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    
  },
  spimgs1:{
   width:250,
   height:200,
  margin:40
  },
  spimgs2:{
    marginTop:10,
    width:150,
    height:50, 
   },
   top:{
    backgroundColor:"#6082B6",
    width:80,
    height:80,
    borderBottomLeftRadius:80,
    alignSelf:'flex-start',
    marginTop: -5,
    top:-1,
    right:0,
    position: 'absolute',
   },
   bottom:{
    backgroundColor:"#6082B6",
    width:200,
    height:200,
    alignSelf:'flex-start',
    bottom:-80,
    left:-90,
   borderRadius:100,
    position: 'absolute',
   }
})