import { StyleSheet, Text, View,Dimensions,Image,TextInput,TouchableOpacity, ScrollView } from 'react-native'
import React,{useState,useEffect} from 'react'
import {DarkTheme,DefaultTheme,Provider,ThemeProvider,Button} from "react-native-paper";
import DocumentPicker from 'react-native-document-picker';
import FastImage from 'react-native-fast-image'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from '../assets/Config.json'
import axios from "axios";
import Spinner from 'react-native-loading-spinner-overlay';
import { Root, Popup,Toast  } from 'react-native-popup-confirm-toast'
import {Dropdown} from 'react-native-element-dropdown';
const Queries = ({navigation}) => {
  const[token,settoken]=useState('');
  useEffect(() => {
    async function fetchData() {
      try {
       settoken(await AsyncStorage.getItem("token"));
      } catch (e) {
        console.error(e);
      }
    };
  
    fetchData();
  });

  function showres(id){
    Popup.show({
      type: 'success',
     position: 'top',
     title: 'Ticket id :-'+id,
      textBody: 'The ticket was successfully raised !',
      buttonText: 'Ok',
      callback: async() => {
        Popup.hide();
        navigation.navigate('Main');
      }
  });
  }
    const [nightMode, setNightmode] = useState(false);
    const [remarks, setRemarks] = useState('');
    const [phno, setPhno] = useState('');
    const [email, setEmail] = useState('');
    const [singleFile, setSingleFile] = useState(null);
    const [issub,setsub]=useState(false);
    const [dropdown, setDropdown] = useState("PAYMENT");
    const handlePhoneChange = (text) => {
    const trimmedText = text.trim();
    if (trimmedText.includes(' ')) {
      return;
    }
    setPhno(trimmedText);
    };

    const handleEmailChange = (text) => {
      const trimmedText = text.trim();
      if (trimmedText.includes(' ')) {
        return;
      }
      setEmail(trimmedText);
      };


    const uploadImage = async () => {
      if (remarks !== '' && phno !== '' && email !== '' && singleFile !=null) {
        // try {
          setsub(true);
         
          const data = new FormData();
          data.append('mobileNumber', phno);
          data.append('description', remarks);
          data.append('Email', email);
          data.append('title', 'title');
          data.append('ticketType', dropdown);
          // Retrieve the file path and type
          if(singleFile !=null){
            console.log("file not empty")
            const fileToUpload = singleFile;
            data.append('attachment', fileToUpload[0]);
          }
      
          const uploadUrl = Config.url+'contactUs/saveTicket';
          let reqOptions = {
            url: uploadUrl,
            method: "POST",
            data: data,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
          try{
          let response = await axios.request(reqOptions);
        if(response.status==200){
           const result=response.data;
            setsub(false);
            showres(result.ticketId);
        }else{
          console.log("not completed 500");
        }
          }catch(e){
            console.log(`Error ${e}`)
          }
          
       
      } else {
        setsub(false);
        alert('Please fill all the mandatory details');
      }
      setsub(false);
    };
    
    const selectFile = async () => {
      try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
        });
        setSingleFile(res);
      } catch (err) {
        setSingleFile(null);
        if (DocumentPicker.isCancel(err)) {
           console.log('Canceled');
        } else {
          alert('Unknown Error: ' + JSON.stringify(err));
          console.error(err);
        }
      }
    };
    
   
  return (
    <Root>
    <Provider theme={nightMode ? DarkTheme : DefaultTheme}>
    <ThemeProvider theme={nightMode ? DarkTheme : DefaultTheme}>
    <Spinner
          visible={issub}
          textContent={'Uploading...'}
         textStyle={styles.spinnerTextStyle}
        />
        <View style={styles.image1}>
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
            <ScrollView style={{marginLeft:10}}>
            <Image  source={require('../assets/splogo.png')} resizeMode={'cover'} style={styles.image2}/>
            <Image  source={require('../assets/bgp.png')} resizeMode={'cover'} style={styles.image}/>
            <Text style={{margin:10,color:"black",marginTop:20}}>Enter E-mail ID <Text style={{color:'red'}}>*</Text></Text>
          
            <TextInput
        value={email}
        onChangeText={handleEmailChange}
        placeholder="Enter E-mail ID"
        style={{borderWidth:1,borderColor:'#ccc',height:40,alignItems:'center',width:'90%',marginLeft:'2%',borderRadius:7,marginTop:5}}
      />
            <Text style={{margin:10,color:"black",marginTop:20}}>Enter Registered Mobile number <Text style={{color:'red'}}>*</Text></Text>
            <TextInput
        value={phno}
        maxLength={10}
         onChangeText={handlePhoneChange}
        placeholder="Enter Registered Mobile number"
        style={{borderWidth:1,borderColor:'#ccc',height:40,alignItems:'center',width:'90%',marginLeft:'2%',borderRadius:7,marginTop:5}}
      />
            <Text style={styles.buttonTextStyle1}>Select File <Text style={{color:'red',fontSize:12}}>(Max limit of 2 MB only)</Text></Text>
       <TouchableOpacity  onPress={selectFile}  activeOpacity={0.5}>
        <View style={{flexDirection:"row",borderWidth:1,borderColor:'#ccc',height:40,alignItems:'center',width:'90%',marginLeft:'2%',borderRadius:7,marginTop:10}}>
        
    
      <View >
        <Text style={styles.buttonTextStyle}>Upload Relevant Files</Text>
      </View>
      <View >
        <Text>  {singleFile!=null?singleFile[0].name ? singleFile[0].name : '':''}</Text>
      </View>
    </View>
    </TouchableOpacity>
    <Text style={{margin:10,color:"black",marginTop:20}}>Select Ticket Type</Text>

    <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.shadow}
                    data={[{label:"PAYMENT",value:"PAYMENT"},{label:"NON PAYMENT/GENERAL",value:"NONPAYMENT"}]}
                    labelField="label"
                    valueField="value"
                    label="Dropdown"
                    placeholder="Select ticket type ..."
                    value={dropdown}
                    onChange={item => {
                    setDropdown(item.value);
                        //retdata(item.value);
                    }}
                    textError="Error"
                />

            <View style={styles.textAreaContainer} >
              <Text style={{margin:10,color:"black"}}>Enter Remarks <Text style={{color:'red'}}>*</Text></Text>
            <TextInput
        value={remarks}
        onChangeText={setRemarks}
        placeholder="Please Enter Your Queries/Suggestions..... "
        multiline={true}
        numberOfLines={4}
        style={styles.rmk}
      />
    <View style={{margin:5,paddingLeft:5}}><Text style={{color:"red"}}>* Mandatory</Text></View>
      <Button  mode="contained" style={styles.btn}  onPress={uploadImage}>
      Submit
  </Button>
  </View>
</ScrollView>
    </ThemeProvider>
    </Provider>
    </Root>
  )
}

export default Queries

const styles = StyleSheet.create({
  dropdown:{
    borderWidth:1,
    borderColor:'#ccc',
    height:40,
    alignItems:'center',
    width:'90%',
    marginLeft:'2%',
    borderRadius:7,
    marginTop:5,
    paddingLeft:5,
  },
  btn:{
    width:"90%",
    padding:5,
    marginTop:10,
    backgroundColor:"#6082B6",
    fontSize:30,
    borderRadius:10,
    marginLeft:10,
    marginBottom:20
    },
  buttonTextStyle1:{
   marginTop:10,
   paddingLeft:10,
   color:'black'
  },
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop: 16,
    marginLeft: 35,
    marginRight: 35,
    textAlign: 'center',
  },
  buttonTextStyle:{
   marginLeft:10,
   
  },
    rmk:{
    borderWidth:1,
    borderColor:'#d5d5d5',
    width:'90%',
    marginLeft:10
    },
    header:{
        width:Dimensions.get("window").width,
        height:Dimensions.get("window").height/3.5,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
        marginTop:-7
          },
          image:{
           bottom:0,
           width:Dimensions.get('window').width,
           position:'absolute',
           justifyContent:'center',
           alignItems:'center',
           opacity:0.2
            },
            image2:{
              marginTop:Dimensions.get('window').height/3,
              margin:Dimensions.get('window').width/4,
              position:'absolute',
              justifyContent:'center',
              alignItems:'center',
              opacity:0.2
              },
})