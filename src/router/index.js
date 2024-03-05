import React, { useEffect, useState } from 'react'
import {
    Absen,
    AccountProfile,
    Chart,
    CurrVitae,
    Cuti,
    DataKeluarga,
    DataPendidikan,
    DataPersonal,
    EditData,
    FormCuti,
    FormLembur,
    FormSPPD,
    Home,
    Inbox,
    Info,
    Informasi,
    Lembur,
    Login,
    NewFormKeluarga,
    NewFormPendidikan,
    News,
    Notifikasi,
    Presensi,
    Profile,
    SPPD,
} from '../pages'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BottomTabNavigator } from '../components';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Klarifikasi from '../pages/Klarifikasi';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainApp = () => {
    return (
        <Tab.Navigator tabBar={props => <BottomTabNavigator {...props} />} screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Inbox" component={Inbox} />
            <Tab.Screen name="Presensi" component={Presensi} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    )
}

const getLoggedIn = () => {
    return true;
}

const Router = () => {
    const isLoggedIn = getLoggedIn;
    const [isSignedIn, setIsSignedIn] = useState('');

    useEffect(() => {
        const checkLogin = async () => {
            const userToken = AsyncStorage.getItem('');
            setIsSignedIn(userToken !== null);
        }
        checkLogin();
    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Main">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Main" component={MainApp} />
                <Stack.Screen name="Info" component={Info} />
                <Stack.Screen name="Cuti" component={Cuti} />
                <Stack.Screen name="News" component={News} />
                <Stack.Screen name="FormCuti" component={FormCuti} />
                <Stack.Screen name="Akun" component={AccountProfile} />
                <Stack.Screen name="Personal" component={DataPersonal} />
                <Stack.Screen name="SPPD" component={SPPD} />
                <Stack.Screen name="Form" component={FormSPPD} />
                <Stack.Screen name="Pendidikan" component={DataPendidikan} />
                <Stack.Screen name="FormPendidikan" component={NewFormPendidikan} />
                <Stack.Screen name="Lembur" component={Lembur} />
                <Stack.Screen name="FormLembur" component={FormLembur} />
                <Stack.Screen name="Absen" component={Absen} />
                <Stack.Screen name="Keluarga" component={DataKeluarga} />
                <Stack.Screen name="FormKeluarga" component={NewFormKeluarga} />
                <Stack.Screen name="Notifikasi" component={Notifikasi} />
                <Stack.Screen name="Curriculum" component={CurrVitae} />
                <Stack.Screen name="Edit" component={EditData} />
                <Stack.Screen name="Klarifikasi" component={Klarifikasi} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Router;