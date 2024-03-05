import { StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function FormSPPD({ onPress }) {
    const [input, setInput] = useState("");
    const [tujuan, setTujuan] = useState("");
    const [jalan, setJalan] = useState("");
    const [cost, setCost] = useState("");
    const [ring, setRing] = useState("");
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [date, setDate] = useState(new Date(Date.now()));
    const [dateKembali, setDateKembali] = useState(new Date(Date.now()))
    const [isPickerKembali, setIsPickerKembali] = useState(false);
    const dt = { year: 'numeric', month: 'short', day: 'numeric' };
    const [filePath, setFilePath] = useState('');
    const [transferred, setTransferred] = useState('');
    const [tgl] = useState(new Date(Date.now()));
    const navigation = useNavigation();

    const chooseFile = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
                copyTo: 'cachesDirectory'
            });
            console.log('res : ' + JSON.stringify(res));
            console.log('File Name : ' + res.name);
            setFilePath(res);
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                Alert.alert('', 'Canceled from multiple doc picker');
            } else {
                Alert.alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    }

    // upload file to firebase storage
    const uploadFile = async () => {
        if (!filePath) {
            ToastAndroid.show('Pilih file terlebih dahulu!', ToastAndroid.SHORT);
            return;
        }
        const fileName = file.substring(file.lastIndexOf("/") + 1);
        const ref = storage().ref(`/files/${fileName}`);
        try {
            await ref.putFile(filePath);
            ToastAndroid.show('Sukses!', 'File berhasil diunggah', ToastAndroid.SHORT);
            console.log('Berhasil');
        } catch (error) {
            ToastAndroid.show('Error' + error, ToastAndroid.SHORT);
            console.error(error);
        }
    }

    const showPicker = () => {
        setIsPickerShow(true);
    };

    const showKembali = () => {
        setIsPickerKembali(true);
    }

    const onChange = (event, value) => {
        setDate(value);
        if (Platform.OS === 'android') {
            setIsPickerShow(false);
        }
    };

    const onChangeKembali = (event, value) => {
        setDateKembali(value);
        if (Platform.OS === 'android') {
            setIsPickerKembali(false);
        }
    }

    const handleSaveData = () => {
        try {
            firestore().collection('surat_dinas').add({
                dasar: input,
                alasan: jalan,
                kota: tujuan,
                tgl_berangkat: date.toLocaleDateString("id", { month: 'short', day: 'numeric', year: '2-digit' }),
                tgl_kembali: dateKembali.toLocaleDateString("id", { month: 'short', day: 'numeric', year: '2-digit' }),
                biaya: cost,
                detail_kegiatan: ring,
                data: 'SPPD',
                // status: 'Pending',
                createdAt: tgl.toLocaleDateString("id", { month: 'numeric', year: 'numeric', day: 'numeric' }),
            })
                .then(() => {
                    console.log('Data added!');
                    ToastAndroid.show('Data Successfully added!', ToastAndroid.SHORT);
                });
        } catch (err) {
            console.log("Error", err);
        }
    }

    // save data form + file/img to firestore & storage
    const savingData = async () => {
        try {
            const userRef = await firestore().collection('surat_dinas').add({
                data: 'SPPD',
                dasar: input,
                alasan: jalan,
                kota: tujuan,
                tgl_berangkat: date.toLocaleDateString("id", { month: 'short', day: 'numeric', year: '2-digit' }),
                tgl_kembali: dateKembali.toLocaleDateString("id", { month: 'short', day: 'numeric', year: '2-digit' }),
                biaya: cost,
                detail_kegiatan: ring,
                bukti_pendukung: filePath.name,
                // status: 'Pending',
                createdAt: tgl.toLocaleDateString("id", { month: 'numeric', year: 'numeric', day: 'numeric' }),
            });
            const docId = userRef.id;

            if (!filePath) {
                Alert.alert('Warning!', 'Please pick image or file!');
                return;
            }
            if (filePath) {
                console.log(filePath.fileCopyUri.replace("files://", ""));
                console.log(filePath.name);
                const reference = storage().ref(`/myfiles/SPPD/${docId}/${filePath.name}`);
                const task = reference.putFile(filePath.fileCopyUri.replace('files://', ''));

                task.on("state_changed", (taskSnapshot) => {
                    const progress = Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
                    setTransferred(progress);
                    console.log(progress, '%');
                })
                task.then(() => {
                    Alert.alert('Success', 'File or Image uploaded to the bucket');
                    setTransferred('');
                })
                setFilePath({});
            }
            Alert.alert('Success', 'Data berhasil disimpan!');
            console.log('Berhasil menyimpan data');
        } catch (error) {
            Alert.alert('Error!', '', error);
            console.warn(error);
        }
    }

    const _batal = () => {
        console.log('User canceled');
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
    }


    return (
        <View style={styles.page}>
            <View style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                <Text style={styles.textTitle}>Form SPPD</Text>
            </View>
            <View style={{ marginTop: 8 }}>
                <View style={styles.contain}>
                    <Text style={styles.text}>Dasar</Text>
                    <TextInput
                        placeholder="Dasar"
                        style={styles.input}
                        value={input}
                        onChangeText={(text) => setInput(text)} />
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Perjalanan{'\n'}Dinas</Text>
                    <TextInput
                        placeholder="Tujuan Perjalanan Dinas"
                        style={styles.inputMulti}
                        value={jalan}
                        onChangeText={(text) => setJalan(text)} />
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Tujuan</Text>
                    <TextInput
                        placeholder="Kota Tujuan"
                        value={tujuan}
                        onChangeText={(text) => setTujuan(text)}
                        style={{
                            padding: 8,
                            width: '70%',
                            borderRadius: 8,
                            borderColor: '#ccc',
                            borderWidth: 1,
                            backgroundColor: 'whitesmoke',
                        }} />
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Tanggal{'\n'}Berangkat</Text>
                    <View style={styles.dateB}>
                        {!isPickerShow && (
                            <TouchableOpacity onPress={showPicker}>
                                <Text style={styles.textDate}>{date.toLocaleDateString("id", dt)}</Text>
                            </TouchableOpacity>
                        )}
                        {isPickerShow && (
                            <DateTimePicker
                                value={date}
                                mode={'date'}
                                display={'calendar'}
                                onChange={onChange}
                                style={styles.tanggal} />
                        )}
                    </View>
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Tanggal{'\n'}Kembali</Text>
                    <View style={styles.date}>
                        {!isPickerKembali && (
                            <TouchableOpacity onPress={showKembali}>
                                <Text style={styles.textDate}>{dateKembali.toLocaleDateString("id", dt)}</Text>
                            </TouchableOpacity>
                        )}
                        {isPickerKembali && (
                            <DateTimePicker
                                value={dateKembali}
                                mode={'date'}
                                display={'calendar'}
                                onChange={onChangeKembali}
                                style={styles.tanggal} />
                        )}
                    </View>
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Lampiran</Text>
                    <View style={{ flexDirection: 'row', marginHorizontal: width * 0.48, marginLeft: 40 }}>
                        <TouchableOpacity style={styles.document} onPress={chooseFile}>
                            <Text style={styles.textDoc}>Choose</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style={styles.txtStyles}>{filePath.name ? filePath.name : 'Choose File'}</Text>
                        </TouchableOpacity>
                        {/* <Text style={styles.txtStyles}>{filePath.name ? filePath.name : ''}</Text> */}
                    </View>
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Jumlah{'\n'}Biaya SPPD</Text>
                    <TextInput
                        placeholder="Biaya"
                        value={cost}
                        onChangeText={(text) => setCost(text)}
                        style={{
                            padding: 9,
                            width: '70%',
                            borderRadius: 8,
                            borderColor: '#ccc',
                            borderWidth: 1,
                            backgroundColor: 'whitesmoke',
                        }} />
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Ringkasan</Text>
                    <TextInput
                        placeholder="Ringkasan"
                        multiline={true}
                        value={ring}
                        maxLength={255}
                        onChangeText={(text) => setRing(text)}
                        style={{
                            padding: 10,
                            width: '70%',
                            height: 50,
                            borderRadius: 8,
                            borderColor: '#ccc',
                            borderWidth: 1,
                            backgroundColor: 'whitesmoke',
                        }} />
                </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-evenly' }}>
                <TouchableOpacity style={styles.btnSave} onPress={savingData}>
                    <Text style={styles.txtSave}>Simpan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnCancel} onPress={_batal}>
                    <Text style={styles.txtCncl}>Batal</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    input: {
        padding: 8,
        width: '70%',
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'whitesmoke',
        borderRadius: 8,
    },
    inputMulti: {
        padding: 10,
        width: '70%',
        borderWidth: 1,
        backgroundColor: 'whitesmoke',
        borderColor: '#ccc',
        borderRadius: 8,
    },
    textTitle: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
    },
    text: {
        textAlign: 'left',
        textAlignVertical: 'center',
        marginHorizontal: 6,
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black',
        marginLeft: 6
    },
    containerDate: {
        padding: 10,
        width: '65%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginHorizontal: 22
    },
    textDate: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        textAlignVertical: 'center',
        marginVertical: 8
    },
    tanggal: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    date: {
        padding: 6,
        width: '70%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: 'whitesmoke'
    },
    dateB: {
        padding: 6,
        width: '70%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        backgroundColor: 'whitesmoke'
    },
    document: {
        backgroundColor: '#ccc',
        padding: 6,
        borderRadius: 6,
        width: 80,
        borderWidth: 1,
        borderColor: 'whitesmoke'
    },
    textDoc: {
        fontFamily: 'Inter-SemiBold',
        color: 'black',
        fontSize: 14,
        textAlign: 'center',
    },
    txtSave: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: 'white'
    },
    txtCncl: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 14,
        fontFamily: 'Inter-SemiBold',
        color: 'black',
    },
    btnSave: {
        padding: 8,
        width: 100,
        borderRadius: 20,
        backgroundColor: 'deepskyblue',
    },
    btnCancel: {
        padding: 8,
        width: 100,
        borderRadius: 20,
        backgroundColor: 'lightgray',
    },
    contain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 4,
        marginVertical: 8
    },
    txtStyles: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        margin: 5,
    },
})