import { data } from 'react-native-cheerio/lib/api/attributes';
import { Auth, firestore } from 'src/service/setup';


export const submitHarvest = async data => {
    return new Promise(async function (resolve, reject) {
      try {
        let id = Auth().currentUser?.uid;
        await firestore()
          .collection('harvest')
          .add({...data, uid: id});
        resolve('success');
      } catch (error) {
        reject(new Error(error));
      }
    });
  };

  export const getHarvestData = () => {
    return new Promise(async function (resolve, reject) {
      let userId = Auth().currentUser?.uid;
      
       await firestore()
        .collection('harvest')
        .where('uid', '==', userId)
        // .where('crop', '==', crop)
        .get()
        .then(querySnapshot => {
          let arr = [];
          querySnapshot.forEach(documentSnapshot => {
            arr.push({...documentSnapshot.data(), id: documentSnapshot.id});
          });
          resolve(arr);
        })
        .catch(error => {
          console.log(error,)
          reject(new Error(error));
        });
    });
  };
  export const updateHarvest = async data => {
    return new Promise(async function (resolve, reject) {
      try {
        await firestore().collection('harvest').doc(data?.id).update(data);
        resolve('success');
      } catch (error) {
        reject(new Error(error));
      }
    });
  };
  export const deleteHarvest = async id => {
    return new Promise(async function (resolve, reject) {
      try {
        await firestore().collection('harvest').doc(id).delete();
        resolve('success');
      } catch (error) {
        reject(new Error(error));
      }
    });
  };

export const deleteHarvestCollection = async () => {
    
    try {
      const userId = Auth().currentUser?.uid;
      
      
      const deleteHarvest = firestore()
        .collection('harvest')
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
      await Promise.all([deleteHarvest]);
    } catch (error) {
      throw new Error(error);
    }
  };