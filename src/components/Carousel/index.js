import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, Animated, Dimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

const { width } = Dimensions.get('window').width;

const Carousel = () => {
    const flatListRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const data = Array.from({ length: 20 }).map((_, i) => {
        return {
            id: i,
            img: `https://source.unsplash.com/random/400x100?sig=${i}`
        }
    });

    useEffect(() => {
        const intv = setInterval(() => {
            const nextIndex = (currentIndex + 1) % data.length;
            flatListRef.current.scrollToIndex({
                index: nextIndex,
                Animated: true
            });
            setCurrentIndex(nextIndex);
        }, 5000);
        return () => clearInterval(intv);
    }, [currentIndex, data.length]);

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={data}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.container}>
                        <Image
                            source={{ uri: item.img }}
                            style={{ width: 400, height: 100, justifyContent: 'center', borderRadius: 10 }}
                        />
                    </TouchableOpacity>)}
                onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
                    setCurrentIndex(newIndex);
                }}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
            />
        </View>
    )
}

export default Carousel

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
        width: 400
    }
})