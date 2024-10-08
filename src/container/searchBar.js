import Icon from '@components/icon';
import { red } from '@utils/colors';
import React, { useState } from 'react';
import Animated, { SequencedTransition } from 'react-native-reanimated';
import Input from 'src/components/input';

export default function SearchBar({ setSearch, search, isFocus, setIsFocus }) {
  return (
    <Animated.View layout={SequencedTransition}>
      {isFocus ? (
        <Input
          placeholder={'Type Name...'}
          value={search}
          autoFocus={isFocus}
          setValue={setSearch}
          inputStyle={{ width: '94%' }}
          innerStyle={{ borderWidth: 0, borderBottomWidth: 0.4 }}
          style={{ marginVertical: 0, width: '100%' }}
          rightComponent={
            <Icon
              name={'closecircle'}
              size={20}
              color={red}
              onPress={() => setIsFocus(!isFocus)}
            />
          }
        />
      ) : (
        <Icon name={'search1'} size={16} onPress={() => setIsFocus(!isFocus)} />
        // <Button
        //   entering={null}
        //   iconRight={'search1'}
        //   label={null}
        //   // small
        //   btnStyle={{ width: normalize(35), marginVertical: 0, height: 45 }}
        //   onPress={() => setIsFocus(!isFocus)}
        // />
      )}
    </Animated.View>
  );
}
