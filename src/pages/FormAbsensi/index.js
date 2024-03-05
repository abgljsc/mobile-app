import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, ScrollView, ToastAndroid, Alert } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'

const { width } = Dimensions.get('window');

export default function FormAbsensi({ onPress }) {
    const navigation = useNavigation();
    const [input, setInput] = useState("");
    const [detail, setDetail] = useState("");
    const [atasan, setAtasan] = useState("");
    const [bukan, setBukan] = useState("");
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [date, setDate] = useState(new Date(Date.now()));
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const [dateA, setDateA] = useState(false);
    const [tanggalAwal, setTanggalAwal] = useState(new Date(Date.now()));
    const [dateL, setDateL] = useState(false);
    const [tanggalAkhir, setTanggalAkhir] = useState(new Date(Date.now()));
    const [today] = useState(new Date(Date.now()));
    const [file, setFile] = useState('');
    const [transferred, setTransferred] = useState('');

    const izin = [
        'Cuti Sakit',
        'Cuti Tahunan',
        'Izin',
        'Lainnya'
    ];
    const atasan_langsung = [
        'atasan 1',
        'atasan 2',
        'atasan 3',
        'atasan 4',
        'atasan 5'
    ];
    const bkn_atasan = [
        'Atasan 1',
        'Atasan 2',
        'Atasan 3',
        'Atasan 4',
        'Atasan 5'
    ];

    // picker tanggal permohonan
    const showPicker = () => {
        setIsPickerShow(true);
    };

    // picker tanggal awal
    const showDateAwal = () => {
        setDateA(true);
    }

    // picker tanggal akhir
    const showDateAkhir = () => {
        setDateL(true);
    }

    // change tanggal permohonan
    const onChange = (event, value) => {
        setDate(value);
        if (Platform.OS === 'android') {
            setIsPickerShow(false);
        }
    };

    // change tanggal awal
    const onChangeTanggalAwal = (event, value) => {
        setTanggalAwal(value);
        if (Platform.OS === 'android') {
            setDateA(false);
        }
    };

    // change tanggal akhir
    const onChangeTanggalAkhir = (event, value) => {
        setTanggalAkhir(value);
        if (Platform.OS === 'android') {
            setDateL(false);
        }
    };

    // save data
    const SaveData = async () => {
        firestore().collection('data_absensi').add({
            dt_permohonan: date.toLocaleDateString("id", options),
            dt_awal_absen: tanggalAwal.toLocaleDateString("id", options),
            dt_akhir_absen: tanggalAkhir.toLocaleDateString("id", options),
            keterangan: detail,
            izin: input,
            atasan_lgsng: atasan,
            atasan_tdk_lgsng: bukan,
            createdAt: today.toLocaleDateString("id", options)
        })
            .then(() => {
                console.log('Data added!');
                ToastAndroid.show('Data berhasil disimpan!', ToastAndroid.SHORT);
                // navigation.navigate("Main");
            });
    }

    // save data form + file/img to firestore & storage
    const savingData = async () => {
        try {
            const docRef = await firestore().collection('data_absensi').add({
                // dt_permohonan: date.toLocaleDateString("id", options),
                dt_awal_absen: tanggalAwal.toLocaleDateString("id", options),
                dt_akhir_absen: tanggalAkhir.toLocaleDateString("id", options),
                keterangan: detail,
                izin: input,
                atasan_lgsng: atasan,
                atasan_tdk_lgsng: bukan,
                bukti_pendukung: file.name,
                createdAt: today.toLocaleDateString("id", options)
            });
            const docId = docRef.id;

            if (!file) {
                Alert.alert('Alert!', 'Please pick the file!');
                return;
            }
            if (file) {
                console.log(file.fileCopyUri.replace("files://", ""));
                console.log(file.name);
                const ref = storage().ref(`/myfiles/absensi/${docId}/${file.name}`);
                const task = ref.putFile(file.fileCopyUri.replace("files://", ""));

                task.on("state_changed", (taskSnapshot) => {
                    const progress = Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
                    setTransferred(progress);
                    console.log(progress, '%');
                })
                task.then(() => {
                    Alert.alert('Success', 'File uploaded to the bucket');
                    setTransferred('');
                })
                setFile({});
            }
            Alert.alert('Success', 'Data berhasil disimpan!');
            console.log('Success');
        } catch (error) {
            Alert.alert('Error: ', error);
            console.warn('Error: ', error);
        }
    }

    const cancel = () => {
        Alert.alert(
            'Cancel',
            'Are you sure?',
            [
                {
                    text: 'Yes',
                    onPress: navigation.goBack
                },
                {
                    text: 'No',
                }
            ],
        );
        console.log('Pressed!');
    }

    // choose file 
    const ch_file = async () => {
        try {
            const result = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
                copyTo: 'cachesDirectory'
            });
            console.log('res : ' + JSON.stringify(result));
            console.log('File Name : ' + result.name);
            setFile(result);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                ToastAndroid.show('Batal memilih file!', ToastAndroid.SHORT);
                console.log('Cancel');
            } else {
                ToastAndroid.show('Unknown Error: ' + JSON.stringify, ToastAndroid.SHORT);
                console.log('Error', JSON.stringify);
                throw err;
            }
        }
    }

    // upload file
    const uploadFile = () => {
        if (!file) {
            Alert.alert("Alert!", "Please pick the file!");
            return;
        }
        try {
            console.log(file.fileCopyUri.replace("files://", ""));
            console.log(file.name);
            const reference = storage().ref(`/myfiles/absensi/${file.name}`);
            const task = reference.putFile(file.fileCopyUri.replace("files://", ""));
            task.on("state_changed", (taskSnapshot) => {
                const progress = Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
                setTransferred(progress);
                console.log(progress, '%');
            });
            task.then(() => {
                Alert.alert("Success", "Image uploaded to the bucket!");
                setTransferred("");
            });
            setFile({});
        } catch (error) {
            Alert.alert(error.message);
            console.error(error.message);
            return;
        }
    }

    return (
        <View style={styles.page}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Jenis{'\n'}Izin/Absen</Text>
                        <SelectDropdown
                            data={izin}
                            defaultButtonText={'Pilih Jenis Izin'}
                            onSelect={(selectedItem, index) => setInput(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(Item, index) => { return Item; }}
                            buttonStyle={styles.cntSelect}
                            buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                            dropdownIconPosition={'left'}
                            dropdownStyle={{ padding: 6, width: 155, borderRadius: 4 }}
                        />
                    </View>
                    {/* <View style={styles.contain}>
                        <Text style={styles.textTitle}>Tanggal{'\n'}Permohonan</Text>
                        <View style={styles.containerDate}>
                            {!isPickerShow && (
                                <TouchableOpacity onPress={showPicker}>
                                    <Text style={styles.textDate}>{date.toLocaleDateString("id", options)}</Text>
                                </TouchableOpacity>
                            )}
                            {isPickerShow && (
                                <DateTimePicker
                                    value={date}
                                    mode={'date'}
                                    display={'calendar'}
                                    onChange={onChange}
                                    style={styles.date} />)}
                        </View>
                    </View> */}
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Tanggal Awal</Text>
                        <View style={styles.containerDateL}>
                            {!dateA && (
                                <TouchableOpacity onPress={showDateAwal}>
                                    <Text style={styles.textDate}>{tanggalAwal.toLocaleDateString("id", options)}</Text>
                                </TouchableOpacity>
                            )}
                            {dateA && (
                                <DateTimePicker
                                    value={tanggalAwal}
                                    mode={'date'}
                                    display={'calendar'}
                                    onChange={onChangeTanggalAwal}
                                    style={styles.date} />)}
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Tanggal Akhir</Text>
                        <View style={styles.containerDateM}>
                            {!dateL && (
                                <TouchableOpacity onPress={showDateAkhir}>
                                    <Text style={styles.textDate}>{tanggalAkhir.toLocaleDateString("id", options)}</Text>
                                </TouchableOpacity>
                            )}
                            {dateL && (
                                <DateTimePicker
                                    value={tanggalAkhir}
                                    mode={'date'}
                                    display={'calendar'}
                                    onChange={onChangeTanggalAkhir}
                                    style={styles.date} />)}
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Keterangan</Text>
                        <View style={styles.input}>
                            <TextInput
                                placeholder="Keterangan"
                                value={detail}
                                onChangeText={(text) => setDetail(text)}
                                style={{ fontSize: 15, fontFamily: 'Poppins-Regular', }}
                            />
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>File</Text>
                        <View style={{ flexDirection: 'row', marginLeft: 90, marginHorizontal: width * 0.35 }}>
                            <TouchableOpacity style={styles.btnFile} onPress={ch_file}>
                                <Text style={styles.txtUploadFile}>Choose</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.txtChooseFile}>{file.name ? file.name : 'Choose File'}</Text>
                                {/* <Text style={{ textAlign: 'center', textAlignVertical: 'center', margin: 4 }}>{file.name ? file.name : ''}</Text> */}
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Atasan{'\n'}Langsung</Text>
                        <SelectDropdown
                            data={atasan_langsung}
                            defaultButtonText={'Pilih Atasan'}
                            onSelect={(selectedItem, index) => setAtasan(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(Item, index) => { return Item; }}
                            buttonStyle={styles.cntSelect}
                            buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                            dropdownIconPosition={'left'}
                            dropdownStyle={{ padding: 6, width: 155, borderRadius: 4 }}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Atasan Tidak{'\n'}Langsung</Text>
                        <SelectDropdown
                            data={bkn_atasan}
                            defaultButtonText={'Pilih Atasan'}
                            onSelect={(selectedItem, index) => setBukan(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(Item, index) => { return Item; }}
                            buttonStyle={{ padding: 2, width: '65%', marginHorizontal: width * 0.04, backgroundColor: 'whitesmoke', borderBottomWidth: 1, borderBlockColor: '#ccc' }}
                            buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                            dropdownIconPosition={'left'}
                            dropdownStyle={{ padding: 6, width: 155, borderRadius: 4 }}
                        />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <View style={styles.containB}>
                            <TouchableOpacity style={styles.btnSave} onPress={savingData}>
                                <Text style={styles.txtSave}>Simpan</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnCancel} onPress={cancel}>
                                <Text style={styles.txtCancel}>Batal</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    page: {
        flex: 1,
    },
    textContainer: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black'
    },
    contain: {
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 4,
        marginRight: 4
    },
    containB: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center'
    },
    cntSelect: {
        padding: 2,
        width: '65%',
        marginHorizontal: 38,
        backgroundColor: 'whitesmoke',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    textTitle: {
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black',
    },
    containerDate: {
        alignContent: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        backgroundColor: 'whitesmoke',
        width: '65%',
    },
    containerDateL: {
        alignContent: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        backgroundColor: 'whitesmoke',
        width: '65%',
    },
    containerDateM: {
        alignContent: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        backgroundColor: 'whitesmoke',
        width: '65%',
    },
    textDate: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: 'black',
        textAlignVertical: 'center',
        textAlign: 'left'
    },
    date: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    input: {
        // padding: 0,
        width: '65%',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    btnSave: {
        padding: 8,
        width: 100,
        borderRadius: 18,
        backgroundColor: 'dodgerblue',
        right: 20,
    },
    btnCancel: {
        padding: 8,
        width: 100,
        borderRadius: 18,
        backgroundColor: 'lightgray',
        left: 20
    },
    txtUploadFile: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: 'black'
    },
    txtChooseFile: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-Medium',
        fontSize: 15,
        margin: 4,
    },
    btnFile: {
        padding: 4,
        width: 80,
        borderRadius: 8,
        backgroundColor: '#ccc',
        borderWidth: 1,
        borderColor: '#ccc'
    },
    txtSave: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: 'white'
    },
    txtCancel: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: 'black'
    },
})