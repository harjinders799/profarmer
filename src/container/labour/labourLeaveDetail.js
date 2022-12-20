import {View, StyleSheet, Alert} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'src/components/icon';
import Text from 'src/components/text';
import {orange, red} from 'src/utils/color';
import {navigate, replace} from 'src/navigation/ref';
import {strings} from 'src/translations/locale';
import {ToastError, ToastSuccess} from 'src/utils/toast';
import Loader from 'src/components/loader';
import {dateFormat} from 'src/utils/dateformat';
import {useTheme} from '@react-navigation/native';
import {deleteLabourLeave} from '../../network/labour-service';

export default function LabourLeaveDetail({data}) {
  const [loading, setLoading] = React.useState(false);
  const {colors} = useTheme();
  const delteData = async () => {
    Alert.alert(
      `${data?.count} ${strings.labour}`,
      `${strings.delete_wt}`,
      [
        {
          text: 'Yes',
          onPress: async () => {
            setLoading(true);
            await deleteLabourLeave(data?.id);
            setLoading(false);
            ToastSuccess(strings.labour_leave_deleted, strings.leave);
            navigate('Labour');
          },
        },
        {
          text: 'No',
        },
      ],
      {cancelable: true},
    );
  };
  return (
    <View style={[styles.list, {backgroundColor: colors.background}]}>
      <Loader visible={loading} />
      <View style={styles.row}>
        <Text h3 numberOfLines={1}>
          {dateFormat(data?.date)}
        </Text>
        <Text h3 numberOfLines={1}>
          {data?.count}
          {' ' + strings.leave}
        </Text>
      </View>
      <Text h4 style={{textAlign: 'center', paddingTop: 20}}>
        {strings.remark}
      </Text>
      <Text h4>{data?.detail}</Text>
      <View style={styles.icons}>
        <Icon
          name="delete"
          size={20}
          color={red}
          style={[styles.icon, {backgroundColor: colors.card}]}
          onPress={delteData}
        />
        <Icon
          name="edit"
          size={20}
          color={orange}
          style={[styles.icon, {backgroundColor: colors.card}]}
          onPress={() =>
            navigate('AddLabourLeave', {item: {...data, edit: true}})
          }
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  list: {
    elevation: 3,
    width: '98%',
    padding: 20,
    marginTop: 30,
    borderRadius: 10,
    borderWidth: 1,
  },
  row: {
    // width: '70%',
    // marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
    borderBottomWidth: 1,
    paddingVertical: 10,
    borderStyle: 'dotted',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    justifyContent: 'space-between',
    position: 'absolute',
    top: -20,
  },
  icon: {
    elevation: 3,
    padding: 10,
    borderRadius: 20,
  },
  picker: {
    width: '55%',
  },
  farm: {
    textAlign: 'left',
  },
  wt: {
    width: '35%',
    textAlign: 'right',
  },
});
