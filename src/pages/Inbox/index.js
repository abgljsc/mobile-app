import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react';
import { ListInbox } from '../../components';
import { Search } from '../../assets';
import firestore from '@react-native-firebase/firestore'

export default function Inbox() {
    const dt = firestore().collection('lembur');
    const [input, setInput] = useState("");

    return (
        <View style={styles.page}>
            <View style={styles.SearchContainer}>
                <View style={{ marginLeft: 2, marginRight: 1 }}>
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
                <Text style={{ fontSize: 18 }}>Soon...</Text>
            </View>
            {/* <ListInbox
                data={dt}
                input={input}
                setInput={setInput}
            /> */}
        </View>
    )
}


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    containerData: {
        padding: 8,
        width: '98%',
        backgroundColor: 'whitesmoke',
        borderWidth: 1,
        borderColor: '#ccc',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 7,
    },
    text: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    input: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        flex: 1
    },
    SearchContainer: {
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
    }

});