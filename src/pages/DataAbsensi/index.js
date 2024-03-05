import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { Edit } from '../../assets';
import { useNavigation } from '@react-navigation/native';

export default function DataAbsensi() {
    const [data, setData] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        async function fetchingData() {
            const tRef = firestore().collection('data_absensi')
            tRef.onSnapshot(qS => {
                const data = []
                qS.forEach((doc) => {
                    const { createdAt, izin, dt_awal_absen, dt_akhir_absen, keterangan, bukti_pendukung } = doc.data()
                    data.push({ id: doc.id, createdAt, izin, dt_awal_absen, dt_akhir_absen, keterangan, bukti_pendukung })
                })
                setData(data)
            })
        }
        fetchingData();
    }, []);

    return (
        <View style={styles.page}>
            <FlatList
                scrollEnabled={false}
                data={data}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.containerData}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 5, marginRight: 5 }}>
                            <Text style={styles.textDate}>{item.createdAt}</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("Klarifikasi")}>
                                <View style={{ marginTop: 4, marginBottom: 4 }}>
                                    <Edit />
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.contain}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 6, marginRight: 6 }}>
                                <Text style={styles.txtTitle}>Permohonan:</Text>
                                <Text style={styles.txtBody}>{item.dt_awal_absen} - <Text style={styles.txtBody}>{item.dt_akhir_absen}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.contain}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 6, marginRight: 6 }}>
                                <Text style={styles.txtTitle}>Izin:</Text>
                                <Text style={styles.txtBody}>{item.izin}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 6, marginRight: 6 }}>
                                <Text style={styles.txtTitle}>Nama File:</Text>
                                <Text style={styles.txtBody}>{item.bukti_pendukung}</Text>
                            </View>
                        </View>
                        <View style={styles.contain}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 6, marginRight: 6 }}>
                                <Text style={styles.txtTitle}>Keterangan:</Text>
                                <Text style={styles.txtKeterangan}>{item.keterangan}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    page: {
        margin: 5
    },
    txtBtn: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 15,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'dodgerblue',
        margin: 2
    },
    contain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 6,
        marginRight: 6,
        marginVertical: 5
    },
    line: {
        width: '97%',
        height: 1,
        backgroundColor: '#ccc',
        alignSelf: 'center',
    },
    containerData: {
        padding: 5,
        backgroundColor: 'whitesmoke',
        width: '98%',
        borderRadius: 10,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        borderWidth: 1,
        borderColor: '#ccc',
        alignSelf: 'center'
    },
    txtTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black',
        textAlignVertical: 'center',
        marginRight: 4
    },
    txtBody: {
        textAlignVertical: 'center',
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: 'black'
    },
    textDate: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        color: 'black',
        textAlign: 'right',
        textAlignVertical: 'center',
        marginLeft: 4,
        marginRight: 6
    },
    txtKeterangan: {
        textAlignVertical: 'center',
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: 'black'
    },
})