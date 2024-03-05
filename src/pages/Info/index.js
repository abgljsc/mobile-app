import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, ToastAndroid, PermissionsAndroid, Dimensions, } from 'react-native'
import React, { useEffect, useState, } from 'react'
import { Back, Bell, Calendar, Delete, Kompas, UserDef } from '../../assets'
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const { width } = Dimensions.get('window');

export default function Info({ onPress }) {
    const navigation = useNavigation();
    const user = auth().currentUser.displayName;

    // geolocation
    const lat1 = -7.2059; const lat2 = -7.2165;
    const lon1 = 112.7345; const lon2 = 112.7324;

    const [lat] = useState(-7.2059);
    const [lon] = useState(112.7345);

    // perhitungan jarak antara 2 lokasi
    const countLoc = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const toRadians = (deg) => (deg * Math.PI / 180);
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
        return distance.toFixed(1);
    };

    const dist = countLoc(lat1, lat2, lon1, lon2);

    // permission for access location
    useEffect(() => {
        async function LocationPermission() {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'Can we access your location? ',
                        buttonPositive: 'Yes',
                        buttonNegative: 'No'
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can access location!');
                } else {
                    console.log('You can not access location!');
                }
            } catch (err) {
                console.error(err);
            }
        }
        // LocationPermission();
    });

    const api_key = "aBcBRgjZ6MUBWKYaihjX8XYgB0MgZx3B" // geocodify API
    const myAPI_key = "d31c2b2ea25b413093297c77f9c51f50" // geoapify API
    const [address, setAddress] = useState('');

    // reverse geocode using geoapify
    const reverseGeocoding = (lat, lon) => {
        fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${myAPI_key}`)
            .then(response => response.json())
            .then(result => {
                if (result.features.length) {
                    var addressComponent = (result.features[0].properties.street);
                    // console.log(addressComponent);
                    setAddress(addressComponent);
                } else {
                    console.log("No address found");
                }
            });
    }

    const locationAddress = reverseGeocoding(lat, lon);

    const goingBack = () => {
        navigation.goBack
    }

    //  data jam masuk & jam keluar
    const [data, setData] = useState('');
    useEffect(() => {
        async function fetchData() {
            const userReference = firestore().collection('recordTimes')
            userReference.onSnapshot(querySnapshot => {
                const data = []
                querySnapshot.forEach((doc) => {
                    const { dateCreate, TimeIn, TimeOut } = doc.data()
                    data.push({ id: doc.id, TimeIn, TimeOut, dateCreate })
                })
                setData(data)
            })
        }
        fetchData();
    }, []);

    const deleteData = async () => {
        try {
            await firestore().collection('recordTimes')
                .doc('')
                .delete()
                .then(() => {
                    console.log('User deleted!');
                });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.page}>
            <View style={styles.container}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => navigation.navigate("Main")}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.txt}>Informasi</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/*  cuti besar dan cuti tahunan */}
                <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 8, }}>
                    <TouchableOpacity style={styles.containerCuti}>
                        <Calendar />
                        <View style={styles.lineContainer} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.txtTitle}>Cuti Besar</Text>
                            <Text style={styles.txtDsc}>25 Hari</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.containerCuti2}>
                        <Calendar />
                        <View style={styles.lineContainer} />
                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.txtTitle}>Cuti Tahunan</Text>
                            <Text style={styles.txtDsc}>12 Hari</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                {/* jarak lokasi A & lokasi B */}
                <View style={{ marginVertical: 6 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 6 }}>
                        <TouchableOpacity style={{ flexDirection: 'row', marginLeft: 6 }}>
                            <Kompas />
                            <View style={{ flexDirection: 'column', marginLeft: 15 }}>
                                <Text style={styles.txtKompas}>Jarak</Text>
                                <Text style={styles.txtKM}>{dist}km</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Notifikasi')}>
                            <Bell />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.lineV} />
                {/* lokasi */}
                <View style={{ marginVertical: 6 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ alignSelf: 'center' }}>
                            <UserDef />
                        </View>
                        {/* <View style={styles.lineH} /> */}
                        <View style={{ flexDirection: 'column', marginLeft: 20 }}>
                            <View style={{ flexDirection: 'row', marginVertical: 3 }}>
                                <Text style={styles.txtSmall}>Hello,</Text>
                                <Text style={styles.txtAddress}>{user ? user : 'Guest'}</Text>
                            </View>
                            {/* convert lat lon to loc address */}
                            <View style={{ flexDirection: 'row', bottom: 3, justifyContent: 'space-between' }}>
                                <Text style={styles.txtSmall}>Lokasi:</Text>
                                <Text style={styles.txtAddress}>{address}</Text>
                            </View>
                            <TouchableOpacity style={styles.btnLok} onPress={onPress}>
                                <Text style={styles.txtButton}>Ubah Lokasi</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.lineV} />
                {/* Absensi Terakhir */}
                <View style={{ margin: 4, borderRadius: 10, }}>
                    <Text style={styles.titleColumn}>Data Presensi</Text>
                    <View style={{ margin: 3 }}>
                        <FlatList
                            data={data}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.containerPresensi}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 3 }}>
                                        {/* <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15, color: 'black', textAlign: 'left' }}>Tanggal</Text> */}
                                        <Text style={{ fontFamily: 'Poppins-Medium', fontSize: 15, color: 'black', textAlign: 'right' }}>{item.dateCreate}</Text>
                                        {/* <TouchableOpacity>
                                            <Delete />
                                        </TouchableOpacity> */}
                                    </View>
                                    <Text style={{ height: 0.9, width: '100%', backgroundColor: '#ccc', justifyContent: 'center', margin: 3 }} />
                                    <View style={{ flexDirection: "row", justifyContent: 'space-between', margin: 4 }}>
                                        <View style={{ width: 65, padding: 5, backgroundColor: 'darkgreen', borderRadius: 7 }}>
                                            <Text style={{ fontFamily: 'Poppins-Medium', color: 'white', fontSize: 14, textAlign: 'center' }}>Masuk</Text>
                                        </View>
                                        <View style={{ marginTop: 2, marginBottom: 2, marginRight: 2, justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', color: 'black', fontSize: 18, textAlignVertical: 'center', textAlign: "center" }}>{item.TimeIn}</Text>
                                        </View>
                                        <View style={{ width: 65, padding: 5, backgroundColor: 'darkred', borderRadius: 7 }}>
                                            <Text style={{ fontFamily: 'Poppins-Medium', color: 'white', fontSize: 14, textAlign: 'center' }}>Keluar</Text>
                                        </View>
                                        <View style={{ marginTop: 2, marginBottom: 2, marginRight: 2, justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: 'Poppins-SemiBold', color: 'black', fontSize: 18, textAlignVertical: 'center', textAlign: "center" }}>{item.TimeOut}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
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
    container: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white'
    },
    txt: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        marginRight: 150
    },
    containerData: {
        padding: 8,
        width: '95%',
        borderRadius: 10,
        backgroundColor: 'azure',
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { height: 3, width: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignSelf: 'center'
    },
    txtDate: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 15,
        textAlign: 'right',
        textAlignVertical: 'center',
        color: 'black'
    },
    containerPresensi: {
        padding: 8,
        width: '85%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'aliceblue',
        marginVertical: 5,
        shadowColor: "#ccc",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        margin: 5,
    },
    containerCuti: {
        padding: 6,
        width: '45%',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#ccc',
        backgroundColor: 'azure',
        flexDirection: 'row',
        marginVertical: 10,
        marginLeft: 3,
        marginRight: 4,
        shadowColor: "#ccc",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    containerCuti2: {
        padding: 6,
        width: '45%',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#ccc',
        backgroundColor: 'azure',
        flexDirection: 'row',
        marginVertical: 10,
        marginLeft: 3,
        marginRight: 4,
        shadowColor: "#ccc",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    lineContainer: {
        height: 45,
        width: 0.9,
        backgroundColor: '#cccc',
        alignSelf: 'center',
        margin: 5,
    },
    lineH: {
        height: '110%',
        width: 0.5,
        backgroundColor: '#ccc',
        alignSelf: 'center'
    },
    lineV: {
        width: '98%',
        height: 0.5,
        backgroundColor: '#ccc',
        alignSelf: 'center'
    },
    txtTitle: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center',
        marginLeft: 5,
    },
    txtDsc: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        textAlignVertical: 'center',
        textAlign: 'center',
        flexDirection: 'row'
    },
    text: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white'
    },
    txtKompas: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 16,
        color: 'black',
        textAlignVertical: 'center',
        textAlign: 'left'
    },
    txtKM: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        textAlign: 'left',
        textAlignVertical: 'center'
    },
    txtAddress: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: 'black',
        textAlignVertical: 'center',
    },
    txtSmall: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        textAlignVertical: 'center',
        color: 'gray'
    },
    btnLok: {
        padding: 5,
        width: '100%',
        borderRadius: 10,
        backgroundColor: 'deepskyblue',
        borderWidth: 1,
        borderColor: 'skyblue'
    },
    txtButton: {
        fontSize: 18,
        fontFamily: 'Poppins-Medium',
        textAlignVertical: 'center',
        textAlign: 'center',
        color: 'white'
    },
    titleColumn: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: 'black',
        marginLeft: 6
    }

})