import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { sanitizeData } from '@utils/helper';
import { ToastError } from '@utils/toast';

// Centralized error handler
const handleError = error => {
    console.error(error);
    ToastError(error?.message || 'An error occurred');
};

// Listener for notifications
export const notificationDataListener = onUpdate => {
    const userId = auth().currentUser?.uid;

    const unsubscribe = firestore()
        .collection('notifications_data')
        .where('receiverId', '==', userId)
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
            const documents = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id,
            }));
            onUpdate?.(documents); // Call the callback if provided
        }, handleError);

    return unsubscribe;
};

// Listener for notification count
export const notificationCountListener = onUpdate => {
    const userId = auth().currentUser?.uid;

    const unsubscribe = firestore()
        .collection('notifications_data')
        .where('receiverId', '==', userId)
        .where('isRead', '==', false)
        .onSnapshot(querySnapshot => {
            const count = querySnapshot.size;
            onUpdate?.(count); // Call the callback if provided
        }, handleError);

    return unsubscribe;
};

// Add a single notification
export const addNotification = async data => {
    try {
        const userId = auth().currentUser?.uid;
        await firestore()
            .collection('notifications_data')
            .add(
                sanitizeData({
                    ...data,
                    createdAt: Date.now(),
                    status: 'pending',
                    isRead: false,
                    senderId: userId,
                }),
            );
        return 'success';
    } catch (error) {
        handleError(error);
    }
};

// Add multiple notifications
export const addMultipleNotification = async (data, picker) => {
    try {
        const userId = auth().currentUser?.uid;
        if (Array.isArray(picker?.read_access)) {
            const promises = picker.read_access.map(receiver =>
                firestore()
                    .collection('notifications_data')
                    .add(
                        sanitizeData({
                            ...data,
                            createdAt: Date.now(),
                            status: 'pending',
                            isRead: false,
                            senderId: userId,
                            receiverId: receiver,
                        }),
                    ),
            );
            await Promise.all(promises); // Wait for all notifications to be added
        }
        if (Array.isArray(picker?.full_access)) {
            const promises = picker.full_access.map(receiver =>
                receiver != userId
                    ? firestore()
                        .collection('notifications_data')
                        .add(
                            sanitizeData({
                                ...data,
                                createdAt: Date.now(),
                                status: 'pending',
                                isRead: false,
                                senderId: userId,
                                receiverId: receiver,
                            }),
                        )
                    : null,
            );
            await Promise.all(promises); // Wait for all notifications to be added
        }
        return 'success';
    } catch (error) {
        handleError(error);
    }
};

// Mark a notification as read
export const readNotification = async id => {
    try {
        await firestore()
            .collection('notifications_data')
            .doc(id)
            .set({ isRead: true }, { merge: true });
        return 'success';
    } catch (error) {
        handleError(error);
    }
};
