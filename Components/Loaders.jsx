import React from 'react';
import { View, Animated, StyleSheet, Image, Text } from 'react-native';

const Shimmer = ({ style }) => {
    const translateX = new Animated.Value(-100); // Start position for animation

    React.useEffect(() => {
        const startAnimation = () => {
            translateX.setValue(-100); // Reset position
            Animated.timing(translateX, {
                toValue: 100, // End position
                duration: 1500, // Animation duration
                useNativeDriver: true, // Use native driver for performance
            }).start(() => startAnimation()); // Repeat animation
        };

        startAnimation(); // Start the animation

        return () => {

        };
    }, [translateX]);

    return (
        <Animated.View
            style={[
                style,
                {
                    transform: [{ translateX }], // Apply animated translation
                },
            ]}
        />
    );
};

export  const SkeletonLoader = () => {
    return (
        <View style={styles.skeletonContainer}>
            <Shimmer style={styles.skeletonIcon} />
            <View style={styles.skeletonTextContainer}>
                <Shimmer style={styles.skeletonLabel} />
                <Shimmer style={styles.skeletonName} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    skeletonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    skeletonIcon: {
        width: 25,
        height: 25,
        backgroundColor: '#e0e0e0',
        borderRadius: 12.5, // Make it circular
        marginRight: 10,
    },
    skeletonTextContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    skeletonLabel: {
        height: 13,
        backgroundColor: '#e0e0e0',
        width: '60%', // Adjust width to simulate loading
        marginBottom: 5,
        borderRadius: 4,
    },
    skeletonName: {
        height: 13,
        backgroundColor: '#e0e0e0',
        width: '80%', // Adjust width to simulate loading
        borderRadius: 4,
    },
});