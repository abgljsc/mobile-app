import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Dimensions, FlatList, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { Back } from '../../assets'
import { useNavigation } from '@react-navigation/native'

const DataPendidikan = () => {
    const [data, setData] = useState([]);
    const user = auth().currentUser;
    const navigation = useNavigation();

    // fetch data collection data_keluarga
    useEffect(() => {
        async function fetch() {
            const userRef = firestore().collection('pendidikanRecord')
            userRef.onSnapshot(querySnapshot => {
                const data = []
                querySnapshot.forEach((doc) => {
                    const { school, schl_name, year, city, } = doc.data()
                    data.push({ id: doc.id, school, schl_name, year, city })
                })
                setData(data)
            })
        }
        fetch();
    }, []);

    const deleteData = () => {
        firestore().collection('pendidikan').doc('data_pendidikan').delete()
            .then(() => {
                ToastAndroid.show('Data dihapus!', ToastAndroid.SHORT);
                console.log('deleted');
            })
    }

    return (
        <View style={styles.page}>
            <View style={styles.contain}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.textStyles}>Data Pendidikan</Text>
                </View>
            </View>
            <View>
                <View style={{ marginVertical: 8, alignItems: 'center', }}>
                    <Image source={{ uri: 'https://picsum.photos/id/100/200/300' }} style={styles.profile} />
                    {/* <Text style={styles.textTitle}>{user.displayName}</Text> */}
                    <View style={{ marginTop: 5 }}>
                        <TouchableOpacity style={styles.containerBtn} onPress={() => navigation.navigate('FormPendidikan')} >
                            <Text style={styles.text}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <FlatList
                        scrollEnabled={false}
                        data={data}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.container} onPress={deleteData}>
                                <View style={styles.StyleText}>
                                    <Text style={styles.textTitle}>Pendidikan</Text>
                                    <Text style={styles.textTitle}>Tahun Lulus</Text>
                                </View>
                                <View style={styles.StyleText}>
                                    <Text style={styles.textDesc}>{item.school}</Text>
                                    <Text style={styles.textDesc}>{item.year}</Text>
                                </View>
                                <View style={styles.StyleText}>
                                    <Text style={styles.textTitle}>Nama Sekolah</Text>
                                    <Text style={styles.textTitle}>Status</Text>
                                </View>
                                <View style={styles.StyleText}>
                                    <Text style={styles.textDesc}>{item.schl_name}</Text>
                                    <Text style={styles.textDesc}>Lulus</Text>
                                </View>
                                <View style={styles.StyleText}>
                                    <Text style={styles.textTitle}>Kota</Text>
                                </View>
                                <View style={styles.StyleText}>
                                    <Text style={styles.textDesc}>{item.city}</Text>
                                </View>
                                <View style={styles.line} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity style={styles.btnEdit} >
                                        <Text style={styles.text}>Edit Data</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </ScrollView>
            </View>
        </View>
    )
}

export default DataPendidikan
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    profile: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        borderWidth: 1,
        borderColor: 'navy'
    },
    container: {
        width: "95%",
        padding: 10,
        backgroundColor: '#FFF',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginVertical: 8,
        alignSelf: 'center'

    },
    textTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        color: '#243763',
        textAlign: 'center',
        textAlignVertical: 'center',
        margin: 2
    },
    textDesc: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#000'
    },
    containerBtn: {
        width: 100,
        padding: 8,
        borderRadius: 24,
        backgroundColor: '#4DACFF'
    },
    StyleText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 4,
        marginRight: 4,
    },
    text: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#FFF',
        textAlign: 'center'
    },
    line: {
        backgroundColor: 'black',
        height: 1,
        width: '96%',
        margin: 2,
    },
    contain: {
        padding: 8,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    textStyles: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        marginRight: 120
    },
    btnEdit: {
        width: '95%',
        padding: 6,
        borderRadius: 8,
        backgroundColor: '#4DACFF',
        marginTop: 8,
        alignItems: 'center'
    }
})