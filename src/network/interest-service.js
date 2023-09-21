import {Auth, firestore} from 'src/service/setup';

export const submitInterestAmount = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let id = Auth().currentUser?.uid;
      await firestore()
        .collection('interest_amount')
        .add({...data, uid: id});
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};
export const updateIneterstAmt = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore()
        .collection('interest_amount')
        .doc(data?.id)
        .update(data);
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deleteIneterstAmt = async id => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('interest_amount').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getInterstAmount = () => {
  return new Promise(async function (resolve, reject) {
    let userId = Auth().currentUser?.uid;
    await firestore()
      .collection('interest_amount')
      .where('uid', '==', userId)
      .get()
      .then(querySnapshot => {
        let arr = [];
        querySnapshot.forEach(documentSnapshot => {
          arr.push({...documentSnapshot.data(), id: documentSnapshot.id});
        });
        resolve(arr);
      })
      .catch(error => {
        reject(new Error(error));
      });
  });
};

export const submitCrop = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let id = Auth().currentUser?.uid;
      await firestore()
        .collection('crop')
        .add({...data, uid: id});
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};
export const updateCrop = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('crop').doc(data?.id).update(data);
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deleteCrop = async id => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('crop').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getCrops = () => {
  return new Promise(async function (resolve, reject) {
    let userId = Auth().currentUser?.uid;
    await firestore()
      .collection('crop')
      .where('uid', '==', userId)
      .get()
      .then(querySnapshot => {
        let arr = [];
        querySnapshot.forEach(documentSnapshot => {
          arr.push({...documentSnapshot.data(), id: documentSnapshot.id});
        });
        resolve(arr);
      })
      .catch(error => {
        reject(new Error(error));
      });
  });
};

export const deleteGiverCollection = async (name) => {
  try {
    const userId = Auth().currentUser?.uid;

    const deleteGiver = firestore()
      .collection('interest_amount')
      .where('uid', '==', userId)
      .where('giver', '==', name)
      .get()
      .then((querySnapshot) => {
        const deletePromises = [];
        querySnapshot.forEach((documentSnapshot) => {
          deletePromises.push(documentSnapshot.ref.delete());
        });
        return Promise.all(deletePromises);
      });
    await Promise.all([deleteGiver]);
  } catch (error) {
    throw new Error(error);
  }
};
