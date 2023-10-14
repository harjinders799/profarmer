import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Box from '../../components/box';
import Draggable from '../../components/draggable';
import { WIDTH } from '../../utils/constant';
import { orange } from '../../utils/color';
import { useTab } from '../../context/tabContext';
import Button from '../../components/button';
import { ToastSuccess } from '../../utils/toast';
import { goBack } from '../../navigation/ref';
import Text from '../../components/text';

const Customize = () => {
    const { tabs, setTab } = useTab();
    const [update, setUpdate] = useState(false);
    const positions = useSharedValue(
        Object.assign({}, ...tabs.map((item, i) => ({ [item.id]: i }))),
    );
    useEffect(() => {
        console.log(positions);
    }, [positions, update]);
    const refresh = () => {
        setUpdate(!update);
    };

    const setup = () => {
        tabs.sort((a, b) => {
            const indexA = Object.values(positions.value).indexOf(a.id - 1);
            const indexB = Object.values(positions.value).indexOf(b.id - 1);
            return indexA - indexB;
        });
        setTab(tabs);
        ToastSuccess('Done');
        goBack();
    };
    return (
        <SafeAreaProvider style={styles.container}>
            <GestureHandlerRootView style={styles.container}>
                <SafeAreaView style={{ flex: 0.7 }}>
                    <View style={styles.wrapper}>
                        {tabs.slice(0, 4).map(item => (
                            <Draggable
                                key={item.id}
                                positions={positions}
                                id={item.id}
                                refresh={refresh}>
                                <Box key={item.id} item={item} />
                            </Draggable>
                        ))}
                        {tabs.slice(4, 8).map((item, i) => (
                            <Draggable
                                key={item.id}
                                positions={positions}
                                id={item.id}
                                refresh={refresh}>
                                <Box key={item.id} item={item} />
                            </Draggable>
                        ))}
                    </View>
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: orange,
                            width: '100%',
                            height: WIDTH / 3,
                            top: '0%',
                        }}
                    />
                </SafeAreaView>
                <Text style={{ padding: 20, textAlign: 'center' }}>
                    Drag and Drop frequetly using screens in top section
                </Text>
                <Button label={'Done'} onPress={setup} />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
};

export default Customize;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    wrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
    },
});
