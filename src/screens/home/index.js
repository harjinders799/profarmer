import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import BaseView from '@container/base';
import Header from '@components/header';
import { tabsData } from '@utils/helper';
import Icon from '@components/icon';
import { strings } from '@translations/locale';
import { common } from '@utils/style';
import { useTheme } from '@react-navigation/native';
import Text from '@components/text';
import { navigate } from '@navigation/ref';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useAuth } from '@context/authContext';

export default function Home() {
    const { colors } = useTheme();
    const { user } = useAuth();

    const tabs = [...tabsData];
    tabs.shift();

    return (
        <BaseView>
            <Header
                label={`Welcome ${user?.name ?? user?.phone ?? user?.email} !!`}
            />
            <View style={[common.row_btw, { flexWrap: 'wrap', padding: 20, }]}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        onPress={() => navigate(tab.name)}
                        key={tab.id}
                        style={[
                            common.card,
                            common.shadow,
                            {
                                backgroundColor: colors.secondaryCard,
                                marginVertical: '3%',
                                paddingVertical: 20,
                                width: '47%'
                            },
                        ]}>
                        <Icon name={tab.icon} type={tab.iconType} size={25} />
                        <Text h3 semi style={{ marginTop: 5 }}>{strings[tab.title]}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </BaseView>
    );
}
