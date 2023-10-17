import auth from '@react-native-firebase/auth';
import { Auth, firestore } from 'src/service/setup';
import { ToastSuccess } from 'src/utils/toast';

export const SignUpUser = async (email, password) => {
  try {
    return await Auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    throw error;
  }
};

export const SignInWithEmailUser = async (email, password) => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      throw error
      // return SignUpUser(email, password);
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
      let id = Auth().currentUser?.uid;
      await firestore().collection('users').doc(id).set({
        name: data?.name,
        phone: data?.phone,
        // profileUrl: url,
        email: data?.email,
        id: id,
      });
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const UpdateUser = async data => {
  try {
    let id = Auth().currentUser?.uid;
    return await firestore().collection('users').doc(id)
      .update({
        name: data?.name,
        phone: data?.phone,
        email: data?.email,
        id: id,
      });
  } catch (error) {
    submitUser(data)
    return error;
  }
};

export const logout = async () => {
  try {
    return await Auth().signOut();
  } catch (error) {
    return error;
  }
};
