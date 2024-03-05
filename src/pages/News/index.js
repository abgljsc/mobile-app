import { View, Text, StyleSheet, Dimensions, ImageBackground, FlatList, Image, TouchableOpacity, Animated, } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Back } from '../../assets';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const data = Array.from({ length: 10 }).map((_, i) => {
    return {
        id: i,
        title: `nunc sed blandit libero volutpat sed cras ornare`,
        body: `Ut tincidunt tincidunt erat. Sed cursus turpis vitae tortor. Quisque malesuada placerat nisl.`,
        image: `https://picsum.photos/1440/2840?random=${i}`,
        date: `10 Mar 2020`
    };
});

const article = Array.from({ length: 50 }).map((_, i) => {
    return {
        id: i,
        title: 'amet venenatis urna cursus eget nunc scelerisque viverra',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.',
        pict: `https://picsum.photos/200/400?random=${i}`,
        user: 'admin',
        date: '20 Okt 2022'
    }
});

export default function News({ onPress }) {
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % data.length;
            flatListRef.current.scrollToIndex({
                index: nextIndex,
                Animated: true,
            });
            setCurrentIndex(nextIndex);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex, data.length]);

    const renderPagination = () => {
        return (
            <View style={styles.paging}>
                {data.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.pagingDot,
                            index === currentIndex ? styles.pagingDotActive : styles.pagingDotInactive,
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={styles.page}>
            <View style={styles.contain}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.txtContain}>News</Text>
                </View>
            </View>
            {/* carousel img */}
            <View style={{ top: 4 }}>
                <FlatList
                    ref={flatListRef}
                    data={data}
                    initialNumToRender={1}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window'));
                        setCurrentIndex(newIndex);
                    }}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.container}>
                            <ImageBackground style={styles.image} source={{ uri: item.image }} >
                                <View style={{ flexDirection: "column", top: 70 }} >
                                    <Text style={styles.txtSlideTitle}>{item.title}</Text>
                                    <Text style={styles.txtSlideBody}>{item.date}</Text>
                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    )}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                />
                <View style={{ top: 40 }}>
                    {renderPagination()}
                </View>
            </View>

            {/* reccomendation */}
            <View style={{ top: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginLeft: 10 }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Poppins-SemiBold', letterSpacing: 1, color: 'black' }}>reccomendation</Text>
                </View>
                <FlatList
                    data={article}
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.cntrNews} onPress={onPress}>
                            <View style={{ flexDirection: 'row' }}>
                                <Image source={{ uri: item.pict }} style={{ height: 100, width: 100, borderRadius: 10, justifyContent: 'center' }} />
                                <View style={{ flexDirection: 'column', marginLeft: 2, }}>
                                    <Text style={styles.txtTitle}>{item.title}</Text>
                                    <Text style={styles.txtBody}>{item.body}</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {/* <Text style={styles.txtUsername}>{item.user}</Text> */}
                                        <View style={{ width: 10, height: 10, borderRadius: 10 / 2, backgroundColor: 'lightgray', top: 8, marginLeft: 2, marginRight: 2 }} />
                                        <Text style={styles.txtDate}>{item.date}</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )} />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white'
    },
    contain: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white'
    },
    txtContain: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'black',
        marginRight: 150
    },
    txtTitle: {
        fontFamily: 'Inter-Bold',
        fontSize: 16,
        color: 'black',
        textAlignVertical: 'center',
        flexWrap: 'wrap',
        width: 290,
        marginLeft: 2
    },
    txtBody: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        textAlignVertical: 'center',
        color: 'gray',
        flexWrap: 'wrap',
        width: 290,
        marginLeft: 2
    },
    txtUsername: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 14,
        color: 'grey',
        textAlignVertical: 'center'
    },
    txtDate: {
        fontFamily: 'Poppins-Medium',
        fontSize: 14,
        color: 'black',
        textAlignVertical: 'center',
        top: 1,
        marginLeft: 5
    },
    cntrNews: {
        padding: 8,
        width: '100%',
        marginVertical: 1,
        alignSelf: 'center',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        height: 255,
        width: width,
    },
    image: {
        width: 355,
        height: 255,
        justifyContent: 'center'
    },
    txtSlideTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        flexWrap: 'wrap',
        color: 'white',
        width: 255,
        marginLeft: 3,
        marginRight: 3
    },
    txtSlideBody: {
        fontSize: 14,
        fontFamily: 'Poppins-Medium',
        letterSpacing: 1,
        color: 'whitesmoke',
        marginLeft: 4,
        marginRight: 4
    },
    paging: {
        bottom: 30,
        width: '100%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    pagingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 2,
    },
    pagingDotActive: {
        backgroundColor: 'dodgerblue',
    },
    pagingDotInactive: {
        backgroundColor: 'lightgray'
    },
})