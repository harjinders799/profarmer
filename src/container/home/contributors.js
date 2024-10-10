import { Image, ScrollView, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { common } from '@utils/style';
import Text from '@components/text';
import { contributorsDataListener } from '@network/common-service';
import Loader from '@components/loader';
import { strings } from '@translations/locale';
import Icon from '@components/icon';
import { navigate } from '@navigation/ref';

export default function Contributors() {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(true);
    const [contributors, setContributors] = useState([]);

    // Optimized data fetching with useCallback
    const fetchData = useCallback(() => {
        const unsubscribe = contributorsDataListener(updatedDocuments => {
            setContributors(updatedDocuments);
            setLoading(false);
        });
        return () => {
            unsubscribe && unsubscribe();
        }; // Cleanup on unmount or dependency change
    }, []);

    useFocusEffect(fetchData);

    return (
        <View
            style={[
                {
                    width: '100%',
                    backgroundColor: colors.background,
                    padding: 10,
                    paddingHorizontal: 20,
                    paddingBottom: 25,
                },
                // common.shadow,
            ]}>
            <Text semi h5 color={colors.success} style={{ marginBottom: 8 }}>
                {strings.contributors}
            </Text>
            <Icon
                name={'person-add'}
                type='Octicons'
                color={colors.success}
                size={20}
                style={{ position: 'absolute', right: 20, top: 20 }}
                onPress={() => navigate('AboutUs')}
            />
            <ScrollView horizontal>
                {contributors.map((c, i) => (
                    <View key={i}>
                        <Image
                            source={{ uri: c?.image }}
                            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                        />
                    </View>
                ))}
                <Loader visible={loading} small size={20} />
            </ScrollView>
        </View>
    );
}
