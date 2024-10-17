import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { sanitizeData } from '@utils/helper';

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


export const addNewCrop = data => {
  return new Promise(function (resolve, reject) {
    try {
      let userId = auth().currentUser?.uid;
      firestore()
        .collection('crops_data')
        .add(
          sanitizeData({
            ...data,
            uid: userId,
            total_expense: '0.00',
            total_earning: '0.00',
            read_access: [],
            full_access: [userId],
          }),
        )
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const submitEvent = data => {
  return new Promise(function (resolve, reject) {
    try {
      let ref = firestore().collection('crops_data').doc(data?.cid);
      ref
        .collection('events')
        .add(sanitizeData(data))
      ref
        .update(sanitizeData({
          total_expense: data?.total_expense,
          total_earning: data?.total_earning,
        }))
      resolve('success');
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });
};

export const updateEvent = data => {
  return new Promise(function (resolve, reject) {
    try {
      let ref = firestore().collection('crops_data').doc(data?.cid);
      ref
        .collection('events')
        .doc(data?.id)
        .update(sanitizeData(data))
      ref
        .update(sanitizeData({
          total_expense: data?.total_expense,
          total_earning: data?.total_earning,
        }))
      resolve('success');
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });
};

export const deleteEvent = data => {
  return new Promise(function (resolve, reject) {
    try {
      let ref = firestore().collection('crops_data').doc(data?.cid);
      ref
        .collection('events')
        .doc(data?.id)
        .delete()
      ref
        .update(sanitizeData({
          total_expense: data?.total_expense,
          total_earning: data?.total_earning,
        }))
      resolve('success');
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });
};

export const getCropData = onUpdate =>
  getDocumentsListener(
    // __DEV__ ? firestore().collection('crops_data') :
    firestore().collection('crops_data').where('uid', '==', auth().currentUser?.uid),
    onUpdate,
  );

export const getCropEvents = (id, onUpdate) =>
  getDocumentsListener(
    firestore()
      .collection('crops_data')
      .doc(id)
      .collection('events')
      .orderBy('date', 'desc'),
    onUpdate,
  );

export const deleteCropCollection = async id => {
  try {
    await firestore().collection('crops_data').doc(id).delete();
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};