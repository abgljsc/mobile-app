import { StyleSheet, View, Text, ScrollView } from 'react-native'
import { Berita, DataLembur, HeaderInformation, ListMenu } from '../../components';
import React, { Component } from 'react';

class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listmenu: '',
        };
    }

    clickListMenu(value) {
        this.setState({
            listmenu: value,
        });
    }

    render() {
        return (
            <View style={styles.page}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.containerHeader}>
                        <HeaderInformation />
                    </View>
                    {/* Menu */}
                    <View style={{ marginVertical: 8, borderRadius: 20, }}>
                        <View style={{ left: 10 }}>
                            <Text style={styles.label}>Menu</Text>
                        </View>
                        {/* List Menu */}
                        <View style={styles.containerMenu}>
                            <View style={styles.listmenu}>
                                <ListMenu
                                    title="Absen"
                                    onPress={() => this.props.navigation.navigate('Absen')}
                                    active={this.state.listmenu === 'Absen' ? true : false} />

                                <ListMenu
                                    title="Cuti"
                                    onPress={() => this.props.navigation.navigate('Cuti')}
                                    active={this.state.listmenu === 'Cuti' ? true : false} />

                                <ListMenu
                                    title="SPPD"
                                    onPress={() => this.props.navigation.navigate('SPPD')}
                                    active={this.state.listmenu === 'SPPD' ? true : false} />

                                <ListMenu
                                    title="Lembur"
                                    onPress={() => this.props.navigation.navigate('Lembur')}
                                    active={this.state.listmenu === 'Lembur' ? true : false} />

                                <ListMenu
                                    title="Informasi"
                                    onPress={() => this.props.navigation.navigate('Info')}
                                    active={this.state.listmenu === 'Info' ? true : false} />

                                <ListMenu
                                    title="News"
                                    onPress={() => this.props.navigation.navigate('News')}
                                    active={this.state.listmenu === 'News' ? true : false} />
                            </View>
                        </View>
                    </View>
                    {/* berita */}
                    <View style={styles.containerBerita}>
                        <View style={styles.berita}>
                            <Text style={styles.label}>reccomendation</Text>
                            <Text style={styles.txtButton} onPress={() => this.props.navigation.navigate('News')}>view all</Text>
                        </View>
                        <Berita />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

export default Home;

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
    },
    containerMenu: {
        marginHorizontal: 10,
        paddingLeft: 10,
        borderRadius: 10,
        marginVertical: 8
    },
    containerHeader: {
        alignContent: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        top: 8,
    },
    text: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        color: 'black',
        textAlignVertical: 'center',
        textAlign: 'left',
    },
    listmenu: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    containerBerita: {
        flex: 1,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        alignSelf: 'center',
        marginRight: 2,
        marginLeft: 2,
    },
    berita: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginLeft: 6,
        marginRight: 6
    },
    label: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
        color: '#212121',
        letterSpacing: 1,
    },
    lembur: {
        flex: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        paddingHorizontal: 8,
        marginVertical: 10,
    },
    txtButton: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        color: 'deepskyblue',
        textAlignVertical: 'center',
        textAlign: 'center',
        right: 3
    }
});