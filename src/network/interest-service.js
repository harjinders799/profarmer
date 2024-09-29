import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const submitInterestAmount = data => {
  return new Promise(function (resolve, reject) {
    try {
      let id = auth().currentUser?.uid;
      firestore()
        .collection('interest_amount')
        .add({ ...data, uid: id });
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};
export const updateIneterstAmt = data => {
  return new Promise(function (resolve, reject) {
    try {
      firestore()
        .collection('interest_amount')
        .doc(data?.id)
        .update(data);
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deleteIneterstAmt = id => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('interest_amount').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getInterestAmount = () => {
  return new Promise(function (resolve, reject) {
    let userId = auth().currentUser?.uid;
    firestore()
      .collection('interest_amount')
      .where('uid', '==', userId)
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

export const submitCrop = data => {
  return new Promise(function (resolve, reject) {
    try {
      let id = auth().currentUser?.uid;
      firestore()
        .collection('crop')
        .add({ ...data, uid: id });
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};
export const updateCrop = data => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('crop').doc(data?.id).update(data);
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deleteCrop = id => {
  return new Promise(function (resolve, reject) {
    try {
      firestore().collection('crop').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};
export const getCrops = () => {
  return new Promise(function (resolve, reject) {
    let userId = auth().currentUser?.uid;
    firestore()
      .collection('crop')
      .where('uid', '==', userId)
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
export const deleteCropCollection = name => {
  return new Promise(function (resolve, reject) {
    try {
      let userId = auth().currentUser?.uid;
      firestore()
        .collection('crop')
        .where('uid', '==', userId)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(documentSnapshot => {
            console.log(documentSnapshot.ref.delete())
          });
        });
      resolve();
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deleteGiverCollection = (name) => {

  try {
    const userId = auth().currentUser?.uid;

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
    Promise.all(deleteGiver);
  } catch (error) {
    throw new Error(error);
  }
};
// export const deleteDebtorCollection =  (name) => {
//   x
//   try {
//     const userId = auth().currentUser?.uid;

//     const deleteDebtor = firestore()
//       .collection('interest_amount')
//       .where('uid', '==', userId)
//       .where('debtor', '==', name)
//       .get()
//       .then((querySnapshot) => {
//         const deletePromises = [];
//         querySnapshot.forEach((documentSnapshot) => {
//           deletePromises.push(documentSnapshot.ref.delete());
//         });
//         return Promise.all(deletePromises);
//       });
//      Promise.all([deleteDebtor]);
//   } catch (error) {
//     throw new Error(error);
//   }
// };
