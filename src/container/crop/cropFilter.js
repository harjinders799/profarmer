import { StyleSheet } from 'react-native';
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import Text from '@components/text';
import SearchBar from '@container/searchBar';
import { common } from '@utils/style';
import Animated, { FadeInLeft, LinearTransition } from 'react-native-reanimated';
import Icon from '@components/icon';
import { useTheme } from '@react-navigation/native';
import { strings } from '@translations/locale';
import CropList from './cropList';

const CropFilter = ({
    isFocus,
    setIsFocus,
    orderBy,
    setOrderBy,
    crops,
}) => {
    const [search, setSearch] = useState(false);
    const { colors } = useTheme();
    const [filteredCrops, setFilteredCrops] = useState(crops);

    const filterCrops = useCallback(() => {
        if (search && search.trim().length > 0) {
            const runFilter = () => {
                const searchLower = search.toLowerCase().trim();
                const filtered = crops.filter(picker =>
                    picker.name.toLowerCase().includes(searchLower),
                );
                setFilteredCrops(filtered);
            };
            runFilter();
        } else {
            setFilteredCrops(crops);
        }
    }, [search, crops]);

    useEffect(() => {
        filterCrops();
    }, [search, crops]);

    return (
        <Fragment>
            <Animated.View layout={LinearTransition} style={styles.row}>
                {!isFocus ? (
                    <Text
                        h5
                        color={orderBy.key == 'name' ? colors.primary : colors.text}
                        entering={FadeInLeft.delay(50)}
                        onPress={() => setOrderBy({ key: 'name', type: 'asc' })}>
                        <Icon
                            color={orderBy.key == 'name' ? colors.primary : colors.text}
                            name={'sort-alpha-down'}
                            type="FontAwesome5"
                        />{' '}
                        {strings.name}
                    </Text>
                ) : null}
                {!isFocus ? (
                    <Text
                        h5
                        color={orderBy.key == 'dateOfSowing' ? colors.primary : colors.text}
                        entering={FadeInLeft.delay(50)}
                        onPress={() => setOrderBy({ key: 'dateOfSowing', type: 'desc' })}>
                        <Icon
                            name={'sort-calendar-descending'}
                            type="MaterialCommunityIcons"
                            color={orderBy.key == 'dateOfSowing' ? colors.primary : colors.text}
                        />{' '}
                        {strings.latest}
                    </Text>
                ) : null}
                <SearchBar
                    search={search}
                    setSearch={setSearch}
                    isFocus={isFocus}
                    setIsFocus={setIsFocus}
                />
            </Animated.View>
            {isFocus ? <CropList data={filteredCrops} onPress={setSearch} /> : null}
        </Fragment>
    );
};

export default memo(CropFilter);

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 20,
        ...common.row_btw,
    },
});
