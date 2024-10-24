import {Image, StyleSheet, Text, View} from "react-native";
import React from "react";

export const IconStatusBox = ({icon, label, txthighlight, txt, customStyle = {}}) => {
    return (
        <View style={[IconStatusBar.StatusChildContainer, customStyle.container]}>
            {icon && (
                <Image
                    style={[IconStatusBar.statusIcon, customStyle.icon]}
                    source={icon}
                />
            )}
            <View>
                <Text style={[IconStatusBar.drivernameLabeltext, customStyle.label]}>{label}</Text>
                <View style={customStyle.margintxt}>
                    <Text
                        style={[
                            IconStatusBar.drivername,
                            {
                                fontSize: customStyle?.fontSize ?? IconStatusBar.drivername.fontSize,
                                fontFamily: customStyle?.fontFamily ?? IconStatusBar.drivername.fontFamily,
                                color: customStyle?.color ?? IconStatusBar.drivername.color,
                            },
                            customStyle.text
                        ]}><Text style={[IconStatusBar.txthighlight, customStyle.highlight]}>{txthighlight}</Text>
                        {txt ?? "loading..."}</Text>

                </View>
            </View>
        </View>
    );
};



const IconStatusBar = StyleSheet.create({
    contentContainer: {

        position: "relative",
        alignItems: 'center',
        padding: 10,
        display: "flex",
        gap: 5,

    },
    gradientContainer: {
        width: '100%',
        backgroundColor: "#ffffff",
        borderRadius: 10,

        position: "relative",
    },
    driverInfoCard: {
        flex: 0.25,
        height: '100%',
        display: 'flex',
        flexDirection: "row",
        paddingBottom: 5,
        width: '100%',

        justifyContent: "space-between",
        gap: 10,
        paddingHorizontal: 10,
    },
    secondCardcon: {
        flex: 1,
        width: '100%',
        height: '100%',

        backgroundColor: '#fff',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    }
    ,
    driverAvatar: {
        width: 45,
        height: 45,

        borderRadius: 100
    },
    drivernameLabel: {

        display: "flex",
        justifyContent: "center"
    },
    drivernameLabeltext: {

        color: "#555a6a",

        fontSize: 13,

        fontFamily: "PlusJakartaSans-Medium",
    }, drivername: {
        color: "rgba(88,87,87,0.88)",
        fontSize: 13,
        fontFamily: "PlusJakartaSans-Bold",
    },
    txthighlight: {
        fontFamily: "PlusJakartaSans-Bold",
        color: "#3083FF",
    },
    parentdrivercon: {

        alignItems: "center",
        display: 'flex',
        padding: 10,

        borderStyle: "solid",
        borderColor: "rgba(0,0,0,0.21)",
        borderRadius: 15,

        paddingHorizontal: 20,
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",

    }, drivercontact: {
        fontSize: 11,
        color: "#959595",
    },
    IconCon: {
        flexDirection: "row",
        gap: 8,
        alignItems: "top",
        display: 'flex',
    }, AvatarImage: {
        width: 45,
        borderRadius: 100,
        height: 45,
    }, ParentstatusLabel: {
        display: 'flex',
        flexDirection: "row",
        gap: 15,
        justifyContent: "center",
        width: "auto"
    }, statusLabel: {}, statusLabelTexttint: {
        color: "#3083FF",
        fontSize: 14,
        fontWeight: "medium",
    }, statusLabelText: {
        color: "#959595",
        fontSize: 14,
        fontWeight: "medium",
    },
    StatusContainer: {

        paddingHorizontal: 32,
        paddingBottom: 15,
        display: "flex",
        gap: 15,
    }, StatusChildContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 10,

        alignItems: "center",
    },
    statusIcon: {
        width: 25,
        height: 25,


    }, WarningContainer: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        display: "flex",


    }, ChildWarningContainer: {
        borderStyle: "solid",
        borderColor: "#1E3FAE",
        borderWidth: 1,
        flex: 1,
        width: "100%",
        padding: 14,
        borderRadius: 10,
        height: "auto",
        backgroundColor: "#DCEBFE"
    }, warningtitle: {

        display: "flex",
        flexDirection: "row",
        gap: 6,
        alignItems: "center"
    }, warningtext: {
        lineHeight: 21,
        color: "#1E3FAE",
        letterSpacing: 0.2,
        fontFamily: "PlusJakartaSans-Medium",
        fontSize: 13,
    }, warningmessage: {
        lineHeight: 21,
        fontSize: 12,
        color: "#1E3FAE",
        letterSpacing: 0.3,
        fontFamily: "PlusJakartaSans-Medium",
        paddingHorizontal: 20,
    }, callbox: {

        elevation: 4,
        backgroundColor: "#3083FF",

        padding: 8,
        borderRadius: 100
    }, timelinecon: {

        paddingHorizontal: 30,

        display: "flex",


        justifyContent: "center",

    }, contactbtns: {

        display: "flex",
        flexDirection: "row",
        gap: 5
    }
})
