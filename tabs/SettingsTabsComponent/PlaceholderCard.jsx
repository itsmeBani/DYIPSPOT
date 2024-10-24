import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import {Skeleton} from "moti/skeleton";

const PlaceholderCard = () => {
    const colorMode ='light';

    return (

        <View style={styles.skeletonContainer}>

            <MotiView
                transition={{
                    type: 'timing',
                }}
                style={styles.skeletonCard}
                animate={{ backgroundColor:  '#ffffff' }}
            >

                <Skeleton height={10} colorMode={colorMode} width={'100%'} />

                <Skeleton height={10} colorMode={colorMode} width={'80%'} />
                <Skeleton height={10} colorMode={colorMode} width={'70%'} />
                <Skeleton height={40}  radius="round"  colorMode={colorMode} width={'100%'} />
            </MotiView>
        </View>

    );
};

const styles = StyleSheet.create({
    skeletonContainer: {
        display: 'flex',
        gap: 5,

paddingHorizontal:20
    },
    skeletonCard: {
        padding: 20,
        borderRadius: 10,

        gap:5,
        justifyContent: 'space-between',
      elevation:3
    },
    skeletonText: {
        gap: 3,
        padding: 10,
        width: "100%",
        flex: 1,
        backgroundColor: '#fff', // Light gray for text placeholder
        height: 60, // Adjust height as needed
        borderRadius: 5,
        marginBottom: 10,
    },
    skeletonButton: {
        backgroundColor: '#fff', // Light gray for button placeholder
        height: 40,
        borderRadius: 100,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    skeletonButtonText: {
        backgroundColor: '#d0d0d0',
        height: 20,
        width: '70%', // Adjust width as needed
        borderRadius: 5,
    },
});

export default PlaceholderCard;
