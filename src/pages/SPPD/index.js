import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Back, Chevron, NewFile, Search, } from '../../assets';
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native';

export default function SPPD() {
    const [data, setData] = useState('');
    const [input, setInput] = useState('');

    const NewData = () => {
        navigation.navigate('Form');
        console.log('Press');
    };

    const navigation = useNavigation();

    useEffect(() => {
        async function fetch() {
            const dtRef = firestore().collection('surat_dinas');
            dtRef.onSnapshot(qS => {
                const data = []
                qS.forEach((doc) => {
                    const { dasar, kota, tgl_berangkat, tgl_kembali, status, } = doc.data()
                    data.push({
                        id: doc.id, dasar, kota, tgl_berangkat, tgl_kembali, status,
                    })
                })
                setData(data)
            })
        }
        fetch();
    }, []);

    return (
        <SafeAreaView style={styles.page}>
            <View style={styles.headerContain}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.textContainer}>Surat Dinas</Text>
                </View>
            </View>
            {/* search */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.searchContainer}>
                    <View style={{ marginLeft: 5, marginRight: 3 }}>
                        <Search />
                    </View>
                    <TextInput
                        placeholder="Search"
                        value={input}
                        onChangeText={(text) => setInput(text)}
                        style={styles.input}
                    />
                </View>
                <TouchableOpacity style={styles.btn} onPress={NewData}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', top: 8 }}>
                        <NewFile />
                        <Text style={styles.textBtn}>Add</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* data */}
            <View style={{ flexDirection: 'column', marginTop: 6, }}>
                <FlatList
                    scrollEnabled={false}
                    data={data}
                    numColumns={1}
                    renderItem={({ item }) => (
                        <View style={styles.container}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <Text style={styles.txtDasar}>{item.dasar}</Text>
                                <TouchableOpacity style={{ flexDirection: 'row' }}>
                                    <Text style={styles.txtDtl}>Detail</Text>
                                    <Chevron />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.line} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                                    <Text style={styles.txtTitle}>Tujuan</Text>
                                    <Text style={styles.txtDeskripsi}>{item.kota}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                                    <Text style={styles.txtTitle}>Tgl berangkat</Text>
                                    <Text style={styles.txtDeskripsi}>{item.tgl_berangkat}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', alignSelf: 'center' }}>
                                    <Text style={styles.txtTitle}>Tgl kembali</Text>
                                    <Text style={styles.txtDeskripsi}>{item.tgl_kembali}</Text>
                                </View>
                                <View style={{ flexDirection: 'column', }}>
                                    <Text style={styles.txtTitle}>Status</Text>
                                    <Text style={styles.txtDeskripsi}>{item.status}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerContain: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    textContainer: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        marginRight: 150
    },
    status: {
        padding: 2,
        width: 60,
        borderWidth: 1,
        borderColor: 'sandybrown',
        borderRadius: 20
    },
    txtStatus: {
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'grey',
        fontSize: 10
    },
    searchContainer: {
        height: 45,
        borderColor: '#212121',
        borderWidth: 0.5,
        borderRadius: 10,
        width: '65%',
        backgroundColor: 'whitesmoke',
        marginVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    },
    btn: {
        width: 90,
        height: 45,
        backgroundColor: 'deepskyblue',
        borderRadius: 10,
        alignSelf: 'center',
        marginRight: 16,
    },
    textBtn: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        alignSelf: 'center',
        textAlignVertical: 'center',
        color: 'white',
        // marginLeft: 3
    },
    container: {
        padding: 18,
        width: '96%',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: '#212121',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 10,
        alignSelf: 'center',
    },
    txtTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: 'dimgray',
        textAlignVertical: 'center',
        textAlign: 'left',
    },
    txtDasar: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black',
        textAlign: 'left',
        textAlignVertical: 'center',
    },
    txtDeskripsi: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: 'black',
        textAlign: 'left',
        textAlignVertical: 'center',
    },
    line: {
        width: '105%',
        height: 1,
        alignItems: 'center',
        backgroundColor: '#ccc',
        alignSelf: 'center',
        margin: 3
    },
    txtDtl: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'deepskyblue'
    }
})