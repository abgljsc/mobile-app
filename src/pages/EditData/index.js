import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Image,
    Platform,
    PermissionsAndroid,
    ToastAndroid,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Alert
} from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native';
import { Back } from '../../assets';

export default function EditData() {
    const navigation = useNavigation();
    const [image, setImage] = useState({});
    const [nama, setNama] = useState("");
    const [name, setName] = useState("");
    const [no_rek, setNo_Rek] = useState("");
    const [no_telp, setNo_Telp] = useState("");
    const [nrp, setNRP] = useState("");
    const [email, setEmail] = useState("");
    const [alamat, setAlamat] = useState("");
    const [gender, setGender] = useState("");
    const [npwp, setNPWP] = useState("");
    const [bank, setBank] = useState("");
    const [status_pegawai] = useState("Aktif");
    const [date, setDate] = useState(new Date(Date.now()));
    const [picker, setPicker] = useState(false);
    const [tgl_npwp, setTgl_Npwp] = useState(new Date(Date.now()));
    const [isPicker, setIsPicker] = useState(false);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };

    //tanggal Lahir
    const showPick = () => {
        setPicker(true);
    };
    const Onchange = (event, value) => {
        setDate(value);
        if (Platform.OS === 'android') {
            setPicker(false);
        }
    };

    //tanggal NPWP
    const isShowPicker = () => {
        setIsPicker(true);
    };
    const onChange = (event, value) => {
        setTgl_Npwp(value);
        if (Platform.OS === 'android') {
            setIsPicker(false);
        }
    };

    const Gender = [
        'Laki-Laki',
        'Perempuan',
    ];
    const _bank = [
        'Bank BCA',
        'Bank BRI',
        'Bank ABC',
    ];

    //update data
    const update_data = () => {
        try {
            firestore().collection('data_pribadi').doc('pdMz8So6jthpKFn4jtiG').update({
                name: nama,
                no_nrp: nrp,
                usermail: email,
                tgl_lahir: date.toLocaleDateString("id", options),
                jenis_kelamin: gender,
                almt: alamat,
                sts_pegwai: status_pegawai,
                id_npwp: npwp,
                tgl_daftar_npwp: tgl_npwp.toLocaleDateString("id", options),
                no_rekening: no_rek,
                nama_rek: name,
                nama_bank: bank,
                telp: no_telp
            })
                .then(() => {
                    ToastAndroid.show('Berhasil melakukan update data!', ToastAndroid.SHORT);
                    console.log('Update data');
                })
        } catch (err) {
            ToastAndroid.show('Error:' + err, ToastAndroid.LONG);
            console.error('Error: ', err);
        }
    }

    const requestExternalPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Permission',
                        message: 'Apps needs Permission',
                        buttonPositive: 'Oke',
                        buttonNegative: 'Cancel'
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                ToastAndroid.show('Permission error', ToastAndroid.SHORT);
            }
            return false;
        } else return true;
    }

    const _changeImage = async () => {
        const result = await ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            maxWidth: 100,
            maxHeight: 150,
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
                console.log('base64 ->', response.base64);
                console.log('uri ->', response.uri);
                console.log('fileName -> ', response.fileName);
                setImage(response);
            });
        }
    }

    const cancelData = () => {
        Alert.alert(
            "Cancel",
            "Are you sure?",
            [
                { text: 'Yes', onPress: navigation.goBack },
                { text: 'No' }
            ]
        );
        console.log('Cancel');
    }

    return (
        <SafeAreaView style={styles.page}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.txtStyls}>Edit Data</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ alignSelf: 'center', marginTop: 6, marginBottom: 4 }}>
                    <Image
                        source={{ uri: 'https://picsum.photos/200/300' }}
                        style={styles.imageStyle}
                    />
                    <TouchableOpacity style={styles.btn} onPress={_changeImage}>
                        <Text style={styles.txtButton}>Ubah Foto</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 8 }}>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Nama</Text>
                        <TextInput
                            placeholder='Nama'
                            style={styles.input}
                            value={nama}
                            onChangeText={(text) => setNama(text)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>NRP</Text>
                        <TextInput
                            placeholder='NRP'
                            style={styles.input}
                            value={nrp}
                            onChangeText={(text) => setNRP(text)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Email</Text>
                        <TextInput
                            placeholder='Email'
                            style={styles.input}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>No. Telp</Text>
                        <TextInput
                            placeholder='Nomor Telp'
                            style={styles.input}
                            value={no_telp}
                            onChangeText={(text) => setNo_Telp(text)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Tanggal{'\n'}Lahir</Text>
                        <View>
                            {!picker && (
                                <TouchableOpacity style={styles.cntnrDate} onPress={showPick}>
                                    <Text style={styles.txtDate}>{date.toLocaleDateString("id", options)}</Text>
                                </TouchableOpacity>)}
                            {picker && (
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    display={'default'}
                                    onChange={Onchange}
                                    style={styles.date}
                                />)}
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Gender</Text>
                        <SelectDropdown
                            data={Gender}
                            defaultButtonText={'Pilih Gender'}
                            onSelect={(selectedItem, index) => setGender(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(item, index) => { return item; }}
                            buttonStyle={styles.containerSelect}
                            buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Alamat</Text>
                        <TextInput
                            placeholder='Alamat'
                            style={styles.input}
                            value={alamat}
                            onChangeText={(text) => setAlamat(text)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Status{'\n'}Pegawai</Text>
                        <SelectDropdown
                            data={status_pegawai}
                            defaultButtonText={'Aktif'}
                            disabled
                            buttonStyle={styles.containerSelect}
                            buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>NPWP</Text>
                        <TextInput
                            placeholder='NPWP'
                            style={styles.input}
                            value={npwp}
                            onChangeText={(text) => setNPWP(text)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Bank</Text>
                        <SelectDropdown
                            data={_bank}
                            defaultButtonText={'Pilih Bank'}
                            onSelect={(selectedItem, index) => setBank(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(item, index) => { return item; }}
                            buttonStyle={styles.containerSelect}
                            buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                            dropdownStyle={{ width: 185, padding: 4 }}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>No. Rek</Text>
                        <TextInput
                            placeholder='No. Rekening'
                            style={styles.input}
                            value={no_rek}
                            onChangeText={(text) => setNo_Rek(text)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Nama</Text>
                        <TextInput
                            placeholder='Nama Rekening'
                            style={styles.input}
                            value={name}
                            onChangeText={(text) => setName(text)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Tanggal{'\n'}NPWP</Text>
                        <View>
                            {!isPicker && (
                                <TouchableOpacity style={styles.cntnrDate} onPress={isShowPicker}>
                                    <Text style={styles.txtDate}>{tgl_npwp.toLocaleDateString("id", options)}</Text>
                                </TouchableOpacity>)}
                            {isPicker && (
                                <DateTimePicker
                                    value={tgl_npwp}
                                    mode={'date'}
                                    display={'default'}
                                    onChange={onChange}
                                    style={styles.date}
                                />)}
                        </View>
                    </View>
                </View>
                {/* button */}
                <View style={{ justifyContent: 'center' }}>
                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 10, marginVertical: 20 }}>
                        <TouchableOpacity style={styles.btn} onPress={update_data}>
                            <Text style={styles.txtSave}>Simpan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancel} onPress={cancelData}>
                            <Text style={styles.txtCancel}>Batal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    container: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    txtStyls: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 150
    },
    txtButton: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    btn: {
        padding: 6,
        width: 100,
        backgroundColor: 'deepskyblue',
        borderRadius: 20,
        marginTop: 4,
        alignSelf: 'center'
    },
    input: {
        padding: 8,
        width: '80%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: 'whitesmoke'
    },
    txtTitle: {
        textAlign: 'left',
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black',
    },
    contain: {
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 8,
        marginRight: 8
    },
    txtDate: {
        fontSize: 14,
        color: 'black',
        fontFamily: 'Inter-Medium',
        textAlignVertical: 'center'
    },
    date: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    txtSave: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
    },
    txtCancel: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
    },
    cancel: {
        padding: 6,
        width: 100,
        borderRadius: 20,
        backgroundColor: 'lightgray'
    },
    containerSelect: {
        width: '80%',
        height: 50,
        backgroundColor: 'whitesmoke',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8
    },
    cntnrDate: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: 'whitesmoke',
        width: 300,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    imageStyle: {
        height: 100,
        width: 100,
        borderRadius: 100 / 2,
        borderWidth: 1.5,
        borderColor: 'navy',
    },
})