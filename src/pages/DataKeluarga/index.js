import { StyleSheet, Text, View, Image, Dimensions, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import firestore from '@react-native-firebase/firestore'
import { Back } from '../../assets'

const DataKeluarga = () => {
    const [data, setData] = useState({});
    const navigation = useNavigation();

    const saveData = () => {
        try {
            navigation.navigate('FormKeluarga');
            console.log('berhasil!')
        } catch (error) {
            console.error('Error when navigate', error)
        }
    }

    const deleteData = () => {
        firestore().collection('keluarga').doc('data_keluarga').delete()
            .then(() => {
                console.log('deleted');
            })
    }

    useEffect(() => {
        async function fetch() {
            const Ref = firestore().collection('data_keluarga');
            Ref.onSnapshot(querySnapshot => {
                const data = []
                querySnapshot.forEach((doc) => {
                    const { id_user, name, sex, sts_job, job_place, addres, sts_mar, fam, schl, date_birth } = doc.data()
                    data.push({
                        id: doc.id, id_user,
                        name, sex,
                        sts_job, job_place,
                        addres, sts_mar,
                        fam, schl,
                        date_birth
                    })
                })
                setData(data);
            })
        }
        fetch();
    }, [])

    return (
        <View style={styles.page}>
            <View style={{ padding: 8, borderBottomWidth: 1, borderColor: '#ccc' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.headerText}>Data Keluarga</Text>
                </View>
            </View>
            <View style={{ marginVertical: 8, alignItems: 'center', marginTop: 10, alignSelf: 'center' }}>
                <View style={styles.profile}>
                    <Image source={{ uri: 'https://picsum.photos/id/100/200/300' }} style={styles.image} />
                    {/* <Text style={styles.txtUsername}>{user.displayName}</Text> */}
                    <TouchableOpacity style={styles.btn} onPress={saveData}>
                        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <Text style={styles.textBtn}>Add</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            {/* display data*/}
            <ScrollView showsVerticalScrollIndicator={false}>
                <FlatList
                    scrollEnabled={false}
                    data={data}
                    numColumns={1}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.container} onPress={deleteData}>
                            <View style={{ margin: 2 }}>
                                <View style={styles.StyleText}>
                                    <Text style={styles.text}>NIK</Text>
                                    <Text style={styles.text}>Pendidikan Terakhir</Text>
                                </View>
                                <View style={styles.StyleText}>
                                    <Text style={styles.dsc}>{item.id_user}</Text>
                                    <Text style={styles.dsc}>{item.schl}</Text>
                                </View>
                                <View style={styles.StyleText}>
                                    <Text style={styles.text}>Nama</Text>
                                    <Text style={styles.text}>Tgl Lahir</Text>
                                </View>
                                <View style={styles.StyleText}>
                                    <Text style={styles.dsc}>{item.name}</Text>
                                    <Text style={styles.dsc}>{item.date_birth}</Text>
                                </View>
                                <View style={styles.StyleText}>
                                    <Text style={styles.text}>Gender</Text>
                                    <Text style={styles.text}>Hubungan Keluarga</Text>
                                </View>
                                <View style={styles.StyleText}>
                                    <Text style={styles.dsc}>{item.sex}</Text>
                                    <Text style={styles.dsc}>{item.fam}</Text>
                                </View>
                                <View style={styles.line} />
                                <TouchableOpacity style={styles.containerBtn}>
                                    <Text style={styles.textBtn}>Edit Data</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </ScrollView>
        </View>
    )
}

export default DataKeluarga
const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerText: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        color: '#000',
        textAlign: 'center',
        marginRight: 120,
    },
    container: {
        width: '92%',
        padding: 10,
        backgroundColor: '#f0ffff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginHorizontal: width * 0.06,
        marginVertical: 8,
        alignSelf: 'center'
    },
    dsc: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#000',
        textAlign: 'center'
    },
    text: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#191970',
        textAlign: 'center'
    },
    btn: {
        padding: 6,
        borderRadius: 24,
        width: 100,
        backgroundColor: '#4DACFF'
    },
    textBtn: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
        textAlignVertical: 'center',
        margin: 2
    },
    StyleText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlignVertical: 'auto'
    },
    containerBtn: {
        width: 320,
        padding: 6,
        borderRadius: 8,
        backgroundColor: '#4DACFF',
        marginTop: 8,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    txtUsername: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        margin: 3
    },
    line: {
        backgroundColor: '#ccc',
        height: 1,
        margin: 2,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: 'navy'
    },
})