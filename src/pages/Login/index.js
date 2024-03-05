import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity, ToastAndroid, Image, Alert, } from 'react-native'
import React, { useState } from 'react'
import { ImageLogin } from '../../assets';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

export default function Login({ onPress }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [LoginMessage, setLoginMessage] = useState('');
    const navigation = useNavigation();

    /* akun
        username: JohnDoe
        password: JohnDoe
    */

    const isPasswordValid = () => {
        if (password.length < 8) {
            ToastAndroid.show('Error', 'Password must be at least 8 characters long!', ToastAndroid.SHORT);
            console.log('Password kurang dari 8 karakter!');
            return false;
        }
        const uniquePassword = new Set(password);
        if (uniquePassword.size !== password.length) {
            ToastAndroid.show('Error', 'Password must have unique characters!', ToastAndroid.SHORT);
            console.log('Password not unique!');
            return false;
        }
        return true;
    }

    const handleLogin = async () => {
        try {
            if (!isPasswordValid) {
                Alert.alert('Error', 'Password invalid!');
                console.log('Password tidak valid!');
                return;
            }
            const userCredentials = await auth().signInWithEmailAndPassword(`${username}@email.com`, password);
            const userDoc = await firestore().
                collection('user').
                doc((userCredentials).user.uid).get()
            const userData = userDoc.data;
            if (userData) {
                navigation.navigate("Main");
                console.log('Berhasil Login!');
                ToastAndroid.show('Berhasil login', ToastAndroid.SHORT);
            }
        } catch (error) {
            console.error('Error: ', error);
        }
    }

    const LoginwithUserPassword = async () => {
        try {
            if (!isPasswordValid) {
                // Alert.alert('Error', 'Password invalid!');
                console.log('Invalid!');
                return;
            }
            const userCredent = await auth().signInWithEmailAndPassword(username, password);
            const userData = await firestore()
                .collection('users')
                .doc((userCredent).user.uid)
                .get();
            if (!userData.exists) {
                const userCredential = await auth().createUserWithEmailAndPassword('jessijc@email.com', 'dinoAyam');
                const userDataRef = await firestore()
                    .collection('users')
                    .doc((userCredential).user.uid)
                    .get();
                const user = userDataRef.data;
                if (user) {
                    // Alert.alert('Warning!', 'User not found!');
                    console.log('Error!');
                }
            }
            if (userData.exists) {
                navigation.navigate("Main");
                // Alert.alert('Success', 'Berhasil login');
            }
        } catch (error) {
            // Alert.alert('Error!', error);
            console.error('Error: ', error);
        }
    }

    const LoginValidation = async (username, password) => {
        try {
            const userRef = firestore().collection('user');
            const userDoc = await userRef.where('username', '==', username).get()

            if (userDoc.empty) {
                ToastAndroid.show('Username invalid!', ToastAndroid.SHORT);
                console.log('Username tidak ada!');
                return { success: false, message: 'Username tidak ada!' };
            }

            const userData = userDoc.docs[0].data();
            if (userData.password === password) {
                await auth().signInWithEmailAndPassword(userData.email, password);
                ToastAndroid.show('Success login!', ToastAndroid.SHORT);
                console.log('Login Berhasil!');
                return { success: true, message: 'Succes login!' };
            } else {
                ToastAndroid.show('Password invalid!', ToastAndroid.SHORT);
                console.log('Password tidak ada!');
                return { success: false, message: 'Password tidak ada!' };
            }
        } catch (err) {
            console.error(err);
            return { success: false, message: err.message };
        }
    }

    const loginWithUsername = async () => {
        const res = await LoginValidation(username, password);
        if (res.success) {
            setLoginMessage(res.message);
            navigation.navigate("Main");
            console.log('User login!');
        } else {
            setLoginMessage(res.message);
            console.warn(res.message);
        }
    }

    const SignIn = () => {
        auth().signInWithEmailAndPassword('jessijc@email.com', 'dinoAyam')
            .then(() => {
                console.log('User signed in!');
                navigation.navigate("Main");
            })
            .catch(error => {
                if (error.code === 'auth/email-already-in-use') {
                    console.log('That email address is already in use!')
                }
                if (error.code === 'auth/invalid-email') {
                    console.log('That email address is invalid!');
                }

                console.error(error);
            })
    };

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <View style={styles.Title}>
                    <Text style={styles.textTitle}>Login</Text>
                    <View style={{ alignSelf: 'center', marginTop: 10, marginBottom: 10 }}>
                        <Image source={ImageLogin} style={{ width: 90, height: 90, }} />
                    </View>
                </View>
                <View style={styles.user}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        placeholder='Username'
                        value={username}
                        maxLength={255}
                        onChangeText={(text) => setUsername(text)}
                        style={styles.input}
                    />
                </View>
                <View style={styles.pass}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry={true}
                        placeholder='Password'
                        value={password}
                        maxLength={12}
                        onChangeText={(text) => setPassword(text)}
                    />
                </View>
                {/* <Text style={styles.txtWarn(active)}>{user.displayName}</Text> */}
                <View>
                    <View style={styles.button}>
                        <TouchableOpacity onPress={loginWithUsername}>
                            <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 17, color: '#FFF', textAlign: 'center' }}>Log in</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 10 }}>
                        <Text style={{ fontFamily: 'Inter-Medium', fontSize: 16, color: 'black' }}>Forgot your password ? </Text>
                        <TouchableOpacity>
                            <Text style={{ fontFamily: 'Inter-Medium', fontSize: 15, color: 'red' }}>reset password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        flex: 1
    },
    container: {
        backgroundColor: 'rgba(240,255,255,180)',
        // backgroundColor: 'lightskyblue',
        width: 355,
        padding: 8,
        // opacity: 0.75,
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: '#212121',
        //marginLeft: 20,
        shadowColor: "#ccc",
        shadowOffset: { width: 0, height: 3, },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 7,
        marginTop: width * 0.40,
        alignSelf: 'center'
    },
    user: {
        marginVertical: 4,
        marginLeft: width * 0.05
    },
    pass: {
        marginVertical: 4,
        marginLeft: width * 0.05
    },
    textTitle: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 28,
        color: '#000'
    },
    Title: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10,
    },
    input: {
        fontSize: 14,
        padding: 10,
        width: 300,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        backgroundColor: 'white'
    },
    button: {
        padding: 6,
        width: 300,
        backgroundColor: '#00bfff',
        borderRadius: 18,
        borderWidth: 0.5,
        borderColor: 'white',
        // marginVertical: 5,
        marginTop: 18,
        alignContent: 'center',
        marginLeft: 16
    },
    text: {
        textAlign: 'center',
        marginLeft: 18,
        marginTop: height * 0.01
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Inter-SemiBold',
        margin: 4
    },
    txtWarn: (active) => ({
        color: active ? 'black' : 'red',
    })
})