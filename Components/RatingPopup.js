import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, Button, Modal, TouchableOpacity, Linking,StyleSheet,Image } from 'react-native';
import { Checkbox } from 'react-native-paper';

const RatingPopup = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const [checked, setChecked] = React.useState(false);
  const handleRateNow = () => {
    setModalVisible(false);
    // Open Google Play Store for rating
    Linking.openURL('market://details?id=com.apcdma.clapapp');
  };

  const handleMayBeLater = async() => {
    const ch=await AsyncStorage.getItem("hto");
    if(ch=="15"){
      await AsyncStorage.setItem("hto",1);
    }
    await AsyncStorage.setItem("dshow","false");
    setModalVisible(false);
    // Implement your logic for "Maybe Later"
  };

  const handleDontShowAgain = async() => {
    await AsyncStorage.setItem("dshow","true");
    setModalVisible(false);
    // Implement your logic for "Don't Show Again"
  };

  return (
    <View style={styles.container}>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
            <View style={{alignItems:"center"}}>
            <Image source={require("../images/rating.png")} />
            </View>
           
          <Text style={styles.title}>How would you rate our app?</Text>
          <TouchableOpacity style={styles.button} onPress={handleRateNow}>
            <Text style={styles.buttonText}>Yes, I love it 🤩</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.abutton} onPress={handleMayBeLater}>
            <Text style={styles.abuttonText}>Maybe Later</Text>
          </TouchableOpacity>
          <View style={{flexDirection:"row",justifyContent:"center",alignSelf:"baseline"}}>
          <Checkbox
      status={checked ? 'checked' : 'unchecked'}
      onPress={handleDontShowAgain}
    />
          <Text style={{marginTop:8,marginLeft:-7}}>  Don't show me again</Text>
           
          </View>
        </View>
      </View>
    </Modal>
  </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: 300,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: '#6082B6',
      paddingVertical: 10,
      borderRadius: 30,
      marginBottom: 10,
    },
    abutton: {
        backgroundColor: '#f2f2f2',
        paddingVertical: 10,
        borderRadius: 30,
        marginBottom: 10,
        borderWidth:1
      },
    buttonText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
    abuttonText: {
        color: 'black',
        fontSize: 16,
        textAlign: 'center',
      },
  });
export default RatingPopup;
