import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
    FlatList,
    Alert,
    PermissionsAndroid,
    Platform
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore'
import { Back } from '../../assets';

const DataPersonal = () => {
    const navigation = useNavigation();
    // const user = firebase.auth().currentUser;
    const [data, setData] = useState('');

    useEffect(() => {
        async function fetch() {
            const ref = firestore().collection('data_pribadi');
            ref.onSnapshot(querySnapshot => {
                const data = []
                querySnapshot.forEach((doc) => {
                    const { name, no_nrp, usermail, tgl_lahir, jenis_kelamin, almt, sts_pegwai, id_npwp, tgl_daftar_npwp, no_rekening, nama_bank, telp } = doc.data()
                    data.push({
                        id: doc.id, name, no_nrp,
                        usermail, tgl_lahir, jenis_kelamin,
                        almt, sts_pegwai, id_npwp,
                        tgl_daftar_npwp, no_rekening, nama_bank, telp
                    })
                })
                setData(data)
            })
        }
        fetch();
    }, []);

    // request permission
    const requestExternalPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Permission',
                        message: 'Apps needs Permission',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
            }
            return false;
        } else return true;
    }

    // ubah foto profil
    const _changeImage = async () => {
        const result = await ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            maxWidth: 200,
            maxHeight: 200,
            quality: 1,
        });
        let isStoragePermitted = await requestExternalPermission();
        if (isStoragePermitted) {
            ImagePicker.launchImageLibrary(result, (response) => {
                console.log('Response = ', response);

                if (response.didCancel) {
                    Alert.alert('User Cancelled image picker');
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    Alert.alert('Camera not unavailable');
                    return;
                } else if (response.errorCode == 'permission') {
                    Alert.alert('Permission not satisfied');
                    return;
                } else if (response.errorCode == 'others') {
                    Alert.alert(response.errorMessage);
                    return;
                }
                console.log('base64 -> ', response.base64);
                console.log('uri -> ', response.uri);
                console.log('width -> ', response.width);
                console.log('height -> ', response.height);
                console.log('fileSize -> ', response.fileSize);
                console.log('type -> ', response.type);
                console.log('fileName -> ', response.fileName);
                setImage(response);
            });
        }
    }

    return (
        <View style={styles.page}>
            <View style={{ padding: 8, borderBottomWidth: 1, borderBlockColor: '#ccc' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.textContainer}>Data Personal</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ marginVertical: 8, alignItems: 'center', }}>
                    <View style={styles.profile}>
                        <Image
                            source={{ uri: 'https://picsum.photos/id/100/200/300' }} style={styles.image}
                        />
                        <TouchableOpacity style={styles.button} onPress={_changeImage}>
                            <Text style={styles.txtButton}>Ubah Foto</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <FlatList
                    scrollEnabled={false}
                    data={data}
                    numColumns={1}
                    renderItem={({ item }) => (
                        <View style={styles.container}>
                            <Text style={styles.titleContainer}>Data Pribadi</Text>
                            <View style={styles.line}></View>
                            <View style={styles.StyleText}>
                                <Text style={styles.text}>Nama</Text>
                                <Text style={styles.text}>Tgl.Lahir</Text>
                            </View>
                            <View style={styles.StyleText}>
                                <Text style={styles.dsc}>{item.name}</Text>
                                <Text style={styles.dsc}>{item.tgl_lahir}</Text>
                            </View>
                            <View style={styles.StyleText}>
                                <Text style={styles.text}>NRP</Text>
                                <Text style={styles.text}>Alamat</Text>
                            </View>
                            <View style={styles.StyleText}>
                                <Text style={styles.dsc}>{item.no_nrp}</Text>
                                <Text style={styles.dsc}>{item.almt}</Text>
                            </View>
                            <View style={styles.StyleText}>
                                <Text style={styles.text}>Email</Text>
                                <Text style={styles.text}>Status Pegawai</Text>
                            </View>
                            <View style={styles.StyleText}>
                                <Text style={styles.dsc}>{item.usermail}</Text>
                                <Text style={styles.dsc}>{item.sts_pegwai}</Text>
                            </View>
                            <View style={styles.StyleText}>
                                <Text style={styles.text}>Jenis Kelamin</Text>
                                <Text style={styles.text}>NPWP</Text>
                            </View>
                            <View style={styles.StyleText}>
                                <Text style={styles.dsc}>{item.jenis_kelamin}</Text>
                                <Text style={styles.dsc}>{item.id_npwp}</Text>
                            </View>
                            <View style={styles.StyleText}>
                                <Text style={styles.text}>Bank</Text>
                                <Text style={styles.text}>No. Rekening</Text>
                            </View>
                            <View style={styles.StyleText}>
                                <Text style={styles.dsc}>{item.nama_bank}</Text>
                                <Text style={styles.dsc}>{item.no_rekening}</Text>
                            </View>
                            <View style={styles.StyleText}>
                                <Text style={styles.text}>Tgl. daftar NPWP</Text>
                                <Text style={styles.text}>No. Telp</Text>
                            </View>
                            <View style={styles.StyleText}>
                                <Text style={styles.dsc}>{item.tgl_daftar_npwp}</Text>
                                <Text style={styles.dsc}>{item.telp}</Text>
                            </View>
                            <View style={styles.line} />
                            <TouchableOpacity style={styles.containerBtn} onPress={() => navigation.navigate('Edit')}>
                                <Text style={styles.textContainerbtn}>Edit Data</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            </ScrollView>
        </View>
    )
}

export default DataPersonal
const width = Dimensions.get('window').width

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        borderWidth: 1,
        borderColor: 'navy',
        marginBottom: 6
    },
    container: {
        width: '90%',
        padding: 10,
        backgroundColor: 'whitesmoke',
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginHorizontal: width * 0.05,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    titleContainer: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 20,
        color: '#000',
        marginHorizontal: 2
    },
    profile: {
        alignItems: 'center',
        marginVertical: 4,
    },
    containerBtn: {
        backgroundColor: '#4DACFF',
        borderRadius: 20,
        padding: 4,
        margin: 5
    },
    textContainerbtn: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 15,
        color: '#FFF',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    StyleText: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 2
    },
    text: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#483d8b'
    },
    dsc: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: '#000',
    },
    textContainer: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        marginRight: 130
    },
    txt: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 20,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black'
    },
    button: {
        backgroundColor: "deepskyblue",
        width: 100,
        padding: 8,
        borderRadius: 24,
        marginTop: 2,
        alignSelf: 'center'
    },
    txtButton: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 15,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: '#fff'
    },
    line: {
        backgroundColor: '#000',
        height: 1,
        alignItems: 'center',
        margin: 4,
        width: 325
    },
})