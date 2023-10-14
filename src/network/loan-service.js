import firestore from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';

export const submitLoan = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let id = Auth().currentUser?.uid;
      await firestore()
        .collection('loan')
        .add({ ...data, uid: id })
        .then(res => resolve(res?.id));
      // resolve('success');
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
          arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
        });
        resolve(arr);
      })
      .catch(error => {
        reject(new Error(error));
      }
      );
    })
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

export const updateLoan = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('loan').doc(data?.id).update(data);
      resolve(data?.fid);
      // resolve('success')
    } catch (error) {
      reject(new Error(error));
    }
  });
};
export const updateLoanName = async (name,data) => {
  return new Promise(async function (resolve, reject) {
    let userId = Auth().currentUser?.uid;
    try {
        const usersQuerySnapshot = await firestore().collection('loan').where(
          firestore.Filter.or(
            firestore.Filter.and(firestore.Filter('giver', '==', userId), firestore.Filter('receiver', '==', name)),
            firestore.Filter.and(firestore.Filter('giver', '==', name), firestore.Filter('receiver', '==', userId)),
          ),
        ).get();
      console.log(usersQuerySnapshot,'-----usersQuerySnapshot',name)
        // Create a new batch instance
        const batch = firestore().batch();
      
        usersQuerySnapshot.forEach(documentSnapshot => {
          batch.update(documentSnapshot.ref,{
            giver:documentSnapshot.data()?.giver==userId?
            userId:data?.receiver,
            receiver:documentSnapshot.data().receiver == userId?userId:data?.receiver,
            interest_rate:data?.interest_rate,
            phone:data?.phone
          });
        });
      
         batch.commit();
      
      resolve('success')
    } catch (error) {
      reject(new Error(error));
    }
  });
};


export const deleteLoanCollection = async (name,data) => {
  return new Promise(async function (resolve, reject) {
  let userId = Auth().currentUser?.uid;
  try {

    const usersQuerySnapshot = await firestore().collection('loan').where(
      firestore.Filter.or(
        firestore.Filter.and(firestore.Filter('giver', '==', userId), firestore.Filter('receiver', '==', name)),
        firestore.Filter.and(firestore.Filter('giver', '==', name), firestore.Filter('receiver', '==', userId)),
      ),
    ).get();
    console.log(usersQuerySnapshot,'-----usersQuerySnapshot',name)
    // Create a new batch instance
    const batch = firestore().batch();
  
    usersQuerySnapshot.forEach(documentSnapshot => {
      batch.delete(documentSnapshot.ref,{
        giver:documentSnapshot.data()?.giver==userId?
        userId:data?.receiver,
        receiver:documentSnapshot.data().receiver == userId?userId:data?.receiver,
      });
      console.log('-----------',)
    });
  
     batch.commit();
  
  resolve('success')
  } catch (error) {
    throw new Error(error);
  }
});
};