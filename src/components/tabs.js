import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import Text from './text';
import { WIDTH } from '@utils/constants';
import { white } from '@utils/colors';


const Tabs = ({ tabs, activeTab, setActiveTab, style, activeTextColor, activeBGColor, inactiveTextColor, inactiveBGColor }) => {
    const translateX = useSharedValue(0);
    const { colors } = useTheme();

    useEffect(() => {
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
            style={[styles.container, { backgroundColor: inactiveBGColor ?? colors.secondaryCard }, style]}>
            <Animated.View
                style={[
                    styles.indicator,
                    {
                        backgroundColor: activeBGColor ?? colors.primary,
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
                    <Text h5 color={activeTab == tab ? activeTextColor ?? white : inactiveTextColor ?? colors.primary} bold={activeTab == tab}>
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
        alignItems: 'center',
        justifyContent: 'center',
    },
    indicator: {
        position: 'absolute',
        bottom: 0,
        height: '100%',
        width: '50%',
    },
});

export default Tabs;
