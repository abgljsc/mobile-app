import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native'
import React, { useState } from 'react'
import { DataLembur } from '../../components';
import { Back, Dollar, NewFile, People, Plus } from '../../assets';
import SelectDropdown from 'react-native-select-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BarChart, PieChart } from 'react-native-gifted-charts'
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function Lembur() {
    const navigation = useNavigation();
    const [PickerShow, setPickerShow] = useState(false);
    const [date, setDate] = useState(new Date(Date.now()));
    const [input, setInput] = useState('');
    const deptmnt = ['department1', 'department2', 'department3', 'department4', 'department5', 'department6', 'department7', 'department8',];

    const ShowPicker = () => {
        setPickerShow(true);
    }
    const OnChange = (event, value) => {
        setDate(value);
        if (Platform.OS === 'android') {
            setPickerShow(false)
        };
    }
    const renderDot = color => {
        return (
            <View
                style={{
                    width: 10,
                    height: 10,
                    borderRadius: 10 / 2,
                    backgroundColor: color,
                    marginRight: 10,
                    marginLeft: 10
                }}
            />
        )
    }
    const renderComponent = () => {
        return (
            <View style={{ flexDirection: 'column', justifyContent: 'center', marginBottom: 5, }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: 150, }}>
                    {renderDot('seagreen')}
                    <Text style={{ color: 'black', fontFamily: 'Poppins-SemiBold', fontSize: 14 }}>Biaya</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: 150 }}>
                    {renderDot('navajowhite')}
                    <Text style={{ color: 'black', fontFamily: 'Poppins-SemiBold', fontSize: 14 }}>Pegawai</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={styles.page}>
            <View style={styles.headerMenu}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={navigation.goBack}>
                        <Back />
                    </TouchableOpacity>
                    <Text style={styles.txtC}>Lembur</Text>
                </View>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.dateContainer}>
                    <View style={{ flexDirection: 'row', }}>
                        {/* <Text style={styles.label}>Periode</Text>
                        {!PickerShow && (
                            <TouchableOpacity style={styles.datePeriod} onPress={ShowPicker}>
                                <Text style={styles.txtDate}>{`${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()} - ${date.getDate()} / ${date.getMonth()} / ${date.getFullYear()}`}</Text>
                            </TouchableOpacity>)}
                        {PickerShow && (
                            <DateTimePicker
                                value={date_permohon}
                                mode={'date'}
                                display={'calendar'}
                                onChange={OnChange}
                                style={styles.calendar}
                            />
                        )} */}
                    </View>
                    {/* department */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        {/* <Text style={styles.label}>Department</Text>
                        <SelectDropdown
                            data={deptmnt}
                            defaultButtonText='select dept.'
                            onSelect={(selectedItem, index) => setInput(selectedItem, index)}
                            buttonTextAfterSelection={(selectedItem, index) => { return selectedItem; }}
                            rowTextForSelection={(Item, index) => { return Item; }}
                            buttonStyle={styles.selectButton}
                            buttonTextStyle={styles.txtDropdown}
                        />
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.txtButton}>Pilih</Text>
                        </TouchableOpacity> */}
                    </View>
                </View>
                <View style={styles.upContainer}>
                    <Text style={styles.label}>Lembur Bulanan</Text>
                    {/* container people & money */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                            <View style={styles.cntrmny}>
                                <View style={{ alignContent: 'center' }}>
                                    <Dollar />
                                </View>
                                <View style={styles.verticalLine} />
                                <View>
                                    <Text style={styles.txt}>Biaya</Text>
                                    <Text style={styles.txtMoney}>75</Text>
                                </View>
                            </View>
                            <View style={styles.cntrpeople}>
                                <View style={{ alignContent: 'center' }}>
                                    <People />
                                </View>
                                <View style={styles.verticalLine} />
                                <View>
                                    <Text style={styles.txt}>Pegawai</Text>
                                    <Text style={styles.txtMoney}>45</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ alignItems: 'center', top: 10, flexDirection: 'row', justifyContent: 'space-between', }}>
                            <PieChart
                                data={pieData}
                                donut
                                sectionAutoFocus
                                focusOnPress
                                radius={65}
                                innerRadius={65 / 2}
                                innerCircleColor={'#FFF'}
                                showGradient
                            />
                        </View>
                        {renderComponent()}
                    </View>
                </View>

                {/* Bar Chart */}
                <View style={styles.middleContainer}>
                    <Text style={styles.label}>Bar Chart</Text>
                    <View style={styles.horizontalLine} />
                    <BarChart
                        barWidth={30}
                        noOfSections={5}
                        barBorderRadius={5}
                        frontColor="lightgray"
                        backgroundColor={'whitesmoke'}
                        data={barData}
                        yAxisThickness={0.9}
                        xAxisThickness={0.9}
                        xAxisLabelTextStyle={{ transform: [{ rotate: '55deg' }], color: '#212121', }}
                    />
                </View>
                {/*Button Form Lembur*/}
                <View style={styles.bottomContainer}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 4 }}>
                        <Text style={styles.label}>Pegawai Lembur</Text>
                        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('FormLembur')}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', }}>
                                <NewFile />
                                <Text style={styles.txtBtn}>Data</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.horizontalLine} />
                    {/* data lembur */}
                    <View>
                        <DataLembur />
                    </View>
                </View>
            </ScrollView>
        </View >
    )
}

const barData = [
    { value: 250, label: 'Org', frontColor: 'teal' },
    { value: 156, label: 'Org', frontColor: 'teal' },
    { value: 420, label: 'Org', frontColor: 'teal' },
    { value: 745, label: 'Alih', frontColor: 'skyblue' },
    { value: 600, label: 'Alih', frontColor: 'skyblue' },
    { value: 40, label: 'Alih', frontColor: 'skyblue' },
];
const pieData = [
    { value: 7500, color: 'seagreen' },
    { value: 4500, color: 'navajowhite' }
];

const styles = StyleSheet.create({
    page: {
        backgroundColor: 'white',
        flex: 1
    },
    headerMenu: {
        padding: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    dateContainer: {
        padding: 10,
        width: '100%',
        borderRadius: 10,
        marginVertical: 3,
        flex: 1,
        alignSelf: 'center'
    },
    middleContainer: {
        padding: 10,
        width: '100%',
        borderRadius: 8,
        justifyContent: 'center',
        marginVertical: 8,
        // marginTop: 8,
        // backgroundColor: '#rgba(255, 178, 107, 0.60)',
        // backgroundColor: 'white',
        // borderWidth: 1,
        // borderColor: '#ccc',
        alignSelf: 'center',
    },
    upContainer: {
        padding: 10,
        width: '100%',
        borderRadius: 8,
        justifyContent: 'center',
        marginVertical: 8,
        // flex: 1,
        alignSelf: 'center',
        // borderWidth: 0.7,
        // borderColor: '#ccc',
        // backgroundColor: '#rgba(255, 178, 107, 0.60)',
    },
    bottomContainer: {
        padding: 10,
        width: '100%',
        borderRadius: 10,
        // borderWidth: 0.7,
        // borderColor: '#ccc',
        // backgroundColor: '#rgba(255, 178, 107, 0.60)',
        justifyContent: 'center',
        marginVertical: 8,
        alignSelf: 'center'
    },
    Mcontainer: {
        padding: 10,
        width: '98%',
        borderRadius: 8,
        justifyContent: 'center',
        marginVertical: 8,
        flex: 1,
        marginHorizontal: 3,
        marginLeft: 3,
        marginRight: 3,
        alignSelf: 'center'
    },
    label: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 18,
        color: 'black',
        textAlignVertical: 'center',
        marginVertical: 4
    },
    txtC: {
        fontFamily: 'Inter-SemiBold',
        color: 'black',
        fontSize: 18,
        textAlignVertical: 'center',
        textAlign: 'center',
        marginRight: 150
    },
    btn: {
        padding: 8,
        width: 90,
        backgroundColor: 'deepskyblue',
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: 'blue',
    },
    txtBtn: {
        fontFamily: 'Poppins-SemiBold',
        color: 'white',
        fontSize: 18,
        textAlignVertical: 'center',
        alignSelf: 'center'
    },
    cntrmny: {
        padding: 4,
        width: '100%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D49B54',
        backgroundColor: 'navajowhite',
        flexDirection: 'row',
        marginVertical: 6,
    },
    cntrpeople: {
        padding: 5,
        width: '100%',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D49B54',
        backgroundColor: 'navajowhite',
        flexDirection: 'row',
        marginVertical: 6,
    },
    txtMoney: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 15,
        color: 'black',
        textAlignVertical: 'center',
        alignSelf: 'center',
        marginLeft: 5,
        bottom: 5
    },
    txt: {
        fontFamily: 'Poppins-Medium',
        fontSize: 15,
        textAlignVertical: 'center',
        color: 'black',
        alignSelf: 'center',
        marginLeft: 5
    },
    verticalLine: {
        height: 40,
        width: 0.7,
        backgroundColor: '#212121',
        alignSelf: 'center',
        marginLeft: 3,
        marginRight: 3
    },
    horizontalLine: {
        width: '98%',
        height: 0.8,
        backgroundColor: '#212121',
        alignItems: 'center',
        margin: 3
    },
    selectButton: {
        height: 35,
        width: 145,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: '#212121',
        backgroundColor: 'whitesmoke'
    },
    txtDropdown: {
        fontFamily: 'Poppins-Medium',
        color: 'black',
        alignItems: 'center',
        fontSize: 14
    },
    calendar: {
        width: 320,
        height: 260,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    datePeriod: {
        height: 35,
        width: 215,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: '#212121',
        backgroundColor: 'whitesmoke',
        marginLeft: 10
    },
    txtDate: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        color: 'black',
        textAlign: 'center',
        textAlignVertical: 'center',
        top: 4,
        bottom: 4
    },
    button: {
        padding: 5,
        width: 80,
        backgroundColor: 'deepskyblue',
        borderRadius: 10,
        borderWidth: 0.7,
        borderColor: 'blue'
    },
    txtButton: {
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16,
        textAlignVertical: 'center',
        color: 'white',
        alignSelf: 'center',
    },

})