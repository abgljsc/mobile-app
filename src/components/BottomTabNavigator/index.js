import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import TabItem from '../TabItem';

const BottomTabNavigator = ({ state, descriptors, navigation, }) => {
    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        // The `merge: true` option makes sure that the params inside the tab screen are preserved
                        navigation.navigate({ name: route.name, merge: true });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity>
                        <TabItem
                            key={index}
                            label={label}
                            isFocused={isFocused}
                            onLongPress={onLongPress}
                            onPress={onPress}
                        />
                        {/* <Text style={{ color: isFocused ? 'black' : 'gray', justifyContent: 'center', alignSelf: 'center', fontFamily: isFocused ? 'Poppins-SemiBold' : 'Poppins-Medium' }}>
                            {label}
                        </Text> */}
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

export default BottomTabNavigator

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        padding: 4,
        width: width,
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#ccc',
        borderTopRightRadius: 5,
        borderTopLeftRadius: 5,
    },
})