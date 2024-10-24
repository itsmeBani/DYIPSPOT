import usePlacesAutocomplete from "../CustomHooks/usePlacesAutocomplete";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import React from "react";

export const MapboxPlacesAutocomplete = ({
                                             id = "",
                                             inputStyle,
                                             containerStyle,
                                             inputClassName = "",
                                             containerClassName = "",
                                             placeholder = "Address",
                                             accessToken = process.env.EXPO_PUBLIC_MAPBOX_API_KEY,
                                             onPlaceSelect,
                                             countryId = "ph",
                                             onClearInput,
                                         }) => {
    const placesAutocomplete = usePlacesAutocomplete("", accessToken, countryId);
    if (id === "" || typeof id !== "string")
        throw new Error(
            "[MapboxPlacesAutocomplete] Property `id` is required and must be a string."
        );

    return (
        <View
            style={[styles.container, containerStyle]}
            className={containerClassName}
        >
            <TextInput
                {...{...placesAutocomplete, placeholder}}
                style={[styles.input, inputStyle]}
                className={inputClassName}
                placeholderTextColor={"rgba(96,95,95,0.49)"}
            />
            {placesAutocomplete.value && (
                <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={() => {
                        placesAutocomplete.setValue("");
                        onClearInput({id}); // tell the consumer about which input is cleared
                    }}
                >
                    {/*<Image source={closeBtnUri} style={styles.clearBtnImage} />*/}
                    <View style={styles.clearBtnImage}>
                        <Ionicons name="close" size={18} color="#605f5f"/>
                    </View>
                </TouchableOpacity>
            )}
            {placesAutocomplete.suggestions?.length > 0 &&
                placesAutocomplete.value && (
                    <PlaceSuggestionList {...{placesAutocomplete, onPlaceSelect}} />
                )}
        </View>
    );
};


const PlaceSuggestionList = ({placesAutocomplete, onPlaceSelect}) => {
    return (
        <ScrollView style={styles.suggestionList}>
            {placesAutocomplete.suggestions.map((suggestion, index) => {
                return (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            placesAutocomplete.setValue(suggestion.place_name);
                            placesAutocomplete.setSuggestions([]);
                            onPlaceSelect && onPlaceSelect(suggestion);
                        }}
                        style={styles.SuggestionCon}>
                        <Octicons name="location" size={20} color="#605f5f"/>
                        <Text style={styles.suggestionItem}>{suggestion.place_name}</Text>
                    </TouchableOpacity>
                );
            })}
            <View style={styles.creditBox}>
                <Text style={styles.creditText}>
                    powered by <Text style={{fontWeight: "bold"}}>Mapbox</Text>
                </Text>
                {/*<Image source={mapboxLogoUri} style={styles.creditImage} />*/}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        zIndex: 100,
        position: "relative",
        height: 32,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        color: '#605f5f',

        display: "flex",
        width: "100%",
        zIndex: 0,
        fontFamily: 'PlusJakartaSans-Medium',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingRight: 25,
        backgroundColor: '#ffffff',
    },
    clearBtn: {position: "absolute", top: 7, right: 5},
    suggestionList: {
        position: "absolute",

        zIndex: -1,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: "#fff",
        borderRadius: 10,

        top: 35,
        width: "100%",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 2,
    },
    suggestionItem: {

        color: '#605f5f',
        fontWeight: "300",
        fontSize: 12,
        width: "90%",
        fontFamily: 'PlusJakartaSans-Medium',
        borderBottomWidth: 0.3,
        borderBottomColor: "#9ca3af",
        padding: 10,
    },
    creditBox: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 4,
    },
    creditText: {
        color: "#6b7280",
        fontWeight: "400",
        fontSize: 12,
        padding: 2,
    },
    creditImage: {width: 16, height: 16, marginLeft: 2},

    SuggestionCon: {

        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    }
});