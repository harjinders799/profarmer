import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { calculateLoanDetails, sanitizeData } from '@utils/helper';
import { ToastError } from '@utils/toast';


export const addAadhatiya = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let uid = auth().currentUser?.uid;
      await firestore()
        .collection('aadhat_data')
        .add({
          ...data,
          read_access: [data?.phone],
          full_access: [uid],
          uid,
        });
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};


export const aadhatDataListener = (onUpdate, unsubscribeFunctions = []) => {
  try {
    let uid = auth().currentUser?.uid;
    const unsubscribeMain = firestore()
      .collection('aadhat_data')
      .where('uid', '==', uid)
      .onSnapshot(querySnapshot => {
        const aadhatsData = [];
        const promises = [];

        unsubscribeFunctions.forEach(unsub => unsub());
        unsubscribeFunctions.length = 0;
        console.log({ querySnapshot })
        querySnapshot != null && querySnapshot.forEach(doc => {
          const aadhatData = doc.data();
          aadhatData.id = doc.id;
          aadhatData.transactions = [];

          const unsubscribe = doc.ref
            .collection('transactions')
            .orderBy('date', 'desc')
            .onSnapshot(subSnapshot => {
              const transactions = [];
              subSnapshot.forEach(transactionDoc => {
                transactions.push({
                  ...transactionDoc.data(),
                  aid: doc.id,
                  id: transactionDoc.id,
                });
              });
              aadhatData.transactions = transactions;
              console.log({ transactions })
              calculateLoanDetails(aadhatsData, aadhatData);
            });

          unsubscribeFunctions.push(unsubscribe);
          promises.push(doc.ref.collection('transactions').get());
          aadhatsData.push(aadhatData);
        });
        Promise.all(promises).then(() => {
          aadhatsData.forEach(aadhatData => {
            calculateLoanDetails(aadhatsData, aadhatData);
          });
          if (onUpdate) onUpdate([...aadhatsData]);
        });
      });
    return unsubscribeMain;
  } catch (error) {
    ToastError(error?.message, 'Aadhat');
    throw new Error(error);
  }
};


export const addAmountTransaction = data => {
  return new Promise(function (resolve, reject) {
    try {
      firestore()
        .collection('aadhat_data')
        .doc(data?.aid)
        .collection('transactions')
        .add(sanitizeData(data)).then(() => {
          resolve('success');
        }).catch(error => {
          reject(new Error(error));
        })
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deleteAmountTransaction = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore()
        .collection('aadhat_data')
        .doc(data?.aid)
        .collection('transactions')
        .doc(data?.id)
        .delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};


export const updateAmountTransaction = async data => {
  console.log(data)
  return new Promise(async function (resolve, reject) {
    try {
      await firestore()
        .collection('aadhat_data')
        .doc(data?.aid)
        .collection('transactions')
        .doc(data?.id)
        .update(sanitizeData(data));
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};


export const deleteAadhatCollection = async id => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('aadhat_data').doc(id).delete();
      resolve('success');
    } catch (error) {
      throw new Error(error);
    }
  });
};

