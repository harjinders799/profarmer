import moment from 'moment';
import { WIDTH } from './constants';
import { strings } from '../translations/locale';
import { MMKV } from 'react-native-mmkv';
// import PickerStack from '../navigation/pickerStack';
import LabourStack from '../navigation/labourStack';
import CottonStack from '../navigation/cottonStack';
import SettingStack from '../navigation/settingStack';
import LoanStack from '../navigation/loanStack';
import Timeline from '../screens/timeline';
import AAdhatStack from '@navigation/aadhatStack';

export const storage = new MMKV();

const removeFirstChar = str => {
    if (str.length > 1) {
        return str.substring(1);
    }
    return '';
};

export const onChangeValue = ({
    setData,
    key,
    value,
    isPhone = false,
    isAmount = false,
    isName = false,
}) => {
    let isPhoneOnly = isPhone ? isPhone : false;
    let isAmountOnly = isAmount ? isAmount : false;
    let isNameOnly = isName ? isName : false;
    setData(prevData => {
        const data = { ...prevData };

        if (isPhoneOnly) {
            // Strip out non-numeric characters for phone number input
            data[key] = value.replace(/[^0-9]/g, '');
        } else if (isAmountOnly) {
            // Handle amount input with number and decimal only, up to 2 decimal places
            let newValue = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\./g, '$1');
            const lastValueArr = data[key].split('.');
            const newValueArr = newValue.split('.');

            // Adjust if there's a trailing dot after decimal
            if (
                lastValueArr.length === 2 &&
                newValueArr.length === 2 &&
                lastValueArr[1] === '' &&
                newValueArr[1].length === 2
            ) {
                newValue = `${newValueArr[0]}.${newValueArr[1].slice(1)}`;
            }

            // Limit to maximum 2 decimal places
            if (newValueArr.length === 2 && newValueArr[1].length > 2) {
                newValue = `${newValueArr[0]}.${newValueArr[1].substring(0, 2)}`;
            }

            data[key] = newValue;
        } else if (isNameOnly) {
            // Remove invalid characters
            data[key] = value.replace(/[^a-zA-Z0-9\s]/g, '');
        } else {
            // Default case: assign value directly
            data[key] = value;
        }

        return data;
    });
};

export const calculateLoanDetails = (loansData, loanData) => {
    let totalGivenAmount = 0;
    let totalGivenAmountInterest = 0;
    let totalGivenAmountWithInterest = 0;
    let totalReceivedAmount = 0;
    let totalReceivedAmountInterest = 0;
    let totalReceivedAmountWithInterest = 0;

    loanData.transactions.forEach(v => {
        const date = moment(v.date).format('YYYY-MM-DD');
        const start_date = moment(date);
        const today = moment();
        const days = today.diff(start_date, 'days');
        const interest =
            ((parseFloat(v.amount) * (parseFloat(loanData.interest_rate) / 100)) /
                30) *
            days;

        if (v.type === 'giver') {
            totalGivenAmount += parseFloat(v.amount);
            totalGivenAmountInterest += parseFloat(interest);
            totalGivenAmountWithInterest +=
                parseFloat(interest) + parseFloat(v.amount);
        } else if (v.type === 'receiver') {
            totalReceivedAmount += parseFloat(v.amount);
            totalReceivedAmountInterest += parseFloat(interest);
            totalReceivedAmountWithInterest +=
                parseFloat(interest) + parseFloat(v.amount);
        }
    });

    loanData.totalGivenAmount = totalGivenAmount.toFixed(2);
    loanData.totalGivenAmountInterest = totalGivenAmountInterest.toFixed(2);
    loanData.totalGivenAmountWithInterest =
        totalGivenAmountWithInterest.toFixed(2);
    loanData.totalReceivedAmount = totalReceivedAmount.toFixed(2);
    loanData.totalReceivedAmountInterest = totalReceivedAmountInterest.toFixed(2);
    loanData.totalReceivedAmountWithInterest =
        totalReceivedAmountWithInterest.toFixed(2);
    loanData.finalAmount = (
        totalGivenAmountWithInterest - totalReceivedAmountWithInterest
    ).toFixed(2);
    const index = loansData.findIndex(loan => loan.id === loanData.lid);
    if (index !== -1) {
        loansData[index] = loanData;
    }
};

export const getTotalInterst = (data = []) => {
    let tot_interest = 0;
    data.map(v => {
        let date = moment(v?.date).format('YYYY-MM-DD');
        let start_date = moment(date);
        let today = moment();
        let days = today.diff(start_date, 'days');
        let interest = (
            ((parseFloat(v?.amount) * (parseFloat(v?.interest_rate) / 100)) / 30) *
            parseInt(days)
        ).toFixed(2);
        tot_interest += parseFloat(interest) + parseFloat(v?.amount);
    });
    return tot_interest;
};
export const getInterest = (data = []) => {
    let tot_interest = 0;
    data.map(v => {
        let date = moment(v?.date).format('YYYY-MM-DD');
        let start_date = moment(date);
        let today = moment();
        let days = today.diff(start_date, 'days');
        let interest = (
            ((parseFloat(v?.amount) * (parseFloat(v?.interest_rate) / 100)) / 30) *
            parseInt(days)
        ).toFixed(2);
        tot_interest += parseFloat(interest);
    });
    return tot_interest;
};
export const sanitizeData = data => {
    const sanitizedData = {};
    Object.keys(data).forEach(key => {
        if (data[key] !== undefined) {
            sanitizedData[key] = data[key];
        }
    });
    return sanitizedData;
};

export const calculateTotals = data => {
    const totals = {};
    data.forEach(item => {
        const { amount, giver, receiver, uid } = item;
        const isGiver = giver === uid;
        const isReceiver = receiver === uid;

        if (isGiver) {
            totals['given'] = (totals['given'] || 0) + parseFloat(amount);
        }

        if (isReceiver) {
            totals['taken'] = (totals['taken'] || 0) + parseFloat(amount);
        }
    });

    return totals;
};

export const tabsData = [
    // {
    //     id: 1,
    //     name: 'Picker',
    //     title: strings.pickers,
    //     component: PickerStack,
    //     icon: 'flower-poppy',
    //     iconType: 'MaterialCommunityIcons',
    // },
    {
        id: 1,
        name: 'AadhatStack',
        title: strings.aadhtiya,
        component: AAdhatStack,
        icon: 'shopping-store',
        iconType: 'Fontisto',
    },
    {
        id: 2,
        name: 'LabourStack',
        title: strings.labour,
        component: LabourStack,
        icon: 'solution1',
    },
    {
        id: 4,
        name: 'LoanStack',
        title: strings.loan,
        component: LoanStack,
        icon: 'sack-percent',
        iconType: 'MaterialCommunityIcons',
    },
    // {
    //     id: 5,
    //     name: 'Timeline',
    //     title: 'Timeline',
    //     component: Timeline,
    //     icon: 'timeline-text',
    //     iconType: 'MaterialCommunityIcons',
    // },
    {
        id: 6,
        name: 'SettingStack',
        title: strings.settings,
        component: SettingStack,
        icon: 'setting',
    },
    // {
    //     id: 7,
    //     name: 'Reminder',
    //     title: 'Reminder',
    //     component: Timeline,
    //     icon: 'alarm',
    //     iconType: 'MaterialCommunityIcons',
    // },
    // {
    //     id: 8,
    //     name: 'Harvest',
    //     title: 'Harvest',
    //     component: Timeline,
    //     icon: 'flower-outline',
    //     iconType: 'MaterialCommunityIcons',
    // },
    // {
    //     id: 9,
    //     name: 'Rent',
    //     title: 'Rent',
    //     component: Timeline,
    //     icon: 'tractor-variant',
    //     iconType: 'MaterialCommunityIcons',
    // },
];
