import { Auth, storage } from 'src/service/setup';
import firestore from '@react-native-firebase/firestore';

export const submitDocument = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let id = Auth().currentUser?.uid;
      firestore()
        .collection('document_reminder')
        .add({ ...data, uid: id })
        .then(res => resolve(res?.id));
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getDocumentData = () => {
  return new Promise(async function (resolve, reject) {
    let userId = Auth().currentUser?.uid;
    await firestore()
      .collection('document_reminder')
      .where('uid', '==', userId)
      .get()
      .then(querySnapshot => {
        let arr = [];
        querySnapshot.forEach(documentSnapshot => {
          arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
        });
        console.log(arr,"##########")
        resolve(arr);
      })
      .catch(error => {
        reject(new Error(error));
      });
  });
};

export const getDocumentByName = name => {
  return new Promise(async function (resolve, reject) {
    let userId = Auth().currentUser?.uid;
    await firestore()
      .collection('document_reminder')
      .where('uid', '==', userId)
      .where('document_reminder', '==', name)
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
export const updateDocument = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('document_reminder').doc(data?.fid).update(data);
      resolve(data?.fid);
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deleteDocument = async id => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('document_reminder').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deleteDocumentCollection = async (name) => {
  try {
    const userId = Auth().currentUser?.uid;

    const deleteDocument = firestore()
      .collection('document_reminder')
      .where('uid', '==', userId)
      .where('document_reminder', '==', name)
      .get()
      .then((querySnapshot) => {
        const deletePromises = [];
        querySnapshot.forEach((documentSnapshot) => {
          deletePromises.push(documentSnapshot.ref.delete());
        });col
        return Promise.all(deletePromises);
      });

    await Promise.all([deleteDocument]);
  } catch (error) {
    throw new Error(error);
  }

};
