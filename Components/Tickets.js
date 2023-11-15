import { StyleSheet, Text, View,Image,Dimensions,TextInput,ToastAndroid,ScrollView ,useColorScheme} from 'react-native'
import React, { useEffect, useState,useRef } from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
import DropDownPicker from 'react-native-dropdown-picker';
import Config from '../assets/Config.json';
import FastImage from 'react-native-fast-image';
import { useNetInfo } from '@react-native-community/netinfo';
import Offline from './Offline';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Appbar,
    DarkTheme,
    DefaultTheme,
    Provider,
    Surface,
    Card,
    Button,
    Checkbox,
    Dialog, Portal,
    Avatar,
    ThemeProvider,
  } from "react-native-paper";
 
const Tickets = ({navigation}) => {

  const showToast = () => {
    ToastAndroid.show('No records found in this mobile number ....', ToastAndroid.SHORT);
  };

  const inputRef = useRef(null);
  const info=useNetInfo();
  
  const [issub,setsub]=useState(false);
  const[row,setrow]=useState(0);
const [data,setfinal]=useState([]);
   
   async function getall(){
    inputRef.current?.blur();
   if(phno !='' || ticket !=''){ 
    setsub(true);
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "contactUsId": ticket,
  "mobileNumber":phno
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw
};
fetch(Config.url+"contactUs/searchTicket", requestOptions)
  .then(response => response.json())
  .then(res =>{
    if(res.status!=404 && res.length>0){
      //console.log(res)
      setrow(1);
      setfinal(res);
     }else{
      showToast();
     }
      setsub(false);
  })
  .catch(error =>{console.log('error', error);setsub(false);});

   
   }else{
    alert("Please enter mobile number or ticket id");
   }
    }
    const [phno,setphno]=useState('');
    const [ticket,setticket]=useState('');
    const [nightMode, setNightmode] = useState(false);
    const senddata=data.map((res,i)=>{
      return(
        <View style={styles.card} key={i}>
        <View style={styles.cardContent}>
          <View style={styles.avatarContainer}>
            <Avatar.Icon icon="file" />
          </View>
          <View style={styles.textContainer}>
            <Text style={{fontSize:18}}>{res.email}</Text>
            <Text>{res.description}</Text>
          </View>
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, res.status === "PENDING" ? styles.pendingStatus : styles.completedStatus]}>
              {res.status}
            </Text>
          </View>
        </View>
      </View>
      
      )
     })
  
  return (
    <Provider theme={nightMode ? DarkTheme : DefaultTheme}>
    <ThemeProvider theme={nightMode ? DarkTheme : DefaultTheme}>
    <Spinner
          visible={issub}
          textContent={'Loading...'}
         textStyle={styles.spinnerTextStyle}
        />

        <ScrollView>
        <View style={styles.image2}>
         <FastImage
        style={styles.header}
        source={{
            uri: 'https://allvy.com/CLAP_Mobile/bb.png',
            priority: FastImage.priority.high,
            cache:FastImage.cacheControl.immutable
        }}
        resizeMode={FastImage.resizeMode.stretch}
    />
            </View>
            <Image  source={require('../assets/splogo.png')} resizeMode={'cover'} style={styles.image1}/>
      <Image  source={require('../assets/bgp.png')} resizeMode={'cover'} style={styles.image}/>
    <View style={styles.text}>
    <View style={styles.gen}>
        <Text style={{padding:2,margin:2,marginTop:10,color:'black'}}>Enter Ticket Id</Text>
        <TextInput onChangeText={setticket}
        value={ticket}
        style={styles.inp}
        placeholder="Enter here ..."
        ref={inputRef}
        >
            
        </TextInput>
      </View>
    
     <View style={{margin:0,alignItems:"center"}}>
      <Text style={{fontSize:20}}>Or</Text>
     </View>
      <View style={styles.gen}>
        <Text style={{padding:2,margin:2,color:'black'}}>Enter Mobile Number</Text>
        <TextInput onChangeText={setphno}
        value={phno}
        style={styles.inp}
        placeholder="Enter here ..."
        keyboardType='numeric'
        maxLength={10}
        ref={inputRef}
        >
            
        </TextInput>
      </View>
   
     <View  style={styles.gen}>
     <Button  mode="contained" style={styles.btn} 
     onPress={() => getall()} disabled={!info?.isConnected}>
    Get Status
  </Button>
     </View>
     
    </View>
   
    {row!=0?<View style={{marginTop:20}}>{senddata}</View>:''}
    {info?.isConnected?'':
    <Offline />
        }
        </ScrollView>
    </ThemeProvider>
    </Provider>
  )
}

export default Tickets

const styles = StyleSheet.create({
    spldrop:(schem)=>({
      backgroundColor:"transparent",
      borderWidth:1,
      borderColor:"#777",
      zIndex:10,
      borderRadius:10,
     // color:(schem==='dark')?'white':'black',
     color:"red"
    }),
    card: {
      backgroundColor: "white",
      borderRadius: 10,
      elevation: 3, // For Android shadow
      shadowOffset: { width: 1, height: 1 }, // For iOS shadow
      shadowColor: "#333",
      shadowOpacity: 0.3,
      marginVertical: 10,
      marginHorizontal: 20,
      padding: 15,
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    avatarContainer: {
      justifyContent: "center",
    },
    textContainer: {
      flex: 1,
      marginLeft: 10,
    },
    statusContainer: {
      justifyContent: "center",
    },
    statusText: {
      fontWeight: "bold",
    },
    pendingStatus: {
      color: "red",
    },
    completedStatus: {
      color: "green",
    },
    btn:{
        width:"100%",
        padding:5,
        marginTop:10,
        backgroundColor:"#6082B6",
        borderRadius:0,
        fontSize:30,
        borderRadius:10,
      
        },
       header:{
     width:Dimensions.get("window").width,
     height:Dimensions.get("window").height/3.5,
     borderBottomLeftRadius:20,
     borderBottomRightRadius:20,
       },
    text:{
     width:'80%',
     marginLeft:'10%',
    },
    inp:{
     borderWidth:1,
     borderColor:"#777",
     borderRadius:10,
     paddingLeft:20
    },
    gen:{
    margin:5
    },
    image:{
        bottom:10,
        marginTop:200,
       width:Dimensions.get('window').width,
       position:'absolute',
       justifyContent:'center',
       alignItems:'center',
       opacity:0.1
        },
        image1:{
          marginTop:Dimensions.get('window').height/3,
          margin:Dimensions.get('window').width/4,
          position:'absolute',
          justifyContent:'center',
          alignItems:'center',
          opacity:0.1
          },
})