import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ToastAndroid, Dimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import SelectDropdown from 'react-native-select-dropdown';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Back } from '../../assets';

const { width } = Dimensions.get('window');

export default function NewFormPendidikan({ onPress }) {
    const navigation = useNavigation();
    const [sch, setSelectSch] = useState("");
    const [schName, setSchName] = useState("");
    const [tahun, setTahun] = useState("");
    const [city, setCity] = useState("");
    const [num, setNum] = useState("");
    const [ttd, setTtd] = useState("");
    const [dateIjazah, setDateIjazah] = useState(new Date(Date.now())); // Ijazah
    const [isPickerIjazah, setIsPickerIjazah] = useState(false);
    const [date, setDate] = useState(new Date(Date.now())); // Acc
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [dateKadarluasa, setDateKadarluasa] = useState(new Date(Date.now())); // Kadarluasa
    const [isPickerKadarLuasa, setIsPickerKadarluasa] = useState(false);
    const [dateTerbit, setDateTerbit] = useState(new Date(Date.now())); // Terbit
    const [isPickerTerbit, setIsPickerTerbit] = useState(false);
    const event = { year: 'numeric', month: 'short', day: 'numeric' };
    const [file, setFile] = useState('');
    const [tgl] = useState(new Date(Date.now()));
    const [transferred, setTransferred] = useState('');

    const showPicker = () => {
        setIsPickerShow(true);
    };

    const showIjazah = () => {
        setIsPickerIjazah(true);
    };

    const showKadarluasa = () => {
        setIsPickerKadarluasa(true);
    };

    const showTerbit = () => {
        setIsPickerTerbit(true);
    };

    const onChange = (event, value) => {
        setDate(value);
        if (Platform.OS === 'android') {
            setIsPickerShow(false);
        }
    };

    const onChangeIjazah = (event, value) => {
        setDateIjazah(value);
        if (Platform.OS === 'android') {
            setIsPickerIjazah(false);
        }
    };

    const onChangeKadarluasa = (event, value) => {
        setDateKadarluasa(value);
        if (Platform.OS === 'android') {
            setIsPickerKadarluasa(false);
        }
    };

    const onChangeTerbit = (event, value) => { //Acc
        setDateTerbit(value);
        if (Platform.OS === 'android') {
            setIsPickerTerbit(false);
        }
    };

    const pendidikan = [
        'SD',
        'S1 Teknik Sipil',
        'S1 Desain Komunikasi Visual',
        'SMP',
        'SMA',
        'S2 Sistem Informasi'
    ];

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
            if (DocumentPicker.isCancel(err)) {
                console.log('Cancel');
                ToastAndroid.show('Batal memilih dokumen', ToastAndroid.SHORT);
            } else {
                console.log('unknown error');
                ToastAndroid.show('Unknown Error: ' + JSON.stringify(err), ToastAndroid.SHORT);
                throw err;
            }
        }
    }

    // save data form + file/img to firestore & storage
    const savingData = async () => {
        try {
            const userRef = await firestore().collection('pendidikanRecord').add({
                school: sch,
                schl_name: schName,
                year: tahun,
                city: city,
                date_terbit: dateTerbit.toLocaleDateString("id", event),
                date_acc: date.toLocaleDateString("id", event),
                date_kdrluasa: dateKadarluasa.toLocaleDateString("id", event),
                date_ijzh: dateIjazah.toLocaleDateString("id", event),
                id_num: num,
                sign: ttd,
                file_ijazah: file.name,
                createdAt: tgl.toLocaleDateString("id", { month: '2-digit', day: 'numeric', year: 'numeric' }),
            });
            const docId = userRef.id;

            if (!file) {
                Alert.alert('Warning!', 'Please pick image or file!');
                return;
            }
            if (file) {
                console.log(file.fileCopyUri.replace("files://", ""));
                console.log(file.name);
                const reference = storage().ref(`/myfiles/pendidikan/${docId}/${file.name}`);
                const task = reference.putFile(file.fileCopyUri.replace('files://', ''));

                task.on("state_changed", (taskSnapshot) => {
                    const progress = Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
                    setTransferred(progress);
                    console.log(progress, '%');
                })
                task.then(() => {
                    Alert.alert('Success', 'Image or File uploaded to the bucket!');
                    setTransferred('');
                })
                setFile({});
            }
            Alert.alert('Success', 'Data berhasil disimpan!');
            console.log('Berhasil menyimpan data');
        } catch (error) {
            Alert.alert('Error: ', error);
            console.warn(error);
        }
    }

    const saveData = () => {
        try {
            firestore().collection('pendidikanRecord').add({
                school: sch,
                schl_name: schName,
                year: tahun,
                city: city,
                date_terbit: dateTerbit.toLocaleDateString("id", event),
                date_acc: date.toLocaleDateString("id", event),
                date_kdrluasa: dateKadarluasa.toLocaleDateString("id", event),
                date_ijzh: dateIjazah.toLocaleDateString("id", event),
                id_num: num,
                sign: ttd,
                createdAt: tgl.toLocaleDateString("id", { month: '2-digit', day: 'numeric', year: 'numeric' }),
            })
                .then(() => {
                    console.log('Data added!');
                    ToastAndroid.show('Data berhasil disimpan!', ToastAndroid.SHORT);
                });
        } catch (err) {
            console.error(err);
            ToastAndroid.show(`Error:${err}`, ToastAndroid.SHORT);
        }
    }

    const _cancel = () => {
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
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.text}>Form Pendidikan</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.data}>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Pendidikan</Text>
                        <SelectDropdown
                            data={pendidikan}
                            defaultButtonText={'Pilih Jenis Pendidikan'}
                            onSelect={(selectedItem, index) => setSelectSch(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(item, index) => { return item; }}
                            buttonStyle={styles.pickerStyle}
                            buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                            dropdownIconPosition={'left'}
                            dropdownStyle={{ padding: 6, width: 155, borderRadius: 4 }}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Nama Sekolah</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nama Sekolah"
                            value={schName}
                            onChangeText={(value) => setSchName(value)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Tahun Lulus</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Tahun"
                            value={tahun}
                            maxLength={4}
                            onChangeText={(value) => setTahun(value)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Kota</Text>
                        <TextInput
                            style={styles.input}
                            value={city}
                            placeholder="Kota"
                            onChangeText={(value) => setCity(value)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Tgl. Ijazah</Text>
                        <View style={styles.containerDate}>
                            {!isPickerIjazah && (
                                <TouchableOpacity onPress={showIjazah}>
                                    <Text style={styles.textDate}>{dateIjazah.toLocaleDateString("id", event)}</Text>
                                </TouchableOpacity>)}
                            {isPickerIjazah && (
                                <DateTimePicker
                                    value={dateIjazah}
                                    mode={'date'}
                                    display={'default'}
                                    onChange={onChangeIjazah}
                                    style={styles.inputDate} />
                            )}
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>No. Ijazah</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nomor Ijazah"
                            value={num}
                            onChangeText={(value) => setNum(value)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Ttd Ijazah</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Sign"
                            value={ttd}
                            onChangeText={(value) => setTtd(value)}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Tgl. Acc</Text>
                        <View style={styles.containerDate}>
                            {!isPickerShow && (<TouchableOpacity onPress={showPicker}>
                                <Text style={styles.textDate}>{date.toLocaleDateString("id", event)}</Text>
                            </TouchableOpacity>)}
                            {isPickerShow && (<DateTimePicker
                                value={date}
                                mode={'date'}
                                display={'default'}
                                onChange={onChange}
                                style={styles.inputDate}
                            />)}
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Tgl. Terbit</Text>
                        <View style={styles.containerDate}>
                            {!isPickerTerbit && (
                                <TouchableOpacity onPress={showTerbit}>
                                    <Text style={styles.textDate}>{dateTerbit.toLocaleDateString("id", event)}</Text>
                                </TouchableOpacity>)}
                            {isPickerTerbit && (<DateTimePicker
                                value={dateTerbit}
                                mode={'date'}
                                display={'default'}
                                onChange={onChangeTerbit}
                                style={styles.inputDate}
                            />)}
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Tgl. Kadarluasa</Text>
                        <View style={styles.containerDate}>
                            {!isPickerKadarLuasa && (<TouchableOpacity onPress={showKadarluasa}>
                                <Text style={styles.textDate}>{dateKadarluasa.toLocaleDateString("id", event)}</Text>
                            </TouchableOpacity>)}
                            {isPickerKadarLuasa && (<DateTimePicker
                                value={dateKadarluasa}
                                mode={'date'}
                                display={'default'}
                                onChange={onChangeKadarluasa}
                                style={styles.inputDate}
                            />)}
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>File Ijazah</Text>
                        <View style={{ flexDirection: 'row', marginHorizontal: width * 0.36, marginLeft: 60 }}>
                            <TouchableOpacity style={styles.btnFile} onPress={_chooseFile}>
                                <Text style={styles.textFile}>Choose</Text>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Text style={styles.txtChooseFile}>{file.name ? file.name : 'no file choose'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 12, marginVertical: 15 }}>
                        <TouchableOpacity style={styles.saveBtn} onPress={savingData}>
                            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 15, color: '#fff', textAlign: 'center' }}>Simpan</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cnclBtn} onPress={_cancel}>
                            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 15, color: 'black', textAlign: 'center' }}>Batal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    text: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: '#000',
        margin: 4,
        textAlign: 'center',
        marginRight: 120
    },
    container: {
        padding: 8,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5
    },
    contain: {
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 3,
        marginRight: 3
    },
    pickerStyle: {
        width: 245,
        height: 50,
        borderRadius: 5,
        backgroundColor: 'whitesmoke',
        borderColor: '#ccc',
        borderWidth: 1
    },
    data: {
        margin: 4,
        justifyContent: 'center'
    },
    input: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'whitesmoke',
        width: '65%'
    },
    textTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#000',
        textAlignVertical: 'center',
    },
    textDate: {
        fontSize: 16,
        color: 'black',
        fontFamily: 'Inter-Medium',
        textAlignVertical: 'center'
    },
    textBtn: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: 'white',
        textAlign: 'center'
    },
    inputDate: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    btnFile: {
        backgroundColor: '#ccc',
        padding: 6,
        borderRadius: 8,
        width: 80,
    },
    textFile: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: 'black',
        textAlign: 'center'
    },
    saveBtn: {
        padding: 8,
        width: 100,
        borderRadius: 20,
        backgroundColor: '#4DACFF'
    },
    cnclBtn: {
        padding: 8,
        width: 100,
        borderRadius: 20,
        backgroundColor: '#ccc'
    },
    containerDate: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'whitesmoke',
        width: '65%',
        borderWidth: 1,
        borderColor: '#ccc'
    },
    txtStyles: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: 'black',
        textAlignVertical: 'center',
        marginLeft: 4
    },
    txtChooseFile: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        margin: 6,
        top: 3,
        color: 'gray'
    }

})