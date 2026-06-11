import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import React from 'react';

type Props = {
  name: string;
  age: number;
};

const Ahihi = (props: Props) => {
  function onPressHello() {
    Alert.alert('Thông báo', `Hello ${props.name}, tuổi: ${props.age}`, [
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);
  }

  return (
    <View style={styles.box1}>
      <Text style={styles.title}>👋 Xin chào!</Text>
      <Text style={styles.text1}>Hello {props.name}</Text>
      <Text style={styles.textAge}>{props.age} tuổi</Text>

      <TouchableOpacity style={styles.button} onPress={onPressHello}>
        <Text style={styles.textButton}>Nhấn vào đây</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Ahihi;

const styles = StyleSheet.create({
  box1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0d1117',
  },
  title: {
    fontSize: 18,
    color: '#f97316',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  text1: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textAge: {
    color: '#fdba74',
    fontSize  : 20,
    marginBottom: 40,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ea580c',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 30,
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  textButton: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
