import { StyleSheet, Text, TouchableOpacity,ToastAndroid, View,ScrollView,Dimensions,TouchableWithoutFeedback,StatusBar } from 'react-native'
import React,{useEffect, useState} from 'react'
import {Image,useColorScheme} from 'react-native'
import {Avatar, Card, TouchableRipple,List} from "react-native-paper";
import { NavigationContainer,useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';
import Config from '../assets/Config.json'
import { Root, Popup,Toast  } from 'react-native-popup-confirm-toast'
import {Appearance} from 'react-native';
import MarqueeScroll from './MarqueeScroll';
import { useNetInfo } from '@react-native-community/netinfo';
import Offline from './Offline';
import Spinner from 'react-native-loading-spinner-overlay';
import RatingPopup from './RatingPopup';
const Home = ({navigation}) => {
  const info=useNetInfo();
  const showToast = () => {
    ToastAndroid.show('This feature comming soon ....', ToastAndroid.SHORT);
  };

    const screenmode = Appearance.getColorScheme();
    const [fav,setfav]=useState([]);
    const [sopt,setopt]=useState(false);
    const [pending,setpending]=useState([]);
    const[show,setshow]=useState(false);
    const isVisible = useIsFocused();
    const [issub,setsub]=useState(false);
   useEffect(()=>{
   setpending([]);
     getdata();
     getToken();
     check();
   },[isVisible]);

   async function getToken() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
  
    var raw = JSON.stringify({
      "username": "21073001",
      "password": "Allvy@123"
    });
  
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
 // console.log(Config.url + "authenticate")
    try {
      const response = await fetch(Config.url + "authenticate", requestOptions);
      const result = await response.json();
      await AsyncStorage.setItem('token', result['token']);
    } catch (error) {
      console.log('error', error);
    }
  }
  
  async function check(){
   const diss=await AsyncStorage.getItem("dshow");
    const ch=await AsyncStorage.getItem("hto");
    console.log(ch);
   if(parseInt(ch)==3){
    setshow(true);
   }
   if(diss !=null){
    if(diss=="false"){
      if(parseInt(ch)==10){
        setshow(true);
       }
    }
   }
  }

   async function getdata(){
    
     try{
         const val=CryptoJS.AES.decrypt(await AsyncStorage.getItem("@fav"),Config.private_key).toString(CryptoJS.enc.Utf8);
         setfav(JSON.parse(val))
         var res=JSON.parse(val);
         res.forEach(ele => {
          setpen(ele.type,ele.data.slno)
         });
     }catch(e){

     }
    
 }

async function setpen(type, slno) {
  
  var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "JSESSIONID=4035D7C31FAEF770047202D36096173E");

var raw = JSON.stringify({
  "slno": slno,
  "hhType": type
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};
console.log(Config.url +"paymentHistory/getHHPendingAmount", requestOptions)
await fetch(Config.url +"paymentHistory/getHHPendingAmount", requestOptions)
  .then(response => response.json())
  .then(data => {
    setpending(prevPending => [...prevPending, { [slno]: data.pendingamount}]);
    console.log(data.pendingamount)
  })
  .catch(error => console.log('error', error));


  // fetch(Config.url + 'paymentHistory/getHouseHoldIds/mobileNumber/' + phno)
  //   .then(response => response.json())
  //   .then(data => {
  //     var bb = [];
  //     data.forEach(rrt => {
  //       if (rrt.slno == [slno]) {
         
  //         var sr = { [slno]: rrt.pendingamount };
  //         bb.push(sr);
  //       }
  //     });
  //     setpending(prevPending => [...prevPending, bb[0]]);
  //     //setsub(false);
  //   })
  //   .catch(err => console.log(err));
}

   function removeitem(i){
    Popup.show({
        type: 'confirm',
       position: 'top',
        textBody: 'Are you sure want to remove!',
        buttonText: 'Ok',
        confirmText: 'Cancel',
        callback: async() => {
            const vval=fav;
         vval.splice(i,1);
         var trm=JSON.stringify(vval);
         var cdma=CryptoJS.AES.encrypt(trm,Config.private_key).toString();
         await AsyncStorage.setItem('@fav',cdma);
         getdata();
            Popup.hide();
        },
        cancelCallback: () => {
            Popup.hide();
        },
    });
   }

   function gotopay(i){
   navigation.navigate("Preview",{data:fav[i].data,title:fav[i].type,status:fav[i].status});
   //console.log({data:fav[i].data,title:fav[i].type});
   } 
  
const dispdata=fav.map((res,i)=>{
  
    var split=res.name.trim().split(' ');
    var nick='';
    if(split.length>1){
         nick=split[0].substr(0,1).toUpperCase()+''+split[1].substr(0,1).toUpperCase();
    }else{
        nick=split[0].substr(0,1).toUpperCase();
    }
    var foundItem ='';
  try{
     foundItem = pending.find(ry => ry.hasOwnProperty(res.data.slno));
  }catch(E){
    console.log(E)
  }
    const value = foundItem ? foundItem[res.data.slno] : null;
   
    const test=res.data;
    
    return(
      <TouchableRipple  onLongPress={()=>removeitem(i)} onPress={()=>gotopay(i)} style={{ borderWidth: 0.5,
        borderRadius: 10,borderColor:'#ccc',Width:"100%"}} key={i}>
      
         <View style={{flexDirection:"row",justifyContent:"center",margin:10}}>
         <Avatar.Text size={50} label={nick} style={{margin:5}} backgroundColor={res.type=='Commercial'?'green':'royalblue'}/>
         <View style={{flexDirection:"column"}}>
         <Text style={{margin:0,textAlign:'center',width:200}}><Text style={{fontWeight:"bold"}}>{res.data.citizenName}{res.data.traderNameComm}</Text>   {res.data.doorNo}{res.data.doorNoComm}</Text>
         <Text style={{margin:0,textAlign:'center'}}>{res.data.mandalName}{res.data.mandalNameComm} ({res.type})</Text>
         </View>
         
        {value!='' && value !=null?
         <View><Text style={{color:'red'}}>₹ {value.split(".")[0]}</Text></View>
    :<View><Text style={{color:'red'}}>Calculating ...</Text></View>}
         </View>
</TouchableRipple>
    )
})
  return (
    
<Root>
        <View>
          
          {show?
          <RatingPopup/>
          :""}
        <Spinner
          visible={issub}
          textContent={'Loading...'}
         textStyle={styles.spinnerTextStyle}
        />
            <View style={styles.top}></View>
            <View style={styles.topline}></View>
            <Image  source={require('../assets/splogo.png')} resizeMode={'cover'} style={styles.image1}/>
          <Image  source={require('../assets/bgp.png')} resizeMode={'cover'} style={styles.image}/>
         
        <View style={styles.headi} >
          {/*onPress={updtopt}*/}
            <TouchableOpacity >
           <Image source={require('../assets/llogo.png')} resizeMode={'cover'} style={styles.iconuser}></Image>
           </TouchableOpacity> 
     {!sopt?'':
     <Card style={{width:110,margin:10,zIndex:1}} >
     <View style={{flexDirection:"row",margin:10,flex:1,justifyContent:'center',alignItems:'center'}}>
                   
                    <View style={{flex:1}}>
                    <Avatar.Icon size={32} icon="logout" />
                    </View>
                    <View style={{flex:1}}>
                    <Text style={{color:'black'}}>Logout</Text>
                    </View>
                
                </View>
     </Card>
}
                 
        </View>
          <View>
            <Text style={[{fontSize:20,margin:10},styles.heading(screenmode)]}>WELCOME TO CLAP </Text>
            <Text style={[{fontSize:14,marginLeft:10},styles.heading(screenmode)]}>USERFEE APP</Text>
          </View>

         <View style={styles.medle}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <TouchableRipple  style={{flex:1}} onPress={()=>navigation.navigate("Search")}>
                <View style={styles.box}>
           <Image source={require("../assets/quick_pay.png")} style={{width:60,height:60,margin:10}}/>
           <Text style={[{margin:5,fontSize:14},styles.colormode(screenmode)]}>Quick Pay</Text>
           </View>
                </TouchableRipple >
                     {/* PH */}
                <TouchableRipple  style={{flex:1}} onPress={() => 
                    // showToast()
                    navigation.navigate("PH")
                }>
                <View style={styles.box} >
           <Image source={require("../assets/payment_history.png")} style={{width:40,height:40,margin:10}}/>
           <Text style={[{margin:5,fontSize:14},styles.colormode(screenmode)]}>Payment History</Text>
           </View>
                </TouchableRipple >
           
            <TouchableRipple  style={{flex:1}} onPress={() => 
                       //showToast()
                       navigation.navigate("Qur")
                }>
                <View style={styles.box}>
           <Image source={require("../assets/queries.png")} style={{width:60,height:60,margin:10}}/>
           <Text style={[{margin:5,fontSize:14},styles.colormode(screenmode)]}>Any Queries</Text>
           </View>
                </TouchableRipple >

                {/* <TouchableOpacity style={{flex:1}} onPress={()=>navigation.navigate("Add")}>
                <View style={styles.box}>
           <Image source={require("../assets/addicons.png")} style={{width:80,height:80,margin:10}}/>
           <Text style={[{margin:10,fontSize:14},styles.colormode(screenmode)]}>Add</Text>
           </View>
                </TouchableOpacity> */}
            </View>
          

            </View>
         <View style={{alignItems:'center',justifyContent:'center',Width:"99%", height:400}}>
            <ScrollView >
                <View style={{marginTop:50}}>
                <Text >{dispdata}</Text>
               
                </View>
             
            </ScrollView>
            </View>
            {/* <MarqueeScroll text="Thanks for SMNS sir for coordination" /> */}
            {/* <View style={styles.bottom}></View> */}
        </View>
        {info?.isConnected?'':
    <Offline />
        }
        </Root>
  )
}

export default Home

const styles = StyleSheet.create({
    colormode:(val)=>({
      color:val=='dark'?'black':'black'
    }),
    heading:(val)=>({
        color:val=='dark'?'white':'black'
      }),
    disp:{
     width:Dimensions.get("window").width,
     margin:5,
     alignItems:'center'
    },
    box:{
        elevation: 2,
        alignItems:'center',
        backgroundColor: 'white',
        margin:3,
        borderRadius:10
    },
    medle:{
    width:'80%',
     alignItems:'center',
     marginLeft:'10%',
     marginTop:40
    },
    iconuser:{
    borderRadius:100,
    width:50,
    height:50,
    },
  
    headi:{
    width:130,
    position:'absolute',
    top:20,
    right:5,
    alignItems:'flex-end'
    },
    image:{ 
        marginTop:Dimensions.get('window').height/1.7, //  bottom:0,
        width:Dimensions.get('window').width,
        position:'absolute',
        justifyContent:'center',
        alignItems:'center',
        opacity:0.1
         },
         image1:{
           marginTop:Dimensions.get('window').height/3,
           margin:Dimensions.get('window').width/5,
           position:'absolute',
           justifyContent:'center',
           alignItems:'center',
           opacity:0.1
           },
           top:{
            backgroundColor:"#6082B6",
            width:120,
            height:120,
            borderRadius:100,
            alignSelf:'flex-start',
            marginTop: -5,
            top:-20,
            right:-40,
            position: 'absolute',
           },
           bottom:{
            backgroundColor:"#6082B6",
            width:200,
            height:200,
            bottom:0,
            // marginBottom:-160,
             left:-80,
            top:Dimensions.get('window').height/1.2,
           borderRadius:100,
             position: 'absolute',
           },
           topline:{
            backgroundColor:"#6082B6",
            width:'100%',
            height:10
           }
})