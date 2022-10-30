import React, { useCallback, useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Text from 'src/components/text'
import BaseView from 'src/container/base'
import Profile from 'src/container/profile'
import { Auth } from 'src/service/setup'
import { commonStyle } from 'src/utils/style'
import Logo from 'src/container/logo'
import { useLang } from 'src/context/langContext'
import Header from 'src/components/header'
import LanguagePicker from 'src/components/languagePicker'
import { getInterstAmount } from 'src/network/interest-service'
import { useFocusEffect } from '@react-navigation/native'
import { groupBy, sumBy } from 'lodash'
import moment from 'moment'
import { strings } from 'src/translations/locale'
import { useStore } from 'src/context/context'
import List from 'src/container/list'
import Button from '../../components/button'
import { navigate } from '../../navigation/ref'
import { getLabourData } from '../../network/labour-service'
import FilterTab from '../../container/filterTab'
import DateWiseList from '../../container/labour/dateWiseList'
import { ToastError } from '../../utils/toast'
import Loader from '../../components/loader'

export default function Labour() {
    const { lang } = useLang();
    const { labours, setLabours } = useStore();
    const [active, setActive] = useState('date')
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])
    let arr = [];

    useFocusEffect(
        useCallback(() => {
            getData();
        }, [lang])
    );

    const getData = async () => {
        try {
            let res = await getLabourData();
            if (Array.isArray(res) && res.length) {
                setData(res)
            } else (setData([]))
            setLoading(false)
        } catch (error) {
            ToastError(error?.message, 'Aadhtiya')
            setLoading(false)
        }
    }

    useEffect(() => {
        // console.log('------------------------')
        if (Auth()?.currentUser?.uid && Array.isArray(labours) && labours.length < 1 && Array.isArray(data) && data.length) {
            let pick = [];
            data.map(v => {
                if (pick.indexOf(v?.labour) === -1) pick.push(v?.labour)
            })
            // console.log('-------update-----------------')
            setLabours(pick)
        }
    }, [data])

    return (
        <BaseView>
            <Loader visible={loading} />
            <Header
                leftComponent={
                    <Button
                        label={strings.add_labour}
                        btnStyle={{ width: '40%' }}
                        onPress={() => navigate('AddLabour')}
                    />
                }
                rightComponent={
                    <Button
                        label={strings.add_expense}
                        btnStyle={{ width: '40%' }}
                        onPress={() => navigate('AddLabourExpense')}
                    />
                }
            />
            <Text h2>
                {strings.labour_record}
            </Text>
            {/* <FilterTab arr={["Date", "Name"]} active={active} setActive={setActive} /> */}
            <DateWiseList data={data} />
        </BaseView>
    )
}