import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { currencyFormat, currentStamp } from '@utils/dateformat';
import {
  formatPhoneNumber,
  processAmounts,
  processWeights,
  sanitizeData,
} from '@utils/helper';
import { ToastError } from '@utils/toast';
import {
  addMultipleNotification,
  addNotification,
} from '@network/common-service';
import { strings } from '@translations/locale';

export const pickersDataListener = (onUpdate, phone, orderBy) => {
  try {
    const userId = auth().currentUser?.uid;
    // Define the two queries
    const query1 = firestore()
      .collection('pickers_data')
      // .where('uid', '==', userId)
      .where('full_access', 'array-contains', userId)
      // .orderBy('name', 'asc');
      .orderBy(orderBy.key, orderBy.type);

    const query2 = firestore()
      .collection('pickers_data')
      .where('read_access', 'array-contains', userId);

    // const query3 = firestore()
    //   .collection('pickers_data')
    //   .where('full_access', 'array-contains', userId);
    // if (phone != null || phone != undefined) query2.where('read_access', 'array-contains', phone)
    // Subscribe to the first query's snapshot changes
    const unsubscribe = query1.onSnapshot(
      snapshot1 => {
        const documents1 = snapshot1.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));

        // Combine results from the second query
        query2.get().then(snapshot2 => {
          const documents2 = snapshot2.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));

          // Merge both sets of documents and avoid duplicates
          const combinedDocuments = [...documents1, ...documents2];
          const uniqueDocuments = Array.from(
            new Map(combinedDocuments.map(doc => [doc.id, doc])).values(),
          );

          if (onUpdate) onUpdate(uniqueDocuments); // Call the callback with updated documents
        });
      },
      error => {
        ToastError(error?.message);
        console.error('Snapshot error:', error);
      },
    );

    // Return the unsubscribe function if needed later
    return () => {
      unsubscribe(); // Call unsubscribe for the first query
    };
  } catch (error) {
    ToastError(error?.message);
    console.error('Unexpected error:', error);
  }
};

export const groupsDataListener = (onUpdate, orderBy) => {
  try {
    const userId = auth().currentUser?.uid;
    // Listen for real-time updates
    const unsubscribe = firestore()
      .collection('picker_groups')
      .where('uid', '==', userId)
      .orderBy('name', 'asc')
      .onSnapshot(
        querySnapshot => {
          const documents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          if (onUpdate) onUpdate(documents); // Call the callback function with updated documents
        },
        error => {
          ToastError(error?.message);
          throw new Error(error);
        },
      );
    return unsubscribe;
  } catch (error) {
    ToastError(error?.message);
    throw new Error(error);
  }
};

export const pickersWeightListener = (onUpdate, pid) => {
  try {
    const userId = auth().currentUser?.uid;
    let query = firestore()
      .collection('picker_cotton_weight')
      .orderBy('date', 'desc');

    // Add the optional `where` clause if `pid` is provided
    if (pid) {
      query = query.where('pid', '==', pid);
    } else {
      query = query.where('uid', '==', userId);
    }
    // Listen for real-time updates
    const unsubscribe = query.onSnapshot(
      querySnapshot => {
        const documents = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        if (onUpdate) onUpdate(documents); // Call the callback function with updated documents
      },
      error => {
        ToastError(error?.message);
        throw new Error(error);
      },
    );
    return unsubscribe;
  } catch (error) {
    ToastError(error?.message);
    throw new Error(error);
  }
};

export const pickersExpenseListener = (onUpdate, pid) => {
  try {
    const userId = auth().currentUser?.uid;
    let query = firestore()
      .collection('pickers_expense')
      .orderBy('date', 'desc');

    // Add the optional `where` clause if `pid` is provided
    if (pid) {
      query = query.where('pid', '==', pid);
    } else {
      query = query.where('uid', '==', userId);
    }
    // Listen for real-time updates
    const unsubscribe = query.onSnapshot(
      querySnapshot => {
        const documents = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        }));
        if (onUpdate) onUpdate(documents); // Call the callback function with updated documents
      },
      error => {
        ToastError(error?.message);
        throw new Error(error);
      },
    );
    return unsubscribe;
  } catch (error) {
    ToastError(error?.message);
    throw new Error(error);
  }
};

export const submitPicker = data => {
  return new Promise(function (resolve, reject) {
    try {
      let uid = auth().currentUser?.uid;
      firestore()
        .collection('pickers_data')
        .add(
          sanitizeData({
            ...data,
            read_access: [data?.receiverId ?? formatPhoneNumber(data?.phone)],
            full_access: [uid],
            total_earning: 0,
            total_given: 0,
            total_weight: 0,
            uid: uid,
            createdAt: currentStamp(new Date()),
            updatedAt: currentStamp(new Date()),
          }),
        );
      if (data?.receiverId)
        addNotification({
          data,
          type: 'picker',
          message: `${auth().currentUser.displayName
            } added you as new picker!!`,
          receiverId: data?.receiverId,
        });
      resolve(true);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const addPickerWeight = (data, picker) => {
  return new Promise(function (resolve, reject) {
    try {
      let uid = auth().currentUser?.uid;
      firestore()
        .collection('picker_cotton_weight')
        .add(sanitizeData({ ...data, uid }));
      firestore()
        .collection('pickers_data')
        .doc(data?.pid)
        .update(
          sanitizeData({
            total_weight: data?.total_weight,
            total_earning: data?.total_earning,
            rate: data?.rate,
            updatedAt: currentStamp(new Date()),
          }),
        );
      addMultipleNotification(
        {
          data,
          type: 'picker',
          message: `${auth().currentUser.displayName} added ${data?.weight}Kg ${strings.weight
            }!!`,
        },
        picker,
      );
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};
export const addPickerWeightBulk = (data, date, pickers) => {
  return new Promise((resolve, reject) => {
    try {
      let uid = auth().currentUser?.uid;
      const processedData = processWeights(data, date); // Process weights before saving
      // console.log({ processedData, data, date });
      const batch = firestore().batch(); // Create a batch for bulk operations

      // Create an object to hold the total weight and earnings for each picker
      const pickerTotals = {};

      // Loop through each picker ID
      for (const pickerData of pickers) {
        let lastTotalWeight = pickerData.total_weight || 0;
        let lastTotalEarning = pickerData.total_earning || 0;

        // Initialize totals for this picker
        pickerTotals[pickerData.id] = {
          read_access: pickerData?.read_access,
          totalWeight: lastTotalWeight,
          totalEarning: lastTotalEarning,
        };
      }

      // Loop through processed data and add to the batch
      processedData.forEach(entry => {
        const docRef = firestore().collection('picker_cotton_weight').doc(); // Create a new document reference
        batch.set(docRef, sanitizeData({ ...entry, uid })); // Add to the batch

        // Update totals for the corresponding picker
        const pid = entry.pid; // Assuming entry contains pid
        if (pickerTotals[pid]) {
          pickerTotals[pid].totalWeight += entry.weight; // Add current weight
          pickerTotals[pid].totalEarning += entry.weight * entry.rate; // Update total earning
          addMultipleNotification(
            {
              data: entry,
              type: 'picker',
              message: `${auth().currentUser.displayName} added ${entry.weight
                } Kg ${strings.weight}!!`,
            },
            pickerTotals[pid], // Assuming each entry has a picker field
          );
        }
      });

      // Commit the batch
      batch.commit();

      // Update each picker's data with new totals
      for (const p of pickers) {
        const newTotalWeight = pickerTotals[p.id]?.totalWeight;
        const newTotalEarning = pickerTotals[p.id]?.totalEarning;

        firestore()
          .collection('pickers_data')
          .doc(p.id)
          .update({
            total_weight: newTotalWeight,
            total_earning: newTotalEarning,
            updatedAt: currentStamp(new Date()),
          });
      }

      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const addPickerExpenseBulk = (data, date, pickers) => {
  return new Promise((resolve, reject) => {
    try {
      let uid = auth().currentUser?.uid;
      const processedData = processAmounts(data, date); // Process weights before saving
      // console.log({ processedData, data, date });
      const batch = firestore().batch(); // Create a batch for bulk operations

      // Create an object to hold the total expense for each picker
      const pickerTotals = {};

      // Loop through each picker ID
      for (const pickerData of pickers) {
        let lastTotalGiven = pickerData.total_given || 0;

        // Initialize totals for this picker
        pickerTotals[pickerData.id] = {
          read_access: pickerData?.read_access,
          totalGiven: lastTotalGiven,
        };
      }

      // Loop through processed data and add to the batch
      processedData.forEach(entry => {
        const docRef = firestore().collection('pickers_expense').doc(); // Create a new document reference
        batch.set(docRef, sanitizeData({ ...entry, uid })); // Add to the batch

        // Update totals for the corresponding picker
        const pid = entry.pid; // Assuming entry contains pid
        if (pickerTotals[pid]) {
          pickerTotals[pid].totalGiven += parseFloat(entry.amount); // Add current amount
          addMultipleNotification(
            {
              data: entry,
              type: 'picker',
              message: `${auth().currentUser.displayName
                } added ${currencyFormat(entry?.amount)} ${strings.given_amount
                }!!`,
            },
            pickerTotals[pid], // Assuming each entry has a picker field
          );
        }
      });

      // Commit the batch
      batch.commit();

      // Update each picker's data with new totals
      for (const p of pickers) {
        const newTotalGiven = pickerTotals[p.id]?.totalGiven;

        firestore()
          .collection('pickers_data')
          .doc(p.id)
          .update({
            total_given: newTotalGiven,
            updatedAt: currentStamp(new Date()),
          });
      }

      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const addPickerExpense = (data, picker) => {
  return new Promise(function (resolve, reject) {
    try {
      let uid = auth().currentUser?.uid;
      firestore()
        .collection('pickers_expense')
        .add(sanitizeData({ ...data, uid }));
      firestore()
        .collection('pickers_data')
        .doc(data?.pid)
        .update({
          total_given: data?.total_given,
          updatedAt: currentStamp(new Date()),
        });
      addMultipleNotification(
        {
          data,
          type: 'picker',
          message: `${auth().currentUser.displayName} added ${currencyFormat(
            data?.amount,
          )} ${strings.given_amount}!!`,
        },
        picker,
      );
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getPickerData = () => {
  return new Promise(function (resolve, reject) {
    let userId = auth().currentUser?.uid;
    firestore()
      .collection('picker')
      .where('uid', '==', userId)
      .get()
      .then(querySnapshot => {
        let arr = [];
        querySnapshot.forEach(documentSnapshot => {
          arr.push({ ...documentSnapshot.data(), fid: documentSnapshot.id });
        });
        resolve(arr);
      })
      .catch(error => {
        reject(new Error(error));
      });
  });
};

export const getPickerByName = name => {
  return new Promise(function (resolve, reject) {
    let userId = auth().currentUser?.uid;
    firestore()
      .collection('picker')
      .where('uid', '==', userId)
      .where('picker', '==', name)
      .get()
      .then(querySnapshot => {
        let arr = [];
        querySnapshot.forEach(documentSnapshot => {
          arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
        });
        resolve(arr);
      })
      .catch(error => {
        reject(new Error(error));
      });
  });
};

export const getAllPickerExpense = name => {
  return new Promise(function (resolve, reject) {
    try {
      let userId = auth().currentUser?.uid;
      firestore()
        .collection('pickers_expense')
        .where('uid', '==', userId)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(documentSnapshot => {
            arr.push({ ...documentSnapshot.data(), fid: documentSnapshot.id });
          });
          resolve(arr);
        });
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deletePickerExpense = id => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('pickers_expense').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updatePicker = (data, isRateChange) => {
  return new Promise(async (resolve, reject) => {
    try {
      let uid = auth().currentUser?.uid;
      const batch = firestore().batch(); // Create a batch instance

      // Calculate total weight for all documents
      let total_earning = data?.total_earning;
      // If the rate has changed, update the rate in picker_cotton_weight
      if (isRateChange) {
        const newRate = data.rate; // Assuming data contains the new rate
        total_earning = 0;

        // Get all documents in picker_cotton_weight
        const cottonWeightCollection = firestore().collection(
          'picker_cotton_weight',
        );
        const snapshot = await cottonWeightCollection
          .where('pid', '==', data?.id)
          .get();

        snapshot.docs.forEach(doc => {
          const docData = doc.data();
          const totalWeight = docData.weight; // Assuming there's a weight field

          // Update rate in the batch
          batch.update(cottonWeightCollection.doc(doc.id), {
            rate: newRate,
          });
          console.log({ total_earning });
          // Calculate total amount based on weight and new rate
          total_earning += parseFloat(
            parseFloat(totalWeight) * parseFloat(newRate),
          );
        });
      }

      // Update the pickers_data with sanitized data
      batch.update(
        firestore().collection('pickers_data').doc(data?.id),
        sanitizeData({
          ...data,
          total_earning: total_earning,
          read_access: [data?.receiverId ?? formatPhoneNumber(data?.phone)],
          full_access: [uid],
          uid: uid,
          updatedAt: currentStamp(new Date()),
        }),
      );

      // Commit the batch
      await batch.commit();

      // Send notification if there's a receiverId
      if (data?.receiverId) {
        addNotification({
          data,
          type: 'picker',
          message: `${auth().currentUser.displayName} updated your data!!`,
          receiverId: data?.receiverId,
        });
      }

      resolve(data?.fid);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updatePickerCottonWeight = (data, oldData, picker) => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('picker_cotton_weight').doc(data?.id).update(data);
      addMultipleNotification(
        {
          data,
          type: 'picker',
          message: `${auth().currentUser.displayName} updated ${oldData?.weight
            } Kg to ${data?.weight}Kg ${strings.weight}!!`,
        },
        picker,
      );
      resolve(true);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updatePickerAccess = data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('pickers_data').doc(data?.id).update(data);
      await addMultipleNotification(
        {
          data,
          type: 'picker',
          message: `${auth().currentUser.displayName
            } updated to in picker access permission!!`,
        },
        data,
      );
      resolve(true);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updatePickersCalculation = data => {
  return new Promise(function (resolve, reject) {
    try {
      firestore()
        .collection('pickers_data')
        .doc(data.pid) // Assuming item has a pid property
        .update({
          total_weight: data?.totalWeight,
          total_earning: data?.totalEarning,
          total_given: data?.totalGiven,
          updatedAt: currentStamp(new Date()), // Optionally, include a timestamp
        });
      resolve(true);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updatePickerExpense = (data, oldData, picker) => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('pickers_expense').doc(data?.id).update(data);
      addMultipleNotification(
        {
          data,
          type: 'picker',
          message: `${auth().currentUser.displayName} updated ${currencyFormat(
            oldData?.amount,
          )} to ${currencyFormat(data?.amount)} ${strings.taken_amount}!!`,
        },
        picker,
      );
      resolve(true);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deletePickerCottonWeight = (data, picker) => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('picker_cotton_weight').doc(data?.id).delete();
      addMultipleNotification(
        {
          data,
          type: 'picker',
          message: `${auth().currentUser.displayName} deleted ${data?.weight
            } Kg ${strings.weight}!!`,
        },
        picker,
      );
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deletePickerCollection = async picker => {
  try {
    const uid = auth()?.currentUser?.uid;

    const deletePickerCottonWeight = await firestore()
      .collection('picker_cotton_weight')
      .where('pid', '==', picker?.id)
      .get()
      .then(querySnapshot => {
        const deletePromises = [];
        querySnapshot.forEach(documentSnapshot => {
          deletePromises.push(documentSnapshot.ref.delete());
        });
        return Promise.all(deletePromises);
      });

    const deletePickerExpense = await firestore()
      .collection('pickers_expense')
      .where('pid', '==', picker?.id)
      .get()
      .then(querySnapshot => {
        const deletePromises = [];
        querySnapshot.forEach(documentSnapshot => {
          deletePromises.push(documentSnapshot.ref.delete());
        });
        return Promise.all(deletePromises);
      });

    const querySnapshot = await firestore()
      .collection('picker_groups')
      .where('uid', '==', uid)
      .where('members', 'array-contains', picker?.id)
      .get();

    // Assume only one group due to single membership rule
    const groupDoc = querySnapshot.docs[0];
    const members = querySnapshot.size
      ? (await querySnapshot.docs[0].data().members) || []
      : [];

    // Delete the group if the picker is the only member, otherwise remove the picker
    const action =
      members.length === 0
        ? false
        : members.length === 1
          ? await groupDoc.ref.delete()
          : await groupDoc.ref.update({
            members: firestore.FieldValue.arrayRemove(picker?.id),
          });

    action;

    const deletePicker = await firestore()
      .collection('pickers_data')
      .doc(picker?.id)
      .delete();

    Promise.all([
      deletePicker,
      deletePickerExpense,
      deletePickerCottonWeight,
      action,
    ]);
    addNotification({
      type: 'picker',
      message: `${auth().currentUser.displayName} deleted your whole data!!`,
      receiverId: picker?.id,
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const createGroup = data => {
  return new Promise(function (resolve, reject) {
    try {
      let id = auth().currentUser?.uid;
      firestore()
        .collection('picker_groups')
        .add({ ...data, uid: id });
      resolve(true);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updateGroup = data => {
  return new Promise(function (resolve, reject) {
    try {
      let id = auth().currentUser?.uid;
      firestore().collection('picker_groups').doc(data?.id).update(data);
      resolve(data?.id);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deleteGroup = id => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('picker_groups').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getGroupMembersData = group => {
  return new Promise(function (resolve, reject) {
    try {
      const memberPromises = group.members.map(memberRef =>
        firestore()
          .collection('pickers_data')
          .doc(memberRef)
          .get()
          .then(doc => ({ id: doc.id, ...doc.data() })),
      );

      const memberDetails = Promise.all(memberPromises);
      resolve(memberDetails);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const migrateData = async () => {
  try {
    // Fetch all documents from the old collections
    const oldPickersSnapshot = await firestore().collection('picker').get();
    const oldExpensesSnapshot = await firestore()
      .collection('picker_expense')
      .get();

    const batch = firestore().batch();
    console.log('------1--------');
    // Migrate pickers to pickers_data
    // Migrate pickers to pickers_data
    const uniqueNamesMap = {}; // Track unique names for each UID

    for (const doc of oldPickersSnapshot.docs) {
      const oldData = doc.data();
      const uid = oldData.uid;
      const basePickerName = oldData.picker;

      // Initialize the unique names map for the UID if not already set
      if (!uniqueNamesMap[uid]) {
        uniqueNamesMap[uid] = {}; // Use a Set to track unique picker names
      }

      // Check if the basePickerName already exists for this UID
      if (!uniqueNamesMap[uid][basePickerName]) {
        // Store the base picker name and its pid
        uniqueNamesMap[uid][basePickerName] = {
          pid: doc.id, // Store the pid here
        };

        const newPickerData = {
          createdAt: oldData.date,
          full_access: [uid],
          name: basePickerName, // Use the original name here
          phone: oldData.phone || '',
          rate: oldData.rate,
          read_access: [],
          total_earning: 0,
          total_given: 0,
          total_weight: 0,
          uid: uid,
          id: doc.id, // Use old document ID if needed
          updatedAt: Date.now(),
        };

        const newPickerDocRef = firestore()
          .collection('pickers_data')
          .doc(doc.id); // Use auto-generated ID
        batch.set(newPickerDocRef, newPickerData);
        // console.log('----', { newPickerData });
      }
    }

    console.log(oldPickersSnapshot.size, uniqueNamesMap);
    console.log('------2-------');

    // Migrate expenses to pickers_expense
    // Create a map to track unique expenses by date
    const uniqueExpenses = new Map();

    // Migrate expenses to pickers_expense
    for (const doc of oldExpensesSnapshot.docs) {
      const oldExpenseData = doc.data();

      // Skip processing if the amount is zero
      if (oldExpenseData.amount === '0' || oldExpenseData.amount === 0) {
        continue;
      }

      const date = oldExpenseData.date;

      // Check if this date has already been processed
      if (!uniqueExpenses.has(date)) {
        uniqueExpenses.set(date, oldExpenseData); // Store the data for this date

        const existingExpenseRef = firestore()
          .collection('pickers_expense')
          .where('date', '==', date);
        const existingExpenses = await existingExpenseRef.get();

        // Check if an entry with the same date already exists in the new collection
        if (existingExpenses.empty) {
          // Retrieve the pid from uniqueNamesMap
          const uniquePickerName = oldExpenseData.picker;
          const uid = oldExpenseData.uid;

          // Find the corresponding pid from uniqueNamesMap
          let pid = null;
          if (uniqueNamesMap[uid] && uniqueNamesMap[uid][uniquePickerName]) {
            pid = uniqueNamesMap[uid][uniquePickerName].pid; // Access the pid directly
          }
          if (pid) {
            const newExpenseData = {
              amount: oldExpenseData.amount,
              date: oldExpenseData.date,
              detail: oldExpenseData.detail || '',
              pid: pid || '', // Use the pid found from uniqueNamesMap
              uid: oldExpenseData.uid,
            };

            // Set the new document in the batch
            const newExpenseDocRef = firestore()
              .collection('pickers_expense')
              .doc(); // Use auto-generated ID
            batch.set(newExpenseDocRef, newExpenseData);
            console.log({ newExpenseData });
          }
        }
      }
    }

    console.log('------3--------', oldPickersSnapshot.size);
    // Migrate cotton weight to picker_cotton_weight
    // Create a map to track unique entries by date
    const uniqueCottonWeights = new Map();

    // Migrate cotton weight to picker_cotton_weight
    for (const doc of oldPickersSnapshot.docs) {
      const oldCottonWeightData = doc.data();

      // Only proceed if weight is greater than zero
      if (oldCottonWeightData.weight > 0) {
        const date = oldCottonWeightData.date;

        // Check if this date has already been processed
        if (!uniqueCottonWeights.has(date)) {
          uniqueCottonWeights.set(date, oldCottonWeightData); // Store the data for this date

          const existingCottonWeightRef = firestore()
            .collection('picker_cotton_weight')
            .where('date', '==', date);
          const existingCottonWeights = await existingCottonWeightRef.get();

          console.log(
            existingCottonWeights.empty,
            'existingCottonWeights.empty',
            oldCottonWeightData.weight,
          );

          // Check if an entry with the same date already exists in the new collection
          if (existingCottonWeights.empty) {
            // Retrieve the pid from uniqueNamesMap
            const uniquePickerName = oldCottonWeightData.picker;
            const uid = oldCottonWeightData.uid;

            // Find the corresponding picker to get the pid
            let pid = null;
            if (uniqueNamesMap[uid] && uniqueNamesMap[uid][uniquePickerName]) {
              pid = uniqueNamesMap[uid][uniquePickerName].pid; // Access the pid directly
            }
            if (pid) {
              const newCottonWeightData = {
                date: oldCottonWeightData.date,
                detail: oldCottonWeightData.detail || '',
                pid: pid, // Use the pid found from the picker data
                rate: oldCottonWeightData.rate,
                uid: oldCottonWeightData.uid,
                weight: oldCottonWeightData.weight || '0',
              };

              // Set the new document in the batch
              const newCottonWeightDocRef = firestore()
                .collection('picker_cotton_weight')
                .doc(); // Use auto-generated ID
              batch.set(newCottonWeightDocRef, newCottonWeightData);

              console.log({ newCottonWeightData });
            }
          }
        }
      }
    }

    console.log('------4--------');

    // Commit the batch if there are any writes
    if (batch._writes.length > 0) {
      await batch.commit();
      console.log('Migration completed successfully.');
    } else {
      console.log('No new entries to migrate.');
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
