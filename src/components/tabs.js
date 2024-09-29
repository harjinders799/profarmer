import { useTheme } from '@react-navigation/native';
import { WIDTH } from '@utils/constants';
import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    LinearTransition,
} from 'react-native-reanimated';
import Text from './text';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
    const translateX = useSharedValue(0);
    const { colors } = useTheme();
    useEffect(() => {
        // Initialize the position of the indicator based on the default active tab
        const index = tabs.indexOf(activeTab);
        translateX.value = withTiming(index * (WIDTH / tabs.length), {
            duration: 200,
        });
    }, [activeTab]);

    const handleTabPress = tab => {
        setActiveTab(tab);
    };

    const indicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <Animated.View layout={LinearTransition} style={styles.container}>
            {tabs.map(tab => (
                <TouchableOpacity
                    key={tab}
                    onPress={() => handleTabPress(tab)}
                    style={[styles.tab, { width: `${100 / tabs.length}%`, }]}>
                    <Text h5 bold={activeTab == tab} >{tab}</Text>
                </TouchableOpacity>
            ))}
            <Animated.View
                style={[
                    styles.indicator,
                    {
                        backgroundColor: colors.primary,
                        width: `${90 / tabs.length}%`,
                    },
                    indicatorStyle,
                ]}
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    tab: {
        padding: 10,
        alignItems: 'center',
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        height: 4,
        width: '46%',
        marginHorizontal: '2%',
        borderRadius: 5,
    },
});

export default Tabs;
