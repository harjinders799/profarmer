import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


export const submitTimeline = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let id = auth().currentUser?.uid;
      await firestore()
        .collection('timeline')
        .add({ ...data, uid: id });
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getTimelineData = (crop) => {
  return new Promise(async function (resolve, reject) {
    let userId = auth().currentUser?.uid;
    console.log('Crop Label:', crop);
    await firestore()
      .collection('timeline')
      .where('uid', '==', userId)
      .where('crop', '==', crop)
      // .orderBy('date', 'desc')
      .get()
      .then(querySnapshot => {
        let arr = [];
        querySnapshot.forEach(documentSnapshot => {
          arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
        });
        resolve(arr);
      })
      .catch(error => {
        console.log(error,)
        reject(new Error(error));
      });
  });
};
export const updateTimeline = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('timeline').doc(data?.id).update(data);
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};
export const deleteTimeline = async id => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore().collection('timeline').doc(id).delete();
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const deleteTimelineCollection = async (personName) => {

  try {
    const userId = auth().currentUser?.uid;


    const deleteTimeline = firestore()
      .collection('timeline')
      .where('uid', '==', userId)
      //  .where('receiver', '==', personName)
      //  .where('giver', '==', userId)
      .get()
      .then((querySnapshot) => {
        const deletePromises = [];

        querySnapshot.forEach((documentSnapshot) => {
          deletePromises.push(documentSnapshot.ref.delete());
        });
        return Promise.all(deletePromises);
      });
    await Promise.all([deleteTimeline]);
  } catch (error) {
    throw new Error(error);
  }
};