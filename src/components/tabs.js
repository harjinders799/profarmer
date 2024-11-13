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
import { white } from '@utils/colors';

const Tabs = ({ tabs, activeTab, setActiveTab, style }) => {
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
        <Animated.View
            layout={LinearTransition}
            style={[styles.container, { backgroundColor: colors.secondaryCard }, style]}>
            <Animated.View
                style={[
                    styles.indicator,
                    {
                        backgroundColor: colors.primary,
                        width: `${100 / tabs.length}%`,
                    },
                    indicatorStyle,
                ]}
            />
            {tabs.map(tab => (
                <TouchableOpacity
                    key={tab}
                    onPress={() => handleTabPress(tab)}
                    style={[styles.tab, { width: `${100 / tabs.length}%` }]}>
                    <Text h5 color={activeTab == tab ? white : colors.primary} bold={activeTab == tab}>
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 30,
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 10,
    },
    tab: {
        // padding: 10,
        alignItems: 'center',
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        height: '100%',
        width: '50%',
        // marginHorizontal: '2%',
        // borderRadius: 5,
    },
});

export default Tabs;
