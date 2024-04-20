import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const submitPrice = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let id = auth().currentUser?.uid;
      firestore()
        .collection('prices')
        .add({ ...data, uid: id })
        .then(res => resolve(res?.id));
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getPriceData = () => {
  return new Promise(async function (resolve, reject) {
    let userId = auth().currentUser?.uid;
    await firestore()
      .collection('prices')
      .orderBy('date', 'desc')
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

export const getPriceByName = name => {
  return new Promise(async function (resolve, reject) {
    let userId = auth().currentUser?.uid;
    await firestore()
      .collection('prices')
      .where('uid', '==', userId)
      .where('commodity', '==', name)
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


export const updatePrice = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('prices').doc(data?.id).update(data);
      resolve(data?.id);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deletePrice = async id => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('prices').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

