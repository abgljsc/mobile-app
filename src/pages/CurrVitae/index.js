import { View, Text, StyleSheet, SafeAreaView, Dimensions, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Address, Back, Date_Id, Email, Id, Job, Phone } from '../../assets';
const { width } = Dimensions.get('window');
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'
import { useNavigation } from '@react-navigation/native';

export default function CurrVitae() {
    const [data, setData] = useState('');
    const user = auth().currentUser.displayName;
    const navigation = useNavigation();

    useEffect(() => {
        async function fetch() {
            const ref = firestore().collection('data_pribadi');
            ref.onSnapshot(querySnapshot => {
                const data = []
                querySnapshot.forEach((doc) => {
                    const { usermail, almt, telp, id_npwp, tgl_daftar_npwp, dept } = doc.data()
                    data.push({ id: doc.id, usermail, almt, telp, id_npwp, tgl_daftar_npwp, dept })
                })
                setData(data)
            })
        }
        fetch();
    }, []);

    return (
        <SafeAreaView style={styles.page}>
            <View style={styles.Hcontainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.Htxt}>Curriculum Vitae</Text>
                </View>
            </View>
            {/* Header Cv */}
            <View>
                <View style={styles.header}>
                    <View>
                        <Image
                            source={{ uri: 'https://picsum.photos/id/20/200/200' }}
                            style={styles.imgHeader}
                        />
                        <Image
                            source={{ uri: 'https://picsum.photos/id/100/200/300' }}
                            style={styles.imgProfile}
                        />
                    </View>
                    <View style={{ marginTop: 40, justifyContent: 'center' }}>
                        <Text style={styles.txtName}>{user ? user : 'Guest'}</Text>
                        <View style={{ flexDirection: 'row', alignSelf: 'center', }}>
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, textAlignVertical: 'center' }}>Surabaya</Text>
                            <View style={styles.line} />
                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: 14, textAlignVertical: 'center' }}>Dept. Operasi</Text>
                        </View>
                    </View>
                </View>
            </View>
            {/* Informasi & data pribadi */}
            <View>
                <FlatList
                    scrollEnabled={false}
                    numColumns={1}
                    data={data}
                    renderItem={({ item }) => (
                        <View style={styles.container}>
                            <Text style={styles.txtTitle}>Informasi</Text>
                            <View style={styles.contain}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Email />
                                    <Text style={styles.txtRight}>Email</Text>
                                </View>
                                <Text style={styles.txtDsc}>{item.usermail}</Text>
                            </View>
                            <View style={styles.contain}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Phone />
                                    <Text style={styles.txtRight}>Telepon</Text>
                                </View>
                                <Text style={styles.txtDsc}>{item.telp}</Text>
                            </View>
                            <View style={styles.contain}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Address />
                                    <Text style={styles.txtRight}>Alamat</Text>
                                </View>
                                <Text style={styles.txtDsc}>{item.almt}</Text>
                            </View>
                            <View style={styles.lineH} />
                            <View>
                                <Text style={styles.txtTitle}>Histori Jabatan</Text>
                            </View>
                            <View style={styles.contain}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Job />
                                    <Text style={styles.txtRight}>Staff I</Text>
                                </View>
                                <Text style={styles.txtDsc}>2017 - Sekarang</Text>
                            </View>
                            <View style={styles.contain}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Job />
                                    <Text style={styles.txtRight}>Staff II</Text>
                                </View>
                                <Text style={styles.txtDsc}>2011 - 2016</Text>
                            </View>
                            <View style={styles.lineH} />
                            <View>
                                <Text style={styles.txtTitle}>NPWP</Text>
                            </View>
                            <View style={styles.contain}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Id />
                                    <Text style={styles.txtRight}>No. NPWP</Text>
                                </View>
                                <Text style={styles.txtDsc}>{item.id_npwp}</Text>
                            </View>
                            <View style={styles.contain}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Date_Id />
                                    <Text style={styles.txtRight}>Tgl. NPWP</Text>
                                </View>
                                <Text style={styles.txtDsc}>{item.tgl_daftar_npwp}</Text>
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
    Hcontainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    Htxt: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        alignSelf: 'center',
        marginRight: 110
    },
    contain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 4
    },
    container: {
        width: '95%',
        padding: 6,
        backgroundColor: 'whitesmoke',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        //marginHorizontal: width * 0.08,
        marginVertical: 8,
        alignSelf: 'center',
        borderWidth: 0.7,
        borderColor: 'black'
    },
    txtTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        color: 'black',
        marginLeft: 8,
        textAlignVertical: 'center',
        marginVertical: 6
    },
    line: {
        width: 3,
        height: 14,
        margin: 4,
        alignSelf: 'center',
        backgroundColor: '#ccc'
    },
    lineH: {
        width: '96%',
        height: 2,
        backgroundColor: '#ccc',
        margin: 4,
        alignSelf: 'center'
    },
    header: {
        width: '95%',
        padding: 4,
        backgroundColor: 'whitesmoke',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginVertical: 8,
        //marginHorizontal: width * 0.04,
        alignSelf: 'center',
        borderWidth: 0.7,
        borderColor: 'black'
    },
    txtName: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    txtRight: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: 'black',
        textAlignVertical: 'center',
        margin: 4,
        textAlign: 'center'
    },
    txtDsc: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        color: 'black',
        textAlignVertical: 'center',
        textAlign: 'center',
    },
    imgHeader: {
        width: 365,
        height: 100,
        borderRadius: 4,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'navy'
    },
    imgProfile: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        borderWidth: 1,
        borderColor: 'navy',
        marginHorizontal: width * 0.35,
        alignSelf: 'center',
        position: 'absolute',
        bottom: '-40%'
    },
})