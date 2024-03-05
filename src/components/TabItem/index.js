import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { IconCalen, IconCalenAktif, IconMail, IconMailAktif, IconMain, IconMainAktif, IconProfile, IconProfileAktif, } from '../../assets';

const TabItem = ({ label, isFocused, onLongPress, onPress, active, index }) => {
    const Icon = () => {
        if (label === "Home") {
            return isFocused ? <IconMainAktif /> : <IconMain />;
        }

        if (label === "Inbox") {
            return isFocused ? <IconMailAktif /> : <IconMail />;
        }

        if (label === "Presensi") {
            return isFocused ? <IconCalenAktif /> : <IconCalen />;
        }

        if (label === "Profile") {
            return isFocused ? <IconProfileAktif /> : <IconProfile />;
        }
    }

    return (
        <TouchableOpacity
            key={index}
            onPress={onPress}
            onLongPress={onLongPress}
            label={label}
        >
            <View style={{ flexDirection: 'column', justifyContent: 'center', }}>
                <View style={styles.icons}>
                    <Icon />
                </View>
                <Text style={styles.txt(active)}>{label}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default TabItem

const styles = StyleSheet.create({
    txt: (active) => ({
        color: active === active ? 'black' : 'gray',
        fontFamily: active === active ? 'Poppins-Medium' : 'Poppins-SemiBold',
        fontSize: 14,
        textAlign: 'center',
    }),
    icons: {
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'center',
    }
})