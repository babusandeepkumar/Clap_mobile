import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Offline = () => {
  return (
    <View style={[styles.container, { backgroundColor: '#FF0000' }]}>
      <Text style={[styles.text,{textAlign:'center',color:'white'}]}>You are in Offline</Text>
    </View>
  )
}

export default Offline

const styles = StyleSheet.create({
    container: {
        height: 30,
        width:'100%',
        alignItems: 'center',
        bottom:0,
        position:'absolute',
        justifyContent: 'center',
        
      },
      text: {
        color: '#FFFFFF',
        fontWeight: 'bold',
      },
})