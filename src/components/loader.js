import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { HEIGHT, WIDTH } from 'src/utils/constant';

const Loader = ({
    size = "large",
    color,
    visible
}) => {
    const { colors } = useTheme();
    return (visible ?
        <ActivityIndicator
            size={size}
            color={color ? color : colors.text}
            style={[styles.loader, { backgroundColor: colors.text + 10, }]}
        />
        : null
    );
};

const styles = StyleSheet.create({
    loader: {
        width: WIDTH,
        height: HEIGHT,
        position: 'absolute',
        zIndex: 99
    }
});
export default Loader;
