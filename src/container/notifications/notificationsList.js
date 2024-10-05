import React, { useCallback, useState, useEffect } from 'react';
import Text from '@components/text';
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { strings } from '@translations/locale';
import { navigate } from '@navigation/ref';
import { timeAgo } from '@utils/dateformat';
import { navy } from '@utils/colors';
import { common } from '@utils/style';
import { useTheme } from '@react-navigation/native';
import Button from '@components/button';
import auth from '@react-native-firebase/auth';
import { getUserById } from '@network/auth-service';
import { findPickerGroupNames } from '@utils/helper';
import Animated, { LinearTransition } from 'react-native-reanimated';
import Icon from '@components/icon';
import { readNotification } from '@network/common-service';

function NotificationsList({ data, onRefresh, refreshing }) {
    const { colors } = useTheme();

    // Optimized renderItem function using useCallback
    const renderItem = useCallback(
        ({ item }) => {
            return (
                <TouchableOpacity
                    style={[styles.list, { backgroundColor: colors.background }]}
                    onPress={() => !item?.isRead ? readNotification(item?.id) : null
                    }
                >
                    <View style={styles.row}>
                        <Icon
                            name={item?.isRead ? 'mail-open-outline' : 'mail-unread'}
                            size={20}
                            type="Ionicons"
                        />
                        <Text style={{ marginLeft: 10 }}>{item?.message}</Text>
                    </View>
                    <Text h6 color={colors.border} right style={{ width: '100%', marginTop: 5 }}>
                        {timeAgo(item?.createdAt)}
                    </Text>
                </TouchableOpacity>
            );
        },
        [colors],
    );

    // Memoized key extractor
    const keyExtractor = useCallback(item => item?.id?.toString(), []);

    // Memoized ListEmptyComponent
    const ListEmptyComponent = useCallback(
        () => (
            <Text style={{ textAlign: 'center', paddingTop: 30 }}>
                {strings.no_data}
            </Text>
        ),
        [],
    );

    return (
        <Animated.FlatList
            layout={LinearTransition}
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 150 }}
            data={data}
            refreshing={refreshing}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            keyExtractor={keyExtractor}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        ...common.card,
        ...common.shadow,
        alignItems: 'flex-start',
        marginHorizontal: '2.5%',
        marginTop: '5%',
        width: '95%',
    },
    row: {
        ...common.row_top_start,
    },
    btn: {
        backgroundColor: navy,
        width: 'auto',
        maxWidth: '40%',
        height: 25,
        marginVertical: 0,
        borderRadius: 5,
    },
});

export default React.memo(NotificationsList);
