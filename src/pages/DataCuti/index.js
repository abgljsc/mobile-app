import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Cln } from '../../assets';
import firestore from '@react-native-firebase/firestore'

export default function DataCuti() {
    const [data, setData] = useState('');

    useEffect(() => {
        async function fetchData() {
            const userRef = firestore().collection('cutiData');
            userRef.onSnapshot(querySnapshot => {
                const data = []
                querySnapshot.forEach((doc) => {
                    const { tgl_awal, tgl_akhir, keterangan, izin, createDate, bukti_pendukung } = doc.data()
                    data.push({ id: doc.id, tgl_awal, tgl_akhir, keterangan, izin, createDate, bukti_pendukung })
                })
                setData(data)
            })
        }
        fetchData();
    }, []);

    return (
        <View style={{ marginBottom: 5, marginTop: 5 }}>
            <View style={styles.page}>
                <FlatList
                    scrollEnabled={false}
                    data={data}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.container}>
                            <View>
                                <Text style={styles.txtDate}>{item.createDate}</Text>
                            </View>
                            <View style={styles.line} />
                            <View style={styles.contain}>
                                <View style={styles.containItemCalendar}>
                                    <Text style={styles.txtTitle}>Permohonan:</Text>
                                    <Text style={styles.txtBody}>{item.tgl_awal} - <Text style={styles.txtBody}>{item.tgl_akhir}</Text></Text>
                                </View>
                            </View>
                            <View style={styles.contain}>
                                <View style={styles.containItemCalendar}>
                                    <Text style={styles.txtTitle}>Awal:</Text>
                                    <Text style={styles.txtTanggal}>{item.tgl_awal}</Text>
                                </View>
                                <View style={styles.containItemCalendar}>
                                    <Text style={styles.txtTitle}>Akhir:</Text>
                                    <Text style={styles.txtTanggal}>{item.tgl_akhir}</Text>
                                </View>
                            </View>
                            <View style={styles.contain}>
                                <View style={styles.containItemText}>
                                    <Text style={styles.txtTitle}>Izin:</Text>
                                    <Text style={styles.txtBody}>{item.izin}</Text>
                                </View>
                                <View style={styles.containItemText}>
                                    <Text style={styles.txtTitle}>Nama File:</Text>
                                    <Text style={styles.txtBody}>{item.bukti_pendukung}</Text>
                                </View>
                            </View>
                            <View style={styles.contain}>
                                <View style={styles.containItemText}>
                                    <Text style={styles.txtTitle}>Keterangan:</Text>
                                    <Text style={styles.txtBody}>{item.keterangan}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    container: {
        padding: 8,
        width: '98%',
        backgroundColor: 'whitesmoke',
        borderRadius: 10,
        borderWidth: 0.4,
        borderColor: '#212121',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 8,
        alignSelf: 'center',
    },
    contain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    txtDate: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: 'black',
        textAlign: 'right',
        textAlignVertical: 'center',
        marginLeft: 4,
        marginRight: 4
    },
    containItemCalendar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 4,
        marginRight: 4,
        marginVertical: 5
    },
    containItemText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 4,
        marginRight: 4,
        marginVertical: 5
    },
    txtTanggal: {
        fontFamily: 'Poppins-Medium',
        fontSize: 16,
        color: 'black',
        textAlignVertical: 'center',
        marginLeft: 3
    },
    txtTitle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 17,
        color: 'black',
        textAlignVertical: 'center'
    },
    txtBody: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        color: '#212121',
        textAlignVertical: 'center',
        marginLeft: 3,
    },
    line: {
        width: '100%',
        height: 0.9,
        backgroundColor: '#212121',
        alignItems: 'center',
        marginTop: 2,
        marginBottom: 2
    },
})