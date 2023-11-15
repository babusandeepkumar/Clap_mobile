import { StyleSheet, Text, View,Dimensions,Image } from 'react-native'
import React,{useState} from 'react'
import {DarkTheme,DefaultTheme,Provider,ThemeProvider} from "react-native-paper";
import FastImage from 'react-native-fast-image'

const Genformate = (props) => {
    const [nightMode, setNightmode] = useState(false);
  return (
    <Provider theme={nightMode ? DarkTheme : DefaultTheme}>
    <ThemeProvider theme={nightMode ? DarkTheme : DefaultTheme}>
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
            <Image  source={require('../assets/splogo.png')} resizeMode={'cover'} style={styles.image2}/>
            <Image  source={require('../assets/bgp.png')} resizeMode={'cover'} style={styles.image}/>
           <Text >{props.name}</Text>
    </ThemeProvider>
    </Provider>
  )
}

export default Genformate

const styles = StyleSheet.create({
    header:{
        width:Dimensions.get("window").width,
        height:Dimensions.get("window").height/3.5,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
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