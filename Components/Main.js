import { View, Text } from 'react-native'
import React from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Home from './Home';
import Tickets from './Tickets';
import Faq from './Faq';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Tab = createMaterialBottomTabNavigator();
export default function Main() {
  return (
    <Tab.Navigator initialRouteName="Home"   
    activeColor="black"
  inactiveColor="black"
  barStyle={{ backgroundColor: 'transparent' }}
  
    >
      <Tab.Screen name="Home" component={Home} options={{
        tabBarIcon:({ focused })=>(<Icon name="home" size={30}  style={{ color: focused ? '#6082B6' : "gray"}} />),
      }}/>
      <Tab.Screen name="Tickets" component={Tickets} options={{
        tabBarIcon:({focused})=>(<Icon name="confirmation-number" size={30} style={{ color: focused ? '#6082B6' : "gray"}}/>)
      }}/>
      <Tab.Screen name="FAQ's" component={Faq} options={{
        tabBarIcon:({focused})=>(<Icon name="help" size={30}  style={{ color: focused ? '#6082B6' : "gray"}}/>)
      }}/>
    </Tab.Navigator>
  )
}