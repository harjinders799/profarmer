import {View, Text} from 'react-native';
import React from 'react';
import Input from 'src/components/input';

export default function SearchBar({setSerach, search}) {
  return (
    <Input placeholder={'Search here'} value={search} setValue={setSerach} />
  );
}
