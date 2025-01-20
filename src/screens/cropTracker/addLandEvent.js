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
import { debugLog, onChangeValue } from '@utils/helper';
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
import { normalize } from '@utils/fonts';
import { useCropTracker } from '@context/cropTrackerContext';
import Calculator from '@components/calculator';

export default function AddLandEvent() {
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
          name: '',
          quantity: '',
        },
      ],
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
          name: '',
          quantity: '',
        },
      ],
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
  const editData = params?.land ?? {};
  const { landCrops } = useCropTracker();
  const [data, setData] = useState({
    title: '',
    description: '',
    categories: [{ category: '', amount: '' }],
    type: '',
    date: new Date(),
  });
  const [crops, setCrops] = useState([]);
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
    await handleEventSubmission();
  }, [data]);

  const totalAmount = sumBy(categories, o => parseFloat(o?.amount || '0'));
  const handleEventSubmission = async () => {
    setLoading(true);
    try {
      const newExpenseAmount = type === 'expense' ? totalAmount : 0;
      const newEarningAmount = type === 'earning' ? totalAmount : 0;

      // Total area of all crops
      const totalAreaOfCrops = landCrops.reduce(
        (sum, crop) => sum + parseFloat(crop.totalArea),
        0,
      );

      // Store all promises for submission
      const submitPromises = landCrops.map(async crop => {
        const cropArea = parseFloat(crop.totalArea);
        const cropRatio = cropArea / totalAreaOfCrops;

        // Calculate the expense and earning for each crop based on the ratio
        const expenseForCrop = (
          parseFloat(crop?.total_expense || '0') +
          parseFloat(newExpenseAmount) * cropRatio
        ).toFixed(2);

        const earningForCrop = (
          parseFloat(crop?.total_earning || '0') +
          parseFloat(newEarningAmount) * cropRatio
        ).toFixed(2);

        debugLog(
          `${crop.name} - Expense: ${expenseForCrop}, Earning: ${earningForCrop}`,
        );

        // Prepare eventData
        const eventData = {
          ...data,
          categories: categories.map(c => ({
            ...c,
            amount: (parseFloat(c?.amount || '0') * cropRatio).toFixed(2),
            quantity: (parseFloat(c?.quantity || '0') * cropRatio).toFixed(2),
            data: c?.data
              ? c.data
                .map(cd => ({
                  ...cd,
                  quantity: parseFloat(cd?.quantity || '0') * cropRatio,
                }))
                .toFixed(2)
              : null,
          })),
          date: currentStamp(data.date),
          cid: crop.id,
          lid: editData?.id,
          totalAmount: totalAmount * cropRatio,
          total_expense: expenseForCrop,
          total_earning: earningForCrop,
        };

        // Submit event for each crop
        await submitEvent(eventData);
      });

      // Wait for all submit promises to resolve
      await Promise.all(submitPromises);

      // Show success message and navigate back after all submissions are completed
      ToastSuccess(strings.successfully_saved);
      goBack();
    } catch (error) {
      ToastError(error?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseView>
      <Loader visible={loading} />
      <Header back label={editData?.name} rightComponent={<Calculator />} />
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 150 }}
        showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <DropdownPicker
            entering={FadeInDown.delay(450)}
            data={landCrops.map(item => ({
              ...item,
              detail: `${item.name} ${item.variety} (${item.farm})`,
            }))}
            label={strings.crop}
            labelField="detail"
            valueField="id"
            placeholder={strings.crop}
            showSelectedOnFocus
            multiple
            value={crops}
            onChange={value => {
              setCrops(value);
            }}
          />

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
          <Text entering={FadeInDown.delay(500)} h4 style={{ paddingTop: 10 }}>
            {strings.optional}
          </Text>
          <Animated.View
            entering={FadeInDown.delay(500)}
            style={[common.row_evenly]}>
            <Checkbox
              isChecked={type == 'expense'}
              activeColor={colors.error}
              label={strings.expense}
              style={{
                width: '30%',
                marginVertical: 3,
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
              style={{
                width: '30%',
                marginVertical: 3,
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
                      if (
                        value.value == 'fertilizer' ||
                        value.value == 'pesticide'
                      )
                        arr[i] = {
                          ...arr[i],
                          category: value.value,
                          data: value.data,
                        };
                      else arr[i] = { ...arr[i], category: value.value };
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
                    placeholder={'2,4,6...'}
                    style={{ width: '38%' }}
                    rightComponent={<Text h6>{`( ${strings.liter} )`}</Text>}
                    value={cat?.quantity}
                    multiline
                    inputStyle={{
                      fontSize: normalize(14),
                      paddingHorizontal: 5,
                      width: '70%',
                      maxHeight: 150,
                      minHeight: 35,
                      lineHeight: normalize(18),
                    }}
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
                    value={cat?.detail}
                    inputStyle={{
                      fontSize: normalize(14),
                      paddingHorizontal: 5,
                      maxHeight: 150,
                      minHeight: 35,
                      lineHeight: normalize(18),
                    }}
                    multiline
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
                    placeholder={'1,2,3...'}
                    style={{ width: '38%' }}
                    rightComponent={<Text h6>{`( ${strings.labour} )`}</Text>}
                    value={cat?.quantity}
                    inputStyle={{
                      fontSize: normalize(14),
                      paddingHorizontal: 5,
                      width: '60%',
                      maxHeight: 150,
                      minHeight: 35,
                      lineHeight: normalize(18),
                    }}
                    multiline
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
                    inputStyle={{
                      fontSize: normalize(14),
                      paddingHorizontal: 5,
                      maxHeight: 150,
                      minHeight: 35,
                      lineHeight: normalize(18),
                    }}
                    multiline
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
                    inputStyle={{
                      fontSize: normalize(14),
                      paddingHorizontal: 5,
                      maxHeight: 150,
                      minHeight: 35,
                      lineHeight: normalize(18),
                    }}
                    multiline
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
                    inputStyle={{
                      fontSize: normalize(14),
                      paddingHorizontal: 5,
                      maxHeight: 150,
                      minHeight: 35,
                      lineHeight: normalize(18),
                    }}
                    multiline
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
                      onPress={() =>
                        setData(prevs => {
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
                      style={{ width: '28%', marginLeft: 5 }}
                      value={scat?.name}
                      inputStyle={{
                        fontSize: normalize(14),
                        paddingHorizontal: 5,
                        maxHeight: 150,
                        minHeight: 35,
                        lineHeight: normalize(18),
                      }}
                      multiline
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
                      placeholder={`20ml, 2ltr...`}
                      style={{ width: '20%', marginLeft: 5 }}
                      value={scat?.quantity}
                      inputStyle={{
                        fontSize: normalize(14),
                        paddingHorizontal: 5,
                        maxHeight: 150,
                        minHeight: 35,
                        lineHeight: normalize(18),
                      }}
                      multiline
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
                    <Input
                      placeholder={strings.remark}
                      style={{ width: '35%', marginLeft: 5 }}
                      innerStyle={{}}
                      value={scat?.detail}
                      multiline
                      inputStyle={{
                        fontSize: normalize(14),
                        paddingHorizontal: 5,
                        maxHeight: 150,
                        minHeight: 35,
                        lineHeight: normalize(18),
                      }}
                      setValue={value =>
                        setData(prevs => {
                          // Copy the categories array
                          const updatedCategories = [...prevs.categories];
                          // Copy the data array of the category
                          const updatedData = [...updatedCategories[i].data];
                          // Update the specific item in the data array
                          updatedData[inx] = {
                            ...updatedData[inx],
                            detail: value,
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
                      onPress={() =>
                        setData(prevs => {
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
                      style={{ width: '28%', marginLeft: 5 }}
                      value={scat?.name}
                      inputStyle={{
                        fontSize: normalize(14),
                        paddingHorizontal: 5,
                        maxHeight: 150,
                        minHeight: 35,
                        lineHeight: normalize(18),
                      }}
                      multiline
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
                      placeholder={`200gm, 2kg...`}
                      style={{ width: '20%', marginLeft: 5 }}
                      value={scat?.quantity}
                      inputStyle={{
                        fontSize: normalize(14),
                        paddingHorizontal: 5,
                        maxHeight: 150,
                        minHeight: 35,
                        lineHeight: normalize(18),
                      }}
                      multiline
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
                    <Input
                      placeholder={strings.remark}
                      style={{ width: '35%', marginLeft: 5 }}
                      innerStyle={{}}
                      value={scat?.detail}
                      multiline
                      inputStyle={{
                        fontSize: normalize(14),
                        paddingHorizontal: 5,
                        maxHeight: 150,
                        minHeight: 35,
                        lineHeight: normalize(18),
                      }}
                      setValue={value =>
                        setData(prevs => {
                          // Copy the categories array
                          const updatedCategories = [...prevs.categories];
                          // Copy the data array of the category
                          const updatedData = [...updatedCategories[i].data];
                          // Update the specific item in the data array
                          updatedData[inx] = {
                            ...updatedData[inx],
                            detail: value,
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
                    placeholder={'2kg, 5Qtl...'}
                    style={{ width: '38%' }}
                    value={cat?.quantity}
                    multiline
                    inputStyle={{
                      fontSize: normalize(14),
                      paddingHorizontal: 5,
                      maxHeight: 150,
                      minHeight: 35,
                      lineHeight: normalize(18),
                    }}
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
                    value={cat?.detail}
                    multiline
                    inputStyle={{
                      fontSize: normalize(14),
                      paddingHorizontal: 5,
                      maxHeight: 150,
                      minHeight: 35,
                      lineHeight: normalize(18),
                    }}
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
                    placeholder={`200gm, 2kg, 5kg...`}
                    style={{ width: '38%' }}
                    multiline
                    inputStyle={{
                      fontSize: normalize(14),
                      paddingHorizontal: 5,
                      maxHeight: 150,
                      minHeight: 35,
                      lineHeight: normalize(18),
                    }}
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
                    inputStyle={{
                      fontSize: normalize(14),
                      paddingHorizontal: 5,
                      maxHeight: 150,
                      minHeight: 35,
                      lineHeight: normalize(18),
                    }}
                    multiline
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
                    inputStyle={{
                      fontSize: normalize(14),
                      paddingHorizontal: 5,
                      maxHeight: 150,
                      minHeight: 35,
                      lineHeight: normalize(18),
                    }}
                    multiline
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
            label={strings.save}
            onPress={handleSubmit}
          />
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
