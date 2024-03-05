import { View, Text, StyleSheet, TouchableOpacity, ToastAndroid, Alert, Button, Image, TextInput, Dimensions } from 'react-native'
import React, { useState } from 'react'
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

export default function Chart() {
    const [file, setFile] = useState('');
    const [transferred, setTransferred] = useState('');
    const [data, setData] = useState('');


    const _chooseFile = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.allFiles],
                copyTo: 'cachesDirectory'
            });
            console.log('res : ' + JSON.stringify(res));
            // console.log('URI : ' + res.uri);
            // console.log('Type : ' + res.type);
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

    const uploadFile = () => {
        if (!file) {
            Alert.alert("Please pick the file/image!");
            return;
        }
        try {
            const reference = storage().ref(`/myfiles/${file.name}`);
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
            Alert.alert(error);
            console.error(error);
        }
    }

    const SavingData = async () => {
        try {
            const refDoc = await firestore().collection('coba_data').add({
                try: data,
                fileData: file.name,
            });
            const docId = refDoc.id;

            if (!file) {
                Alert.alert('Warning!', 'Please pick file or image!', '');
                return;
            }
            if (file) {
                const ref = storage().ref(`/myfiles/coba/${docId}/${file.name}`);
                const task = ref.putFile(file.fileCopyUri.replace('files://', ''));

                task.on("state_changed", (taskSnapshot) => {
                    const progress = Math.round((taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100);
                    setTransferred(progress);
                    console.log(progress, '%');
                    ToastAndroid.show(progress + '%', ToastAndroid.SHORT);
                })
                task.then(() => {
                    Alert.alert('Success', 'file/image uploaded in the bucket');
                    setTransferred('');
                })
                setFile({});
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <Text style={styles.text}>Dummy</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', margin: 5 }}>
                {/* <TouchableOpacity style={styles.buttonTouch} onPress={uploadFile}>
                    <Text style={styles.textButtonTouch}>Upload</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 5, justifyContent: 'center' }} onPress={_chooseFile}>
                    <Text style={styles.textChooseFile}>{file.name ? file.name : "Choose File"}</Text>
                </TouchableOpacity> */}
            </View>
            <View style={styles.contain}>
                <Text style={styles.txtBold}>sfw</Text>
                <TextInput
                    placeholder='input here'
                    value={data}
                    onChangeText={(text) => setData(text)}
                    style={styles.constinInput}
                />
            </View>
            <View style={styles.contain}>
                <Text style={styles.txtBold}>File</Text>
                <View style={{ flexDirection: 'row', marginLeft: 90, marginHorizontal: width * 0.35 }}>
                    <TouchableOpacity style={styles.buttonTouch} onPress={uploadFile}>
                        <Text style={styles.textButtonTouch}>Upload</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ marginLeft: 5, justifyContent: 'center' }} onPress={_chooseFile}>
                        <Text style={styles.textChooseFile}>{file.name ? file.name : "Choose File"}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ marginTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center' }}>
                    <TouchableOpacity style={styles.btnSave} onPress={SavingData}>
                        <Text style={styles.txtSave}>Simpan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnCancel}>
                        <Text style={styles.txtCancel}>Batal</Text>
                    </TouchableOpacity>
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
    text: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: '#000',
        textAlign: 'center'
    },
    constinInput: {
        padding: 4,
        width: '65%',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10
    },
    container: {
        padding: 8,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#ccc'
    },
    contain: {
        marginVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 4,
        marginRight: 4
    },
    buttonTouch: {
        padding: 8,
        backgroundColor: '#ccc',
        borderRadius: 8,
        width: 85,
    },
    textButtonTouch: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
        color: 'black',
        textAlign: 'center'
    },
    textChooseFile: {
        textAlign: 'center',
        textAlignVertical: 'center',
        fontFamily: 'Poppins-Medium',
        fontSize: 12,
        margin: 3,
        top: 3,
        color: 'gray'
    },
    txtBold: {
        textAlignVertical: 'center',
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black',
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