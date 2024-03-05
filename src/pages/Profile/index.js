import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ToastAndroid, } from 'react-native'
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Family, File, Horn, News, Personal, Posisi, School, Settings, Out, } from '../../assets'
import auth from '@react-native-firebase/auth'

const Profile = ({ onPress }) => {
    const navigation = useNavigation();
    const user = auth().currentUser;

    const Signout = async () => {
        auth()
            .signOut()
            .then(() => {
                console.log('signed out!');
                ToastAndroid.show('User Sign Out!', ToastAndroid.SHORT);
                // navigation.goBack
                navigation.navigate("Login");
            })
    }

    const out = () => {
        navigation.navigate("Login");
        // navigation.goBack;
        console.log('Tap Out!');
    }

    return (
        <View style={styles.page}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity style={{ marginHorizontal: 8, flexDirection: 'row', marginTop: 10, }} onPress={() => navigation.navigate('Akun')}>
                    <Image source={{ uri: 'https://picsum.photos/id/100/200/300' }} style={styles.image} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.txtUsername}>{user.displayName ? user.displayName : 'Guest'}</Text>
                        <Text style={styles.txt}>Account Profile</Text>
                    </View>
                </TouchableOpacity>
                <View>
                    <View style={styles.label}>
                        <Text style={styles.text}>Menu</Text>
                    </View>
                    <TouchableOpacity style={styles.itemMenu}>
                        <Image source={Posisi} style={styles.icon} />
                        <Text style={styles.textIcon}>History Jabatan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemMenu} onPress={() => navigation.navigate('Personal')}>
                        <Image source={Personal} style={styles.icon} />
                        <Text style={styles.textIcon}>Data Personal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemMenu} onPress={() => navigation.navigate('Keluarga')}>
                        <Image source={Family} style={styles.icon} />
                        <Text style={styles.textIcon}>Data Keluarga</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemMenu} onPress={() => navigation.navigate('Pendidikan')}>
                        <Image source={School} style={styles.icon} />
                        <Text style={styles.textIcon}>Data Pendidikan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemMenu} onPress={() => navigation.navigate('Curriculum')}>
                        <Image source={File} style={styles.icon} />
                        <Text style={styles.textIcon}>Curriculum Vitae</Text>
                    </TouchableOpacity>
                    <View style={styles.label}>
                        <Text style={styles.text}>Service</Text>
                    </View>
                    <TouchableOpacity style={styles.itemMenu} onPress={() => navigation.navigate('News')}>
                        <Image source={News} style={styles.icon} />
                        <Text style={styles.textIcon}>Berita</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemMenu}>
                        <Image source={Horn} style={styles.icon} />
                        <Text style={styles.textIcon}>Pengumuman</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemMenu} onPress={onPress}>
                        <Image source={Settings} style={styles.icon} />
                        <Text style={styles.textIcon}>Pengaturan</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemMenu} onPress={Signout}>
                        <Image source={Out} style={styles.icon} />
                        <Text style={styles.txtOut}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    search: {
        padding: 1,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        width: '95%',
        marginTop: 14,
        marginHorizontal: 8,
        marginVertical: 20,
        backgroundColor: 'whitesmoke',
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        textAlignVertical: 'center',
        flex: 1
    },
    image: {
        width: 55,
        height: 55,
        borderRadius: 55 / 2,
        borderWidth: 1,
        borderColor: 'skyblue'
    },
    label: {
        padding: 6,
        paddingHorizontal: 14,
        marginTop: 8,
    },
    text: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 22,
        color: '#483d8b',
        textAlignVertical: 'center'
    },
    icon: {
        width: 35,
        height: 35,
        marginHorizontal: 12,
        alignItems: 'center',
    },
    textIcon: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginLeft: 6,
        letterSpacing: 1
    },
    itemMenu: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    txtOut: {
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginLeft: 6,
        letterSpacing: 1
    },
    txtUsername: {
        fontFamily: 'Inter-Bold',
        fontSize: 18,
        color: 'black',
        marginLeft: 16,
        textAlignVertical: 'center'
    },
    txt: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        marginLeft: 16,
        textAlignVertical: 'center',
        color: 'gray',
        letterSpacing: 1
    }
})