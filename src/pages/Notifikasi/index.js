import { StyleSheet, Text, View, TextInput, TouchableOpacity, } from 'react-native'
import React, { useState } from 'react';
import { Back, Search } from '../../assets';
import { ListNotifikasi } from '../../components';
import { useNavigation } from '@react-navigation/native';

const Notifikasi = () => {
    const data = require('../../assets/data.json');
    const navigation = useNavigation();
    const [input, setInput] = useState("");

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.text}>Notification</Text>
                </View>
            </View>
            <View style={styles.containerFilter}>
                <View style={{ marginLeft: 4, marginRight: 2 }}>
                    <Search />
                </View>
                <TextInput
                    placeholder="Search"
                    clearButtonMode="always"
                    value={input}
                    onChangeText={(text) => setInput(text)}
                    style={styles.input}
                />
            </View>

            <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Soon...</Text>
            </View>

            {/* <ListNotifikasi
                data={data}
                input={input}
                setInput={setInput}
            /> */}
        </View>
    )
}

export default Notifikasi;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        //backgroundColor: '#FFFFFF',
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    text: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 140
    },
    input: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        flex: 1,
        textAlignVertical: 'center'
    },
    containerFilter: {
        marginTop: 10,
        padding: 2,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        width: '95%',
        backgroundColor: 'whitesmoke',
        marginHorizontal: 10,
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
})