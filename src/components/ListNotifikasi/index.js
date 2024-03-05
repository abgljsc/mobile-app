import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'

const ListNotifikasi = ({ data, input, setInput, onPress }) => {
    const [collectionData1, setCollectionData1] = useState([]);
    const [colllectionData2, setCollectionData2] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const collection1 = await firestore().collection('Cuti').get();
                setCollectionData1(collection1.docs.map(doc => doc.data()));

                const collection2 = await firestore().collection('surat_dinas').get();
                setCollectionData2(collection2.docs.map(doc => doc.data()));
            } catch (err) {
                console.error(err);
            }
        }
        fetchData();
    }, []);

    return (
        <View>
            <FlatList
                scrollEnabled={false}
                data={data}
                renderItem={({ item }) => {
                    if (input === "") {
                        return (
                            <View style={styles.Item}>
                                <TouchableOpacity style={styles.Container} onPress={onPress}>
                                    <Text style={styles.textTitle}>{item.title}</Text>
                                    <Text style={styles.textDetail}>{item.detail}</Text>
                                    <Text style={styles.textDate}>{item.date}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }

                    if (item.title.toLowerCase().includes(input.toLowerCase())) {
                        return (
                            <View style={styles.Item}>
                                <TouchableOpacity style={styles.Container} onPress={onPress}>
                                    <Text style={styles.textTitle}>{item.title}</Text>
                                    <Text style={styles.textDetail}>{item.detail}</Text>
                                    <Text style={styles.textDate}>{item.date}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }
                }}
            />
        </View>
    )
}

export default ListNotifikasi

const styles = StyleSheet.create({
    Item: {
        marginVertical: 6,
        alignItems: 'center',
    },
    Container: {
        padding: 6,
        borderRadius: 5,
        width: '95%',
        backgroundColor: 'white',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
    },
    textTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Inter-Medium',
        color: 'black'
    },
    textDetail: {
        fontSize: 14,
        fontFamily: 'Inter-Regular',
        margin: 1
    },
    textDate: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        textAlign: 'right',
        margin: 1
    }
})