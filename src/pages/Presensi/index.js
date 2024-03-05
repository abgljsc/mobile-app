import { View, Text, StyleSheet, SafeAreaView, ToastAndroid, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Tap, TimeTap } from '../../assets';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function Presensi() {
    const [currTime, setCurrTime] = useState(new Date());
    const [currDate] = useState(new Date());
    const user = auth().currentUser;

    // interval for time
    useEffect(() => {
        intvId = setInterval(() => {
            setCurrTime(new Date());
        }, 1000);

        return () => {
            clearInterval(intvId);
        };
    }, []);

    const customFormatTime = (currTime) => {
        let jam = currTime.getHours();
        let menit = currTime.getMinutes();

        jam = jam % 12;
        menit = menit <= 10 ? '' + menit : menit;

        const timeZone = jam >= 12 ? 'AM' : 'PM';
        const timeString = jam + ':' + menit + ' ' + timeZone;

        return timeString;
    };

    const [absenMasuk, setAbsenMasuk] = useState("");
    const [absenKeluar, setAbsenKeluar] = useState("");
    const [totalJam, setTotalJam] = useState("");
    const [createDate] = useState(new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }));

    // absensi masuk
    const handleAbsensiMasuk = () => {
        const currentTimeIn = new Date();
        const formattedTimeIn = `${String(currentTimeIn.getHours()).padStart(2, '0')}:${String(currentTimeIn.getMinutes()).padStart(2, '0')}:${String(currentTimeIn.getSeconds()).padStart(2, '0')}`;
        setAbsenMasuk(formattedTimeIn);
        console.log('Success Masuk');
    };

    const handleKeluar = async () => {
        if (absenMasuk) {
            const currentTimeOut = new Date();
            const formattedTimeOut = `${String(currentTimeOut.getHours()).padStart(2, '0')}:${String(currentTimeOut.getMinutes()).padStart(2, '0')}:${String(currentTimeOut.getSeconds()).padStart(2, '0')}`;
            setAbsenKeluar(formattedTimeOut);
            console.log('Success Keluar');

            const startTime = Date.parse(`01/01/2024T${absenMasuk}Z`);
            const endTime = Date.parse(`01/01/2024T${absenKeluar}Z`)

            if (!isNaN(startTime) && !isNaN(endTime)) {
                const milliseconds = endTime - startTime;

                //  konversi milliseconds => jam,menit,detik
                const seconds = Math.floor(milliseconds / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);

                const totalTime = `${String(hours).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
                setTotalJam(totalTime);
                console.log(totalTime);
            }
            try {
                await firestore().collection('recordTimes').add({
                    TimeIn: absenKeluar,
                    TimeOut: absenMasuk,
                    // Hours: totalJam,
                    dateCreate: createDate
                })
                console.log('Data berhasil disimpan!');
                ToastAndroid.show('Data disimpan!', ToastAndroid.SHORT);
            } catch (error) {
                console.warn('Terjadi kesalahan ketika melakukan simpan data', error);
            }
        } else {
            ToastAndroid.show('AbsenMasuk terlebih dahulu!', ToastAndroid.SHORT);
            console.log('Belum melakukan AbsenMasuk');
        }
    }

    // absensi keluar
    const handleAbsensiKeluar = () => {
        if (absenKeluar) {
            const waktuAbsenKeluar = new Date().toLocaleTimeString();
            const waktuAbsenMasuk = new Date(absenMasuk);

            setAbsenKeluar(waktuAbsenKeluar);
            // perhitungan selisih waktu
            const selisihWaktu = waktuAbsenKeluar - waktuAbsenMasuk;

            // konversi waktu => jam, menit, detik
            const jam = Math.floor(selisihWaktu / (1000 * 60 * 60));
            const sisaSetelahJam = selisihWaktu % (1000 * 60 * 60);
            const menit = Math.floor(jam / (1000 * 60));
            const sisaSetelahMenit = sisaSetelahJam % (1000 * 60);
            const detik = Math.floor(sisaSetelahMenit / 1000);

            // format jam hh:mm:ss ke dalam string
            const hoursWork = `${String(jam).padStart(2, '0')}:${String(menit).padStart(2, '0')}:${String(detik).padStart(2, '0')}`;

            // setAbsenKeluar(waktuAbsenKeluar);
            // setTotalJamKerja(hoursWork);
            // console.log(hoursWork);

            try {
                firestore().collection('recordTimes').add({
                    time_in: absenMasuk,
                    time_out: absenKeluar,
                    total_hoursWork: totalJamKerja,
                    createdAt: createDate,
                });
                ToastAndroid.show('Data berhasil disimpan!', ToastAndroid.SHORT);
                console.log('Data berhasil disimpan!');
            } catch (err) {
                console.error(err);
            }
        } else {
            console.warn('Belum melakukan absenMasuk!');
            return false;
        }
    };

    return (
        <SafeAreaView style={styles.page}>
            {/* header component */}
            <View style={styles.headerContainer}>
                <Text style={styles.txtContainer}>Presensi</Text>
            </View>
            {/* header userProfile */}
            <View style={styles.containerUser}>
                <Image source={{ uri: 'https://picsum.photos/id/100/200/300' }} style={styles.image} />
                <View style={{ flexDirection: 'column', justifyContent: 'center', left: 10, bottom: 4 }}>
                    <Text style={styles.dispName}>Hi, {user.displayName ? user.displayName : 'Guest'}</Text>
                    <Text style={styles.position}>{user.email ? user.email : 'guest@email.com'}</Text>
                </View>
            </View>

            <View style={styles.containDay}>
                <Text style={styles.txtDate}>{currDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                <Text style={styles.txtTime}>{customFormatTime(currTime)}</Text>
            </View>

            <View style={styles.containButton}>
                <TouchableOpacity style={styles.buttonClockIn} onPress={handleAbsensiMasuk}>
                    <View style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'baseline', top: 10, left: 3 }}>
                        <Tap />
                    </View>
                    <Text style={styles.txtButton}>Clock in</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonClockOut} onPress={handleKeluar}>
                    <View style={{ alignSelf: 'center', justifyContent: 'center', alignItems: 'baseline', top: 10, left: 3 }}>
                        <Tap />
                    </View>
                    <Text style={styles.txtButton}>Clock out</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.containTime}>
                <View style={{ marginLeft: 8, marginRight: 10 }}>
                    <View style={{ alignItems: 'center', top: 5, bottom: 5, }}>
                        <TimeTap />
                    </View>
                    <Text style={styles.txtActualTime}>{absenMasuk ? absenMasuk : '00:00:00'}</Text>
                    <Text style={styles.txtClock}>Clock in</Text>
                </View>
                <View style={{ marginLeft: 8, marginRight: 10 }}>
                    <View style={{ alignItems: 'center', top: 5, bottom: 5, }}>
                        <TimeTap />
                    </View>
                    <Text style={styles.txtActualTime}>{absenKeluar ? absenKeluar : '00:00:00'}</Text>
                    <Text style={styles.txtClock}>Clock out</Text>
                </View>
                <View style={{ marginLeft: 8, marginRight: 10 }}>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    headerContainer: {
        padding: 8,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    txtContainer: {
        fontFamily: 'Inter-SemiBold',
        color: 'black',
        fontSize: 18,
        textAlignVertical: 'center',
        textAlign: 'center'
    },
    containerUser: {
        flexDirection: 'row',
        left: 10,
        right: 10,
        top: 10
    },
    image: {
        height: 70,
        width: 70,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: 'navy',
    },
    dispName: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        color: 'black',
        textAlign: 'left',
        textAlignVertical: 'center'
    },
    position: {
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        letterSpacing: 1
    },
    containButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginVertical: 10,
        top: 20,
    },
    containDay: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginVertical: 10,
        top: 20
    },
    containTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'center',
        marginVertical: 20,
        top: 20,
        bottom: 10
    },
    buttonClockIn: {
        width: 160,
        height: 160,
        borderRadius: 10,
        backgroundColor: 'darkgreen',
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        // left: 5,
        right: 5
    },
    buttonClockOut: {
        width: 160,
        height: 160,
        borderRadius: 10,
        backgroundColor: 'firebrick',
        alignSelf: 'center',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        left: 5,
        // right: 5
    },
    txtButton: {
        textAlign: 'center',
        justifyContent: 'center',
        fontFamily: 'Montserrat-SemiBold',
        fontSize: 18,
        color: 'white',
        letterSpacing: 1,
        top: 10
    },
    txtDate: {
        fontFamily: 'Poppins-Bold',
        color: 'black',
        fontSize: 14,
        textAlign: 'center',
        textAlignVertical: 'center',
        letterSpacing: 1
    },
    txtTime: {
        fontFamily: 'Lato-Bold',
        fontSize: 30,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    txtClock: {
        fontFamily: 'Montserrat-Bold',
        color: 'gray',
        fontSize: 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        bottom: 5,
        top: 1
    },
    txtActualTime: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        top: 10,
        bottom: 10
    },
})