import moment from 'moment';
import { WIDTH } from './constants';
import { strings } from '../translations/locale';
// import PickerStack from '../navigation/pickerStack';
import LabourStack from '../navigation/labourStack';
import CottonStack from '../navigation/cottonStack';
import SettingStack from '../navigation/settingStack';
import LoanStack from '../navigation/loanStack';
import Timeline from '../screens/timeline';

import { MMKV } from 'react-native-mmkv'

export const storage = new MMKV()

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
export const getInterst = (data = []) => {
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

const COL = 4;
export const MARGIN = 8;
export const SIZE = WIDTH / 4.2;

export const getPosition = index => {
    'worklet';
    return {
        x: (index % COL) * SIZE,
        y: Math.floor(index / COL) * SIZE * 2,
    };
};

export const getOrder = (x, y) => {
    'worklet';
    const row = Math.round(y / SIZE);
    const col = Math.round(x / SIZE);
    return row * COL + col;
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
        id: 2,
        name: 'LabourStack',
        title: strings.labour,
        component: LabourStack,
        icon: 'solution1',
    },
    // {
    //     id: 3,
    //     name: 'CottonStack',
    //     title: strings.aadhtiya,
    //     component: CottonStack,
    //     icon: 'shopping-store',
    //     iconType: 'Fontisto',
    // },
    // {
    //     id: 4,
    //     name: 'LoanStack',
    //     title: strings.loan,
    //     component: LoanStack,
    //     icon: 'sack-percent',
    //     iconType: 'MaterialCommunityIcons',
    // },
    // {
    //     id: 5,
    //     name: 'Timeline',
    //     title: 'Timeline',
    //     component: Timeline,
    //     icon: 'timeline-text',
    //     iconType: 'MaterialCommunityIcons',
    // },
    // {
    //     id: 6,
    //     name: 'SettingStack',
    //     title: strings.settings,
    //     component: SettingStack,
    //     icon: 'setting',
    // },
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
