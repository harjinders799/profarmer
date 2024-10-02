import { StyleSheet } from 'react-native';
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import Text from '@components/text';
import SearchBar from '@container/searchBar';
import { common } from '@utils/style';
import Animated, { FadeInLeft, LinearTransition } from 'react-native-reanimated';
import Icon from '@components/icon';
import { useTheme } from '@react-navigation/native';
import PickerList from './pickerList';
import { strings } from '@translations/locale';

const PickerFilter = ({
    isFocus,
    setIsFocus,
    orderBy,
    setOrderBy,
    pickers,
    groups,
}) => {
    const [search, setSearch] = useState(false);
    const { colors } = useTheme();
    const [filteredPickers, setFilteredPickers] = useState(pickers);

    const filterPickers = useCallback(() => {
        if (search && search.trim().length > 0) {
            const runFilter = () => {
                const searchLower = search.toLowerCase().trim();
                const filtered = pickers.filter(picker =>
                    picker.name.toLowerCase().includes(searchLower),
                );
                setFilteredPickers(filtered);
            };
            runFilter();
        } else {
            setFilteredPickers(pickers);
        }
    }, [search]);

    useEffect(() => {
        filterPickers();
    }, [search]);

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
                        color={orderBy.key == 'updatedAt' ? colors.primary : colors.text}
                        entering={FadeInLeft.delay(50)}
                        onPress={() => setOrderBy({ key: 'updatedAt', type: 'desc' })}>
                        <Icon
                            name={'sort-calendar-descending'}
                            type="MaterialCommunityIcons"
                            color={orderBy.key == 'updatedAt' ? colors.primary : colors.text}
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
            {isFocus ? <PickerList data={filteredPickers} groups={groups} /> : null}
        </Fragment>
    );
};

export default memo(PickerFilter);

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 20,
        ...common.row_btw,
    },
});
