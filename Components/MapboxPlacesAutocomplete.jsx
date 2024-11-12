import usePlacesAutocomplete from "../CustomHooks/usePlacesAutocomplete";
import {ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import React, {useRef, useState} from "react";
import {BottomSheetScrollView} from "@gorhom/bottom-sheet";

export const MapboxPlacesAutocomplete = ({  bottomSheetScrollViewRef,
                                             id = "",
                                             placesAutocomplete,
                                             inputStyle,
                                             suggestedPlaceStyle,
                                             containerStyle,
                                             inputClassName = "",
                                             containerClassName = "",
                                             placeholder = "Address",

                                             onPlaceSelect,
    PlaceholderTextcolor="rgba(96,95,95,0.49)",

                                             onClearInput,
                                         }) => {
    const textInputRef = useRef(null);

    if (id === "" || typeof id !== "string")
        throw new Error(
            "[MapboxPlacesAutocomplete] Property `id` is required and must be a string."
        );

    return (
        <View
            style={[styles.container, containerStyle]}
            className={containerClassName}
        >
         <View style={{width:"100%",
             borderRadius: 10,
             flexDirection:"row",
             backgroundColor:"white",
             borderColor: '#ccc',
             borderWidth: 1,}}>

             <TextInput
                 {...{...placesAutocomplete, placeholder}}
                 style={[styles.input, inputStyle]}
                 ref={textInputRef}
                 className={inputClassName}
                 onChange={() => placeholder === "Destination" &&  bottomSheetScrollViewRef.current?.scrollToEnd({ animated: true }) }
                 onBlur={(e) => {
                     textInputRef.current.setNativeProps({
                         selection: { start: 0, end: 0 }
                     });
                 }}
                 placeholderTextColor={PlaceholderTextcolor}
             />
             {placesAutocomplete.value && (
                 <TouchableOpacity
                     style={styles.clearBtn}
                     onPress={() => {
                         placesAutocomplete.setValue("");
                         onClearInput({id});
                     }}
                 >
                     <Ionicons name="close" size={18} color="#605f5f"/>
                 </TouchableOpacity>
             )}
         </View>
            {placesAutocomplete.suggestions?.length > 0 &&
                placesAutocomplete.value && (
                    <PlaceSuggestionList {...{placesAutocomplete,suggestedPlaceStyle, onPlaceSelect}} />
                )}
        </View>
    );
};


const PlaceSuggestionList = ({placesAutocomplete,suggestedPlaceStyle, onPlaceSelect}) => {
    return (
        <ScrollView  style={[styles.suggestionList,suggestedPlaceStyle]}>
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        zIndex: 100,
        position: "relative",

        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

    },
    input: {
        height: 40,
flex:1,
        color: '#605f5f',

        display: "flex",


        fontFamily: 'PlusJakartaSans-Medium',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingRight: 25,
        backgroundColor: '#ffffff',
    },
    clearBtn: {alignItems:"center",justifyContent:"center" ,paddingRight:10},
    suggestionList: {
        position: "absolute",
zIndex:111,
        flex:1,

        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,

        top: 40,
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