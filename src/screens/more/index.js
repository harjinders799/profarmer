import { TouchableOpacity } from 'react-native';
import React from 'react';
import BaseView from '../../container/base';
import { tabsData } from '../../utils/helper';
import Icon from '../../components/icon';
import { orange, white } from '../../utils/color';
import Text from '../../components/text';
import { navigate } from '../../navigation/ref';
import { useTab } from '../../context/tabContext';

export default function More() {
    const { tabs } = useTab();
    return (
        <BaseView
            style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            {tabs.slice(4).map(tab => (
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
            <TouchableOpacity
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
                <Icon name={'plus'} color={white} size={22} />
                <Text h4 style={{ color: white }}>
                    {'Customize'}
                </Text>
            </TouchableOpacity>
        </BaseView>
    );
}
