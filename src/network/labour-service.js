import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { formatPhoneNumber, sanitizeData } from '@utils/helper';
import { currentStamp } from '@utils/dateformat';
import { ToastError, ToastSuccess } from '@utils/toast';

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

const deleteDocumentById = (collectionName, id) => {
  try {
    firestore().collection(collectionName).doc(id).delete();
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

export const addNewLabour = data => {
  return new Promise(async function (resolve, reject) {
    try {
      let userId = auth().currentUser?.uid;
      // Add labours_data document
      const labourDataRef = await firestore()
        .collection('labours_data')
        .add(
          sanitizeData({
            name: data?.name,
            is_regular: data?.is_regular,
            phone: formatPhoneNumber(data?.phone),
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

export const submitLabour = data => {
  try {
    let userId = auth().currentUser?.uid;
    firestore()
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_work')
      .add(sanitizeData({ ...data, uid: userId }));
    firestore().collection('labours_data').doc(data?.cid).update({
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

export const submitLabourExpense = data => {
  try {
    let userId = auth().currentUser?.uid;
    firestore()
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_expense')
      .add(sanitizeData({ ...data, uid: userId }));
    firestore().collection('labours_data').doc(data?.cid).update({
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
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_leave')
      .add(sanitizeData({ ...data, uid: userId }));
    firestore().collection('labours_data').doc(data?.cid).update({
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

export const getLabourRegular = (name, onUpdate) =>
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

export const updateLabour = data => {
  try {
    firestore()
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_work')
      .doc(data?.id)
      .update(sanitizeData(data));
    firestore().collection('labours_data').doc(data?.cid).update({
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
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_leave')
      .doc(data?.id)
      .update(sanitizeData(data));
    firestore().collection('labours_data').doc(data?.cid).update({
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
      .collection('labours_data')
      .doc(data?.cid)
      .collection('labour_expense')
      .doc(data?.id)
      .update(sanitizeData(data));
    firestore().collection('labours_data').doc(data?.cid).update({
      given_amount: data?.given_amount,
    });
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

// Function to update labours_data document calculation
export const updateLabourDataCalculation = labourId => {
  try {
    const labourDocRef = firestore().collection('labours_data').doc(labourId);
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
      const expenseSnapshot = labourDocRef.collection('labour_expense').get();
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

      // Update labours_data document with calculated values
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

      console.log('Labours data updated successfully.');
    } else {
      console.error('Labours data document does not exist.');
    }
  } catch (error) {
    console.error('Error saving or updating labours data:', error);
  }
};

export const deleteLabourExpense = (data, labour) => {
  try {
    firestore()
      .collection('labours_data')
      .doc(data.cid)
      .collection('labour_expense')
      .doc(data.id)
      .delete();
    firestore()
      .collection('labours_data')
      .doc(data?.cid)
      .update({
        given_amount: labour?.given_amount - data?.amount,
      });
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteLabour = data => {
  try {
    firestore()
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
export const deleteLabourLeave = (data, labour) => {
  try {
    firestore()
      .collection('labours_data')
      .doc(data.cid)
      .collection('labour_leave')
      .doc(data.id)
      .delete();
    firestore()
      .collection('labours_data')
      .doc(data?.cid)
      .update({
        total_leave: labour?.total_leave - data?.count,
      });
    return true;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteLabourCollection = id => {
  try {
    firestore().collection('labours_data').doc(id).delete();
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

