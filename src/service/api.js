import AsyncStorage from '@react-native-async-storage/async-storage';
import {Auth, database, firestore, storage} from 'src/service/setup';

export const SignUpUser = async (email, password) => {
  try {
    return await Auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    return error;
  }
};

export const SignInUser = (email, passswod) => {
  return new Promise(function (resolve, reject) {
    Auth()
      .signInWithEmailAndPassword(email, passswod)
      .then(() => {
        resolve('');
      })
      .catch(e => {
        reject(e);
      });
  });
};

export const submitUser = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let id = Auth().currentUser?.uid;
      let url = '';
      if (data?.img?.uri) {
        let ref = storage().ref(data?.img?.fileName);
        await ref.putFile(data?.img?.uri);
        url = await ref.getDownloadURL();
      }
      const update = {
        displayName: data?.name,
        photoURL: url,
      };

      await Auth().currentUser?.updateProfile(update);
      await firestore().collection('users').doc(id).set({
        name: data?.name,
        phone: data?.phone,
        profileUrl: url,
        email: data?.email,
        id: id,
      });
      delete data.passswod;
      AsyncStorage.setItem('user', JSON.stringify(data));
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updateUser = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let id = Auth().currentUser?.uid;
      let url = '';
      if (data?.img?.uri) {
        let ref = storage().ref(data?.img?.fileName);
        await ref.putFile(data?.img?.uri);
        url = await ref.getDownloadURL();
      }
      const update = {
        displayName: data?.name,
        photoURL: url,
      };

      await Auth().currentUser?.updateProfile(update);
      await database()
        .ref('users/' + id)
        .update({
          Name: data?.name,
          PhoneNo: data?.phone,
          ProfileUrl: url,
          Email: data?.email,
          Id: id,
        });
      AsyncStorage.setItem('user', JSON.stringify(data));
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const Affiliate = (Id, Name, Phone, Email, Pin, Time) => {
  return new Promise(function (resolve, reject) {
    let key;
    if (Id != null) {
      key = Id;
    } else {
      key = database().ref().push().key;
    }
    let dataToSave = {
      Id: key,
      Name: Name,
      PhoneNo: Phone,
      Email: Email,
      Pin: Pin,
      Time: Time,
    };
    database()
      .ref('Affiliate/' + key)
      .update(dataToSave)
      .then(snapshot => {
        resolve(snapshot);
      })
      .catch(err => {
        reject(err);
      });
  });
};

export const Franchise = (Id, Name, Phone, Email, Pin, Time) => {
  return new Promise(function (resolve, reject) {
    let key;
    if (Id != null) {
      key = Id;
    } else {
      key = database().ref().push().key;
    }
    let dataToSave = {
      Id: key,
      Name: Name,
      PhoneNo: Phone,
      Email: Email,
      Pin: Pin,
      Time: Time,
    };
    database()
      .ref('Franchise/' + key)
      .update(dataToSave)
      .then(snapshot => {
        resolve(snapshot);
      })
      .catch(err => {
        reject(err);
      });
  });
};
