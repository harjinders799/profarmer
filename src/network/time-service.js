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

const deleteDocumentById = (collectionName, id) => {
  try {
    firestore().collection(collectionName).doc(id).delete();
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

export const addNewLabour = data => {
  try {
    let userId = auth().currentUser?.uid;
    // Add timeline_data document
    const labourDataRef = firestore()
      .collection('timeline_data')
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
    firestore()
      .collection('timeline_data')
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

    return 'success';
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const createTimeline = data => {
  return new Promise(function (resolve, reject) {
    try {
      let userId = auth().currentUser?.uid;
      firestore()
        .collection('timeline_data')
        .add(
          sanitizeData({
            ...data,
            uid: userId,
            read_access: [],
            full_access: [userId],
          }),
        )
        .then(() => {
          resolve('success');
        })
        .catch(error => {
          reject(new Error(error));
        });
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const submitLabourExpense = data => {
  try {
    let userId = auth().currentUser?.uid;
    firestore()
      .collection('timeline_data')
      .doc(data?.cid)
      .collection('labour_expense')
      .add(sanitizeData({ ...data, uid: userId }));
    firestore().collection('timeline_data').doc(data?.cid).update({
      given_amount: data?.given_amount,
    });
    return 'success';
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const submitLabourLeave = data => {
  try {
    let userId = auth().currentUser?.uid;
    firestore()
      .collection('timeline_data')
      .doc(data?.cid)
      .collection('labour_leave')
      .add(sanitizeData({ ...data, uid: userId }));
    firestore().collection('timeline_data').doc(data?.cid).update({
      total_leave: data?.total_leave,
    });
    return 'success';
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const getTimelineData = onUpdate =>
  getDocumentsListener(
    firestore().collection('timeline_data').where('uid', '==', auth().currentUser?.uid
    ),
    onUpdate,
  );

export const getLabourRegular = (name, onUpdate) =>
  getDocumentsListener(
    firestore()
      .collection('timeline_data')
      .where('uid', '==', auth().currentUser?.uid)
      .where('name' == name),
    onUpdate,
  );

export const getLabourExpense = (id, onUpdate) =>
  getDocumentsListener(
    firestore()
      .collection('timeline_data')
      .doc(id)
      .collection('labour_expense')
      .orderBy('date', 'desc'),
    onUpdate,
  );

export const getLabourWork = (id, onUpdate) =>
  getDocumentsListener(
    firestore()
      .collection('timeline_data')
      .doc(id)
      .collection('labour_work')
      .orderBy('date', 'desc'),
    onUpdate,
  );

export const getLabourLeave = (id, onUpdate) =>
  getDocumentsListener(
    firestore()
      .collection('timeline_data')
      .doc(id)
      .collection('labour_leave')
      .orderBy('date', 'desc'),
    onUpdate,
  );

export const updateLabour = data => {
  try {
    firestore()
      .collection('timeline_data')
      .doc(data?.cid)
      .collection('labour_work')
      .doc(data?.id)
      .update(sanitizeData(data));
    firestore().collection('timeline_data').doc(data?.cid).update({
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

export const updateLabourLeave = data => {
  try {
    firestore()
      .collection('timeline_data')
      .doc(data?.cid)
      .collection('labour_leave')
      .doc(data?.id)
      .update(sanitizeData(data));
    firestore().collection('timeline_data').doc(data?.cid).update({
      total_leave: data?.total_leave,
    });
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

export const updateLabourExpense = data => {
  try {
    firestore()
      .collection('timeline_data')
      .doc(data?.cid)
      .collection('labour_expense')
      .doc(data?.id)
      .update(sanitizeData(data));
    firestore().collection('timeline_data').doc(data?.cid).update({
      given_amount: data?.given_amount,
    });
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

// Function to update timeline_data document calculation
export const updateLabourDataCalculation = labourId => {
  try {
    const labourDocRef = firestore().collection('timeline_data').doc(labourId);
    const labourDataSnapshot = labourDocRef.get();

    if (labourDataSnapshot.exists) {
      // Calculate total_labour_amount from labour_work
      const workSnapshot = labourDocRef.collection('labour_work').get();
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
      const expenseSnapshot = labourDocRef
        .collection('labour_expense')
        .get();
      let givenAmount = 0;
      expenseSnapshot.forEach(expenseDoc => {
        const expenseData = expenseDoc.data();
        const amount = parseFloat(expenseData.amount); // Assuming amount is numeric
        givenAmount += amount;
      });

      // Calculate total_leave from labour_leave
      const leaveSnapshot = labourDocRef.collection('labour_leave').get();
      let totalLeave = 0;
      leaveSnapshot.forEach(leaveDoc => {
        const leaveData = leaveDoc.data();
        const leaveCount = parseFloat(leaveData.count); // Assuming count is numeric
        totalLeave += leaveCount;
      });

      // Update timeline_data document with calculated values
      labourDocRef.set(
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

      console.log('timeline data updated successfully.');
    } else {
      console.error('timeline data document does not exist.');
    }
  } catch (error) {
    console.error('Error saving or updating timeline data:', error);
  }
};

export const deleteLabourExpense = data => {
  try {
    firestore()
      .collection('timeline_data')
      .doc(data.cid)
      .collection('labour_expense')
      .doc(data.id)
      .delete();
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteLabour = data => {
  try {
    firestore()
      .collection('timeline_data')
      .doc(data.cid)
      .collection('labour_work')
      .doc(data.id)
      .delete();
    return true;
  } catch (error) {
    throw new Error(error);
  }
};
export const deleteLabourLeave = id =>
  deleteDocumentById('labour_leave', id);

export const deleteLabourCollection = id => {
  try {
    firestore().collection('timeline_data').doc(id).delete();
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

// const migrateData =  () => {
//   try {
//     const timelinenapshot =  firestore().collection('labour').get();
//     const expenseSnapshot =  firestore().collection('labour_expense').get();
//     const leaveSnapshot =  firestore().collection('labour_leave').get();

//     const batch = firestore().batch();

//     // Migrate labour collection data
//     timelinenapshot.forEach(doc => {
//       const { labour, is_regular, uid, count, detail, date, rate } = doc.data();
//       const newLabourRef = firestore().collection('timeline').doc(doc.id);

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
//      batch.commit();
//     console.log('Data migration complete');

//     // Delete old collections
//      deleteCollection('labour_expense');
//      deleteCollection('labour_leave');

//     console.log('Old collections deleted');
//   } catch (error) {
//     console.error('Error migrating data and deleting old collections:', error);
//   }
// };

// const deleteCollection =  (collectionName) => {
//   const collectionRef = firestore().collection(collectionName);
//   const querySnapshot =  collectionRef.get();

//   const batch = firestore().batch();

//   querySnapshot.forEach(doc => {
//     batch.delete(doc.ref);
//   });

//    batch.commit();
//   console.log(`Collection ${collectionName} deleted`);
// };

// migrateData();

// const backupData =  () => {
//   try {
//     const backup = {};

//     const cropSnapshot =  firestore().collection('crop').get();
//     backup.crop = cropSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     const interest_amountSnapshot =  firestore().collection('interest_amount').get();
//     backup.interest_amount = interest_amountSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     const pickerSnapshot =  firestore().collection('picker').get();
//     backup.picker = pickerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     const picker_expenseSnapshot =  firestore().collection('picker_expense').get();
//     backup.picker_expense = picker_expenseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     const picker_groupSnapshot =  firestore().collection('picker_group').get();
//     backup.picker_group = picker_groupSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     const loanSnapshot =  firestore().collection('loan').get();
//     backup.loan = loanSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     const usersSnapshot =  firestore().collection('users').get();
//     backup.users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     // Backup labour collection
//     const timelinenapshot =  firestore().collection('labour').get();
//     backup.labour = timelinenapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     const timelineSnapshot =  firestore().collection('timeline').get();
//     backup.timeline = timelineSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     // Backup labour_expense collection
//     const expenseSnapshot =  firestore().collection('labour_expense').get();
//     backup.labour_expense = expenseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     // Backup labour_leave collection
//     const leaveSnapshot =  firestore().collection('labour_leave').get();
//     backup.labour_leave = leaveSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//     // Save backup to file
//     // Convert backup to JSON string
//     const backupJson = JSON.stringify(backup, null, 2);

//     // Define file path
//     const filePath = `${RNFS.DownloadDirectoryPath}/firestore-backup.json`;
//     console.log(filePath)
//     // Write backup to file
//      RNFS.writeFile(filePath, backupJson, 'utf8').then((success) => {
//       console.log('FILE WRITTEN!', success);
//     })
//       .catch((err) => {
//         console.log(err.message);
//       });;

//     console.log('Data backup complete');
//   } catch (error) {
//     console.error('Error backing up data:', error);
//   }
// };

// backupData()

const migrateLabourData = () => {
  try {
    const timelinenapshot = firestore().collection('labour').get();
    const batch = firestore().batch();

    // Migrate labour collection data
    for (const doc of timelinenapshot.docs) {
      const { labour, is_regulare, uid, count, detail, date, rate } = doc.data();

      const newLabourRef = firestore().collection('timeline_data').doc(doc.id);

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
      const expenseSnapshot = firestore()
        .collection('labour')
        .doc(uid)
        .collection('labour_expense')
        .get();
      expenseSnapshot.forEach(expenseDoc => {
        const newExpenseRef = newLabourRef.collection('labour_expense').doc();
        batch.set(newExpenseRef, sanitizeData(expenseDoc.data()));
      });

      // Migrate labour_leave subcollection data
      const leaveSnapshot = firestore()
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
    batch.commit();
    console.log('Data migration complete');

    // Delete old labour collection
    deleteCollection('labour');
    console.log('Old labour collection deleted');
  } catch (error) {
    console.error('Error migrating data:', error);
  }
};

const deleteCollection = collectionName => {
  const collectionRef = firestore().collection(collectionName);
  const querySnapshot = collectionRef.get();

  const batch = firestore().batch();

  querySnapshot.forEach(doc => {
    batch.delete(doc.id);
  });

  batch.commit();
  console.log(`Collection ${collectionName} deleted`);
};

// migrateLabourData();
