import React, { useState,useEffect } from 'react';
import { View, Text, FlatList,StyleSheet,useColorScheme,ScrollView, Dimensions,ActivityIndicator } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { NavigationContainer,useIsFocused } from '@react-navigation/native';
import CryptoJS from 'react-native-crypto-js';
import {  Avatar, Card, IconButton } from 'react-native-paper';
import Config from '../assets/Config.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';


const PaymentHistory = ({navigation}) => {
  const isVisible = useIsFocused();
const [data,setdata]=useState([]);
const [token,settoken]=useState('');
const [disbtn,setbtn]=useState(false);
const [visible,setVisible]=useState(false);
  useEffect(() => {
    setdist([]);
    async function fetchData() {
      try {
        if(await AsyncStorage.getItem("@fav")!='' && await AsyncStorage.getItem("@fav") !=null){
        const val = CryptoJS.AES.decrypt(await AsyncStorage.getItem("@fav"), Config.private_key).toString(CryptoJS.enc.Utf8);
       settoken(await AsyncStorage.getItem("token"));
        const res = JSON.parse(val);
        setdata(res);
        res.forEach((ele,i) => {
          var json={label:ele.name,value:i}
          setdist(dis=>[...dis,json]);
        });
      }
      } catch (e) {
        console.error(e);
      }
    };
  
    fetchData();
  }, [isVisible]);

  async function retdata(i) {
    setPayments([])
    setbtn(false);
    setVisible(true);
    var sl = data[i].data.slno;
    var tc='';
    if(data[i].type=='Residential'){
      tc=Config.url + 'searchPaymentHistroyUlb';
    }else{
      tc=Config.url + 'searchPaymentHistoryCommercial';
    }
  
    let headersList = {
      "Authorization": "Bearer "+token,
      "Content-Type": "application/json"
    };
  
    let bodyContent = JSON.stringify({
      "slno": sl
    });
  
    let response = await fetch(tc, {
      method: "POST",
      body: bodyContent,
      headers: headersList
    });
  
    let responseData = await response.json();
    setVisible(false);
    setPayments(responseData);
    setbtn(true);
  }
  
function nextd(id,sts){
  if(sts=="SUCCESS"){
  navigation.navigate("rcpt",{data:id});
  }
}



  function getFullMonthName(shortMonthName) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    const index = months.findIndex(month => month.slice(0, 3) === shortMonthName);
    if (index !== -1) {
      return months[index];
    } else {
      return null; // Invalid short month name
    }
  }
  const [payments,setPayments]=useState([]);
  const [dist,setdist]=useState([]);
  const [dropdown, setDropdown] = useState(null);
  const [dist1,setdist1]=useState([{label:"last 12 months",value:12},{label:"last 24 months",value:24},{label:"All Data",value:100}]);
const [month,setmonth]=useState(6);
  return (
    <View>
    
       <ScrollView >
       <View style={styles.gen}>

       <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.shadow}
                    data={dist}
                    search
                    searchPlaceholder="Search"
                    labelField="label"
                    valueField="value"
                    label="Dropdown"
                    placeholder="Select User ..."
                    value={dropdown}
                    onChange={item => {
                    //setDropdown(item.value);
                        retdata(item.value);
                    }}
                    textError="Error"
                />

      </View>
      {dist.length>0?'':
<View style={{alignItems:"center",marginTop:10}}>
  <Text style={{fontSize:20,color:"blue"}}>Add at least one record to the home page</Text>
</View>
}
{visible?
<View style={{ justifyContent: "center", alignItems: "center",marginTop:200 }}>
  <ActivityIndicator color={"green"} size={"large"} />
  <Text style={{ marginTop: 10 }}>Please wait fetching data .... </Text>
</View>
:""}

      <View style={{ padding: 10 }}>
        {disbtn?
      <Dropdown
      style={styles.dropdown1}
      containerStyle={styles.shadow}
      data={dist1}
      search
      searchPlaceholder="Search"
      labelField="label"
      valueField="value"
      label="Dropdown"
      placeholder="Filter data ..."
      value={dropdown}
      onChange={item => {
        setmonth(item.value);
      }}
      textError="Error"
  />
        :''}
 
  {payments.slice(0, month).map((payment,i) => (
    // payment.paymentStatus=="SUCCESS"?
    
    <View style={{margin:6}} key={i}>
      <Card  onPress={() => nextd(payment.txnId,payment.paymentStatus)}>
  <Card.Title
    title={<Text>{payment.txnId}</Text>}
    subtitle={
      <View>
        <Text>{payment.year}-{getFullMonthName(payment.month)} <Text style={{ color: 'black' }}>Status :</Text><Text style={{ textTransform: 'capitalize', color: payment.paymentStatus == "SUCCESS" ? 'green' : 'red' }}>{payment.paymentStatus}</Text></Text>
      </View>
    }
    left={(props) => <Avatar.Icon {...props} icon="download" backgroundColor="skyblue" color="black" />}
    right={() => <View><Text style={{ color: 'red', left: -10 }}>₹ {payment.amount}</Text></View>} 
  />
</Card>

    </View>
   // :''
  ))}

</View>
</ScrollView>
</View>
  );
};
const styles=StyleSheet.create({
  dropdown: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginTop: 5,
    marginBottom:10
},

dropdown1: {
  borderBottomColor: 'gray',
  borderBottomWidth: 0.5,
  marginTop: 5,
  marginBottom:10,
  width:150
},

  gen:{
    width:'80%',
    marginTop:40,
    marginLeft:'10%',
    margin:5
    }
})
export default PaymentHistory;
