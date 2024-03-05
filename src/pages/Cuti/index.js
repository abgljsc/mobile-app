import React, { Component } from "react";
import { View, Text, TouchableOpacity, Animated, ScrollView, Dimensions, StyleSheet } from "react-native";
import FormCuti from "../FormCuti";
import DataCuti from "../DataCuti";
import { Back } from "../../assets";

const { width } = Dimensions.get("window");

export default class App extends Component {
    state = {
        active: 0,
        xTabOne: 0,
        xTabTwo: 0,
        translateX: new Animated.Value(0),
        translateXTabOne: new Animated.Value(0),
        translateXTabTwo: new Animated.Value(width),
        translateY: -1000,
    };

    handleSlide = type => {
        let {
            active,
            xTabOne,
            xTabTwo,
            translateX,
            translateXTabOne,
            translateXTabTwo
        } = this.state;
        Animated.spring(translateX, {
            toValue: type,
            duration: 100,
            useNativeDriver: true
        }).start();
        if (active === 0) {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: width,
                    duration: 100,
                    useNativeDriver: true
                }).start()
            ]);
        } else {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -width,
                    duration: 100,
                    useNativeDriver: true
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true
                }).start()
            ]);
        }
    };

    render() {
        let {
            xTabOne,
            xTabTwo,
            translateX,
            active,
            translateXTabOne,
            translateXTabTwo,
            translateY,
        } = this.state;

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <TouchableOpacity onPress={this.props.navigation.goBack}>
                            <Back />
                        </TouchableOpacity>
                        <Text style={styles.txtContainer}>Cuti</Text>
                    </View>
                </View>
                <View
                    style={{
                        width: "90%",
                        marginLeft: "auto",
                        marginRight: "auto",
                        borderRadius: 20
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 10,
                            marginBottom: 10,
                            height: 36,
                            position: "relative"
                        }}
                    >
                        <Animated.View
                            style={{
                                position: "absolute",
                                width: "50%",
                                height: "100%",
                                top: 0,
                                left: 0,
                                // backgroundColor: "#007aff",
                                // backgroundColor: '#DCDCDC',
                                borderRadius: 4,
                                transform: [
                                    {
                                        translateX
                                    }
                                ]
                            }}
                        />
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                borderBottomWidth: 2,
                                borderBottomColor: active === 0 ? "#007aff" : "#ccc",
                                borderRadius: 4,
                                borderRightWidth: 0,
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0
                            }}
                            onLayout={event =>
                                this.setState({
                                    xTabOne: event.nativeEvent.layout.x,
                                })
                            }
                            onPress={() =>
                                this.setState({ active: 0 }, () =>
                                    this.handleSlide(xTabOne)
                                )
                            }
                        >
                            <Text
                                style={{
                                    color: active === 0 ? "#007aff" : "#ccc",
                                    fontSize: active === 0 ? 18 : 16,
                                    fontFamily: active === 0 ? 'Poppins-SemiBold' : 'Poppins-Regular'
                                }}
                            >
                                Pengajuan
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                                borderBottomWidth: 2,
                                borderBottomColor: active === 0 ? "#ccc" : "#007aff",
                                borderRadius: 4,
                                borderLeftWidth: 0,
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0
                            }}
                            onLayout={event =>
                                this.setState({
                                    xTabTwo: event.nativeEvent.layout.x
                                })
                            }
                            onPress={() =>
                                this.setState({ active: 1 }, () =>
                                    this.handleSlide(xTabTwo)
                                )
                            }
                        >
                            <Text
                                style={{
                                    color: active === 1 ? "#007aff" : "#ccc",
                                    fontSize: active === 1 ? 18 : 16,
                                    fontFamily: active === 1 ? 'Poppins-SemiBold' : 'Poppins-Regular'
                                }}
                            >
                                Data
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        <Animated.View
                            style={{
                                transform: [
                                    {
                                        translateX: translateXTabOne
                                    }
                                ]
                            }}
                            onLayout={event =>
                                this.setState({
                                    translateY: event.nativeEvent.layout.height
                                })
                            }
                        >
                            <View>
                                <FormCuti />
                            </View>
                        </Animated.View>

                        <Animated.View
                            style={{
                                transform: [
                                    {
                                        translateX: translateXTabTwo
                                    },
                                    {
                                        translateY: -translateY
                                    }
                                ]
                            }}
                        >
                            <View>
                                <DataCuti />
                            </View>
                        </Animated.View>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: 'white'
    },
    txtContainer: {
        fontFamily: 'Inter-SemiBold',
        fontSize: 18,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        marginRight: 180
    }
})