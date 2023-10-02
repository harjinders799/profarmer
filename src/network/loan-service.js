import { Auth, firestore } from 'src/service/setup';


export const submitLoan = async data => {
    return new Promise(async function (resolve, reject) {
      try {
        let id = Auth().currentUser?.uid;
        await firestore()
          .collection('loan')
          .add({...data, uid: id});
        resolve('success');
      } catch (error) {
        reject(new Error(error));
      }
    });
  };

  export const getLoanData = () => {
    return new Promise(async function (resolve, reject) {
      let userId = Auth().currentUser?.uid;
      await firestore()
        .collection('loan')
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
  export const updateLoan = async data => {
    return new Promise(async function (resolve, reject) {
      try {
        await firestore().collection('loan').doc(data?.id).update(data);
        resolve('success');
      } catch (error) {
        reject(new Error(error));
      }
    });
  };
  export const deleteLoan = async id => {
    return new Promise(async function (resolve, reject) {
      try {
        await firestore().collection('loan').doc(id).delete();
        resolve('success');
      } catch (error) {
        reject(new Error(error));
      }
    });
  };

export const deleteLoanCollection = async (name) => {
    x
    try {
      const userId = Auth().currentUser?.uid;
  
      const deleteLoan = firestore()
        .collection('loan')
        .where('uid', '==', userId)
        .where('loan', '==', name)
        .get()
        .then((querySnapshot) => {
          const deletePromises = [];
          querySnapshot.forEach((documentSnapshot) => {
            deletePromises.push(documentSnapshot.ref.delete());
          });
          return Promise.all(deletePromises);
        });
      await Promise.all([deleteLoan]);
    } catch (error) {
      throw new Error(error);
    }
  };