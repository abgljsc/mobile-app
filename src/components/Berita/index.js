import { StyleSheet, Text, View, Dimensions, TouchableOpacity, FlatList, Image } from 'react-native'
import React from 'react'

const article = Array.from({ length: 5 }).map((_, i) => {
    return {
        id: i,
        title: 'Feguiat consectetur.',
        body: 'Pretium lectus quam id leo in vitae. Laoreet non curabitur gravida arcu. Tortor consequat id porta nibh venenatis.',
        img: `https://picsum.photos/1440/2840?random=${i}`,
        date: '20 Jan 2022'
    }
});

const Berita = () => {
    return (
        <View>
            <FlatList
                data={article}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.container}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={{ uri: item.img }} style={styles.images} />
                            <View style={{ flexDirection: 'column', marginLeft: 2 }}>
                                <Text style={styles.judul}>{item.title}</Text>
                                <Text style={styles.isi}>{item.body}</Text>
                                <View style={{ width: '96%', height: 2, alignSelf: 'center', backgroundColor: '#ccc', margin: 2 }} />
                                <Text style={styles.tanggal}>{item.date}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default Berita;

const { width } = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        padding: 8,
        width: '100%',
        borderRadius: 10,
        marginVertical: 0,
        alignSelf: 'center'
    },
    text: {
        marginLeft: width * 0.03,
        padding: 6,
        flex: 1,
    },
    judul: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        color: 'black',
        textAlignVertical: 'center',
        flexWrap: 'wrap',
        width: 280,
        marginLeft: 2
    },
    isi: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: 'grey',
        textAlignVertical: 'center',
        width: 280,
        flexWrap: 'wrap',
        marginLeft: 2
    },
    tanggal: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 14,
        color: 'black',
        textAlign: 'right',
        marginRight: 4
    },
    images: {
        height: 100,
        width: 100,
        borderRadius: 10,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'navy'
    },
})