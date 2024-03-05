import { StyleSheet, Text, View, FlatList, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import { Approve, Reject } from '../../assets';
import firestore from '@react-native-firebase/firestore'

function approveDataValidation() {
    const dataRef = firestore().collection('lembur').doc('');
    return dataRef.update({
        status: 'Approve'
    });
}

function rejectDataValidation() {
    const dataRef = firestore().collection('lembur').doc('');
    return dataRef.update({
        status: 'Reject'
    });
}

const ListInbox = ({ data, input, setInput, onPress, active }) => {
    const navigation = useNavigation();
    const [dt, setDt] = useState('');

    const approveBtn = () => {
        approveDataValidation().then(() => {
            console.log('disetujui');
            ToastAndroid.show('Approved', ToastAndroid.SHORT);
        })
            .catch((er) => {
                console.log(`${er}`);
                ToastAndroid.show(`${er}`, ToastAndroid.LONG);
            })
    }

    const rejectBtn = () => {
        rejectDataValidation().then(() => {
            console.log('ditolak');
            ToastAndroid.show('Rejected', ToastAndroid.SHORT);
        })
            .catch((err) => {
                console.log(`${err}`);
                ToastAndroid.show(`${err}`, ToastAndroid.LONG);
            })
    }

    useEffect(() => {
        async function fetch() {
            const Ref = firestore().collection('lembur');
            Ref.onSnapshot(qS => {
                const dt = []
                qS.forEach((doc) => {
                    const { data, depart, tgl, no_spkl, } = doc.data()
                    dt.push({ id: doc.id, data, depart, tgl, no_spkl, })
                })
                setDt(dt)
            })
        }
        fetch();
    }, []);

    return (
        <View style={{ marginTop: 2 }}>
            <FlatList
                data={dt}
                numColumns={1}
                renderItem={({ item }) => {
                    if (input === "") {
                        return (
                            <View style={styles.Item}>
                                <TouchableOpacity style={styles.Container(active)}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.textTitle}>{item.data}</Text>
                                    </View>
                                    {/* <Text>{item.no_spkl}</Text> */}
                                    <Text style={styles.textDetail}>Lorem ipsum dolor sit amet consectetur.{'\n'}Varius justo proin quam nunc phasellus bibendum nisl sed.</Text>
                                    <Text style={styles.textTime}>{item.tgl}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }

                    if (item.data.toLowerCase().includes(input.toLowerCase())) {
                        return (
                            <View style={styles.Item}>
                                <TouchableOpacity style={styles.Container(active)} >
                                    <Text style={styles.textTitle}>{item.data}</Text>
                                    <Text style={styles.textDetail}>Lorem ipsum dolor sit amet consectetur.{'\n'}Varius justo proin quam nunc phasellus bibendum nisl sed.</Text>
                                    <Text style={styles.textTime}>{item.tgl}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                }} showsVerticalScrollIndicator={false} />
        </View>
    )
}

export default ListInbox

const styles = StyleSheet.create({
    text: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: 'grey',
        marginLeft: 10
    },
    Item: {
        marginVertical: 5,
        alignItems: 'center',
    },
    textTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Inter-Medium',
        color: 'black'
    },
    textDetail: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        textAlignVertical: 'center'
    },
    textTime: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        textAlign: 'right',
        textAlignVertical: 'center'
    },
    Container: (active) => ({
        padding: 8,
        borderRadius: 8,
        width: '95%',
        backgroundColor: active ? 'whitesmoke' : 'white',
        borderColor: '#ccc',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.20,
        shadowRadius: 4.65,
        elevation: 7,
        alignSelf: 'center'
    }),
    btn: {
        padding: 4,
        width: '30%',
        backgroundColor: 'deepskyblue',
        borderRadius: 6,
    },
})