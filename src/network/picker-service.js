import { Auth, storage } from 'src/service/setup';
import firestore from '@react-native-firebase/firestore';

export const submitPicker = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let id = Auth().currentUser?.uid;
      firestore()
        .collection('picker')
        .add({ ...data, uid: id })
        .then(res => resolve(res?.id));
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getPickerData = () => {
  return new Promise(async function (resolve, reject) {
    let userId = Auth().currentUser?.uid;
    await firestore()
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
  return new Promise(async function (resolve, reject) {
    let userId = Auth().currentUser?.uid;
    await firestore()
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

export const getAllPickerExpense = async name => {
  return new Promise(async function (resolve, reject) {
    try {
      let userId = Auth().currentUser?.uid;
      await firestore()
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
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deletePickerExpense = async id => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('picker_expense').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};
export const updatePicker = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('picker').doc(data?.fid).update(data);
      resolve(data?.fid);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updatePickerExpense = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore()
        .collection('picker_expense')
        .doc(data?.fid)
        .update(data);
      resolve(data?.fid);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deletePicker = async id => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('picker').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const submitPickerExpense = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let id = Auth().currentUser?.uid;
      firestore()
        .collection('picker_expense')
        .add({ ...data, uid: id })
        .then(res => resolve(res?.id));
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getPickerExpense = async name => {
  return new Promise(async function (resolve, reject) {
    try {
      let userId = Auth().currentUser?.uid;
      await firestore()
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
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getCottonByPicker = search => {
  return new Promise(async function (resolve, reject) {
    let userId = Auth().currentUser?.uid;
    await firestore()
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

export const deletePickerCollection = async (name) => {
  try {
    const userId = Auth().currentUser?.uid;

    const deletePicker = firestore()
      .collection('picker')
      .where('uid', '==', userId)
      .where('picker', '==', name)
      .get()
      .then((querySnapshot) => {
        const deletePromises = [];
        querySnapshot.forEach((documentSnapshot) => {
          deletePromises.push(documentSnapshot.ref.delete());
        });
        return Promise.all(deletePromises);
      });

    const deletePickerExpense = firestore()
      .collection('picker_expense')
      .where('uid', '==', userId)
      .where('picker', '==', name)
      .get()
      .then((querySnapshot) => {
        const deletePromises = [];
        querySnapshot.forEach((documentSnapshot) => {
          deletePromises.push(documentSnapshot.ref.delete());
        });
        return Promise.all(deletePromises);
      });

    await Promise.all([deletePicker, deletePickerExpense]);
  } catch (error) {
    throw new Error(error);
  }
};
