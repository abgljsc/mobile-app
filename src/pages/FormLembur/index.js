import { StyleSheet, Text, View, TextInput, Dimensions, Platform, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function FormLembur() {
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [date, setDate] = useState(new Date(Date.now()));
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const [time, setTime] = useState(new Date(Date.now()));
    const [timePicker, setTimePicker] = useState(false);
    const [timeOut, setTimeOut] = useState(new Date(Date.now()));
    const [timeOutPicker, setTimeOutPicker] = useState(false);
    const [divisi, setDivisi] = useState("");
    const [nmr, setNmr] = useState("");
    const [target, setTarget] = useState("");
    const [day, setDay] = useState("");
    const [tgl] = useState(new Date(Date.now()));
    // const [user, setUser] = useState("Pegawai");
    const navigation = useNavigation();

    const hari = [
        'Hari Kerja', 'Hari Libur'
    ];

    const showPicker = () => {
        setIsPickerShow(true);
    };
    const showTimePicker = () => {
        setTimePicker(true);
    };
    const showTimeOutPicker = () => {
        setTimeOutPicker(true);
    };

    const onChangeTimeOut = (event, value) => {
        setTimeOut(value);
        if (Platform.OS === 'android') {
            setTimeOutPicker(false);
        }
    }

    const onChangeTime = (event, value) => {
        setTime(value);
        if (Platform.OS === 'android') {
            setTimePicker(false);
        }
    };

    const onChange = (event, value) => {
        setDate(value);
        if (Platform.OS === 'android') {
            setIsPickerShow(false);
        }
    };

    // save data to db
    handleSave = async () => {
        await firestore().collection('lembur').add({
            no_spkl: nmr,
            depart: divisi,
            tgl: date.toLocaleDateString("id", options),
            user: 'Pegawai',
            jns_hari: day,
            jam_msk: time.toLocaleTimeString('en-US', { hour12: false, minute: '2-digit', hour: '2-digit' }),
            jam_klr: timeOut.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
            jns_lembur: target,
            status: 'Pending',
            data: 'Lembur',
            createdAt: tgl.toLocaleDateString('id', { year: 'numeric', month: '2-digit', day: '2-digit' }),
        })
            .then(() => {
                console.log('Data added!');
                ToastAndroid.show('Data Successfully added!', ToastAndroid.SHORT);
            });
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
        );
        console.log('Cancel!');
    }

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <Text style={styles.txtTitle}>Pengajuan Lembur</Text>
            </View>
            <View style={{ marginTop: 10 }}>
                <View style={styles.contain}>
                    <Text style={styles.text}>No. SPKL</Text>
                    <TextInput
                        placeholder="Nomor SPKL"
                        value={nmr}
                        onChangeText={(text) => setNmr(text)}
                        style={styles.input}
                    />
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Pegawai</Text>
                    <SelectDropdown
                        defaultButtonText={'Pegawai'}
                        disabled
                        buttonStyle={styles.PickStyle}
                        buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                    />
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Departemen</Text>
                    <TextInput
                        placeholder="Departemen"
                        value={divisi}
                        onChangeText={(text) => setDivisi(text)}
                        style={styles.input}
                    />
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Tanggal</Text>
                    <View style={styles.inputDate}>
                        {!isPickerShow && (
                            <TouchableOpacity onPress={showPicker}>
                                <Text style={styles.txtdate}>{date.toLocaleDateString("id", options)}</Text>
                            </TouchableOpacity>)}
                        {isPickerShow && (
                            <DateTimePicker
                                value={date}
                                mode={'date'}
                                display={'calendar'}
                                onChange={onChange}
                                style={styles.date} />
                        )}
                    </View>
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Jenis Hari</Text>
                    <SelectDropdown
                        data={hari}
                        defaultButtonText={'Pilih Hari'}
                        onSelect={(selectedItem, index) => setDay(selectedItem, index)}
                        buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                        rowTextForSelection={(item, index) => { return item; }}
                        buttonStyle={styles.PickStyle}
                        buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                        dropdownIconPosition={'left'}
                        dropdownStyle={{ padding: 6, width: 155, borderRadius: 4 }}
                    />
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Jam Masuk</Text>
                    <View style={styles.inputDate}>
                        {!timePicker && (
                            <TouchableOpacity onPress={showTimePicker}>
                                <Text style={styles.time}>{time.toLocaleTimeString("en-US", { hour12: false, minute: '2-digit', hour: '2-digit' })}</Text>
                            </TouchableOpacity>
                        )}
                        {timePicker && (
                            <DateTimePicker
                                value={time}
                                mode={'time'}
                                display={'clock'}
                                onChange={onChangeTime}
                                is24Hour={false}
                            />)}
                    </View>
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Jam Keluar</Text>
                    <View style={styles.inputDate}>
                        {!timeOutPicker && (
                            <TouchableOpacity onPress={showTimeOutPicker}>
                                <Text style={styles.time}>{timeOut.toLocaleTimeString("en-US", { hour12: false, minute: '2-digit', hour: '2-digit' })}</Text>
                            </TouchableOpacity>
                        )}
                        {timeOutPicker && (
                            <DateTimePicker
                                value={timeOut}
                                mode={'time'}
                                display={'clock'}
                                onChange={onChangeTimeOut}
                                is24Hour={false}
                            />)}
                    </View>
                </View>
                <View style={styles.contain}>
                    <Text style={styles.text}>Target{'\n'}Pekerjaan</Text>
                    <TextInput
                        placeholder="Target"
                        value={target}
                        onChangeText={(text) => setTarget(text)}
                        multiline={true}
                        style={styles.input}
                    />
                </View>
                <View style={styles.containB}>
                    <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                        <Text style={styles.txtSave}>Simpan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnCancel} onPress={handleCancel}>
                        <Text style={styles.txtCncl}>Batal</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    contain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 4,
        marginVertical: 8
    },
    container: {
        padding: 8,
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    txtTitle: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: 255,
        borderRadius: 8,
        backgroundColor: 'whitesmoke'
    },
    inputDate: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        width: 255,
        borderRadius: 8,
        backgroundColor: 'whitesmoke'
    },
    text: {
        textAlign: 'right',
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black',
        margin: 4
    },
    date: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    PickStyle: {
        width: 255,
        padding: 6,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: 'whitesmoke',
        borderRadius: 4
    },
    time: {
        textAlignVertical: 'center',
        color: 'black',
        fontFamily: 'Inter-Medium',
        fontSize: 14
    },
    containB: {
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginLeft: 40,
        marginRight: 40
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
        //marginHorizontal: width * 0.12
    },
    btnCancel: {
        padding: 8,
        width: 100,
        borderRadius: 20,
        backgroundColor: 'lightgray',
        //marginHorizontal: width * 0.06
    },
    txtdate: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: 'black',
        //textAlign: 'center',
        textAlignVertical: 'center'
    },
    inputPegawai: {
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'whitesmoke',
        padding: 8,
        width: 255,
        borderRadius: 8,
        fontSize: 15,
        color: 'black'
    }
})