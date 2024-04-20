import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const getCurrentUserId = () => auth().currentUser?.uid;

const addDocumentToCollection = async (collectionName, data) => {
  try {
    const userId = getCurrentUserId();
    await firestore()
      .collection(collectionName)
      .add({ ...data, uid: userId });
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

const getDocumentsFromCollection = async (
  collectionName,
  name,
  isRegular = false,
) => {
  try {
    const userId = getCurrentUserId();
    let query = firestore()
      .collection(collectionName)
      .where('uid', '==', userId);
    if (name) {
      query = query.where('labour', '==', name);
      if (isRegular) {
        query = query.where('is_regular', '==', true);
      }
    }
    const querySnapshot = await query.get();
    return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  } catch (error) {
    throw new Error(error);
  }
};

const deleteDocumentById = async (collectionName, id) => {
  try {
    await firestore().collection(collectionName).doc(id).delete();
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

const updateDocument = async (collectionName, data) => {
  try {
    await firestore().collection(collectionName).doc(data?.id).update(data);
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

export const submitLabour = async data =>
  addDocumentToCollection('labour', data);
export const submitLabourExpense = async data =>
  addDocumentToCollection('labour_expense', data);
export const submitLabourLeave = async data =>
  addDocumentToCollection('labour_leave', data);

export const getLabourData = async () => getDocumentsFromCollection('labour');

export const getLabourRegular = async name =>
  getDocumentsFromCollection('labour', name, true);
export const getLabourByName = async name =>
  getDocumentsFromCollection('labour', name);

export const getLabourExpense = async name =>
  getDocumentsFromCollection('labour_expense', name);
export const getLabourLeave = async name =>
  getDocumentsFromCollection('labour_leave', name);

export const getAllLabourExpense = async () =>
  getDocumentsFromCollection('labour_expense');

export const updateLabour = async data => updateDocument('labour', data);

export const updateLabourLeave = async data =>
  updateDocument('labour_leave', data);

export const updateLabourExpense = async data =>
  updateDocument('labour_expense', data);
export const deleteLabourExpense = async id =>
  deleteDocumentById('labour_expense', id);
export const deleteLabour = async id => deleteDocumentById('labour', id);
export const deleteLabourLeave = async id =>
  deleteDocumentById('labour_leave', id);

export const deleteLabourCollection = async name => {
  try {
    const deletePromises = [];
    const userId = getCurrentUserId();

    ['labour', 'labour_expense', 'labour_leave'].forEach(collectionName => {
      const query = firestore()
        .collection(collectionName)
        .where('uid', '==', userId)
        .where('labour', '==', name);
      deletePromises.push(
        query.get().then(querySnapshot => {
          const subDeletePromises = [];
          querySnapshot.forEach(doc =>
            subDeletePromises.push(doc.ref.delete()),
          );
          return Promise.all(subDeletePromises);
        }),
      );
    });

    await Promise.all(deletePromises);
    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};
