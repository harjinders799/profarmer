import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { sanitizeData } from '@utils/helper';
import notifee, {
  AndroidImportance,
  AndroidNotificationSetting,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native';
import { currentStamp, dateTimeFormat } from '@utils/dateformat';
import { isIOS } from '@utils/constants';

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
        ToastError(error?.message);
        throw new Error(error);
      },
    );
    return unsubscribe;
  } catch (error) {
    ToastError(error?.message);
    throw new Error(error);
  }
};

export const addNewReminder = data => {
  return new Promise(async function (resolve, reject) {
    try {
      let userId = auth().currentUser?.uid;
      let res = await scheduleReminder(data);
      if (res) {
        firestore()
          .collection('reminders_data')
          .add(
            sanitizeData({
              ...data,
              reminderDate: currentStamp(data?.reminderDate),
              uid: userId,
              status: 'active',
              read_access: [],
              full_access: [userId],
              local_notification_id: res,
              createdAt: firestore.FieldValue.serverTimestamp(),
            }),
          );
        resolve('success');
      } else {
        reject(new Error('Something went wrong!!'));
      }
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updateReminder = data => {
  return new Promise(function (resolve, reject) {
    try {
      firestore()
        .collection('reminders_data')
        .doc(data?.id)
        .update(sanitizeData(data));
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const submitEvent = data => {
  return new Promise(function (resolve, reject) {
    try {
      let ref = firestore().collection('crops_data').doc(data?.cid);
      ref.collection('events').add(sanitizeData(data));
      ref.update(
        sanitizeData({
          total_expense: data?.total_expense,
          total_earning: data?.total_earning,
        }),
      );
      resolve('success');
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });
};

export const updateCrop = data => {
  return new Promise(function (resolve, reject) {
    try {
      firestore()
        .collection('crops_data')
        .doc(data?.id)
        .update(sanitizeData(data));
      resolve('success');
    } catch (error) {
      reject(new Error(error));
    }
  });
};

export const updateEvent = data => {
  return new Promise(function (resolve, reject) {
    try {
      let ref = firestore().collection('crops_data').doc(data?.cid);
      ref.collection('events').doc(data?.id).set(sanitizeData(data));
      ref.update(
        sanitizeData({
          total_expense: data?.total_expense,
          total_earning: data?.total_earning,
        }),
      );
      resolve('success');
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });
};

export const deleteEvent = data => {
  return new Promise(function (resolve, reject) {
    try {
      let ref = firestore().collection('crops_data').doc(data?.cid);
      ref.collection('events').doc(data?.id).delete();
      ref.update(
        sanitizeData({
          total_expense: data?.total_expense,
          total_earning: data?.total_earning,
        }),
      );
      resolve('success');
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  });
};

export const getCropData = () => {
  try {
    return firestore()
      .collection('crops_data')
      .where('uid', '==', auth().currentUser?.uid)
      .onSnapshot(
        querySnapshot => {
          const documents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          return documents;
        },
        error => {
          ToastError(error?.message);
          throw new Error(error);
        },
      );
  } catch (error) {
    reject(new Error(error));
  }
};

export const getRemindersData = (onUpdate, type, typeId) => {
  let query = firestore().collection('reminders_data');
  if (type) query = query.where('reminderType', '==', type);
  if (typeId) query = query.where('reminderTypeId', '==', typeId);
  query.orderBy('reminderDate', 'desc');

  return getDocumentsListener(query, onUpdate);
};

export const getCropEvents = (id, onUpdate) =>
  getDocumentsListener(
    firestore()
      .collection('crops_data')
      .doc(id)
      .collection('events')
      .orderBy('date', 'desc'),
    onUpdate,
  );

export const deleteCropCollection = async id => {
  const batch = firestore().batch(); // Create a new batch

  try {
    // Reference to the subcollection
    const subcollectionRef = firestore()
      .collection('crops_data')
      .doc(id)
      .collection('events'); // Replace with your actual subcollection name

    // Get all documents in the subcollection
    const subcollectionSnapshot = await subcollectionRef.get();

    // Add each document deletion to the batch
    subcollectionSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    // Now add the parent document deletion to the batch
    const parentDocRef = firestore().collection('crops_data').doc(id);
    batch.delete(parentDocRef);

    // Commit the batch
    await batch.commit();

    return 'success';
  } catch (error) {
    throw new Error(error);
  }
};

export const scheduleReminder = async data => {
  // Create the notification channel (only for Android)
  // const channelId = await createNotificationChannel();
  const channelId = await notifee.createChannel({
    id: 'reminder',
    name: 'Reminder Channel',
    importance: AndroidImportance.HIGH,
    sound: 'ProFarmer',
  });

  // Define the reminder content
  const notification = {
    title: data?.title,
    body: data?.description,

    android: {
      channelId,
      lightUpScreen: true,
      colorized: true,
      vibrationPattern: [200, 1000, 3000],
      sound: 'ProFarmer',
      actions: [
        {
          title: '<p style="color: #128557;"><b>Completed</b></p>',
          pressAction: {
            id: 'complete_reminder', // Unique action ID for completing the reminder
          },
          // title: '<p style="background-color: #f35510; color: #ffffff;"><b>Dismiss</b></p>',
          // pressAction: {
          //   id: 'dismiss_reminder', // Unique action ID for completing the reminder
          // },
        },
      ],
    },
    ios: {
      sound: 'default',
    },
  };

  try {
    // Set the notification to trigger
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: currentStamp(data?.reminderDate), // The timestamp for the first reminder
      repeatFrequency: RepeatFrequency[data?.repeat], // Set to repeat daily
      alarmManager: {
        allowWhileIdle: true,
      },
    };

    // Log for debugging
    console.log('Scheduled trigger:', trigger);
    const settings = await notifee.getNotificationSettings();
    if (settings.android.alarm == AndroidNotificationSetting.ENABLED || isIOS) {
      // Create and schedule the notification
      const result = await notifee.createTriggerNotification(
        notification,
        trigger,
      );
      console.log('Notification scheduled:', result);
      return result;
    } else {
      // Show some user information to educate them on what exact alarm permission is,
      // and why it is necessary for your app functionality, then send them to system preferences:
      return await notifee.openAlarmPermissionSettings();
    }
  } catch (error) {
    console.log('Error scheduling notification:', error);
    throw error;
  }
};
