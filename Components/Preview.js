import { StyleSheet, View,TextInput,Text, ScrollView, Dimensions,Image, FlatList,TouchableOpacity } from 'react-native'
import React, { useState,useEffect } from 'react'
import { Appearance,Switch } from 'react-native';
import { Button,Dialog, Portal,Provider,Modal,Card, Avatar,List  } from 'react-native-paper'
import Config from '../assets/Config.json'
import { LogBox } from 'react-native';
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'react-native-crypto-js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Root, Popup,Toast  } from 'react-native-popup-confirm-toast'
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const {width} = Dimensions.get('window');
const frameWidth = width;

LogBox.ignoreLogs(['Warning: Each child in a list should have a unique "key" prop']);

const Preview = ({route}) => {
  const [expanded, setExpanded] = React.useState(true);
const ischange=useIsFocused();
const navigation = useNavigation();

  const handlePress = () => setExpanded(!expanded);
  const [nick,setnick]=useState('');

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
   const data = (route.params.data);
   const type = (route.params.title);
   const [status,setstate]=useState(0);
   const [visible, setVisible] = React.useState(false);
   const [mdata,setmdata]=useState([]);
   const[selcode,setcode]=useState([]);
   const [selmont,setselmont]=useState([]);
 
   const[tempdata,settempdata]=useState([]);
   const[tempdata1,settempdata1]=useState([]);
 var tempyear='';
 const screenmode = Appearance.getColorScheme();

 useEffect(() => {

  if (route && route.params && route.params.status) {
    setstate(route.params.status);
 }else{
  verify();
 }

  var tp='';
  if(type=='Commercial'){
   tp=Config.base_url+'getUCCDetails';
  }else{
   tp=Config.base_url+'getUCDetails';
  }
 
  fetch(tp, {
   method: 'POST',
   headers: {
     Accept: 'application/json',
     'Content-Type': 'application/json',
   },
   body: JSON.stringify({
     slno: data.slno,
   }),
 }).then((response)=>response.json()).then((data)=>{
  // console.log(data)
   const tem1=[];
   const tem2=[];
   data.forEach((ree)=>{
   if(ree.paymentStatus !='SUCCESS'){
   tem1.push(ree.yearMonth);
   item = {}
   item [ree.yearMonth] = ree.transactionId;
   item [ree.transactionId] = ree.amount;
   tem2.push(item);
   }
   });
   settempdata(tem1);
   settempdata1(tem2);
   // console.log(tem1)
   // console.log(tem2)
   setmdata(data);
 
 }).catch((err)=>console.log(err));
 verify();
 }, [route]);
 
 async function verify(){
  try{
  var val=CryptoJS.AES.decrypt(await AsyncStorage.getItem("@fav"),Config.private_key).toString(CryptoJS.enc.Utf8);
  const result=(JSON.parse(val));
  const foundItem = result.find(obj => obj.data.slno === data.slno);

if (foundItem) {
 setstate(1);
 console.log("found");
} else {
  setstate('');
  console.log("Not found");
}
  }catch(e){
    console.log(e);
  }
 } 
 function selectmonth(month) {
  const monthIndex = tempdata.indexOf(month);
  var selectedMonths='';
  if(selmont.indexOf(month)>-1){
     selectedMonths = tempdata.slice(0, monthIndex);
  }else{
     selectedMonths = tempdata.slice(0, monthIndex+1);
  }


  setselmont(selectedMonths);
  
  // Update the code and amount based on selected months
  var tarr = [];
  var amt = 0;
  selectedMonths.forEach((selectedMonth) => {
    const monthIndex = tempdata.indexOf(selectedMonth);
    tarr.push(tempdata1[monthIndex][selectedMonth]);
    var rmn = tempdata1[monthIndex][selectedMonth];
    amt += tempdata1[monthIndex][rmn];
  });

  setcode(tarr);
  setamount(amt);

 }
 
 const [amount,setamount]=useState(0.0);
 var year = Array.from(new Set(mdata.map(({ year }) => year)));
 var temp=[];
 year.forEach((res)=>{
  var ress=mdata.filter((n,i)=>{return n.year==res});
 
  var arr={"year":res,"data":ress};
  temp.push(arr);
 })
 var tempmont=[];

 const modaldata = temp.map((res, index) => {
  const result = res.data.map((item, i) => {
    return (
      <TouchableOpacity
        key={`${index}_${i}`} // Using a combination of the outer and inner index as the key
        style={item.paymentStatus === 'SUCCESS' ? styles.paid : selmont.indexOf(item.yearMonth) > -1 ? styles.select : styles.pending}
        disabled={item.paymentStatus === 'SUCCESS' ? true : false}
        onPress={() => selectmonth(item.yearMonth)}
      >
        <Text style={item.paymentStatus === 'SUCCESS' ? styles.paidc : selmont.indexOf(item.yearMonth) > -1 ? styles.selectc : styles.pendingc}>{item.month}</Text>
      </TouchableOpacity>
    );
  });

  return (
    <View key={index} style={{ flexDirection: 'row' }}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 20, margin: 10, color: '#777' }}>{res.year}</Text>
      </View>
      <View style={styles.frame}>
        {result}
      </View>
    </View>
  );
});

   const showModal = () => setVisible(true);
   const hideModal = () => setVisible(false);



   async function getall(){


    if(selcode.length>0){ 
   var strmon='';
   var strcode='';
   try{
   selcode.map(rr=>{
    strcode+=rr+','
   })
    selmont.map(res=>{
    strmon+=res+','
   })
if(type=='Residential'){
  var resm=(Config.paymentres+data.slno+"/"+strmon.substring(0,strmon.length-1)+"/"+strcode.substring(0,strcode.length-1))
}else{
  var resm=(Config.paymentcom+data.slno+"/"+strmon.substring(0,strmon.length-1)+"/"+strcode.substring(0,strcode.length-1))
}
 
    navigation.replace("Payment",{url:resm});
  }catch(E){
    if(selcode.length !=0){
      if(type=='Residential'){
      var resm=(Config.paymentres+data.slno+"/"+selmont+"/"+selcode)
      }else{
        var resm=(Config.paymentcom+data.slno+"/"+selmont+"/"+selcode)
      }
      navigation.replace("Payment",{url:resm});
    }
  } 

   }else{
    alert("please select month");
   }


  }

  function removeitem(){
if(status==1){
  getall();
}else{
    Popup.show({
        type: 'confirm',
       position: 'top',
        textBody: 'Add this data to the home page !',
        buttonText: 'Ok',
        confirmText: 'Cancel',
        callback: async() => {
          const storedata={"name":type=='Commercial'?data.traderNameComm:data.citizenName,data:data,type:type,status:1};
          const value = await AsyncStorage.getItem('@fav')
                 
          if(value ==null){
            var trm="["+JSON.stringify(storedata)+"]";
            var cdma=CryptoJS.AES.encrypt(trm,Config.private_key).toString();
            await AsyncStorage.setItem('@fav',cdma);
           
          }else{
          var val=CryptoJS.AES.decrypt(await AsyncStorage.getItem("@fav"),Config.private_key).toString(CryptoJS.enc.Utf8);
          const result=(JSON.parse(val));
          const temparr=[];
          if(val.substring(0,1)=='{'){
            temparr.push(result);
            temparr.push(storedata);
            var json=CryptoJS.AES.encrypt(JSON.stringify(temparr),Config.private_key).toString();
            await AsyncStorage.setItem('@fav',json);
          }else{
            result.push(storedata);
            var json=CryptoJS.AES.encrypt(JSON.stringify(result),Config.private_key).toString();
            await AsyncStorage.setItem('@fav',json);
          }
        }
        getall();
            Popup.hide();
        },
        cancelCallback: () => {
          getall();
            Popup.hide();
        },
    });
   }

  }
  const isDisabled = selcode.length > 0;
   const containerStyle = {backgroundColor: 'white', padding: 20,width:'94%',marginLeft:'3%'};
   return (
    <Root>
     <Provider>
       <Portal >
         <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <ScrollView>
          <Text>{modaldata}</Text>
          </ScrollView>
        
        <View style={{justifyContent:'center',alignItems:'center',marginTop:40}}>
        <Button mode="contained" style={{backgroundColor:"#6082B6",width:150,height:45,borderRadius:10,color:'white'}} onPress={hideModal}>Ok</Button>
        </View>
         </Modal>
       </Portal>
 
     <View>
     <FastImage
        style={styles.header}
        source={{
            uri: 'https://allvy.com/CLAP_Mobile/bb.png',
            priority: FastImage.priority.high,
            cache:FastImage.cacheControl.immutable
        }}
        resizeMode={FastImage.resizeMode.stretch}
    />
           <Image  source={require('../assets/splogo.png')} resizeMode={'cover'} style={styles.image1}/>
           <Image  source={require('../assets/bgp.png')} resizeMode={'cover'} style={styles.image}/>
           <ScrollView style={{height:Dimensions.get("window").height/1.6,marginTop:0}}>
    
    <View style={styles.container}>

    <List.Section title="Basic Details">
      <List.Accordion
        title={<Text style={{fontSize:24}}>{data.citizenName}{data.traderNameComm}</Text>}
        description={
          <View>
            <Text style={styles.inptitle(screenmode)}>{data.doorNoComm}{data.doorNo},{data.mandalName}{data.mandalNameComm}</Text>
            <Text style={styles.inptitle(screenmode)}>{data.distName}{data.distNameComm} District</Text>
            <Text style={styles.inptitle(screenmode)}>{data.mobileNumberComm}{data.mobileNumber}</Text>
                     </View>
        }
        left={props => (
          <Avatar.Icon
            {...props}
            icon={() => <Icon name="account" size={40} color={'white'} />}
          />
        )}
      >
        <List.Item title={<Text>Secretariat :- {data.secretariatName}{data.secretariatNameComm}</Text>} />
        <List.Item title={<Text>cluster Id  :- {data.clusterId}{data.clusterIdComm}</Text>} />
      </List.Accordion>
    </List.Section>
    <View style={[styles.title,{flexDirection:"row",alignItems:"center"}]}>
  
  <TouchableOpacity  style={{width:"50%",backgroundColor:"green",marginTop:10,height:50,justifyContent:"center",borderRadius:20,alignItems:"center"}} onPress={()=>setVisible(true)}>
    <Text style={{color:"white"}}> Select Months</Text></TouchableOpacity>
  <Text style={{marginLeft:10,fontSize:20,color:"red"}}>₹ {amount} </Text>
 </View>


   {/* <View style={{marginLeft:10}}>
   <Text  onPress={showModal} style={{fontSize:20}}>
          <Text style={{marginLeft:10}}>Pending Months</Text>   {amount>0?<Text style={{color:'blue'}}><Text style={{color:'red'}}> Rs {amount}</Text> change</Text>:<Text style={{color:'blue'}}>Select here</Text>} </Text>
   </View> */}
        <View style={styles.btnc}>
         <Button  mode="contained" style={styles.btn} onPress={() => removeitem()} disabled={!isDisabled}>
    <Text style={{fontSize:18,fontWeight:'300'}} > Confirm </Text>
   </Button>

   
       </View>


    </View>
 
    </ScrollView>
     </View>
     </Provider>
     </Root>
   )
 }

export default Preview
const styles = StyleSheet.create({
  
  frame: {

    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems:'flex-start',
    justifyContent:'flex-start',
    width: frameWidth/1.5,
    
},
  inptitle:res=>({
    fontSize:14,
    color:res=='dark'?'white':'black',
    margin:5
  }),
  selectc:{
    color:"white"
    },
    pendingc:{
      color:"white"
      },
    paid:{
      backgroundColor:'#ccc',
      margin:3,
      color:'red',
      width:70,
      height:35,
      borderRadius:20,
      justifyContent:"center",
      alignItems:"center"
    },
    select:{
      backgroundColor:'green',
      margin:3,
      color:'white',
      width:70,
      height:35,
      borderRadius:20,
      justifyContent:"center",
      alignItems:"center"
    },
    pending:{
  backgroundColor:'red',
  margin:3,
  width:70,
      height:35,
      borderRadius:20,
      justifyContent:"center",
      alignItems:"center"
    },
  header:{
    width:Dimensions.get("window").width,
    height:Dimensions.get("window").height/3.5,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
    marginTop:-7,
      },
          image:{
            bottom:0,
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
    box:{
      justifyContent:'center',
      alignItems:'center'
    },
    title:{
      marginLeft:14,
      padding:5, 
    },
    inp:res=>({
        borderWidth:1,
        borderColor:"#777",
        borderRadius:10,
        paddingLeft:20,
        width:'90%',
        height:50,
        paddingTop:15,
        color:res=='dark'?'white':'black'
       }),
        btn:{
        marginTop:10,
        backgroundColor:"#6082B6",
        borderRadius:10,
        marginLeft:10,
        width:"90%",
        padding:5,
        marginBottom:10
        },
})