import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { IconPaper, IconCuti, IconInformasi, IconKehadiran, IconLembur, IconSPPD, } from '../../assets';

const ListMenu = ({ title, active, onPress }) => {
    const Icon = () => {
        if (title === "Absen") return <IconKehadiran />;
        if (title === "Cuti") return <IconCuti />;
        if (title === "SPPD") return <IconSPPD />;
        if (title === "Lembur") return <IconLembur />;
        if (title === "Informasi") return <IconInformasi />;
        if (title === "News") return <IconPaper />;
        return <IconInformasi />
    };

    return (
        <TouchableOpacity style={styles.container(active)} onPress={onPress}>
            <View style={styles.icon}>
                <Icon />
            </View>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};

export default ListMenu;

const styles = StyleSheet.create({
    container: (active) => ({
        alignItems: 'center',
        backgroundColor: active ? 'aliceblue' : 'peachpuff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        width: 100,
        marginBottom: 15,
        marginRight: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }),
    text: ({
        fontFamily: 'Lato-Bold',
        fontSize: 18,
        width: 80,
        color: 'black',
        top: 2,
        textAlign: 'center',
        textAlignVertical: 'center',
        alignSelf: 'center'
    }),
    icon: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginVertical: 2
    }
});