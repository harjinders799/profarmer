import firestore, { Filter } from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { ToastError } from '@utils/toast';
import { calculateLoanDetails, sanitizeData } from '@utils/helper';


export const loansDataListener = (
  onUpdate,
  unsubscribeFunctions = [],
  phone,
) => {
  try {
    const userId = auth().currentUser?.uid;

    // Create queries
    const query1 = firestore().collection('loans_data')
      .where('read_access', 'array-contains', phone)
      .get();

    const query2 = firestore().collection('loans_data')
      .where('uid', '==', userId)
      .get();

    // Function to handle the combined results of both queries
    const handleQueryResults = (snapshot1, snapshot2) => {
      const loansData = [];
      const promises = [];

      // Create a Set to avoid duplicate entries
      const docSet = new Map();

      // Add documents from the first query
      snapshot1.forEach(doc => {
        docSet.set(doc.id, doc);
      });

      // Add documents from the second query
      snapshot2.forEach(doc => {
        docSet.set(doc.id, doc);
      });

      // Clear previous unsubscriptions
      unsubscribeFunctions.forEach(unsub => unsub());
      unsubscribeFunctions.length = 0;

      // Create a new unsubscribe function for each document's transactions
      docSet.forEach(doc => {
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

      // Wait for all transaction queries to complete
      Promise.all(promises).then(() => {
        loansData.forEach(loanData => {
          calculateLoanDetails(loansData, loanData);
        });
        if (onUpdate) onUpdate([...loansData]);
      });
    };

    // Run both queries and handle their results
    Promise.all([query1, query2])
      .then(([snapshot1, snapshot2]) => handleQueryResults(snapshot1, snapshot2))
      .catch(error => {
        ToastError(error?.message, 'Loan');
        throw new Error(error);
      });

  } catch (error) {
    ToastError(error?.message, 'Loan');
    throw new Error(error);
  }
};


export const submitLoan = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let userId = auth().currentUser?.uid;
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
      let userId = auth().currentUser?.uid;

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
      let userId = auth().currentUser?.uid;

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
  const userId = auth().currentUser?.uid;
  try {
    const oldLoansRef = db.collection('loan');
    const snapshot = await oldLoansRef
      .where('uid', '==', userId)
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
      batch.set(newLoanRef, newLoanData);

      // Transactions subcollection
      userData.transactions.forEach(transaction => {
        const transactionRef = newLoanRef
          .collection('transactions')
          .doc(transaction.id);
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
