import moment from 'moment';
import { WIDTH } from './constants';
import { strings } from '../translations/locale';
import { MMKV } from 'react-native-mmkv';
// import PickerStack from '../navigation/pickerStack';
import LabourStack from '../navigation/labourStack';
import SettingStack from '../navigation/settingStack';
import LoanStack from '../navigation/loanStack';
import AAdhatStack from '@navigation/aadhatStack';
import CropStack from '@navigation/cropStack';
import Home from '@screens/home';
import auth from '@react-native-firebase/auth';
import PickerStack from '@navigation/pickerStack';
import { currentStamp } from './dateformat';
export const storage = new MMKV();

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

        if (v.type === 'giver' && loanData?.uid == auth()?.currentUser?.uid) {
            totalGivenAmount += parseFloat(v.amount);
            totalGivenAmountInterest += parseFloat(interest);
            totalGivenAmountWithInterest +=
                parseFloat(interest) + parseFloat(v.amount);
        } else if (
            v.type === 'receiver' ||
            (v.type === 'giver' && loanData?.uid != auth()?.currentUser?.uid)
        ) {
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

export const unassignPickers = (pickers, groups, editingGroupId) => {
    // Create a Set of all assigned picker IDs, excluding the group being edited
    const assignedPickerIds = new Set();
    groups.forEach(group => {
        // Skip the group being edited
        if (group.id !== editingGroupId) {
            group.members.forEach(memberRef => {
                assignedPickerIds.add(memberRef);
            });
        }
    });
    // Filter pickers to include unassigned pickers and those in the editing group
    const unassignedPickers = pickers.filter(
        picker => !assignedPickerIds.has(picker.id),
    );

    return unassignedPickers;
};
export const assignedPickers = (pickers, group) => {
    // If the group is not provided or has no members, return an empty array
    if (!group || !group.members) {
        return [];
    }

    // Create a Set of assigned picker IDs from the group
    const assignedPickerIds = new Set(group.members);

    // Filter pickers to include only those who are assigned in the group
    const assignedPickers = pickers.filter(picker => assignedPickerIds.has(picker.id));

    return assignedPickers;
};

export const calculateGroupFinalAmount = (group, pickers) => {
    // Create a Set of member IDs for faster lookup
    const memberIds = new Set(group.members.map(memberRef => memberRef));
    // Filter pickers to only include group members and calculate totals
    const groupTotals = pickers
        .filter(picker => memberIds.has(picker.id))
        .reduce(
            (acc, picker) => {
                acc.totalEarnings += parseFloat(picker?.total_earning ?? 0);
                acc.totalGiven += parseFloat(picker?.total_given ?? 0);
                return acc;
            },
            { totalEarnings: 0, totalGiven: 0 },
        );
    // Calculate final amount
    const finalAmount = groupTotals.totalEarnings - groupTotals.totalGiven;

    return finalAmount;
};

const createPickerGroupMap = groups => {
    if (!Array.isArray(groups)) {
        return {};
    }

    return groups.reduce((acc, group) => {
        group.members.forEach(pickerId => {
            acc[pickerId] = group.name;
        });
        return acc;
    }, {});
};

export const findPickerGroupNames = (picker, groups) => {
    const pickerGroupMap = createPickerGroupMap(groups);

    return pickerGroupMap[picker.id] || 'no group';
};

export function groupPickersByDate(pickers, pickersWeightData, pickersExpenseData) {
    // Create a map of picker ID to name and uid
    const pickerMap = {};
    pickers.forEach(picker => {
        pickerMap[picker.id] = {
            name: picker.name,
            uid: picker.uid, // Store uid for matching
        };
    });

    // Create an object to hold grouped data
    const groupedData = {};

    // Process each entry in pickersWeightData
    pickersWeightData.forEach(entry => {
        const pickerUid = pickerMap[entry.pid]?.uid;
        // Only process if uid matches
        if (entry.uid === pickerUid) {
            const date = new Date(entry.date).toISOString().split('T')[0]; // Convert timestamp to YYYY-MM-DD
            const pickerName = pickerMap[entry.pid]?.name;

            if (!groupedData[date]) {
                groupedData[date] = {
                    total_weight: 0,
                    total_expense: 0,
                    pickers: [],
                };
            }

            // Add to total weight for the date
            groupedData[date].total_weight += parseFloat(entry.weight);

            // Check if the picker is already in the list for that date
            const existingPicker = groupedData[date].pickers.find(p => p.name === pickerName);
            if (existingPicker) {
                existingPicker.total_weight += parseFloat(entry.weight); // Aggregate picker weight
            } else {
                // If picker does not exist, add them with initial weight
                groupedData[date].pickers.push({
                    name: pickerName,
                    total_weight: parseFloat(entry.weight),
                    total_expense: 0, // Initialize total expense for this picker
                });
            }
        }
    });

    // Process each entry in pickersExpenseData
    pickersExpenseData.forEach(entry => {
        const pickerUid = pickerMap[entry.pid]?.uid;
        // Only process if uid matches
        if (entry.uid === pickerUid) {
            const date = new Date(entry.date).toISOString().split('T')[0]; // Convert timestamp to YYYY-MM-DD
            const pickerName = pickerMap[entry.pid]?.name;

            if (!groupedData[date]) {
                groupedData[date] = {
                    total_weight: 0,
                    total_expense: 0,
                    pickers: [],
                };
            }

            // Add to total expense for the date
            groupedData[date].total_expense += parseFloat(entry.amount);

            // Check if the picker is already in the list for that date
            const existingPicker = groupedData[date].pickers.find(p => p.name === pickerName);
            if (existingPicker) {
                existingPicker.total_expense += parseFloat(entry.amount); // Aggregate picker expense
            } else {
                // If picker does not exist, add them with initial expense
                groupedData[date].pickers.push({
                    name: pickerName,
                    total_weight: 0, // Initialize total weight for this picker
                    total_expense: parseFloat(entry.amount),
                });
            }
        }
    });

    // Convert the grouped data into the desired output format
    const result = Object.keys(groupedData).map(date => ({
        date: date,
        total_weight: groupedData[date].total_weight,
        total_expense: groupedData[date].total_expense,
        pickers: groupedData[date].pickers,
    }));

    return result;
}



export const processWeights = (data, date) => {
    const processedData = data
        .filter(entry => entry.weight.trim() !== '') // Filter out entries with blank weights
        .flatMap(entry => {
            // Split the weight by '+' and convert to numbers
            const weights = entry.weight.split('+').map(Number);

            // Create an array of objects for each weight, doubling the weight entries
            return weights
                .filter(weight => weight > 0)
                .map(weight => ({
                    ...entry,
                    weight: weight,
                    date: currentStamp(date),
                }));
        });

    return processedData;
};

export const processAmounts = (data, date) => {
    const processedData = data
        .filter(entry => entry.amount.trim() !== '') // Filter out entries with blank weights
        .flatMap(entry => {
            return {
                ...entry,
                date: currentStamp(date),
            }
        });

    return processedData;
};


export const tabsData = [
    {
        id: 1,
        name: 'Home',
        title: 'home',
        component: Home,
        icon: 'home',
    },
    {
        id: 2,
        name: 'Pickers',
        title: 'pickers',
        component: PickerStack,
        icon: 'flower-poppy',
        iconType: 'MaterialCommunityIcons',
    },
    {
        id: 3,
        name: 'LabourStack',
        title: 'labour',
        component: LabourStack,
        icon: 'solution1',
    },
    {
        id: 4,
        name: 'AadhatStack',
        title: 'aadhtiya',
        component: AAdhatStack,
        icon: 'shopping-store',
        iconType: 'Fontisto',
    },
    {
        id: 5,
        name: 'CropStack',
        title: 'crop',
        component: CropStack,
        icon: 'wheat-awn',
        iconType: 'FontAwesome6',
    },
    {
        id: 6,
        name: 'LoanStack',
        title: 'loan',
        component: LoanStack,
        icon: 'sack-percent',
        iconType: 'MaterialCommunityIcons',
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
    //     name: 'Grocery',
    //     title: 'Grocery',
    //     component: Timeline,
    //     icon: 'flower-outline',
    //     iconType: 'MaterialCommunityIcons',
    // },
    {
        id: 10,
        name: 'SettingStack',
        title: 'settings',
        component: SettingStack,
        icon: 'setting',
    },
    // {
    //     id: 9,
    //     name: 'Rent',
    //     title: 'Rent',
    //     component: Timeline,
    //     icon: 'tractor-variant',
    //     iconType: 'MaterialCommunityIcons',
    // },
];
