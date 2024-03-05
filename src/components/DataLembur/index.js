import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Depart, IconUDefault, } from '../../assets';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';

const DataLembur = () => {
    const [data, setData] = useState([]);
    // const user = auth().currentUser;

    useEffect(() => {
        async function fetch() {
            const dataRef = firestore().collection('lembur');
            dataRef.onSnapshot(querySnapshot => {
                const data = []
                querySnapshot.forEach((doc) => {
                    const { depart, jns_lembur, no_spkl, user, tgl, status, } = doc.data()
                    data.push({
                        id: doc.id, user,
                        depart, no_spkl,
                        jns_lembur, tgl, status,
                    })
                })
                setData(data)
            })
        }
        fetch();
    }, []);

    return (
        <View style={{ marginTop: 5, marginBottom: 5 }}>
            <FlatList
                scrollEnabled={false}
                data={data}
                numColumns={1}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.cntnr}>
                        <View style={styles.name}>
                            {/* <Text style={styles.label}>{user.displayName}</Text> */}
                            <Text style={styles.txtDate}>{item.tgl}</Text>
                        </View>
                        <View style={{ width: '98%', height: 2, backgroundColor: '#ccc', }} />
                        <View style={styles.name}>
                            <View style={{ flexDirection: 'row', marginLeft: 4, marginRight: 4, }}>
                                <IconUDefault />
                                <Text style={styles.txt}>{item.user}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 4, marginRight: 4, }}>
                                <Text style={styles.label}>No. SPKL</Text>
                                <Text style={styles.txt}>{item.no_spkl}</Text>
                            </View>
                        </View>
                        <View style={styles.name}>
                            <View style={{ flexDirection: 'row', marginLeft: 4, marginRight: 4 }}>
                                <Depart />
                                <Text style={styles.txt}>{item.depart}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginLeft: 4, marginRight: 4 }}>
                                <Text style={styles.label}>Target</Text>
                                <Text style={styles.txt}>{item.jns_lembur}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default DataLembur

const styles = StyleSheet.create({
    cntnr: {
        padding: 6,
        width: '96%',
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: "#000",
        borderWidth: 0.4,
        borderColor: '#212121',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 8,
        alignSelf: 'center',
    },
    name: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3,
        marginLeft: 4,
        marginRight: 4
    },
    txt: {
        fontFamily: 'Inter-Medium',
        fontSize: 15,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginLeft: 4,
        marginRight: 4
    },
    label: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: 'black',
        textAlign: 'right',
        textAlignVertical: 'center',
        marginLeft: 4,
        marginRight: 4
    },
    txtStatus: (active) => ({
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: active ? 'green' : 'red',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginLeft: 4,
        marginRight: 4
    }),
    txtDate: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        color: 'black',
        textAlign: 'right',
        textAlignVertical: 'center',
        marginLeft: 4,
        marginRight: 4
    },
})