import { StyleSheet, Text, View } from 'react-native'
import React,{useState} from 'react'
import { WebView } from 'react-native-webview';
import { ProgressBar} from 'react-native-paper';
import Config from '../assets/Config.json'
const Receipt = ({route,navigation}) => {
    const data = (route.params.data);
    url=Config.url+"payment-receiptcash/"+data+"/null";
    const [progress, setProgress] = useState(0);
    const [disp,setdisp]=useState(true);
  return (
    <View style={{flex:1}}>
      {disp?<ProgressBar style={{ margin:10}} progress={progress} color="#00BCD4" />:''}
      <WebView source={{ uri:url  }}
        scrollEnabled={true}
        scalesPageToFit={false}
          onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
          onLoad={()=>setdisp(false)}
        />
    </View>
   
  )
}

export default Receipt

const styles = StyleSheet.create({})