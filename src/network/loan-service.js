import firestore from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { ToastError } from '@utils/toast';
import { calculateLoanDetails, sanitizeData } from '@utils/helper';

let userId = auth().currentUser?.uid;

export const getLoansData = onUpdate =>
  getDocumentsListener(
    firestore().collection('loans_data').where('uid', '==', userId),
    onUpdate,
  );

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
        ToastError(error?.message, 'Loan');
        throw new Error(error);
      },
    );
    return unsubscribe;
  } catch (error) {
    ToastError(error?.message, 'Loan');
    throw new Error(error);
  }
};

export const loansDataListener = (onUpdate, unsubscribeFunctions = []) => {
  try {
    const unsubscribeMain = firestore()
      .collection('loans_data')
      .where('uid', '==', userId)
      .orderBy('name', 'asc')
      .onSnapshot(querySnapshot => {
        const loansData = [];
        const promises = [];

        unsubscribeFunctions.forEach(unsub => unsub());
        unsubscribeFunctions.length = 0;

        querySnapshot.forEach(doc => {
          const loanData = doc.data();
          loanData.id = doc.id;
          loanData.transactions = [];

          const unsubscribe = doc.ref
            .collection('transactions')
            .orderBy('date', 'desc')
            .onSnapshot(subSnapshot => {
              const transactions = [];
              subSnapshot.forEach(transactionDoc => {
                transactions.push({
                  ...transactionDoc.data(),
                  lid: doc.id,
                  id: transactionDoc.id,
                });
              });
              loanData.transactions = transactions;

              calculateLoanDetails(loansData, loanData);
            });

          unsubscribeFunctions.push(unsubscribe);
          promises.push(doc.ref.collection('transactions').get());
          loansData.push(loanData);
        });
        Promise.all(promises).then(() => {
          loansData.forEach(loanData => {
            calculateLoanDetails(loansData, loanData);
          });
          console.log({ loansData });
          if (onUpdate) onUpdate([...loansData]);
        });
      });
    return unsubscribeMain;
  } catch (error) {
    ToastError(error?.message, 'Loan');
    throw new Error(error);
  }
};

export const submitLoan = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore()
        .collection('loans_data')
        .add({
          ...data,
          read_access: [data?.phone],
          full_access: [userId],
          uid: userId,
        });
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const addLoanAmount = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore()
        .collection('loans_data')
        .doc(data?.lid)
        .collection('transactions')
        .add(sanitizeData(data));
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getLoanData = () => {
  return new Promise(function (resolve, reject) {
    try {
      firestore()
        .collection('loan')
        .where('uid', '==', userId)
        .onSnapshot(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(documentSnapshot => {
            arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
          });
          resolve(arr);
        });
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const deleteLoanTransaction = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore()
        .collection('loans_data')
        .doc(data?.lid)
        .collection('transactions')
        .doc(data?.id)
        .delete();
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
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updateLoanTransaction = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore()
        .collection('loans_data')
        .doc(data?.lid)
        .collection('transactions')
        .doc(data?.id)
        .update(sanitizeData(data));
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updateLoanName = async (name, data) => {
  return new Promise(async function (resolve, reject) {
    try {
      const usersQuerySnapshot = await firestore()
        .collection('loan')
        .where(
          firestore.Filter.or(
            firestore.Filter.and(
              firestore.Filter('giver', '==', userId),
              firestore.Filter('receiver', '==', name),
            ),
            firestore.Filter.and(
              firestore.Filter('giver', '==', name),
              firestore.Filter('receiver', '==', userId),
            ),
          ),
        )
        .get();
      console.log(usersQuerySnapshot, '-----usersQuerySnapshot', name);
      // Create a new batch instance
      const batch = firestore().batch();

      usersQuerySnapshot.forEach(documentSnapshot => {
        batch.update(documentSnapshot.ref, {
          giver:
            documentSnapshot.data()?.giver == userId ? userId : data?.receiver,
          receiver:
            documentSnapshot.data().receiver == userId
              ? userId
              : data?.receiver,
          interest_rate: data?.interest_rate,
          phone: data?.phone,
        });
      });

      batch.commit();

      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deleteLoanCollection = async id => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('loans_data').doc(id).delete();
      resolve('success');
    } catch (error) {
      throw new Error(error);
    }
  });
};

const db = firestore();

async function migrateLoanData() {
  try {
    const oldLoansRef = db.collection('loan');
    const snapshot = await oldLoansRef
      // .where('uid', '==', userId)
      .get();

    if (snapshot.empty) {
      console.log('No loan documents found.');
      return;
    }
    const userMap = new Map();
    // Organize data by UID and third-party names
    snapshot.forEach(doc => {
      const oldData = doc.data();
      const uid = oldData.uid;
      const id = doc.id;
      const interest_rate = oldData.interest_rate;
      // console.log(oldData.giver, '---', oldData.receiver, '==', oldData.giver == uid, '---', uid)
      const name = oldData.giver == uid ? oldData.receiver : oldData.giver;
      // console.log(name)

      if (!userMap.has(name) && name != uid) {
        userMap.set(name, {
          name,
          uid,
          id,
          interest_rate,
          phone: oldData?.phone ?? '',
          transactions: [],
        });
      }

      const transactionData = {
        amount: parseFloat(oldData.amount), // Convert to number
        type: oldData.giver === uid ? 'giver' : 'receiver',
        date: oldData.date,
        detail: oldData.detail,
        id: id + 'x',
      };

      if (name != uid && parseFloat(oldData.amount) !== 0)
        userMap.get(name).transactions.push(transactionData);
    });
    const batch = db.batch();

    userMap.forEach(userData => {
      const newLoanRef = db.collection('loans_data').doc(userData.id);

      // Main user document
      const newLoanData = {
        uid: userData.uid,
        id: userData.id,
        name: userData.name,
        phone: userData.phone,
        interest_rate: userData.interest_rate,
        read_access: [],
        full_access: [userData.uid],
        transactions: [], // This field can be omitted if you don't need an array in the main document
      };
      console.log(newLoanData);
      batch.set(newLoanRef, newLoanData);

      // Transactions subcollection
      userData.transactions.forEach(transaction => {
        const transactionRef = newLoanRef
          .collection('transactions')
          .doc(transaction.id);
        console.log(transaction);
        batch.set(transactionRef, transaction);
      });
    });

    await batch.commit();
    console.log('Migration completed successfully.');
  } catch (error) {
    console.log('Migration not completed successfully:', error);
  }
}

// migrateLoanData().catch(error => console.log(error));
// debounce(migrateLoanData, 300)
