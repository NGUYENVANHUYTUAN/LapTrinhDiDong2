import { StyleSheet, Text, View, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import MyButton from './MyButton' // ✅ Import button riêng

const HelloState = () => {
    const [name, setName] = useState('');   // ✅ khởi tạo chuỗi rỗng
    const [age, setAge] = useState('');     // ✅ sửa từ useState() → useState('')

    // ✅ Thêm hàm xử lý khi bấm nút
    const handlePrint = () => {
        Alert.alert('Kết quả', `Tên: ${name}\nTuổi: ${age}`);
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerText}>
                <Text style={styles.helloText}>HelloState</Text>
            </View>

            <View style={styles.containerInput}>
                {/* ✅ Thêm value và onChangeText để kết nối state */}
                <TextInput
                    style={styles.textInput}
                    placeholder='nhập tên của bạn'
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.textInput}
                    placeholder='nhập tuổi của bạn'
                    value={age}
                    onChangeText={setAge}
                    keyboardType='numeric'   // ✅ bàn phím số cho trường tuổi
                />
            </View>

            {/* ✅ Sử dụng button riêng */}
            <MyButton title="in kết quả" onPress={handlePrint} />
        </View>
    )
}

export default HelloState

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // justifyContent: 'center' // căng theo chiều chính chiều dọc
    },
    containerText: {
        alignItems: 'center'
    },
    containerInput: {},
    helloText: {
        color: '#f01010',
        fontSize: 40,
    },
    textInput: {
        color: '#079cf9',
        fontSize: 30,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: '#f305e3',
        marginTop: 5,
        width: 400,
        paddingHorizontal: 8,   // ✅ thêm padding để text không dính sát viền
    }
})
