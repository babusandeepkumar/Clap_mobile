import { StyleSheet, Text, View,Image,Dimensions,TextInput,ToastAndroid,ScrollView ,useColorScheme} from 'react-native'
import React, { useEffect, useState,useRef } from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
import DropDownPicker from 'react-native-dropdown-picker';
import Config from '../assets/Config.json';
import FastImage from 'react-native-fast-image';
import { useNetInfo } from '@react-native-community/netinfo';
import Offline from './Offline';
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
 
const Search = ({navigation}) => {

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
   if(phno !=''){
    setsub(true);
      fetch(Config.url+'paymentHistory/getHouseHoldIds/mobileNumber/'+phno).then(res=>res.json()).then(json=>{
        setsub(false);
        setfinal(json);
  
       if(json.length>0){
        setrow(1);
        //navigation.navigate('Multi',{data:json,type:seltyp});
       }else{
        showToast();
       }
      }).catch(err=>{console.log(err); setsub(false);})
   
   }else{
    alert("Please enter mobile number");
   }
    }
   async function submit(i){
   
      if(data[i].propertyType=='Residential'){
        const response = await fetch(Config.url + 'paymentHistory/searchPaymentHistoryResidential', {
          method: 'POST',  // Specify the HTTP method as POST
          headers: {
            'Content-Type': 'application/json'  // Set the content type to JSON
          },
          body: JSON.stringify({ slno: data[i].slno })  // Convert the data object to JSON string and include it in the request body
        });
        
         const json = await response.json();
         navigation.navigate("Preview",{data:json,title:data[i].propertyType});
      }else{
        fetch(Config.url + 'paymentHistory/searchPaymentHistoryCommercial', {
          method: 'POST',  
          headers: {
            'Content-Type': 'application/json'  
          },
          body: JSON.stringify({ slno: data[i].slno }) 
          
        }).then(res=>res.json()).then(json=>{
          navigation.navigate("Preview",{data:json,title:data[i].propertyType});
        }).catch(err=>console.log(err))
        
        
      }
     
     // console.log({data:data[i],type:data[i].propertyType})
     // navigation.navigate('Multi',{data:data[i],type:data[i].propertyType});
    }
    const [phno,setphno]=useState('');
    const [nightMode, setNightmode] = useState(false);
    const senddata=data.map((res,i)=>{
      return(
          <View style={styles.card} key={i}>
            
            <Card  onPress={()=>{submit(i)}}>
               <Card.Title 
      title={res.citizenname}
      subtitle={
        <View>
          <Text>{res.doorno},{res.distname}{res.distnameComm} ({res.propertyType})</Text>
        </View>}
      style={styles.card}
      left={(props) => <Avatar.Icon {...props} icon="file" />}
     
    />
    </Card>
             
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
        <Text style={{padding:2,margin:2,marginTop:10,color:'black'}}>Enter Mobile Number</Text>
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
     <Button  mode="contained" style={styles.btn} onPress={() => getall()} disabled={!info?.isConnected}>
    Get Data
  </Button>
     </View>
     
    </View>
    <ScrollView>
    {row!=0?<View style={{marginTop:20}}>{senddata}</View>:''}
    {info?.isConnected?'':
    <Offline />
        }
        </ScrollView>
    </ThemeProvider>
    </Provider>
  )
}

export default Search

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
    card:{
     padding:10,
    //  width:'110%'
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