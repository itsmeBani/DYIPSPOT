import React, {useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import DateTimePicker from "react-native-ui-datepicker";

function ModalDatePicker({date,setDate}) {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isToday,setIsToday] = useState(null)


    return (
        <>
            <View style={ModalDatePickerStyle.filterbtncon}>
                <TouchableOpacity onPress={() => {
                    setDate(null)

                }

                }
                                  style={[ModalDatePickerStyle.filterbtn, {backgroundColor: date ? "white" : "#3083FF"}]}>
                    <Text
                        style={[ModalDatePickerStyle.filterbtntxt, {color: date ? "#3083FF" : "white"}]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setDate(new Date())}
                                  style={[ModalDatePickerStyle.filterbtn, {backgroundColor: !date ? "white" : "#3083FF"}]}>
                    <Text
                        style={[ModalDatePickerStyle.filterbtntxt, {color: !date ? "#3083FF" : "white"}]}>Today</Text>
                </TouchableOpacity>
                <Pressable onPress={() => setIsModalVisible(true)}   style={[ModalDatePickerStyle.selectDate, {backgroundColor: !date ? "white" : "#3083FF"}]} >
                    <AntDesign name="calendar" size={20} color={!date ? "#3083FF" : "white"}/>
                    <Text style={[ModalDatePickerStyle.curentdate, {color: !date ? "#3083FF" : "white"}]}>
                        {date ? date.toLocaleDateString() : 'Select a date'}
                    </Text>
                </Pressable>
            </View>


            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={ModalDatePickerStyle.modalContainer}>
                    <View style={ModalDatePickerStyle.modalContent}>
                        <DateTimePicker
                            height={240}
                            mode="single"
                            date={date || new Date()}
                            headerButtonsPosition={"right"}
                            headerButtonSize={14}
                            headerButtonStyle={{backgroundColor: "white", elevation: 2, padding: 5, borderRadius: 4,}}
                            headerButtonColor={"#3083FF"}
                            headerTextContainerStyle={{
                                backgroundColor: "rgba(48, 131, 255,0.3)",
                                borderRadius: 6,
                                paddingHorizontal: 10
                            }}
                            headerTextStyle={ModalDatePickerStyle.monthYearStyle}
                            weekDaysTextStyle={{
                                fontFamily: "PlusJakartaSans-Bold",
                                fontSize: 11,
                                color: "rgba(85,90,106,0.74)",
                            }}
                            calendarTextStyle={{fontFamily: "PlusJakartaSans-Medium", fontSize: 10}}
                            dayContainerStyle={{borderRadius: 8, padding: 3}}
                            selectedItemColor={"#3083FF"}
                            onChange={(params) => {
                                if (params && params.date) {
                                    const selectedDateUTC = new Date(params.date);
                                    const philippinesOffset = 8 * 60;
                                    const userTimezoneOffset = selectedDateUTC.getTimezoneOffset();
                                    const localDate = new Date(selectedDateUTC.getTime() + (philippinesOffset - userTimezoneOffset) * 60000);
                                    setDate(localDate);
                                    setIsModalVisible(false);
                                }
                            }}
                        />
                        <View style={ModalDatePickerStyle.closebtncon}>
                            <View>
                                <TouchableOpacity onPress={() => setIsModalVisible(false)}
                                                  style={ModalDatePickerStyle.closebtn}>
                                    <Text style={ModalDatePickerStyle.closebtntxt}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


        </>
    );
}

export default ModalDatePicker;

const ModalDatePickerStyle = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
    },
    item: {
        gap: 30,
        padding: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderRadius: 10,
    },
    dateButton: {
        fontSize: 16,
        color: '#3083FF',
        textAlign: 'center',
        paddingVertical: 10,
        fontFamily: 'PlusJakartaSans-Bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',


    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 4,
        padding: 20,
        width: '80%',

    },
    placeName: {
        fontSize: 13,
        color: '#3083FF',
        lineHeight: 15,
        textTransform: 'capitalize',
        fontFamily: 'PlusJakartaSans-Medium',
    },
   closebtn: {

        borderColor: "#3083FF",
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,


    }, closebtntxt: {
        fontFamily: 'PlusJakartaSans-Medium',
        color: '#3083FF',
        fontSize: 11,
        textAlign: "right"
    }, closebtncon: {
        alignItems: "flex-end"
    }, selectDate: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderColor: "#3083FF",
        borderWidth: 1.5,
        flexDirection: "row",
        borderRadius: 14,
    }, curentdate: {


        borderRadius: 6,

        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',


        color: "#3083FF"
    }, filterbtncon: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
    }, filterbtn: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: "#3083FF",
        borderColor: "#3083FF",
        borderWidth: 1.5,
        borderRadius: 14,
    }, filterbtntxt: {
        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',
        color: "white",

    },monthYearStyle: {
        fontFamily: 'PlusJakartaSans-Bold',
        fontWeight: undefined,
        fontSize: 12,
        color: '#3083FF',
    },
});
