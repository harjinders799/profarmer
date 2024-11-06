// import React, { useCallback, useState } from 'react';
// import { View, StyleSheet, ScrollView, Pressable, Keyboard } from 'react-native';
// import { useRoute, useTheme } from '@react-navigation/native';
// import Button from '@components/button';
// import Input from '@components/input';
// import Loader from '@components/loader';
// import BaseView from '@container/base';
// import { ToastError, ToastSuccess } from '@utils/toast';
// import { strings } from '@translations/locale';
// import { goBack } from '@navigation/ref';
// import Header from '@components/header';
// import Animated, { FadeInDown } from 'react-native-reanimated';
// import { onChangeValue } from '@utils/helper';
// import { deleteEvent, submitEvent, updateEvent } from '@network/crop-service';
// import DateTimePick from '@components/DateTime';
// import { currencyInput, currentStamp, dateFormat } from '@utils/dateformat';
// import Checkbox from '@components/checkbox';
// import { common } from '@utils/style';
// import Text from '@components/text';

// export default function AddEvent() {
//   const { colors } = useTheme();
//   const { params } = useRoute();
//   const editData = params?.data ?? {};
//   const editItem = params?.item ?? {};

//   const [data, setData] = useState({
//     title: editItem?.title ?? '',
//     description: editItem?.description ?? '',
//     amount: editItem?.expense_amount ?? editItem?.earning_amount ?? '',
//     date: editItem?.date ? new Date(editItem?.date) : new Date(),
//   });

//   const [isExpense, setIsExpense] = useState(() => {
//     if (editItem?.expense_amount) return true;
//     if (editItem?.earning_amount) return false;
//     return undefined;
//   });

//   const [loading, setLoading] = useState(false);
//   const [showDate, setShowDate] = useState(false);
//   const { title, description, amount, date } = data;

//   const handleSubmit = useCallback(async () => {
//     await handleEventSubmission(editItem?.id ? updateEvent : submitEvent);
//   }, [data, editItem?.id]);

//   const handleEventSubmission = async (eventFunction) => {
//     setLoading(true);
//     try {
//       const newExpenseAmount = isExpense ? data.amount : 0;
//       const newEarningAmount = !isExpense ? data.amount : 0;

//       const totalExpenseChange = isExpense ? newExpenseAmount - (editItem?.expense_amount || 0) : 0;
//       const totalEarningChange = !isExpense ? newEarningAmount - (editItem?.earning_amount || 0) : 0;

//       const updatedTotalExpense = (parseFloat(editData?.total_expense || 0) + totalExpenseChange).toFixed(2);
//       const updatedTotalEarning = (parseFloat(editData?.total_earning || 0) + totalEarningChange).toFixed(2);

//       const eventData = {
//         title: data.title,
//         description: data.description,
//         date: currentStamp(data.date),
//         cid: editData.id,
//         id: editItem.id,
//         expense_amount: isExpense ? newExpenseAmount : null,
//         earning_amount: !isExpense ? newEarningAmount : null,
//         total_expense: updatedTotalExpense,
//         total_earning: updatedTotalEarning,
//       };

//       await eventFunction(eventData);
//       ToastSuccess(strings.successfully_saved);
//       goBack();
//     } catch (error) {
//       ToastError(error?.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = useCallback(async () => {
//     setLoading(true);
//     try {
//       const updatedTotalExpense = (parseFloat(editData?.total_expense || 0) - (editItem?.expense_amount || 0)).toFixed(2);
//       const updatedTotalEarning = (parseFloat(editData?.total_earning || 0) - (editItem?.earning_amount || 0)).toFixed(2);

//       await deleteEvent({
//         id: editItem.id,
//         total_expense: updatedTotalExpense,
//         total_earning: updatedTotalEarning,
//         cid: editData.id,
//       });

//       ToastSuccess(strings.successfully_deleted);
//       goBack();
//     } catch (error) {
//       ToastError(error?.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [editData, editItem]);

//   const updatingEntry = editItem?.expense_amount > 0 || editItem?.earning_amount > 0;

//   return (
//     <BaseView>
//       <Loader visible={loading} />
//       <Header back label={editData?.name} />
//       <ScrollView
//         keyboardShouldPersistTaps="always"
//         automaticallyAdjustKeyboardInsets
//         contentContainerStyle={{ paddingHorizontal: 20 }}
//         showsVerticalScrollIndicator={false}>
//         <View style={styles.form}>
//           <Input
//             entering={FadeInDown.delay(350)}
//             label={strings.title}
//             autoFocus
//             autoCapitalize="words"
//             placeholder={strings.title}
//             value={title}
//             setValue={(value) => onChangeValue({ setData, key: 'title', value, isName: true })}
//           />
//           <Input
//             entering={FadeInDown.delay(400)}
//             label={strings.description}
//             placeholder={strings.description} // Updated for localization
//             multiline
//             value={description}
//             setValue={(value) => onChangeValue({ setData, key: 'description', value, isName: true })}
//           />
//           <Pressable
//             onPress={() => {
//               setShowDate(true);
//               Keyboard.dismiss();
//             }}>
//             <Input
//               entering={FadeInDown.delay(450)}
//               label={strings.date}
//               editable={false}
//               placeholder={strings.date}
//               value={dateFormat(date)}
//               onPress={() => {
//                 setShowDate(true);
//                 Keyboard.dismiss();
//               }}
//             />
//           </Pressable>
//           <Text
//             entering={FadeInDown.delay(500)}
//             h4
//             style={{ paddingTop: 10, display: updatingEntry ? 'none' : 'flex' }}>
//             {strings.optional} {/* New key for optional text */}
//           </Text>
//           <Animated.View entering={FadeInDown.delay(500)} style={[common.row_btw]}>
//             <Checkbox
//               isChecked={isExpense === true}
//               activeColor={colors.error}
//               label={strings.expense}
//               disabled={updatingEntry}
//               style={{ width: '50%', marginVertical: 3, display: editItem?.earning_amount > 0 ? 'none' : 'flex' }}
//               onPress={() => setIsExpense((prev) => (prev === undefined || prev === false ? true : undefined))}
//             />
//             <Checkbox
//               isChecked={isExpense === false}
//               label={strings.earning}
//               activeColor={colors.success}
//               disabled={updatingEntry}
//               style={{ width: '50%', marginVertical: 3, display: editItem?.expense_amount > 0 ? 'none' : 'flex' }}
//               onPress={() => setIsExpense((prev) => (prev === undefined || prev === true ? false : undefined))}
//             />
//           </Animated.View>
//           <Input
//             entering={FadeInDown.delay(550)}
//             placeholder={'₹1000, ₹15,000....'}
//             value={currencyInput(amount)}
//             keyboardType={"numeric"}
//             setValue={(value) => onChangeValue({ setData, key: 'amount', value, isAmount: true })}
//           />
//           <DateTimePick
//             show={showDate}
//             setShow={setShowDate}
//             date={date}
//             setDate={(value) => onChangeValue({ setData, key: 'date', value })}
//           />
//           <Button
//             entering={FadeInDown.delay(600)}
//             label={editItem?.id ? strings.update : strings.save}
//             onPress={handleSubmit}
//           />
//           {editItem?.id && (
//             <Button
//               entering={FadeInDown.delay(600)}
//               label={strings.delete}
//               btnStyle={{ backgroundColor: colors.error }}
//               onPress={handleDelete}
//             />
//           )}
//         </View>
//       </ScrollView>
//     </BaseView>
//   );
// }

// const styles = StyleSheet.create({
//   form: {
//     paddingBottom: 100,
//     width: '100%',
//   },
// });

import React, { useCallback, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Keyboard } from 'react-native';
import { useRoute, useTheme } from '@react-navigation/native';
import Button from '@components/button';
import Input from '@components/input';
import Loader from '@components/loader';
import BaseView from '@container/base';
import { ToastError, ToastSuccess } from '@utils/toast';
import { strings } from '@translations/locale';
import { goBack } from '@navigation/ref';
import Header from '@components/header';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { onChangeValue } from '@utils/helper';
import { deleteEvent, submitEvent, updateEvent } from '@network/crop-service';
import DateTimePick from '@components/DateTime';
import {
  currencyFormat,
  currencyInput,
  currentStamp,
  dateFormat,
} from '@utils/dateformat';
import Checkbox from '@components/checkbox';
import { common } from '@utils/style';
import Text from '@components/text';
import DropdownPicker from '@components/dropdown';
import { sumBy } from 'lodash';

export default function AddEvent() {
  const EventCategories = [
    {
      label: strings.diesel,
      value: 'diesel',
    },
    {
      label: strings.labour,
      value: 'labour',
    },
    {
      label: strings.rent,
      value: 'rent',
    },
    {
      label: strings.pesticide,
      value: 'pesticide',
      data: [
        {
          name: "",
          quantity: ''
        }
      ]
    },
    {
      label: strings.seed,
      value: 'seed',
    },
    {
      label: strings.fertilizer,
      value: 'fertilizer',
      data: [
        {
          name: "",
          quantity: ''
        }
      ]
    },
    {
      label: strings.sold,
      value: 'sold',
    },
    {
      label: strings.other,
      value: 'other',
    },
  ];

  const { colors } = useTheme();
  const { params } = useRoute();
  const editData = params?.data ?? {};
  const editItem = params?.item ?? {};
  const [data, setData] = useState({
    title: editItem?.title ?? '',
    description: editItem?.description ?? '',
    categories: editItem?.categories
      ? editItem?.categories
      : editItem?.expense_amount || editItem?.earning_amount
        ? [
          {
            category: 'other',
            amount: editItem?.expense_amount || editItem?.earning_amount,
          },
        ]
        : [{ category: '', amount: '' }],
    type: editItem?.type
      ? editItem?.type
      : editItem?.expense_amount
        ? 'expense'
        : editItem?.earning_amount
          ? 'earning'
          : '',
    date: editItem?.date ? new Date(editItem?.date) : new Date(),
  });
  const [loading, setLoading] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const { title, description, type, date, categories } = data;

  const handleSubmit = useCallback(async () => {
    if (!title) {
      return ToastError(strings.title);
    }
    if (categories.length == 1 && categories[0].amount != '') {
      if (categories[0].category == '') {
        return ToastError(strings.select_category);
      }
      if (type == '') {
        return ToastError(strings.expense + '/' + strings.earning);
      }
    }
    await handleEventSubmission(editItem?.id ? updateEvent : submitEvent);
  }, [data, editItem?.id]);

  const totalAmount = sumBy(categories, o => parseFloat(o?.amount || '0'));

  const handleEventSubmission = async eventFunction => {
    setLoading(true);
    const oldTotalAmount = sumBy(editItem?.categories, o =>
      parseFloat(o?.amount || '0'),
    );
    try {
      const newExpenseAmount = type == 'expense' ? totalAmount : 0;
      const newEarningAmount = type == 'earning' ? totalAmount : 0;

      const totalExpenseChange =
        type == 'expense'
          ? newExpenseAmount - (editItem?.expense_amount || oldTotalAmount || 0)
          : 0;
      const totalEarningChange =
        type == 'earning'
          ? newEarningAmount - (editItem?.earning_amount || oldTotalAmount || 0)
          : 0;

      const updatedTotalExpense = (
        parseFloat(editData?.total_expense || 0) + totalExpenseChange
      ).toFixed(2);
      const updatedTotalEarning = (
        parseFloat(editData?.total_earning || 0) + totalEarningChange
      ).toFixed(2);

      const eventData = {
        ...data,
        date: currentStamp(data.date),
        cid: editData.id,
        id: editItem.id,
        totalAmount,
        total_expense: updatedTotalExpense,
        total_earning: updatedTotalEarning,
      };
      console.log(eventData);
      console.log(editData);
      await eventFunction(eventData);
      ToastSuccess(strings.successfully_saved);
      goBack();
    } catch (error) {
      ToastError(error?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async () => {
    setLoading(true);
    try {
      const oldTotalAmount = sumBy(editItem?.categories, o =>
        parseFloat(o?.amount || '0'),
      );
      const updatedTotalExpense = (
        parseFloat(editData?.total_expense || 0) -
        (editItem?.type == 'expense'
          ? oldTotalAmount
          : editItem?.expense_amount || 0)
      ).toFixed(2);
      const updatedTotalEarning = (
        parseFloat(editData?.total_earning || 0) -
        (editItem?.type == 'earning'
          ? oldTotalAmount
          : editItem?.earning_amount || 0)
      ).toFixed(2);
      await deleteEvent({
        id: editItem.id,
        total_expense: updatedTotalExpense,
        total_earning: updatedTotalEarning,
        cid: editData.id,
      });

      ToastSuccess(strings.successfully_deleted);
      goBack();
    } catch (error) {
      ToastError(error?.message);
    } finally {
      setLoading(false);
    }
  }, [editData, editItem]);

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header back label={editData?.name} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <Input
            entering={FadeInDown.delay(350)}
            label={strings.title}
            autoFocus
            autoCapitalize="words"
            placeholder={strings.title}
            value={title}
            setValue={value =>
              onChangeValue({ setData, key: 'title', value, isName: true })
            }
          />
          <Input
            entering={FadeInDown.delay(400)}
            label={strings.description}
            placeholder={strings.description} // Updated for localization
            multiline
            value={description}
            setValue={value =>
              onChangeValue({ setData, key: 'description', value })
            }
          />
          <Pressable
            onPress={() => {
              setShowDate(true);
              Keyboard.dismiss();
            }}>
            <Input
              entering={FadeInDown.delay(450)}
              label={strings.date}
              editable={false}
              placeholder={strings.date}
              value={dateFormat(date)}
              onPress={() => {
                setShowDate(true);
                Keyboard.dismiss();
              }}
            />
          </Pressable>
          <Text
            entering={FadeInDown.delay(500)}
            h4
            style={{ paddingTop: 10, display: editItem?.id ? 'none' : 'flex' }}>
            {strings.optional}
          </Text>
          <Animated.View
            entering={FadeInDown.delay(500)}
            style={[common.row_evenly]}>
            <Checkbox
              isChecked={type == 'expense'}
              activeColor={colors.error}
              label={strings.expense}
              disabled={editItem?.type == 'expense'}
              style={{
                width: '30%',
                marginVertical: 3,
                display: editItem?.type == 'earning' ? 'none' : 'flex',
              }}
              onPress={() =>
                onChangeValue({
                  setData,
                  key: 'type',
                  value: type != 'expense' ? 'expense' : '',
                })
              }
            />
            <Checkbox
              isChecked={type == 'earning'}
              label={strings.earning}
              activeColor={colors.success}
              disabled={editItem?.type == 'earning'}
              style={{
                width: '30%',
                marginVertical: 3,
                display: editItem?.type == 'expense' ? 'none' : 'flex',
              }}
              onPress={() =>
                onChangeValue({
                  setData,
                  key: 'type',
                  value: type != 'earning' ? 'earning' : '',
                })
              }
            />
          </Animated.View>
          {parseInt(totalAmount) > 0 ? (
            <Text right style={{ marginBottom: -10, marginTop: 10 }}>
              {strings.total_amount} = {currencyFormat(totalAmount)}
            </Text>
          ) : null}
          {categories.map((cat, i) => (
            <View key={i}>
              <View style={common.row_bottom_btw}>
                <DropdownPicker
                  entering={FadeInDown.delay(categories.length > 1 ? 50 : 450)}
                  data={EventCategories}
                  labelField="label"
                  valueField="value"
                  placeholder={strings.select_category}
                  value={cat?.category}
                  onChange={value => {
                    setData(prevs => {
                      let arr = [...prevs?.categories];
                      arr[i] = { ...arr[i], category: value.value, data: value.data };
                      return { ...prevs, categories: arr };
                    });
                  }}
                  style={{ width: '38%' }}
                  dropdownStyle={{ minHeight: 48 }}
                />
                <Input
                  entering={FadeInDown.delay(categories.length > 1 ? 100 : 500)}
                  placeholder={'₹1000, ₹15000 ...'}
                  value={currencyInput(cat?.amount)}
                  keyboardType={'numeric'}
                  setValue={value =>
                    setData(prevs => {
                      let arr = [...prevs?.categories];
                      arr[i] = {
                        ...arr[i],
                        amount: value ? value.replace(/[^0-9]/g, '') : '0',
                      };
                      return { ...prevs, categories: arr };
                    })
                  }
                  style={{ width: '45%' }}
                />
                <Button
                  entering={FadeInDown.delay(categories.length > 1 ? 150 : 500)}
                  iconRight={'minus'}
                  btnStyle={{
                    width: '8%',
                    marginVertical: 15,
                    // marginLeft: 0,
                    paddingLeft: 0,
                    paddingRight: 0,
                    // marginRight: 0,
                    // height: 30,
                    aspectRatio: 1,
                    backgroundColor: colors.error,
                  }}
                  onPress={() => {
                    if (categories.length == 1)
                      setData(prevs => ({
                        ...prevs,
                        categories: [{ category: '', amount: '' }],
                      }));
                    else
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr.splice(i, 1);
                        return { ...prevs, categories: arr };
                      });
                  }}
                />
              </View>
              {cat?.category == 'diesel' ? (
                <View style={common.row_top_start}>
                  <Input
                    placeholder={strings.liter}
                    style={{ width: '38%' }}
                    innerStyle={{ height: 35 }}
                    value={cat?.quantity}
                    keyboardType={'numeric'}
                    setValue={value =>
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr[i] = {
                          ...arr[i],
                          quantity: value ? value.replace(/[^0-9]/g, '') : '0',
                        };
                        return { ...prevs, categories: arr };
                      })
                    }
                  />
                  <Input
                    placeholder={`${strings.diesel} ${strings.remark}`}
                    style={{ width: '45%', marginLeft: 10 }}
                    innerStyle={{ height: 35 }}
                    value={cat?.detail}
                    setValue={value =>
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr[i] = {
                          ...arr[i],
                          detail: value,
                        };
                        return { ...prevs, categories: arr };
                      })
                    }
                  />
                </View>
              ) : null}
              {cat?.category == 'labour' ? (
                <View style={common.row_top_start}>
                  <Input
                    placeholder={strings.labour_count}
                    style={{ width: '38%' }}
                    innerStyle={{ height: 35 }}
                    value={cat?.quantity}
                    keyboardType={'numeric'}
                    setValue={value =>
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr[i] = {
                          ...arr[i],
                          quantity: value ? value.replace(/[^0-9]/g, '') : '0',
                        };
                        return { ...prevs, categories: arr };
                      })
                    }
                  />
                  <Input
                    placeholder={strings.remark}
                    style={{ width: '45%', marginLeft: 10 }}
                    innerStyle={{ height: 35 }}
                    value={cat?.detail}
                    setValue={value =>
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr[i] = {
                          ...arr[i],
                          detail: value,
                        };
                        return { ...prevs, categories: arr };
                      })
                    }
                  />
                </View>
              ) : null}
              {cat?.category == 'rent' ? (
                <View style={common.row_top_start}>
                  <Input
                    placeholder={strings.equipment}
                    style={{ width: '38%' }}
                    innerStyle={{ height: 35 }}
                    value={cat?.equipment}
                    setValue={value =>
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr[i] = {
                          ...arr[i],
                          equipment: value,
                        };
                        return { ...prevs, categories: arr };
                      })
                    }
                  />
                  <Input
                    placeholder={`${strings.rent} ${strings.remark}`}
                    style={{ width: '45%', marginLeft: 10 }}
                    innerStyle={{ height: 35 }}
                    inputStyle={{ height: 'auto', maxHeight: 100 }}
                    value={cat?.detail}
                    setValue={value =>
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr[i] = {
                          ...arr[i],
                          detail: value,
                        };
                        return { ...prevs, categories: arr };
                      })
                    }
                  />
                </View>
              ) : null}
              {cat?.category == 'pesticide' && Array.isArray(cat?.data)
                ? cat.data.map((scat, inx) => (
                  <View key={inx} style={common.row_btw}>
                    <Button
                      small
                      entering={FadeInDown.delay(10)}
                      // label={strings.add_more}
                      iconLeft={'plus'}
                      onPress={() => setData(prevs => {
                        // Copy the categories array
                        const updatedCategories = [...prevs.categories];
                        // Copy the data array of the category
                        const updatedData = [...updatedCategories[i].data];
                        // Add the item in the data array
                        updatedData.push({ name: '', quantity: '' });
                        // Update the category's data with the updated data array
                        updatedCategories[i] = {
                          ...updatedCategories[i],
                          data: updatedData,
                        };
                        // Return the updated state
                        return { ...prevs, categories: updatedCategories };
                      })
                      }
                      btnStyle={{ width: '10%' }}
                    />
                    <Input
                      placeholder={strings.name}
                      style={{ width: '38%' }}
                      innerStyle={{ height: 35 }}
                      value={scat?.name}
                      setValue={value =>
                        setData(prevs => {
                          // Copy the categories array
                          const updatedCategories = [...prevs.categories];
                          // Copy the data array of the category
                          const updatedData = [...updatedCategories[i].data];
                          // Update the specific item in the data array
                          updatedData[inx] = {
                            ...updatedData[inx],
                            name: value,
                          };
                          // Update the category's data with the updated data array
                          updatedCategories[i] = {
                            ...updatedCategories[i],
                            data: updatedData,
                          };
                          // Return the updated state
                          return { ...prevs, categories: updatedCategories };
                        })

                      }
                    />
                    <Input
                      placeholder={`${strings.quantity}`}
                      style={{ width: '45%', marginLeft: 10 }}
                      innerStyle={{ height: 35 }}
                      value={scat?.quantity}
                      setValue={value =>
                        setData(prevs => {
                          // Copy the categories array
                          const updatedCategories = [...prevs.categories];
                          // Copy the data array of the category
                          const updatedData = [...updatedCategories[i].data];
                          // Update the specific item in the data array
                          updatedData[inx] = {
                            ...updatedData[inx],
                            quantity: value,
                          };
                          // Update the category's data with the updated data array
                          updatedCategories[i] = {
                            ...updatedCategories[i],
                            data: updatedData,
                          };
                          // Return the updated state
                          return { ...prevs, categories: updatedCategories };
                        })
                      }
                    />
                  </View>
                ))
                : null}
              {cat?.category == 'fertilizer' && Array.isArray(cat?.data)
                ? cat.data.map((scat, inx) => (
                  <View key={inx} style={common.row_btw}>
                    <Button
                      small
                      entering={FadeInDown.delay(10)}
                      // label={strings.add_more}
                      iconLeft={'plus'}
                      onPress={() => setData(prevs => {
                        // Copy the categories array
                        const updatedCategories = [...prevs.categories];
                        // Copy the data array of the category
                        const updatedData = [...updatedCategories[i].data];
                        // Add the item in the data array
                        updatedData.push({ name: '', quantity: '' });
                        // Update the category's data with the updated data array
                        updatedCategories[i] = {
                          ...updatedCategories[i],
                          data: updatedData,
                        };
                        // Return the updated state
                        return { ...prevs, categories: updatedCategories };
                      })
                      }
                      btnStyle={{ width: '10%' }}
                    />
                    <Input
                      placeholder={strings.name}
                      style={{ width: '38%' }}
                      innerStyle={{ height: 35 }}
                      value={scat?.name}
                      setValue={value =>
                        setData(prevs => {
                          // Copy the categories array
                          const updatedCategories = [...prevs.categories];
                          // Copy the data array of the category
                          const updatedData = [...updatedCategories[i].data];
                          // Update the specific item in the data array
                          updatedData[inx] = {
                            ...updatedData[inx],
                            name: value,
                          };
                          // Update the category's data with the updated data array
                          updatedCategories[i] = {
                            ...updatedCategories[i],
                            data: updatedData,
                          };
                          // Return the updated state
                          return { ...prevs, categories: updatedCategories };
                        })

                      }
                    />
                    <Input
                      placeholder={`${strings.quantity}`}
                      style={{ width: '45%', marginLeft: 10 }}
                      innerStyle={{ height: 35 }}
                      value={scat?.quantity}
                      setValue={value =>
                        setData(prevs => {
                          // Copy the categories array
                          const updatedCategories = [...prevs.categories];
                          // Copy the data array of the category
                          const updatedData = [...updatedCategories[i].data];
                          // Update the specific item in the data array
                          updatedData[inx] = {
                            ...updatedData[inx],
                            quantity: value,
                          };
                          // Update the category's data with the updated data array
                          updatedCategories[i] = {
                            ...updatedCategories[i],
                            data: updatedData,
                          };
                          // Return the updated state
                          return { ...prevs, categories: updatedCategories };
                        })
                      }
                    />
                  </View>
                ))
                : null}
              {cat?.category == 'sold' ? (
                <View style={common.row_top_start}>
                  <Input
                    placeholder={strings.quantity}
                    style={{ width: '38%' }}
                    innerStyle={{ height: 35 }}
                    value={cat?.quantity}
                    setValue={value =>
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr[i] = {
                          ...arr[i],
                          quantity: value,
                        };
                        return { ...prevs, categories: arr };
                      })
                    }
                  />
                  <Input
                    placeholder={`${strings.remark}`}
                    style={{ width: '45%', marginLeft: 10 }}
                    innerStyle={{ height: 35 }}
                    value={cat?.detail}
                    setValue={value =>
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr[i] = {
                          ...arr[i],
                          detail: value,
                        };
                        return { ...prevs, categories: arr };
                      })
                    }
                  />
                </View>
              ) : null}
              {cat?.category == 'seed' ? (
                <View style={common.row_top_start}>
                  <Input
                    placeholder={strings.quantity}
                    style={{ width: '38%' }}
                    innerStyle={{ height: 35 }}
                    value={cat?.quantity}
                    setValue={value =>
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr[i] = {
                          ...arr[i],
                          quantity: value,
                        };
                        return { ...prevs, categories: arr };
                      })
                    }
                  />
                  <Input
                    placeholder={`${strings.seed} ${strings.remark}`}
                    style={{ width: '45%', marginLeft: 10 }}
                    innerStyle={{ height: 35 }}
                    value={cat?.detail}
                    setValue={value =>
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr[i] = {
                          ...arr[i],
                          detail: value,
                        };
                        return { ...prevs, categories: arr };
                      })
                    }
                  />
                </View>
              ) : null}
              {cat?.category == 'other' ? (
                <View style={common.row_top_start}>
                  <Input
                    placeholder={strings.other + ' ' + strings.remark}
                    style={{ width: '85%' }}
                    innerStyle={{ height: 35 }}
                    value={cat?.detail}
                    setValue={value =>
                      setData(prevs => {
                        let arr = [...prevs?.categories];
                        arr[i] = {
                          ...arr[i],
                          detail: value,
                        };
                        return { ...prevs, categories: arr };
                      })
                    }
                  />
                </View>
              ) : null}
            </View>
          ))}
          <Button
            small
            entering={FadeInDown.delay(600)}
            label={strings.add_more}
            onPress={() =>
              setData(prevs => {
                let arr = [...prevs?.categories];
                arr.push({ category: '', amount: '' });
                return { ...prevs, categories: arr };
              })
            }
            btnStyle={{ alignSelf: 'flex-end' }}
          />
          <DateTimePick
            show={showDate}
            setShow={setShowDate}
            date={date}
            setDate={value => onChangeValue({ setData, key: 'date', value })}
          />
          <Button
            entering={FadeInDown.delay(600)}
            label={editItem?.id ? strings.update : strings.save}
            onPress={handleSubmit}
          />
          {editItem?.id && (
            <Button
              entering={FadeInDown.delay(600)}
              label={strings.delete}
              btnStyle={{ backgroundColor: colors.error }}
              onPress={handleDelete}
            />
          )}
        </View>
      </ScrollView>
    </BaseView>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingBottom: 100,
    width: '100%',
  },
});
