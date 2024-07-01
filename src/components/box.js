import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MARGIN, SIZE } from '../utils/helper';
import { WIDTH } from '../utils/constants';
import Text from './text';
import { green, orange, white } from '../utils/colors';
import Icon from './icon';

const Box = ({ item }) => {
    const backgroundColor = item.id > 0 ? green : orange;
    return (
        <View style={[styles.container, { backgroundColor }]}>
            <Icon
                type={item?.iconType}
                name={item.icon}
                color={white}
                size={22}
            />
            <Text h4 style={{ color: white }}>{item?.title}</Text>
        </View>
    );
};

export default Box;

const styles = StyleSheet.create({
    container: {
        width: WIDTH / 5,
        height: WIDTH / 5,
        borderRadius: 8,
        marginVertical: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
});