import { strings } from '@translations/locale';
import { Dimensions, Platform } from 'react-native';

export const WIDTH = Dimensions.get('screen').width;
export const HEIGHT = Dimensions.get('screen').height;
export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;
export const isIOS = Platform.OS === 'ios';
export const LOGO =
    'https://firebasestorage.googleapis.com/v0/b/pro--farmer.appspot.com/o/ic_launcher_round.png?alt=media&token=986624f5-9296-4d01-b368-99b5f3697926';

export const Collections = {
    aadhat_data: {
        name: 'aadhat_data',
        subCollections: ['transactions'],
    },
    notifications_data: { name: 'notifications_data', subCollections: [] },
    reminders_data: { name: 'reminders_data', subCollections: [] },
    contributors: { name: 'contributors', subCollections: [] },
    crops_data: { name: 'crops_data', subCollections: ['events'] },
    pickers_groups: { name: 'pickers_groups', subCollections: [] },
    pickers_data: { name: 'pickers_data', subCollections: [] },
    picker_cotton_weight: { name: 'picker_cotton_weight', subCollections: [] },
    pickers_expense: { name: 'pickers_expense', subCollections: [] },
    labours_data: {
        name: 'labours_data',
        subCollections: ['labour_work', 'labour_expense', 'labour_leave'],
    },
    loans_data: { name: 'loans_data', subCollections: ['transactions'] },
    users: { name: 'users', subCollections: [] },
};

