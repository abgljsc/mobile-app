import { View, Text, StyleSheet, Platform, TouchableOpacity, TextInput, ToastAndroid, Dimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Back } from '../../assets';

export default function Klarifikasi() {
    const navigation = useNavigation();
    const [jam, setJam] = useState(new Date(Date.now()));
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [date, setDate] = useState(new Date(Date.now()));
    const [isPicker, setIsPicker] = useState(false);
    const [keterangan, setKeterangan] = useState('');
    const [kegiatan, setKegiatan] = useState('');
    const [presensi, setPresensi] = useState('');
    const [file, setFile] = useState('');
    const [transferred, setTransferred] = useState('');

    // tanggal
    const showPicker = () => {
        setIsPicker(true);
    }
    // jam
    const showPick = () => {
        setIsPickerShow(true);
    }
    // tanggal
    const onChange = (event, value) => {
        setDate(value);
        if (Platform.OS === 'android') {
            setIsPicker(false);
        }
    }
    // jam
    const onChangeTime = (event, value) => {
        setJam(value);
        if (Platform.OS === 'android') {
            setIsPickerShow(false);
        }
    }

    const jenis_kehadiran = [
        'Kehadiran Datang', 'Kehadiran Pulang', 'Kegiatan Pegawai'
    ]
    const jenis_kegiatan = [
        'Kegiatan 1', 'Kegiatan 2', 'Kegiatan 3', 'Kegiatan 4', 'Kegiatan 5', 'Kegiatan 6', 'Tidak ada'
    ]

    // pilih file yang akan diupload
    const _chooseFile = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
                copyTo: 'cachesDirectory'
            });
            console.log('res : ' + JSON.stringify(res));
            console.log('File Name : ' + res.name);
            setFile(res);
        } catch (err) {
            setFile({});
            if (DocumentPicker.isCancel(err)) {
                console.warn(err);
                ToastAndroid.show("Cancel pick document!", ToastAndroid.SHORT);
            } else {
                ToastAndroid.show("Unknown error: " + JSON.stringify(err), ToastAndroid.SHORT);
                throw err;
            }
        }
    };

    // save data form + file to firestore & storage
    const saveData = async () => {
        try {
            const userRef = await firestore().collection('klarifikasi').add({
                jns_presensi: presensi,
                jns_kegiatan: kegiatan,
                tgl_presensi: date.toLocaleDateString('id', { year: 'numeric', month: 'short', day: 'numeric' }),
                jam_presensi: jam.toLocaleTimeString('en-US', { hour12: false }),
                alasan: keterangan,
                bukti_file: file.name
            });
            const docId = userRef.id;

            if (!file) {
                Alert.alert('Alert!', 'Please pick file!');
                console.log('Alert! data not found.')
                return;
            }
            if (file) {
                console.log(file.fileCopyUri.replace("files://", ""));
                console.log(file.name);
                const ref = storage().ref(`/myfiles/klarifikasi/${docId}/${file.name}`);
                const task = ref.putFile(file.fileCopyUri.replace('files://', ''));

                task.on("state_changed", (taskSnapshot) => {
                    const progress = Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
                    setTransferred(progress);
                    console.log(progress, '%');
                });
                task.then(() => {
                    Alert.alert('Success!', 'File uploaded to the bucket.');
                    setTransferred('');
                })
                setFile({});
            }
            Alert.alert('Success', 'Data berhasil disimpan!');
            console.log('Success!')
        } catch (err) {
            Alert.alert('Error: ', err);
            console.error('Error: ', err);
        }
    }

    const uploadData = async () => {
        await firestore().collection('klarifikasi_absen').add({
            jns_presensi: presensi,
            jns_kegiatan: kegiatan,
            tgl_presensi: date.toLocaleDateString('id', { year: 'numeric', month: 'short', day: 'numeric' }),
            jam_presensi: jam.toLocaleTimeString('en-US', { hour12: false, minute: 'numeric', hour: 'numeric', second: 'numeric' }),
            alasan: keterangan,
            bukti_file: file.name
        })
            .then(() => {
                console.log('Success!');
                ToastAndroid.show('Berhasil disimpan!', ToastAndroid.SHORT);
                navigation.navigate('Main');
            })
    }

    const Cancel = () => {
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
        )
        console.log('Cancel!');
    }

    return (
        <View style={styles.page}>
            <View style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: 'white' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.txtTitleHeader}> Klarifikasi</Text>
                </View>
            </View>
            <View style={{ top: 10, bottom: 10, marginRight: 4, marginLeft: 4 }}>
                <View style={styles.contain}>
                    <Text style={styles.txtTitle}>Presensi</Text>
                    <SelectDropdown
                        data={jenis_kehadiran}
                        defaultButtonText='Pilih Jenis Presensi'
                        onSelect={(selectedItem, index) => setPresensi(selectedItem, index)}
                        buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                        rowTextForSelection={(Item, index) => { return Item; }}
                        buttonStyle={{ padding: 2, width: '70%', backgroundColor: 'whitesmoke', borderBottomWidth: 2, borderBottomColor: '#ccc' }}
                        buttonTextStyle={{ fontFamily: 'Inter-Medium', fontSize: 14, textAlign: 'left', }}
                        dropdownIconPosition={'left'}
                        dropdownStyle={{ padding: 2, width: '65%', borderRadius: 4 }}
                    />
                </View>
                <View style={styles.contain}>
                    <Text style={styles.txtTitle}>Kegiatan</Text>
                    <SelectDropdown
                        data={jenis_kegiatan}
                        defaultButtonText='Pilih Jenis Kegaiatan'
                        onSelect={(selectedItem, index) => setKegiatan(selectedItem, index)}
                        buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                        rowTextForSelection={(Item, index) => { return Item; }}
                        buttonStyle={{ padding: 2, width: '70%', backgroundColor: 'whitesmoke', borderBottomWidth: 2, borderBottomColor: '#ccc' }}
                        buttonTextStyle={{ fontFamily: 'Inter-Medium', fontSize: 14, textAlign: 'left' }}
                        dropdownIconPosition={'left'}
                        dropdownStyle={{ padding: 2, width: '65%', borderRadius: 4 }}
                    />
                </View>
                <View style={styles.contain}>
                    <Text style={styles.txtTitle}>Tgl{'\n'}Presensi</Text>
                    <View style={styles.containerDate}>
                        {!isPicker && (
                            <View>
                                <TouchableOpacity onPress={showPicker}>
                                    <Text style={styles.txtdate}>{date.toLocaleDateString('id', { year: 'numeric', month: 'short', day: 'numeric', })}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {isPicker && (
                            <DateTimePicker
                                value={date}
                                mode={'date'}
                                display={'calendar'}
                                onChange={onChange}
                                style={styles.date}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.contain}>
                    <Text style={styles.txtTitle}>Jam{'\n'}Presensi</Text>
                    <View style={styles.containerDate}>
                        {!isPickerShow && (
                            <View>
                                <TouchableOpacity onPress={showPick}>
                                    <Text style={styles.txtdate}>{jam.toLocaleTimeString('en-US', { hour12: false, hour: 'numeric', minute: 'numeric' })}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        {isPickerShow && (
                            <DateTimePicker
                                value={jam}
                                mode={'time'}
                                display={'default'}
                                onChange={onChangeTime}
                                style={styles.date}
                            />
                        )}
                    </View>
                </View>
                <View style={styles.contain}>
                    <Text style={styles.txtTitle}>Keterangan</Text>
                    <TextInput
                        placeholder='keterangan'
                        value={keterangan}
                        onChangeText={(text) => setKeterangan(text)}
                        style={styles.containerInput}
                    />
                </View>
                <View style={styles.contain}>
                    <Text style={styles.txtTitle}>Bukti{'\n'}Pendukung</Text>
                    <View style={{ flexDirection: 'row', marginHorizontal: width * 0.39, marginLeft: 20 }}>
                        <TouchableOpacity style={styles.button} onPress={_chooseFile}>
                            <Text style={styles.txtbtn}>Choose</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.txtChooseFile}>{file.name ? file.name : 'File not found'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* button to save & cancel */}
                <View style={{ marginTop: 20 }}>
                    <View style={styles.containB}>
                        <TouchableOpacity style={styles.buttonSave} onPress={saveData}>
                            <Text style={styles.txtSave}>Simpan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonCancel} onPress={Cancel}>
                            <Text style={styles.txtCancel}>Batal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    contain: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginLeft: 3,
        marginRight: 3,
        marginVertical: 8
    },
    containB: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
    },
    txtTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        textAlignVertical: 'center',
        textAlign: 'right',
        color: 'black'
    },
    containerDate: {
        alignContent: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        backgroundColor: 'whitesmoke',
        width: '70%',
    },
    containerInput: {
        width: '70%',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontFamily: 'Inter-Medium',
        fontSize: 15
    },
    txtdate: {
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
    button: {
        padding: 4,
        width: 80,
        borderRadius: 8,
        backgroundColor: '#ccc',
        borderWidth: 1,
        borderColor: '#ccc'
    },
    txtbtn: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: 'black'
    },
    buttonSave: {
        padding: 8,
        width: 100,
        backgroundColor: 'dodgerblue',
        borderRadius: 20,
        right: 20
    },
    buttonCancel: {
        padding: 8,
        width: 100,
        backgroundColor: 'lightgrey',
        borderRadius: 20,
        left: 20
    },
    txtCancel: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        textAlignVertical: 'center',
        textAlign: 'center',
        color: 'black'
    },
    txtSave: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        textAlignVertical: 'center',
        textAlign: 'center',
        color: 'white'
    },
    txtTitleHeader: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 150
    },
    txtChooseFile: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-Medium',
        fontSize: 15,
        margin: 4,
    }
})