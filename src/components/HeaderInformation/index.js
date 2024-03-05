import { StyleSheet, Text, View, TouchableOpacity, Image, ToastAndroid, PermissionsAndroid, Platform, } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from 'react-native-image-picker';
import auth from '@react-native-firebase/auth'
import storage from '@react-native-firebase/storage'

const HeaderInformation = ({ navigation }) => {
    const date = new Date(Date.now());
    const event = { year: 'numeric', month: 'short', day: 'numeric', weekday: 'short' };
    const [currentTime, setCurrentTime] = useState(new Date());
    // const role = useState('Staff');
    const user = auth().currentUser;
    const [image, setImage] = useState(null);

    //  interval seconds
    useEffect(() => {
        // interval to update the clock every second
        intervalID = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        // clear interval
        return () => {
            clearInterval(intervalID);
        };
    }, []);

    const hours = currentTime.getHours().toString().padStart(2, '0');
    const minutes = currentTime.getMinutes().toString().padStart(2, '0');
    const seconds = currentTime.getSeconds().toString().padStart(2, '0');

    const requestExternalPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'External Storage Permission',
                        message: 'Apps needs permission',
                        buttonPositive: 'Yes',
                        buttonNegative: 'No'
                    }
                )
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (error) {
                ToastAndroid.show('Error:' + error, ToastAndroid.SHORT);
                console.warn(error);
            }
            return false;
        } else return true;
    }

    const _changeImage = async () => {
        const result = await ImagePicker.launchImageLibrary({
            mediaType: 'photo',
            maxWidth: 100,
            maxHeight: 100,
            quality: 1,
        });
        const isStoragePermitted = await requestExternalPermission();

        if (isStoragePermitted) {
            ImagePicker.launchImageLibrary(result, (response) => {
                console.log('Response = ', response);

                if (response.didCancel) {
                    console.log('Batal');
                    ToastAndroid.show('User Cancel pick', ToastAndroid.SHORT);
                    return;
                } else if (response.errorCode == 'camera_unavailable') {
                    ToastAndroid.show('Camera not unavailable', ToastAndroid.SHORT);
                    return;
                } else if (response.errorCode == 'permission') {
                    ToastAndroid.show('Permission not satisfied', ToastAndroid.SHORT);
                    return;
                } else if (response.errorCode == 'others') {
                    ToastAndroid.show(response.errorMessage, ToastAndroid.SHORT);
                    return;
                }
                console.log('width -> ', response.width);
                console.log('height -> ', response.height);
                console.log('fileSize -> ', response.fileSize);
                console.log('type -> ', response.type);
                console.log('fileName -> ', response.fileName);
                console.log('base64 ->', response.base64);
                console.log('uri ->', response.uri);
                setImage(response);
            });
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ right: 7, }}>
                <TouchableOpacity onPress={_changeImage}>
                    <Image source={{ uri: 'https://picsum.photos/id/100/200/300' }} style={styles.picture} />
                </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
                <View style={styles.textWrapper}>
                    <Text style={styles.username}>Halo,{user.displayName ? user.displayName : 'Guest'}</Text>
                    <Text style={styles.hello}>{user.email ? user.email : 'guest@email.com'}</Text>
                </View>
                <View style={styles.date}>
                    <TouchableOpacity onPress={() => navigation.navigate('Kehadiran')}>
                        <Text style={styles.tanggal}>{date.toLocaleDateString("id", event)}</Text>
                    </TouchableOpacity>
                    <Text style={styles.waktu}>{`${hours}:${minutes}:${seconds}`}</Text>
                </View>
            </View>
        </View >
    )
}

export default HeaderInformation;

const styles = StyleSheet.create({
    container: {
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 4,
        marginRight: 4,
        alignSelf: 'center'
    },
    userInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: 10,
        right: 20
    },
    date: {
        flexDirection: 'column',
        textAlign: 'right',
        textAlignVertical: 'center',
        left: 20,
        right: 10,
        top: 2
    },
    waktu: {
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        color: 'black',
        top: 3,
        textAlign: 'right',
        textAlignVertical: 'center',
        letterSpacing: 0.5
    },
    tanggal: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 16,
        color: 'black',
        textAlignVertical: 'center'
    },
    textWrapper: {
        paddingLeft: 6,
        marginLeft: 4,
        marginRight: 4,
        textAlign: 'left',
        textAlignVertical: 'center',
        flexDirection: 'column',
    },
    username: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
        color: 'black',
        // marginTop: 2,
        textAlignVertical: 'center',
        marginLeft: 4,
        marginRight: 5
    },
    hello: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        textAlignVertical: 'center',
        top: 3,
        marginLeft: 4,
    },
    picture: {
        height: 65,
        width: 65,
        borderRadius: 65 / 2,
        borderWidth: 1,
        borderColor: 'navy',
    }

})