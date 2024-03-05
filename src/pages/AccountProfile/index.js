import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import React, { useState } from 'react'
import SelectDropdown from 'react-native-select-dropdown';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { Back } from '../../assets';
import { useNavigation } from '@react-navigation/native';

const AccountProfile = () => {
    const [nama, setNama] = useState("");
    const [mail, setMail] = useState("");
    const [number, setNumber] = useState("");
    const [id_pegawai] = useState("054863648");
    const navigation = useNavigation();

    const saveBtn = () => {
        try {
            firestore().collection('profile').add({
                name: nama,
                email: mail,
                num_phone: number,
                id: id_pegawai
            })
                .then(() => {
                    console.log('Data added!');
                    ToastAndroid.show('Data Successfully added!', ToastAndroid.SHORT);
                    navigation.navigate("Main");
                });
        } catch (err) {
            console.log(err);
            ToastAndroid.show(`Error: ${err}`, ToastAndroid.SHORT);
        }
    }

    const deleteBtn = () => {
        try {
            firestore().collection('profile').delete()
                .then(() => {
                    console.log('Data deleted');
                    ToastAndroid.show('Successfully deleted!', ToastAndroid.SHORT);
                    auth().signOut;
                });
        } catch (err) {
            console.log('Error!', err)
        }
    }

    return (
        <View style={styles.page}>
            <View style={styles.headerMenu}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.textHeader}>Akun Profil</Text>
                </View>
            </View>
            <View style={{ alignSelf: 'center', margin: 8 }}>
                <Image source={{ uri: 'https://picsum.photos/id/100/200/300' }} style={styles.img} />
            </View>
            <View>
                <View>
                    <Text style={styles.text}>Account Name</Text>
                    <View style={styles.containerInput}>
                        <TextInput
                            placeholder="Nama"
                            maxLength={255}
                            value={nama}
                            onChangeText={(text) => setNama(text)}
                        />
                    </View>
                    <Text style={styles.text}>Email</Text>
                    <View style={styles.containerInput}>
                        <TextInput
                            placeholder="example@mail.com"
                            value={mail}
                            onChangeText={(text) => setMail(text)}
                        />
                    </View>
                    <Text style={styles.text}>NRP</Text>
                    <SelectDropdown
                        data={id_pegawai}
                        defaultButtonText='054863648'
                        disabled
                        buttonStyle={styles.containerInput}
                        buttonTextStyle={{ fontFamily: 'Inter-Regular', fontSize: 15, textAlign: 'left', color: 'black' }}
                    />
                    <Text style={styles.text}>Phone Number</Text>
                    <View style={styles.containerInput}>
                        <TextInput
                            placeholder="Nomor HP"
                            value={number}
                            onChangeText={(text) => setNumber(text)}
                        />
                    </View>
                </View>
                <View style={{ alignSelf: 'center', alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={styles.containButton}>
                        <TouchableOpacity onPress={deleteBtn}>
                            <Text style={styles.txtDelete}>Hapus</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={saveBtn}>
                            <Text style={styles.txtSave}>Simpan</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default AccountProfile

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerMenu: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    textHeader: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        marginRight: 150
    },
    img: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        borderWidth: 1,
        borderColor: 'navy'
    },
    containerStyle: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: 'whitesmoke',
        marginVertical: 10
    },
    containerInput: {
        padding: 1,
        width: '95%',
        backgroundColor: 'whitesmoke',
        borderWidth: 1.5,
        borderColor: '#ccc',
        borderRadius: 10,
        fontWeight: 'bold',
        color: 'black',
        alignSelf: 'center',
        marginVertical: 5
    },
    txtDelete: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: 'red',
        marginVertical: 6,
        marginTop: 10
    },
    txtSave: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: 'deepskyblue',
        marginLeft: 10,
        marginVertical: 6,
        marginTop: 10,
    },
    text: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        marginLeft: 13,
        color: 'black'
    },
    simpan: {
        padding: 8,
        width: 100,
        borderRadius: 18,
        backgroundColor: 'dodgerblue',
        right: 20,
    },
    hapus: {
        padding: 8,
        width: 100,
        borderRadius: 18,
        backgroundColor: 'lightgray',
        left: 20
    },
    containButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center'
    }
})