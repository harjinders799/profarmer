import { StyleSheet } from 'react-native'
import React from 'react'
import BaseView from '@container/base'
import Text from '@components/text'
import Header from '@components/header'
import Button from '@components/button'
import { common } from '@utils/style'
import { navigate } from '@navigation/ref'

const HomeExpenses = () => {
    return (
        <BaseView>
            <Header back label={"Home Expenses"} />
            <Text>HomeExpenses</Text>
            <Button
                iconLeft="plus"
                label={"Add Expense"}
                btnStyle={{
                    maxWidth: '50%',
                    width: 'auto',
                    position: 'absolute',
                    bottom: 20,
                    right: -5,
                    zIndex: 999,
                    ...common.shadow
                }}
                onPress={() => navigate('AddHomeExpense')}
            />
        </BaseView>
    )
}

export default HomeExpenses

const styles = StyleSheet.create({})