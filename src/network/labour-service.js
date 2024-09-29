import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import { sanitizeData } from '@utils/helper';
import { currentStamp } from '@utils/dateformat';

const getDocumentsListener = (query, onUpdate) => {
  try {
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
        ToastError(error?.message, 'Labour');
        throw new Error(error);
      },
    );
    return unsubscribe;
  } catch (error) {
    ToastError(error?.message, 'Labour');
    throw new Error(error);
  }
};

const deleteDocumentById = async (collectionName, id) => {
  try {
    await firestore().collection(collectionName).doc(id).delete();
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

export const addNewLabour = data => {
  return new Promise(async function (resolve, reject) {
    try {
      let userId = auth().currentUser?.uid;
      // let res = await firestore().disableNetwork()
      // console.log({ res })
      // setTimeout(() => {
      //   resolve(true);
      // }, 3000);
      // Add labours_data document
      const labourDataRef = await firestore()
        .collection('labours_data')
        .add(
          sanitizeData({
            name: data?.name,
            is_regular: data?.is_regular,
            phone: data?.phone,
            start_date: data?.start_date,
            total_labour_amount: data?.total_labour_amount,
            total_labour_count: data?.total_labour_count,
            labour_rate: data?.labour_rate,
            given_amount: data?.given_amount,
            read_access: [data?.phone],
            full_access: [userId],
            uid: userId,
          }),
        );

      const labourDataId = labourDataRef.id;

      // Add labour_work subcollection document
      await firestore()
        .collection('labours_data')
        .doc(labourDataId)
        .collection('labour_work')
        .add(
          sanitizeData({
            ...data,
            cid: labourDataId,
            uid: userId,
            date: currentStamp(),
          }),
        );

      resolve(true);
    } catch (error) {
      console.log(error);
      reject(error);
      throw new Error(error);
    }
  });
};

export const submitLabour = async data => {
  try {
    let userId = auth().currentUser?.uid;
    await firestore()
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_work')
      .add(sanitizeData({ ...data, uid: userId }));
    await firestore().collection('labours_data').doc(data?.cid).update({
      total_labour_amount: data?.total_labour_amount,
      total_labour_count: data?.total_labour_count,
      labour_rate: data?.rate,
    });
    return 'success';
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const submitLabourExpense = async data => {
  try {
    let userId = auth().currentUser?.uid;
    await firestore()
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_expense')
      .add(sanitizeData({ ...data, uid: userId }));
    await firestore().collection('labours_data').doc(data?.cid).update({
      given_amount: data?.given_amount,
    });
    return 'success';
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const submitLabourLeave = async data => {
  try {
    let userId = auth().currentUser?.uid;
    await firestore()
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_leave')
      .add(sanitizeData({ ...data, uid: userId }));
    await firestore().collection('labours_data').doc(data?.cid).update({
      total_leave: data?.total_leave,
    });
    return 'success';
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getLabourData = onUpdate =>
  getDocumentsListener(
    firestore()
      .collection('labours_data')
      .where('uid', '==', auth().currentUser?.uid),
    onUpdate,
  );

export const getLabourRegular = async (name, onUpdate) =>
  getDocumentsListener(
    firestore()
      .collection('labours_data')
      .where('uid', '==', auth().currentUser?.uid)
      .where('name' == name),
    onUpdate,
  );

export const getLabourExpense = (id, onUpdate) =>
  getDocumentsListener(
    firestore()
      .collection('labours_data')
      .doc(id)
      .collection('labour_expense')
      .orderBy('date', 'desc'),
    onUpdate,
  );

export const getLabourWork = (id, onUpdate) =>
  getDocumentsListener(
    firestore()
      .collection('labours_data')
      .doc(id)
      .collection('labour_work')
      .orderBy('date', 'desc'),
    onUpdate,
  );

export const getLabourLeave = (id, onUpdate) =>
  getDocumentsListener(
    firestore()
      .collection('labours_data')
      .doc(id)
      .collection('labour_leave')
      .orderBy('date', 'desc'),
    onUpdate,
  );

export const updateLabour = async data => {
  try {
    await firestore()
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_work')
      .doc(data?.id)
      .update(sanitizeData(data));
    await firestore().collection('labours_data').doc(data?.cid).update({
      total_labour_amount: data?.total_labour_amount,
      total_labour_count: data?.total_labour_count,
      labour_rate: data?.labour_rate,
    });
    return 'success';
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const updateLabourLeave = async data => {
  try {
    await firestore()
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_leave')
      .doc(data?.id)
      .update(sanitizeData(data));
    await firestore().collection('labours_data').doc(data?.cid).update({
      total_leave: data?.total_leave,
    });
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

export const updateLabourExpense = async data => {
  try {
    await firestore()
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_expense')
      .doc(data?.id)
      .update(sanitizeData(data));
    await firestore().collection('labours_data').doc(data?.cid).update({
      given_amount: data?.given_amount,
    });
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

// Function to update labours_data document calculation
export const updateLabourDataCalculation = async labourId => {
  try {
    const labourDocRef = firestore().collection('labours_data').doc(labourId);
    const labourDataSnapshot = await labourDocRef.get();

    if (labourDataSnapshot.exists) {
      // Calculate total_labour_amount from labour_work
      const workSnapshot = await labourDocRef.collection('labour_work').get();
      let totalLabourAmount = 0;
      let totalLabourCount = 0;
      let labourRate = 0;
      let start_date;
      workSnapshot.forEach(workDoc => {
        const workData = workDoc.data();
        const count = parseFloat(workData.count); // Assuming count is numeric
        const rate = parseFloat(workData.rate); // Assuming rate is numeric
        totalLabourAmount += count * rate;
        totalLabourCount += count;
        labourRate = rate;
        start_date = workData?.date;
      });

      // Calculate given_amount from labour_expense
      const expenseSnapshot = await labourDocRef
        .collection('labour_expense')
        .get();
      let givenAmount = 0;
      expenseSnapshot.forEach(expenseDoc => {
        const expenseData = expenseDoc.data();
        const amount = parseFloat(expenseData.amount); // Assuming amount is numeric
        givenAmount += amount;
      });

      // Calculate total_leave from labour_leave
      const leaveSnapshot = await labourDocRef.collection('labour_leave').get();
      let totalLeave = 0;
      leaveSnapshot.forEach(leaveDoc => {
        const leaveData = leaveDoc.data();
        const leaveCount = parseFloat(leaveData.count); // Assuming count is numeric
        totalLeave += leaveCount;
      });

      // Update labours_data document with calculated values
      await labourDocRef.set(
        {
          total_labour_amount: totalLabourAmount.toFixed(2), // Example formatting
          total_labour_count: totalLabourCount.toFixed(2), // Example formatting
          labour_rate: labourRate.toFixed(2), // Example formatting
          given_amount: givenAmount.toFixed(2), // Example formatting
          total_leave: totalLeave,
          start_date: start_date,
        },
        { merge: true },
      );

      console.log('Labours data updated successfully.');
    } else {
      console.error('Labours data document does not exist.');
    }
  } catch (error) {
    console.error('Error saving or updating labours data:', error);
  }
};

export const deleteLabourExpense = async data => {
  try {
    await firestore()
      .collection('labours_data')
      .doc(data.cid)
      .collection('labour_expense')
      .doc(data.id)
      .delete();
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteLabour = async data => {
  try {
    await firestore()
      .collection('labours_data')
      .doc(data.cid)
      .collection('labour_work')
      .doc(data.id)
      .delete();
    return true;
  } catch (error) {
    throw new Error(error);
  }
};
export const deleteLabourLeave = async id =>
  deleteDocumentById('labour_leave', id);

export const deleteLabourCollection = async id => {
  try {
    await firestore().collection('labours_data').doc(id).delete();
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

// const migrateData = async () => {
//   try {
//     const labourSnapshot = await firestore().collection('labour').get();
//     const expenseSnapshot = await firestore().collection('labour_expense').get();
//     const leaveSnapshot = await firestore().collection('labour_leave').get();

//     const batch = firestore().batch();

//     // Migrate labour collection data
//     labourSnapshot.forEach(doc => {
//       const { labour, is_regular, uid, count, detail, date, rate } = doc.data();
//       const newLabourRef = firestore().collection('labours').doc(doc.id);

//       // Set labour document with new structure, using default values if necessary
//       batch.set(newLabourRef, sanitizeData({
//         name: labour,
//         is_regular: is_regular,
//         read_access: [], // Initialize with empty arrays
//         full_access: [],
//       }));

//       // Create labour_work subcollection document
//       const newWorkRef = newLabourRef.collection('labour_work').doc();

//       batch.set(newWorkRef, sanitizeData({
//         count: count,
//         detail: detail,
//         date: date,
//         rate: rate,
//       }));
//     });

//     // Migrate labour_expense data to subcollection
//     expenseSnapshot.forEach(doc => {
//       const expenseData = doc.data();
//       const labourId = expenseData.uid; // Assuming `uid` is the reference to the labour document
//       const newExpenseRef = firestore().collection('labour').doc(labourId).collection('labour_expense').doc(doc.id);

//       batch.set(newExpenseRef, sanitizeData(expenseData));
//     });

//     // Migrate labour_leave data to subcollection
//     leaveSnapshot.forEach(doc => {
//       const leaveData = doc.data();
//       const labourId = leaveData.uid; // Assuming `uid` is the reference to the labour document
//       const newLeaveRef = firestore().collection('labour').doc(labourId).collection('labour_leave').doc(doc.id);

//       batch.set(newLeaveRef, sanitizeData(leaveData));
//     });

//     // Commit the batch write to Firestore
//     await batch.commit();
//     console.log('Data migration complete');

//     // Delete old collections
//     await deleteCollection('labour_expense');
//     await deleteCollection('labour_leave');

//     console.log('Old collections deleted');
//   } catch (error) {
//     console.error('Error migrating data and deleting old collections:', error);
//   }
// };

// const deleteCollection = async (collectionName) => {
//   const collectionRef = firestore().collection(collectionName);
//   const querySnapshot = await collectionRef.get();

//   const batch = firestore().batch();

//   querySnapshot.forEach(doc => {
//     batch.delete(doc.ref);
//   });

//   await batch.commit();
//   console.log(`Collection ${collectionName} deleted`);
// };

// migrateData();

export const backupData = async () => {
  try {
    const backup = {};

    const cropSnapshot = await firestore().collection('crop').get();
    backup.crop = cropSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const interest_amountSnapshot = await firestore()
      .collection('interest_amount')
      .get();
    backup.interest_amount = interest_amountSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const pickerSnapshot = await firestore().collection('picker').get();
    backup.picker = pickerSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const picker_expenseSnapshot = await firestore()
      .collection('picker_expense')
      .get();
    backup.picker_expense = picker_expenseSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const picker_groupSnapshot = await firestore()
      .collection('picker_group')
      .get();
    backup.picker_group = picker_groupSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const loanSnapshot = await firestore().collection('loan').get();
    backup.loan = loanSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const usersSnapshot = await firestore().collection('users').get();
    backup.users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Backup labour collection
    const labourSnapshot = await firestore().collection('labour').get();
    backup.labour = labourSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    const laboursSnapshot = await firestore().collection('labours').get();
    backup.labours = laboursSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Backup labour_expense collection
    const expenseSnapshot = await firestore()
      .collection('labour_expense')
      .get();
    backup.labour_expense = expenseSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Backup labour_leave collection
    const leaveSnapshot = await firestore().collection('labour_leave').get();
    backup.labour_leave = leaveSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Backup pickers_data collection
    const pickers_dataSnapshot = await firestore()
      .collection('pickers_data')
      .get();
    backup.labour_pickers_data = pickers_dataSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Backup pickers_groups collection
    const pickers_groupsSnapshot = await firestore()
      .collection('pickers_groups')
      .get();
    backup.labour_pickers_groups = pickers_groupsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Backup picker_cotton_weight collection
    const picker_cotton_weightSnapshot = await firestore()
      .collection('picker_cotton_weight')
      .get();
    backup.labour_picker_cotton_weight = picker_cotton_weightSnapshot.docs.map(
      doc => ({ id: doc.id, ...doc.data() }),
    );

    // Backup labours_data collection
    const labours_dataSnapshot = await firestore()
      .collection('labours_data')
      .get();

    backup.labour_labours_data = await Promise.all(
      labours_dataSnapshot.docs.map(async doc => {
        const [leaveSnapshot, expenseSnapshot, workSnapshot] =
          await Promise.all([
            firestore()
              .collection('labours_data')
              .doc(doc.id)
              .collection('labour_leave')
              .get(),
            firestore()
              .collection('labours_data')
              .doc(doc.id)
              .collection('labour_expense')
              .get(),
            firestore()
              .collection('labours_data')
              .doc(doc.id)
              .collection('labour_work')
              .get(),
          ]);

        const leaveData = leaveSnapshot.docs.map(leaveDoc => ({
          id: leaveDoc.id,
          ...leaveDoc.data(),
        }));

        const expenseData = expenseSnapshot.docs.map(expenseDoc => ({
          id: expenseDoc.id,
          ...expenseDoc.data(),
        }));

        const workData = workSnapshot.docs.map(workDoc => ({
          id: workDoc.id,
          ...workDoc.data(),
        }));

        return {
          id: doc.id,
          ...doc.data(),
          labour_leave: leaveData,
          labour_expense: expenseData,
          labour_work: workData,
        };
      }),
    );

    // Backup aadhat_data collection
    const aadhat_dataSnapshot = await firestore()
      .collection('aadhat_data')
      .get();

    backup.labour_labours_data = await Promise.all(
      aadhat_dataSnapshot.docs.map(async doc => {
        const [transactionsSnapshot] = await Promise.all([
          firestore()
            .collection('aadhat_data')
            .doc(doc.id)
            .collection('transactions')
            .get(),
        ]);

        const transData = transactionsSnapshot.docs.map(transDoc => ({
          id: transDoc.id,
          ...transDoc.data(),
        }));

        return {
          id: doc.id,
          ...doc.data(),
          transactions: transData,
        };
      }),
    );

    // Save backup to file
    // Convert backup to JSON string
    const backupJson = JSON.stringify(backup, null, 2);

    // Define file path
    const filePath = `${RNFS.DownloadDirectoryPath}/firestore-backup.json`;
    console.log(filePath);
    // Write backup to file
    await RNFS.writeFile(filePath, backupJson, 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!', success);
      })
      .catch(err => {
        console.log(err.message);
      });

    console.log('Data backup complete');
  } catch (error) {
    console.error('Error backing up data:', error);
  }
};

// backupData()

const migrateLabourData = async () => {
  try {
    const labourSnapshot = await firestore().collection('labour').get();
    const batch = firestore().batch();
    console.log('----migrate-----labour data');
    // Migrate labour collection data
    for (const doc of labourSnapshot.docs) {
      const { labour, is_regulare, uid, count, detail, date, rate } = doc.data();

      const newLabourRef = firestore().collection('labours_data').doc(doc.id);

      // Set labour document with new structure
      batch.set(
        newLabourRef,
        sanitizeData({
          name: labour,
          is_regular: is_regulare,
          start_date: date,
          uid,
        }),
      );

      // Create labour_work subcollection document
      const newWorkRef = newLabourRef.collection('labour_work').doc();
      batch.set(
        newWorkRef,
        sanitizeData({
          count: count,
          detail: detail,
          date: date,
          rate: rate,
        }),
      );

      // Migrate labour_expense subcollection data
      const expenseSnapshot = await firestore()
        .collection('labour')
        .doc(uid)
        .collection('labour_expense')
        .get();
      expenseSnapshot.forEach(expenseDoc => {
        const newExpenseRef = newLabourRef.collection('labour_expense').doc();
        batch.set(newExpenseRef, sanitizeData(expenseDoc.data()));
      });

      // Migrate labour_leave subcollection data
      const leaveSnapshot = await firestore()
        .collection('labour')
        .doc(uid)
        .collection('labour_leave')
        .get();
      leaveSnapshot.forEach(leaveDoc => {
        const newLeaveRef = newLabourRef.collection('labour_leave').doc();
        batch.set(newLeaveRef, sanitizeData(leaveDoc.data()));
      });
    }

    // Commit the batch write to Firestore
    await batch.commit();
    console.log('Data migration complete');

    // Delete old labour collection
    await deleteCollection('labour');
    // await deleteCollection('labour_expense');
    // await deleteCollection('labour_leave');
    console.log('Old labour collection deleted');
  } catch (error) {
    console.error('Error migrating data:', error);
  }
};

const deleteCollection = async collectionName => {
  const collectionRef = firestore().collection(collectionName);
  const querySnapshot = await collectionRef.get();

  const batch = firestore().batch();

  querySnapshot.forEach(doc => {
    batch.delete(doc.id);
  });

  await batch.commit();
  console.log(`Collection ${collectionName} deleted`);
};

// migrateLabourData();

const cleanUpDuplicates = async () => {
  try {
    let userId = auth().currentUser?.uid;
    const labourDataSnapshot = await firestore()
      .collection('labours_data')
      .where('uid', '==', userId)
      .get();
    const batch = firestore().batch();

    for (const doc of labourDataSnapshot.docs) {
      const newLabourRef = firestore().collection('labours_data').doc(doc.id);

      // // Step 1: Remove duplicates in labour_work subcollection
      const labourWorkSnapshot = await newLabourRef
        .collection('labour_work')
        .get();
      const uniqueLabourWork = new Set(); // Set to track unique records (by date, amount, or full object)

      labourWorkSnapshot.forEach(workDoc => {
        const workData = workDoc.data();
        const { date, amount } = workData;

        // Convert the full object to a string to compare the entire document
        const uniqueIdentifier = JSON.stringify({ date, amount, ...workData });

        if (uniqueLabourWork.has(uniqueIdentifier)) {
          // If this combination of date, amount, or full object is already in the set, delete the duplicate
          batch.delete(workDoc.ref);
          console.log(
            `Deleted duplicate labour_work record for labour: ${doc.id}`,
          );
        } else {
          // Add the unique combination of date, amount, or full object to the set
          uniqueLabourWork.add(uniqueIdentifier);
        }
      });

      // Step 2: Remove duplicates in labour_expense subcollection
      const labourExpenseSnapshot = await newLabourRef
        .collection('labour_expense')
        .get();
      const uniqueLabourExpenseByDate = new Map();

      labourExpenseSnapshot.forEach(expenseDoc => {
        const expenseData = expenseDoc.data();
        const { date, amount } = expenseData;
        // console.log({ expenseData })
        if (uniqueLabourExpenseByDate.has(date + amount)) {
          batch.delete(expenseDoc.ref);
          console.log(
            `Deleted duplicate labour_expense record with date: ${date} for labour: ${doc.id}`,
          );
        } else {
          uniqueLabourExpenseByDate.set(date + amount, expenseDoc.id);
        }
      });

      // Step 3: Remove duplicates in labour_leave subcollection
      const labourLeaveSnapshot = await newLabourRef
        .collection('labour_leave')
        .get();
      const uniqueLabourLeaveByDate = new Map();

      labourLeaveSnapshot.forEach(leaveDoc => {
        const leaveData = leaveDoc.data();
        const { date, count } = leaveData;

        if (uniqueLabourLeaveByDate.has(date + count)) {
          batch.delete(leaveDoc.ref);
          console.log(
            `Deleted duplicate labour_leave record with date: ${JSON.stringify(
              leaveData,
            )} for labour: ${doc.id}`,
          );
        } else {
          uniqueLabourLeaveByDate.set(date + count, leaveDoc.id);
        }
      });
    }

    // // Commit the batch delete operation to Firestore
    await batch.commit();
    console.log('Duplicate records removed successfully.');
  } catch (error) {
    console.error('Error cleaning up duplicates:', error);
  }
};

// cleanUpDuplicates();
