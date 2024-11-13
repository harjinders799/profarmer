import { getFCMToken, saveTokenToFirestore } from '@network/auth-service';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import { PermissionsAndroid, Platform } from 'react-native';
import notifee, { EventType, AndroidImportance } from '@notifee/react-native';

// Request permission to send notifications
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission({
        sound: true,
        provisional: true,
        badge: true,
    });

    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    console.log('Notification Permission Status:', enabled, authStatus);

    if (enabled) {
        const userId = auth()?.currentUser?.uid;
        if (userId) await getFCMToken(userId);  // Fetch and handle the FCM token
    }
}


// Handle incoming FCM messages
export async function handleIncomingMessage(remoteMessage) {
    console.log('A new FCM message arrived!', remoteMessage);
    await onDisplayNotification(remoteMessage);
}

// Subscribe to FCM topics
export function subscribeToTopics() {
    messaging()
        .subscribeToTopic('info')
        .then(() => console.log('Subscribed to "info" topic!'));
}

// Handle token refresh event
export async function handleTokenRefresh(token) {
    console.log('Token refreshed:', token);
    await saveTokenToFirestore(token);  // Update the token in Firestore
}

// Setup foreground event listener for notifications
export function setupForegroundEventListener() {
    return notifee.onForegroundEvent(async ({ type, detail }) => {
        console.log('Foreground Event:', { type, detail });

        switch (type) {
            case EventType.DISMISSED:
                console.log('Notification dismissed:', detail.notification);
                break;
            case EventType.DELIVERED:
                console.log('Notification delivered:', detail.notification);
                // onDisplayNotification(detail.notification);
                break;
            case EventType.ACTION_PRESS:
                if (detail.pressAction.id === 'complete_reminder') {
                    console.log('Reminder Completed');

                    // Cancel the notification (stopping the recurring notifications)
                    await notifee.cancelNotification(detail.notification.id);

                    // Optionally, update the reminder's status in the database
                    // Example: updateReminderStatusInDatabase(reminderId, 'completed');

                }
                break;
            case EventType.PRESS:
                console.log('Notification pressed:', detail.notification);
                break;
            default:
                console.log('Unhandled foreground event:', type);
        }
    });
}

// Setup background event listener for notifications
export function setupBackgroundEventListener() {
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
        console.log('Background Event:', { type, detail });

        switch (type) {
            case EventType.ACTION_PRESS:
                if (detail.pressAction.id === 'complete_reminder') {
                    console.log('Reminder Completed');

                    // Cancel the notification (stopping the recurring notifications)
                    await notifee.cancelNotification(detail.notification.id);
                    // Optionally, update the reminder's status in the database
                    // updateReminderStatusInDatabase(reminderId, 'completed');
                }
                break;
            default:
                console.log('Unhandled background event:', type);
        }
    });
}

// Function to display notifications
export async function onDisplayNotification(data) {
    // Request permissions (for Android)
    await requestNotificationPermissions();

    // Create a notification channel if not already created (Android)
    const channelId = await createNotificationChannel();

    console.log('Displaying notification:', { channelId, data });

    // Display the notification
    await notifee.displayNotification({
        title: data?.notification?.title,
        body: data?.notification?.body,
        android: {
            channelId,
            importance: AndroidImportance.HIGH,
            color: '#4CAF99',
            smallIcon: 'ic_notification',  // Optional: Replace with your own icon
            pressAction: {
                id: 'default',
            },
        },
    });
}

// Request necessary notification permissions for Android and iOS
export async function requestNotificationPermissions() {
    if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
    } else {
        // Handle iOS-specific permissions if needed
        await notifee.requestPermission();
    }
}

// Function to create notification channel for Android
export async function createNotificationChannel() {
    return await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
    });
}