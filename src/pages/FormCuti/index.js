import { View, Text, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, ScrollView, Platform, ToastAndroid, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'

const { width } = Dimensions.get("window");

export default function FormCuti({ onPress, active }) {
    const navigation = useNavigation();
    const [date] = useState(new Date(Date.now()));
    const [input, setInput] = useState('');
    const [Picker_permohon, setPicker_Permohon] = useState(false);
    const [date_permohon, setDate_Permohon] = useState(new Date(Date.now()));
    const [Picker_awal, setPicker_Awal] = useState(false);
    const [date_awal, setDate_Awal] = useState(new Date(Date.now()));
    const [Picker_akhir, setPicker_Akhir] = useState(false);
    const [date_akhir, setDate_Akhir] = useState(new Date(Date.now()));
    const opt = { year: 'numeric', month: 'short', day: 'numeric' };
    const [fileUri, setFileUri] = useState('');
    const [alasan, setAlasan] = useState('');
    const [atasan, setAtasan] = useState('');
    const [bkn_atasan, setBkn_Atasan] = useState('');
    const [transferred, setTransferred] = useState('');

    izin = [
        'Sakit', 'Cuti Tahunan', 'Alasan Penting', 'Lainnya',
    ];
    atasan_lgsg = [
        'Atasan 1', 'Atasan 2', 'Atasan 3', 'Atasan 4'
    ];
    bkn_lgsg = [
        'Atasan 1', 'Atasan 2', 'Atasan 3', 'Atasan 4'
    ];

    const ShowPicker_Pemohon = () => {
        setPicker_Permohon(true);
    }

    const ShowPicker_Awal = () => {
        setPicker_Awal(true);
    }

    const ShowPicker_Akhir = () => {
        setPicker_Akhir(true);
    }

    const Change_Pemohon = (event, value) => {
        setDate_Permohon(value);
        if (Platform.OS === 'android') {
            setPicker_Permohon(false)
        };
    }

    const Change_Awal = (event, value) => {
        setDate_Awal(value);
        if (Platform.OS === 'android') {
            setPicker_Awal(false)
        }
    }

    const Change_Akhir = (event, value) => {
        setDate_Akhir(value);
        if (Platform.OS === 'android') {
            setPicker_Akhir(false)
        }
    }

    // choose file
    const chooseFile = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
                copyTo: 'cachesDirectory'
            });
            console.log('res: ' + JSON.stringify(res));
            console.log('File Name: ' + res.name);
            // console.log('URI: ' + res.uri);
            setFileUri(res);
        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                console.error('Cancel');
                ToastAndroid.show('Batal memilih File!' + error, ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(`Error: ${error}`, ToastAndroid.SHORT);
                throw error;
            }
        }
    }

    // upload file
    const uploadFile = async () => {
        if (!fileUri) {
            ToastAndroid.show('Pilih file terlebih dahulu!', ToastAndroid.SHORT);
            console.log('File not found!');
            return;
        }
        try {
            const reference = storage().ref(`/myfiles/${fileUri.name}`);
            const task = reference.putFile(fileUri.fileCopyUri.replace("files://", ""));

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

        }

    }

    // save data form + file/img to firestore & storage
    const saveData = async () => {
        try {
            const userRef = await firestore().collection('cutiData').add({
                izin: input,
                tgl_permohonan: date_permohon.toLocaleDateString('id', opt),
                tgl_awal: date_awal.toLocaleDateString('id', opt),
                tgl_akhir: date_akhir.toLocaleDateString('id', opt),
                keterangan: alasan,
                atasan_lgsg: atasan,
                bukan_atasan: bkn_atasan,
                bukti_pendukung: fileUri.name,
                createDate: date.toLocaleDateString('id', opt),
            });
            const docId = userRef.id;

            if (!fileUri) {
                Alert.alert('Error!', 'Please pick the image or file');
                return;
            }
            if (fileUri) {
                console.log(fileUri.fileCopyUri.replace("files://", ""));
                console.log(fileUri.name);
                const reference = storage().ref(`myfiles/cuti/${docId}/${fileUri.name}`);
                const task = reference.putFile(fileUri.fileCopyUri.replace('files://', ''));

                task.on('state_changed', (taskSnapshot) => {
                    const progress = Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
                    setTransferred(progress);
                    console.log(progress, '%');
                })
                task.then(() => {
                    Alert.alert('Success', 'File or Image uploaded to the bucket');
                    setTransferred('');
                })
                setFileUri({});
            }
            Alert.alert('Success', 'Data berhasil disimpan!');
            console.log('Success');
        } catch (error) {
            Alert.alert('Error:', error);
            console.warn(error);
        }
    }

    const simpanData = async () => {
        await firestore().collection('cutiData').add({
            izin: input,
            tgl_permohonan: date_permohon.toLocaleDateString('id', opt),
            tgl_awal: date_awal.toLocaleDateString('id', opt),
            tgl_akhir: date_akhir.toLocaleDateString('id', opt),
            keterangan: alasan,
            atasan_lgsg: atasan,
            bukan_atasan: bkn_atasan,
            createDate: date.toLocaleDateString('id', opt),
        })
            .then(() => {
                console.log('Success save');
                ToastAndroid.show('Data berhasil disimpan!', ToastAndroid.SHORT);
                // navigation.goBack("Main");
            })
            .catch((error) => console.error(error))
    }

    const handleCancel = () => {
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
        <SafeAreaView style={styles.page}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Jenis Izin</Text>
                        <SelectDropdown
                            data={izin}
                            defaultButtonText={'Pilih Izin'}
                            onSelect={(selectedItem, index) => setInput(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(Item, index) => { return Item; }}
                            buttonStyle={styles.cntSelect}
                            dropdownIconPosition={'left'}
                            buttonTextStyle={styles.dropdown_txt}
                            dropdownStyle={{ padding: 6, width: 155, borderRadius: 4 }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                    {/* <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Tanggal{'\n'}Permohonan</Text>
                        <View style={styles.containerDate}>
                            {!Picker_permohon && (
                                <TouchableOpacity onPress={ShowPicker_Pemohon}>
                                    <Text style={styles.txtDate}>{date_permohon.toLocaleDateString("id", opt)}</Text>
                                </TouchableOpacity>)}
                            {Picker_permohon && (
                                <DateTimePicker
                                    value={date_permohon}
                                    mode={'date'}
                                    display={'calendar'}
                                    onChange={Change_Pemohon}
                                    style={styles.calendar}
                                />)}
                        </View>
                    </View> */}
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Tanggal{'\n'}Awal</Text>
                        <View style={styles.containerDate}>
                            {!Picker_awal && (
                                <TouchableOpacity onPress={ShowPicker_Awal}>
                                    <Text style={styles.txtDate}>{date_awal.toLocaleDateString("id", opt)}</Text>
                                </TouchableOpacity>)}
                            {Picker_awal && (
                                <DateTimePicker
                                    value={date_awal}
                                    mode={'date'}
                                    display={'default'}
                                    onChange={Change_Awal}
                                    style={styles.calendar}
                                />)}
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Tanggal{'\n'}Akhir</Text>
                        <View style={styles.containerDate}>
                            {!Picker_akhir && (
                                <TouchableOpacity onPress={ShowPicker_Akhir}>
                                    <Text style={styles.txtDate}>{date_akhir.toLocaleDateString("id", opt)}</Text>
                                </TouchableOpacity>)}
                            {Picker_akhir && (
                                <DateTimePicker
                                    value={date_akhir}
                                    mode={'date'}
                                    display={'default'}
                                    onChange={Change_Akhir}
                                    style={styles.calendar}
                                />)}
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Keterangan</Text>
                        <TextInput
                            placeholder={'Keterangan'}
                            maxLength={100}
                            value={alasan}
                            onChangeText={(text) => setAlasan(text)}
                            style={{
                                padding: 6,
                                width: '70%',
                                borderBottomWidth: 1,
                                borderBottomColor: '#ccc',
                                fontSize: 15,
                                fontFamily: 'Poppins-Regular'
                            }}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>File</Text>
                        <View style={{ flexDirection: 'row', marginHorizontal: width * 0.40, marginLeft: 80 }}>
                            <TouchableOpacity style={styles.btnFile} onPress={chooseFile}>
                                <Text style={styles.txtUploadFile}>Choose</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.txtChooseFile}>{fileUri.name ? fileUri.name : 'no file'}</Text>
                                {/* <Text style={{ textAlignVertical: 'center', marginLeft: 4 }}>{file.name ? file.name : ''}</Text> */}
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Atasan{'\n'}Langsung</Text>
                        <SelectDropdown
                            data={atasan_lgsg}
                            defaultButtonText={'Pilih Atasan Langsung'}
                            onSelect={(selectedItem, index) => setAtasan(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(Item, index) => { return Item; }}
                            buttonStyle={styles.cntSelect}
                            buttonTextStyle={styles.dropdown_txt}
                            dropdownStyle={{ padding: 6, width: 155, borderRadius: 4 }}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.txtTitle}>Atasan Tidak{'\n'}Langsung</Text>
                        <SelectDropdown
                            data={bkn_lgsg}
                            defaultButtonText={'Pilih Atasan Langsung'}
                            onSelect={(selectedItem, index) => setBkn_Atasan(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(Item, index) => { return Item; }}
                            buttonStyle={styles.cntSelect}
                            buttonTextStyle={styles.dropdown_txt}
                            dropdownStyle={{ padding: 6, width: 155, borderRadius: 4 }}
                        />
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', marginLeft: 50, marginRight: 50 }}>
                        <TouchableOpacity style={styles.btnSave} onPress={saveData}>
                            <Text style={styles.txtSave}>Simpan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnCancel} onPress={handleCancel}>
                            <Text style={styles.txtCancel}>Batal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView >
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
        top: 0,
        bottom: 10
    },
    contain: {
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 4,
        marginLeft: 4
    },
    cntSelect: {
        padding: 2,
        width: '70%',
        backgroundColor: 'whitesmoke',
        alignSelf: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    txtTitle: {
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 15,
        color: 'black',
    },
    dropdown_txt: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        textAlign: 'left'
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
    calendar: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    txtDate: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: 'black',
        textAlignVertical: 'center',
        textAlign: 'left'
    },
    btnFile: {
        padding: 4,
        width: 80,
        backgroundColor: '#ccc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc'
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
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        margin: 5,
        // color: 'black'
    },
    btnSave: {
        padding: 8,
        width: 100,
        borderRadius: 20,
        backgroundColor: 'dodgerblue',
        borderWidth: 0.5,
        borderColor: '#ccc'
    },
    btnCancel: {
        padding: 8,
        width: 100,
        borderRadius: 20,
        backgroundColor: 'lightgray',
        borderColor: '#ccc',
        borderWidth: 0.5
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