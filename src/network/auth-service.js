import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { ToastSuccess } from 'src/utils/toast';
import messaging from '@react-native-firebase/messaging';
import { formatPhoneNumber, sanitizeData } from '@utils/helper';
import { strings } from '@translations/locale';

export const SignUpUser = async (email, password) => {
  try {
    return await auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    throw error;
  }
};

export const SignInWithEmailUser = async (email, password) => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw error;
    } else {
      throw error;
    }
  }
};

export const SignInUser = phone => {
  return new Promise(function (resolve, reject) {
    return auth()
      .verifyPhoneNumber('+91' + phone)
      .on('state_changed', phoneAuthSnapshot => {
        // console.log(phoneAuthSnapshot, '-------phoneAuthSnapshot-----')
        switch (phoneAuthSnapshot.state) {
          case auth.PhoneAuthState.CODE_SENT: // or 'sent'
            ToastSuccess('OTP Sent', 'Login');
            resolve(phoneAuthSnapshot);
            break;
          case auth.PhoneAuthState.ERROR: // or 'error'
            // ToastError(JSON.stringify(phoneAuthSnapshot.error), "Login")
            reject(phoneAuthSnapshot.error);
            break;
          case auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
            resolve(phoneAuthSnapshot);
            break;
          case auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
            ToastSuccess('Logged In', 'Login');
            // console.log(phoneAuthSnapshot, '??');
            // replace('Main');
            resolve(phoneAuthSnapshot);
            break;
        }
      });
  });
};

export const submitUser = async data => {
  return new Promise(async function (resolve, reject) {
    try {
      let id = auth().currentUser?.uid;
      await firestore()
        .collection('users')
        .doc(id)
        .set(
          sanitizeData({
            name: data?.name,
            phone: formatPhoneNumber(data?.phone),
            // profileUrl: url,
            email: data?.email,
            id: id,
          }),
        );
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const UpdateUser = async data => {
  try {
    let id = auth().currentUser?.uid;
    await auth().currentUser.updateProfile({ displayName: data?.name });
    return await firestore()
      .collection('users')
      .doc(id)
      .update(
        sanitizeData({
          name: data?.name,
          email: data?.email,
          phone: formatPhoneNumber(data?.phone),
          id: id,
        }),
      );
  } catch (error) {
    submitUser(data);
    return error;
  }
};

export const logout = async () => {
  try {
    return await auth().signOut();
  } catch (error) {
    return error;
  }
};

export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();

    if (token) {
      console.log('FCM Token:', token);
      // Save the token to Firestore
      await saveTokenToFirestore(token);
    }
  } catch (error) {
    console.log({ error });
  }
};

export const saveTokenToFirestore = async token => {
  try {
    const userId = auth().currentUser.uid;
    await firestore()
      .collection('users') // Adjust to your Firestore structure
      .doc(userId)
      .set(
        {
          fcmToken: token,
        },
        { merge: true }, // Use merge to avoid overwriting other user data
      );
    console.log('Token saved to Firestore');
  } catch (error) {
    console.error('Error saving token to Firestore:', error);
  }
};

export const getUserByPhone = async phone => {
  return new Promise(async function (resolve, reject) {
    try {
      await firestore()
        .collection('users')
        .where('phone', '==', formatPhoneNumber(phone))
        .get()
        .then(querySnapshot => {
          if (!querySnapshot.empty)
            querySnapshot.forEach(children => {
              if (children.exists) resolve(children.data());
              else resolve('user not found');
            });
          else resolve('user not found');
        })
        .catch(error => {
          reject(new Error(error));
        });
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const getUserById = async id => {
  return new Promise(async function (resolve, reject) {
    try {
      let res = await firestore().collection('users').doc(id).get();
      resolve(res.data());
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updateReadAccessToUID = async phone => {
  const collections = [
    'aadhat_data',
    'crops_data',
    'labours_data',
    'loans_data',
    'pickers_data',
  ];
  const uid = auth().currentUser.uid;
  for (const collection of collections) {
    const snapshot = await firestore()
      .collection(collection)
      .where('read_access', 'array-contains', phone)
      .get();

    const batch = firestore().batch();

    snapshot.forEach(doc => {
      const data = doc.data();
      const newReadAccess = data.read_access.map(item =>
        item === phone ? uid : item,
      ); // Replace phone with uid
      console.log({ newReadAccess });
      batch.update(doc.ref, { read_access: newReadAccess });
    });

    await batch.commit();
  }
};

const getEmailCredential = (email, password) => {
  return auth.EmailAuthProvider.credential(email, password);
};

export const linkEmailWithPhone = async (email, password) => {
  try {
    const user = auth().currentUser;
    const credential = getEmailCredential(email, password);
    console.log({ credential });
    // Link email and password to the current user
    const linkedUser = await user.linkWithCredential(credential);
    return linkedUser;
  } catch (error) {
    console.error('Error linking email with phone auth:', error);
    if (error.code == 'auth/email-already-in-use') {
      throw new Error(strings.emailInUse);
    }
    if (error.code === 'auth/credential-already-in-use') {
      throw new Error(strings.phoneInUse);
    }
    throw error;
  }
};
