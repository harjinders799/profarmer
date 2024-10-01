import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { currentStamp } from '@utils/dateformat';
import { processAmounts, processWeights, sanitizeData } from '@utils/helper';
import { ToastError } from '@utils/toast';

export const pickersDataListener = (onUpdate, phone, orderBy) => {
  try {
    const userId = auth().currentUser?.uid;
    console.log({ phone, userId })
    // Define the two queries
    const query1 = firestore()
      .collection('pickers_data')
      .where('uid', '==', userId)
      // .orderBy('name', 'asc');
      .orderBy(orderBy.key, orderBy.type);

    const query2 = firestore().collection('pickers_data').where('read_access', 'array-contains', phone);

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
    ToastError(error?.message, 'Loan');
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
      .collection('picker_expense')
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
        .add({
          ...data,
          read_access: [data?.phone],
          full_access: [uid],
          total_earning: 0,
          total_given: 0,
          total_weight: 0,
          uid: uid,
          createdAt: currentStamp(new Date()),
          updatedAt: currentStamp(new Date()),
        });
      resolve(true);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const addPickerWeight = data => {
  return new Promise(function (resolve, reject) {
    try {
      let uid = auth().currentUser?.uid;
      console.log(sanitizeData({ ...data, uid }));
      firestore()
        .collection('picker_cotton_weight')
        .add(sanitizeData({ ...data, uid }));
      firestore()
        .collection('pickers_data')
        .doc(data?.pid)
        .update({
          total_weight: data?.total_weight,
          total_earning: data?.total_earning,
          rate: data?.rate,
          updatedAt: currentStamp(new Date()),
        });
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
          totalGiven: lastTotalGiven,
        };
      }

      // Loop through processed data and add to the batch
      processedData.forEach(entry => {
        const docRef = firestore().collection('picker_expense').doc(); // Create a new document reference
        batch.set(docRef, sanitizeData({ ...entry, uid })); // Add to the batch

        // Update totals for the corresponding picker
        const pid = entry.pid; // Assuming entry contains pid
        if (pickerTotals[pid]) {
          pickerTotals[pid].totalGiven += parseFloat(entry.amount); // Add current amount
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

export const addPickerExpense = data => {
  return new Promise(function (resolve, reject) {
    try {
      let uid = auth().currentUser?.uid;
      firestore()
        .collection('picker_expense')
        .add(sanitizeData({ ...data, uid }));
      firestore()
        .collection('pickers_data')
        .doc(data?.pid)
        .update({
          total_given: data?.total_given,
          updatedAt: currentStamp(new Date()),
        });
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
        .collection('picker_expense')
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
      firestore().collection('picker_expense').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updatePicker = data => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('picker').doc(data?.fid).update(data);
      resolve(data?.fid);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updatePickerCottonWeight = data => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('picker_cotton_weight').doc(data?.id).update(data);
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

export const updatePickerExpense = data => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('picker_expense').doc(data?.id).update(data);
      resolve(true);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deletePicker = id => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('picker').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deletePickerCottonWeight = id => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('picker_cotton_weight').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const submitPickerExpense = data => {
  return new Promise(function (resolve, reject) {
    try {
      let id = auth().currentUser?.uid;
      firestore()
        .collection('picker_expense')
        .add({ ...data, uid: id });
      resolve(true);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getPickerExpense = name => {
  return new Promise(function (resolve, reject) {
    try {
      let userId = auth().currentUser?.uid;
      firestore()
        .collection('picker_expense')
        .where('uid', '==', userId)
        .where('picker', '==', name)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(documentSnapshot => {
            arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
          });
          resolve(arr);
        });
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getCottonByPicker = search => {
  return new Promise(function (resolve, reject) {
    let userId = auth().currentUser?.uid;
    firestore()
      .collection('cotton')
      .where('uid', '==', userId)
      .where('picker', '==', search)
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

export const deletePickerCollection = async id => {
  try {
    const uid = auth()?.currentUser?.uid;
    const deletePickerCottonWeight = await firestore()
      .collection('picker_cotton_weight')
      .where('pid', '==', id)
      .get()
      .then(querySnapshot => {
        const deletePromises = [];
        querySnapshot.forEach(documentSnapshot => {
          deletePromises.push(documentSnapshot.ref.delete());
        });
        return Promise.all(deletePromises);
      });

    const deletePickerExpense = await firestore()
      .collection('picker_expense')
      .where('pid', '==', id)
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
      .where('members', 'array-contains', id)
      .get();

    // Assume only one group due to single membership rule
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
            members: firestore.FieldValue.arrayRemove(id),
          });

    action;

    const deletePicker = await firestore()
      .collection('pickers_data')
      .doc(id)
      .delete();

    Promise.all([
      deletePicker,
      deletePickerExpense,
      deletePickerCottonWeight,
      action,
    ]);
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

export const getPickerGroup = () => {
  return new Promise(function (resolve, reject) {
    try {
      let userId = auth().currentUser?.uid;
      let arr = [];
      firestore()
        .collection('picker_groups')
        .where('uid', '==', userId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
          });
          resolve(arr);
        });
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
