import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MarqueeScroll = ({ text }) => {
  const { colors } = useTheme();
  const scrollX = useRef(new Animated.Value(0)).current;
  const iconSize = 24;

  useEffect(() => {
    const animation = Animated.timing(scrollX, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: true,
    });
  
    const loopedAnimation = Animated.loop(animation);
  
    loopedAnimation.start();
  
    return () => {
      loopedAnimation.stop();
    };
  }, []);

  const translateX = scrollX.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -text.length * 10],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateX }] }}>
        <Text style={styles.text}><Icon name="new-box" size={iconSize} color={colors.primary} /> {text}</Text>
      </Animated.View>
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    position:'absolute',
    top:Dimensions.get('window').height/1.3
  },
  text: {
    fontSize: 16,
  },
});

export default MarqueeScroll;
