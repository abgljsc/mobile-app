import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, ToastAndroid, Dimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native';
import { Back } from '../../assets';

const { width } = Dimensions.get('window');

export default function NewFormKeluarga() {
    const [isPickerShow, setIsPickerShow] = useState(false);
    const [date, setDate] = useState(new Date(Date.now()));

    const showPicker = () => {
        setIsPickerShow(true);
    };

    const onChange = (event, value) => {
        setDate(value);
        if (Platform.OS === 'android') {
            setIsPickerShow(false);
        }
    };

    const [nomor, setNomor] = useState(""); //NIK
    const [nama, setNama] = useState(""); //nama
    const [kerja, setKerja] = useState(""); //tempat_kerja
    const [alamat, setAlamat] = useState(""); //alamat
    const [jenis, setJenis] = useState("");
    const [st_kerja, setSt_Kerja] = useState("");
    const [st_kwn, setSt_Kwn] = useState("");
    const [selectkeluarga, setSelectKeluarga] = useState(""); //hub_keluarga
    const [selectpendidikan, setSelectPendidikan] = useState(""); //pendidikan terakhir
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const [tgl] = useState(new Date(Date.now()));
    const navigation = useNavigation();

    const keluarga = [
        'Ayah',
        'Ibu',
        'Adik',
        'Kakak',
        'Kakek',
        'Nenek'
    ];
    const pendidikan = [
        'SMP',
        'SMA',
        'SD',
        'D/IV Manajemen',
        'S1 Arsitektur',
        'S2 Sistem Informasi',
    ];
    const Gender = [
        'Laki-Laki',
        'Perempuan'
    ];
    const sts_kerja = [
        'Bekerja',
        'Tidak Bekerja'
    ];
    const sts_kawin = [
        'Kawin',
        'Belum Kawin'
    ];

    const saveData = () => {
        try {
            firestore().collection('data_keluarga').add({
                id_user: nomor,
                name: nama,
                sex: jenis,
                date_birth: date.toLocaleDateString("id", options),
                sts_job: st_kerja,
                job_place: kerja,
                address: alamat,
                sts_mar: st_kwn,
                fam: selectkeluarga,
                schl: selectpendidikan,
                createdAt: tgl.toLocaleDateString("id", { year: 'numeric', month: 'numeric', day: '2-digit' }),
            })
                .then(() => {
                    console.log('Data success added!');
                    ToastAndroid.show('Data berhasil ditambahkan!', ToastAndroid.SHORT);
                    navigation.navigate("Main");
                })
        } catch (err) {
            console.log('Error!', err);
        }
    }

    const cancelData = () => {
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
            <View style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.Hcontainer}>Form Keluarga</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.data}>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>NIK</Text>
                        <View>
                            <TextInput
                                placeholder="NIK"
                                value={nomor}
                                onChangeText={(value) => setNomor(value)}
                                style={styles.input}
                            />
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Nama</Text>
                        <View>
                            <TextInput
                                placeholder="Nama"
                                value={nama}
                                onChangeText={(value) => setNama(value)}
                                style={styles.input}
                            />
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Gender</Text>
                        <SelectDropdown
                            data={Gender}
                            defaultButtonText={'Pilih'}
                            onSelect={(selectedItem, index) => setJenis(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(item, index) => { return item; }}
                            buttonStyle={styles.pickerStyle}
                            buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                            dropdownStyle={{
                                padding: 4,
                                width: 100,
                                borderRadius: 4
                            }}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Tgl Lahir</Text>
                        {!isPickerShow && (
                            <View style={styles.containerDate}>
                                <TouchableOpacity onPress={showPicker}>
                                    <Text style={styles.txtDate}>{date.toLocaleDateString("id", options)}</Text>
                                </TouchableOpacity>
                            </View>)}
                        {isPickerShow && (
                            <DateTimePicker
                                value={date}
                                mode={'date'}
                                display={'default'}
                                onChange={onChange}
                                style={styles.dateStlye}
                            />)}
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Status{'\n'}Kerja</Text>
                        <SelectDropdown
                            data={sts_kerja}
                            defaultButtonText={'Pilih'}
                            onSelect={(selectedItem, index) => setSt_Kerja(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(item, index) => { return item; }}
                            buttonStyle={styles.pickerStyle}
                            buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                            dropdownStyle={{
                                padding: 4,
                                width: 100,
                                borderRadius: 4
                            }}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Tempat{'\n'}Kerja</Text>
                        <TextInput
                            placeholder="Tempat Kerja"
                            value={kerja}
                            onChangeText={(value) => setKerja(value)}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Alamat{'\n'}Kerja</Text>
                        <TextInput
                            placeholder="Alamat Kerja"
                            value={alamat}
                            onChangeText={(value) => setAlamat(value)}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Status{'\n'}Kawin</Text>
                        <SelectDropdown
                            data={sts_kawin}
                            defaultButtonText={'Pilih'}
                            onSelect={(selectedItem, index) => setSt_Kwn(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(item, index) => { return item; }}
                            buttonStyle={styles.pickerStyle}
                            buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                            dropdownStyle={{
                                padding: 4,
                                width: 100,
                                borderRadius: 4
                            }}
                        />
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Hubungan{'\n'}Keluarga</Text>
                        <View style={styles.pickerStyle}>
                            <SelectDropdown
                                data={keluarga}
                                defaultButtonText={'Pilih'}
                                onSelect={(selectedItem, index) => setSelectKeluarga(selectedItem, index)}
                                buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                                rowTextForSelection={(item, index) => { return item; }}
                                //buttonStyle={styles.containerSelect}
                                buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                                dropdownStyle={{
                                    padding: 6,
                                    width: 100,
                                    borderRadius: 4
                                }}
                            />
                        </View>
                    </View>
                    <View style={styles.contain}>
                        <Text style={styles.textTitle}>Pendidikan{'\n'}Terakhir</Text>
                        <View style={styles.pickerStyle}>
                            <SelectDropdown
                                data={pendidikan}
                                defaultButtonText={'Pilih'}
                                onSelect={(selectedItem, index) => setSelectPendidikan(selectedItem, index)}
                                buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                                rowTextForSelection={(item, index) => { return item; }}
                                //buttonStyle={styles.containerSelect}
                                buttonTextStyle={{ fontFamily: 'Inter-SemiBold', fontSize: 14, textAlign: 'left' }}
                                dropdownStyle={{
                                    padding: 6,
                                    width: 100,
                                    borderRadius: 4
                                }}
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 9, justifyContent: 'space-evenly', flexDirection: 'row', marginTop: 20, }}>
                        <TouchableOpacity style={styles.saveBtn} onPress={saveData}>
                            <Text style={styles.txtSave}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.dltBtn} onPress={cancelData}>
                            <Text style={styles.txtDlt}>Cancel</Text>
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
    contain: {
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 4,
        marginRight: 4
    },
    textTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: '#000',
        textAlignVertical: 'center',
        //margin: 4,
    },
    input: {
        padding: 10,
        width: 285,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'whitesmoke',
        opacity: 55,
        // marginHorizontal: width * 0.090
    },
    dateStlye: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    saveBtn: {
        padding: 8,
        width: 100,
        borderRadius: 10,
        backgroundColor: '#4DACFF'
    },
    dltBtn: {
        padding: 8,
        width: 100,
        borderRadius: 10,
        backgroundColor: 'lightgray',
        borderWidth: 1,
        borderColor: '#ccc'
    },
    pickerStyle: {
        width: 285,
        height: 50,
        borderRadius: 8,
        backgroundColor: 'whitesmoke',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    radioStyle: {
        marginHorizontal: width * 0.06,
    },
    txtSave: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    txtDlt: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    txtDate: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: 'black',
        //textAlign: 'center',
        textAlignVertical: 'center'
    },
    containerDate: {
        padding: 12,
        borderRadius: 5,
        backgroundColor: 'whitesmoke',
        width: 285,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    Hcontainer: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        textAlign: 'center',
        color: 'black',
        marginRight: 120
    },
    data: {
        margin: 4,
        justifyContent: 'center'
    }
})