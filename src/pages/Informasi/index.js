import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Back } from '../../assets'
import { useNavigation } from '@react-navigation/native'

export default function Informasi() {
    const navigation = useNavigation();

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.txt}>Informasi</Text>
                </View>
            </View>
            <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                <Text>Soon...</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white'
    },
    txt: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        marginRight: 150
    },
})