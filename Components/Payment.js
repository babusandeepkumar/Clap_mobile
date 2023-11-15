import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import React,{useEffect, useState} from 'react'
import { WebView } from 'react-native-webview';
import { ProgressBar} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons'
const Payment = ({route,navigation}) => {
    const url = (route.params.url);
    const [progress, setProgress] = useState(0);
    const [disp,setdisp]=useState(true);

    const dataReceived = route.params?.data;
  
    useEffect(() => {
      // Override the default back button behavior
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity onPress={handleBackPress}>
            <Icon name="arrow-back" size={30} color="black" style={{padding:10}}/>
          </TouchableOpacity>
        ),
      });
    }, []);
  
    const handleBackPress = () => {
      // Send data back to the previous screen
      navigation.navigate("Main");
      // You can also use navigation.navigate to specify the previous screen if needed
    };
  return (
    <View style={{flex:1}}>
      {disp?<ProgressBar style={{ margin:10}} progress={progress} color="#00BCD4" />:''}
      <WebView source={{ uri:url  }}
        scrollEnabled={true}
        scalesPageToFit={false}
        // onMessage={event => {
        //     const { data } = event.nativeEvent;
        //     if(data==1){
        //         alert("Request Sent successfully");
        //         navigation.navigate('Home');
        //     }
        //   }}
          onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
          onLoad={()=>setdisp(false)}
        />
    </View>
   
  )
}

export default Payment

const styles = StyleSheet.create({})