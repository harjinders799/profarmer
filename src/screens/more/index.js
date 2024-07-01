import { TouchableOpacity, View } from 'react-native';
import React from 'react';
import BaseView from '../../container/base';
import { tabsData } from '../../utils/helper';
import Icon from '../../components/icon';
import { orange, white } from '../../utils/colors';
import Text from '../../components/text';
import { navigate } from '../../navigation/ref';
import { useTab } from '../../context/tabContext';

export default function More() {
    const { tabs } = useTab();

    let data = [...tabs];
    let isSettingExist = data.findIndex(o => o.name === tabsData[3].name)
    if (isSettingExist > 4) {
        data.push(tabs[3])
        data.splice(isSettingExist, 0)
    }

    return (
        <View
            style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            {data.slice(5).map(tab => (
                <TouchableOpacity
                    key={tab.id}
                    style={{
                        backgroundColor: orange,
                        margin: 10,
                        padding: 10,
                        borderRadius: 10,
                        width: '40%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => navigate(tab.name)}>
                    <Icon type={tab?.iconType} name={tab.icon} color={white} size={22} />
                    <Text h4 style={{ color: white }}>
                        {tab?.title}
                    </Text>
                </TouchableOpacity>
            ))}
            {/* <TouchableOpacity
                style={{
                    backgroundColor: orange,
                    margin: 10,
                    padding: 10,
                    borderRadius: 10,
                    width: '40%',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={() => navigate('Customize')}>
                <Icon name={'dashboard-customize'} type='MaterialIcons' color={white} size={22} />
                <Text h4 style={{ color: white }}>
                    {'Customize'}
                </Text>
            </TouchableOpacity> */}
        </View>
    );
}
