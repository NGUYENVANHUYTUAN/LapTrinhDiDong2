import React from 'react'
import { StyleSheet, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native'

interface MyButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const MyButton = ({ title, onPress, style, textStyle }: MyButtonProps) => {
  return (
    <TouchableOpacity style={[styles.containerButton, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

export default MyButton

const styles = StyleSheet.create({
  containerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18bfe0',
    width: 200,
    borderRadius: 10,
    marginTop: 5,
    paddingVertical: 10, // padding cho nút đẹp và dễ bấm hơn
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000', // Màu chữ rõ ràng
  }
})
