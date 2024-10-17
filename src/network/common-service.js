import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { sanitizeData } from '@utils/helper';
import { ToastError, ToastSuccess } from '@utils/toast';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { Collections } from '@utils/constants';
import { isIOS } from '@utils/constants';
import Aes from 'react-native-aes-crypto';

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

export const contributorsDataListener = onUpdate => {
    try {
        // Listen for real-time updates
        const unsubscribe = firestore()
            .collection('contributors')
            .orderBy('id', 'asc')
            .onSnapshot(
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

export const uploadToFirestore = async () => {
    try {
        const filePath =
            'file:///storage/emulated/0/Download/firestore-backup-1728979351154.json'; // Adjust this path as needed

        // Step 1: Read the JSON file
        const fileContent = await RNFS.readFile(filePath, 'utf8');

        // Step 2: Parse the JSON content
        const data = JSON.parse(fileContent);

        // Step 3: Upload data to Firestore
        const batch = firestore().batch(); // Create a batch instance

        for (const collectionName in data) {
            if (collectionName != 'contributors') {
                const collectionData = data[collectionName];

                if (collectionData.documents) {
                    const batch = firestore().batch(); // Create a new batch for each collection

                    for (const doc of collectionData.documents) {
                        const docRef = firestore().collection(collectionName).doc(doc.id);
                        let main = { ...doc };
                        // Delete subCollections from the main document
                        const { subCollections, ...mainDocData } = main;
                        // Set the main document data in the batch
                        batch.set(docRef, sanitizeData(mainDocData));

                        // Handle subcollections
                        if (doc.subCollections) {
                            for (const subCollectionName in doc.subCollections) {
                                const subDocs = doc.subCollections[subCollectionName];

                                for (const subDoc of subDocs) {
                                    const subDocRef = docRef
                                        .collection(subCollectionName)
                                        .doc(subDoc.id);
                                    batch.set(subDocRef, sanitizeData(subDoc));
                                }
                            }
                        }
                    }

                    await batch.commit(); // Commit the batch after processing the collection
                    ToastSuccess(
                        `Successfully uploaded data for collection: ${collectionName}`,
                    );
                } else {
                    ToastError(`No documents found for collection: ${collectionName}`);
                }
            }
        }

        ToastSuccess('Data upload completed successfully!');
    } catch (error) {
        ToastError(error.message, 'Error uploading data');
    }
};

// export const backupData = async () => {
//     try {
//         const backup = {};
//         ToastSuccess('Backup started take some time to complete it');

//         const collections = Object.values(Collections);

//         for (const collection of collections) {
//             const snapshot = await firestore().collection(collection?.name).get();
//             // backup['collection'][collection] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//             backup['collection'][collection] = await Promise.all(
//                 snapshot.docs.map(async doc => {
//                     collection.subCollections.map(sc => {

//                         if (Object.keys(doc.data()).includes(sc)) {
//                             firestore()
//                                 .collection(collection?.name)
//                                 .doc(doc.id)
//                                 .collection(sc)
//                                 .get()
//                         }
//                     })
//                 }),
//             );
//         }

//         // Save backup to file
//         // Convert backup to JSON string
//         const backupJson = JSON.stringify(backup, null, 2);

//         // Define file path
//         const filePath = `${isIOS ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath
//             }/firestore-backup${Date.now()}.json`;
//         console.log(filePath);
//         // Write backup to file
//         await RNFS.writeFile(filePath, backupJson, 'utf8')
//             .then(success => {
//                 ToastSuccess(filePath, 'Data backup completed!!');
//             })
//             .catch(err => {
//                 console.log(err.message);
//                 ToastError(err.message);
//             });
//     } catch (error) {
//         ToastError(error?.message, 'Error backing up data');
//     }
// };

export const backupData = async () => {
    try {
        const backup = {};
        ToastSuccess('Backup started, this may take some time to complete.');

        const collections = Object.values(Collections);

        for (const collection of collections) {
            const snapshot = await firestore().collection(collection.name).get();
            backup[collection.name] = {
                documents: snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    subCollections: {},
                })),
            };

            // Backup subcollections
            for (const doc of snapshot.docs) {
                for (const subCollection of collection.subCollections) {
                    const subSnapshot = await firestore()
                        .collection(collection.name)
                        .doc(doc.id)
                        .collection(subCollection)
                        .get();

                    backup[collection.name].documents.find(
                        d => d.id === doc.id,
                    ).subCollections[subCollection] = subSnapshot.docs.map(subDoc => ({
                        id: subDoc.id,
                        ...subDoc.data(),
                    }));
                }
            }
        }

        // Save backup to file
        const backupJson = JSON.stringify(backup, null, 2);

        // Define file path
        const filePath = `${isIOS ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath
            }/firestore-backup-${Date.now()}.json`;
        console.log(filePath);

        // Write backup to file
        await RNFS.writeFile(filePath, backupJson, 'utf8')
            .then(() => {
                ToastSuccess(filePath, 'Data backup completed successfully!');
            })
            .catch(err => {
                console.error(err.message);
                ToastError(err.message);
            });
    } catch (error) {
        ToastError(error?.message, 'Error backing up data');
    }
};

const generateKey = (password, salt, cost, length) =>
    Aes.pbkdf2(password, salt, cost, length, 'sha256');

const encryptData = (text, key) => {
    return Aes.randomKey(16).then(iv => {
        return Aes.encrypt(text, key, iv, 'aes-256-cbc').then(cipher => ({
            cipher,
            iv,
        }));
    });
};

const decryptData = (encryptedData, key) =>
    Aes.decrypt(encryptedData.cipher, key, encryptedData.iv, 'aes-256-cbc');

export const backupUserData = async () => {
    try {
        let userId = auth().currentUser?.uid;
        let userName = auth().currentUser?.displayName ?? 'User';

        const backup = {};
        ToastSuccess('Backup started, this may take some time to complete.');

        const collections = Object.values(Collections);

        for (const collection of collections) {
            const snapshot = await firestore().collection(collection.name).where('uid', '==', userId).get();
            backup[collection.name] = {
                documents: snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    subCollections: {},
                })),
            };

            // Backup subcollections
            for (const doc of snapshot.docs) {
                for (const subCollection of collection.subCollections) {
                    const subSnapshot = await firestore()
                        .collection(collection.name)
                        .doc(doc.id)
                        .collection(subCollection)
                        .get();

                    backup[collection.name].documents.find(
                        d => d.id === doc.id,
                    ).subCollections[subCollection] = subSnapshot.docs.map(subDoc => ({
                        id: subDoc.id,
                        ...subDoc.data(),
                    }));
                }
            }
        }
        // Save backup to file
        // Convert backup to JSON string
        const backupJson = JSON.stringify(backup, null, 2);
        const key = await generateKey(userId, 'p-r-o--F-a-r-m-e-r', 5000, 256);

        const { cipher, iv } = await encryptData(backupJson, key);

        const finalData = {
            name: userName,
            phone: auth().currentUser?.phoneNumber,
            email: auth().currentUser?.email,
            data: cipher,
            helper: iv,
        };
        const finalDataJson = JSON.stringify(finalData, null, 2);

        // Define file path
        const filePath = `${isIOS ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath
            }/${userName}-backup${Date.now()}.json`;

        // Write backup to file
        await RNFS.writeFile(filePath, finalDataJson, 'utf8')
            .then(success => {
                ToastSuccess(filePath, 'Data backup completed!!', 3000);
            })
            .catch(err => {
                console.log(err.message);
                ToastError(err.message);
            });
        // // Save backup to file
        // const backupJson = JSON.stringify(backup, null, 2);

        // // Define file path
        // const filePath = `${isIOS ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath
        //     }/firestore-backup-${Date.now()}.json`;
        // console.log(filePath);

        // // Write backup to file
        // await RNFS.writeFile(filePath, backupJson, 'utf8')
        //     .then(() => {
        //         ToastSuccess(filePath, 'Data backup completed successfully!');
        //     })
        //     .catch(err => {
        //         console.error(err.message);
        //         ToastError(err.message);
        //     });
    } catch (error) {
        ToastError(error?.message, 'Error backing up data');
    }
    // try {
    //     let userId = auth().currentUser?.uid;
    //     let userName = auth().currentUser?.displayName ?? 'User';
    //     const backup = {};
    //     ToastSuccess('Backup started take some time to complete it');

    //     const cropSnapshot = await firestore()
    //         .collection('crop')
    //         .where('uid', '==', userId)
    //         .get();
    //     backup.crop = cropSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    //     const pickerSnapshot = await firestore()
    //         .collection('picker')
    //         .where('uid', '==', userId)
    //         .get();
    //     backup.picker = pickerSnapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));

    //     const picker_expenseSnapshot = await firestore()
    //         .collection('picker_expense')
    //         .where('uid', '==', userId)
    //         .get();
    //     backup.picker_expense = picker_expenseSnapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));

    //     const pickers_expenseSnapshot = await firestore()
    //         .collection('pickers_expense')
    //         .where('uid', '==', userId)
    //         .get();
    //     backup.pickers_expense = pickers_expenseSnapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));

    //     const loanSnapshot = await firestore()
    //         .collection('loan')
    //         .where('uid', '==', userId)
    //         .get();
    //     backup.loan = loanSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    //     const doc = await firestore().collection('users').doc(userId).get();
    //     backup.my = { id: doc.id, ...doc.data() };

    //     // Backup labour collection
    //     const labourSnapshot = await firestore()
    //         .collection('labour')
    //         .where('uid', '==', userId)
    //         .get();
    //     backup.labour = labourSnapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));

    //     const laboursSnapshot = await firestore()
    //         .collection('labours')
    //         .where('uid', '==', userId)
    //         .get();
    //     backup.labours = laboursSnapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));

    //     // Backup labour_expense collection
    //     const expenseSnapshot = await firestore()
    //         .collection('labour_expense')
    //         .where('uid', '==', userId)
    //         .get();
    //     backup.labour_expense = expenseSnapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));

    //     // Backup labour_leave collection
    //     const leaveSnapshot = await firestore().collection('labour_leave').get();
    //     backup.labour_leave = leaveSnapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));

    //     // Backup pickers_data collection
    //     const pickers_dataSnapshot = await firestore()
    //         .collection('pickers_data')
    //         .where('uid', '==', userId)
    //         .get();
    //     backup.pickers_data = pickers_dataSnapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));

    //     // Backup pickers_groups collection
    //     const pickers_groupsSnapshot = await firestore()
    //         .collection('picker_groups')
    //         .where('uid', '==', userId)
    //         .get();
    //     backup.picker_groups = pickers_groupsSnapshot.docs.map(doc => ({
    //         id: doc.id,
    //         ...doc.data(),
    //     }));

    //     // Backup picker_cotton_weight collection
    //     const picker_cotton_weightSnapshot = await firestore()
    //         .collection('picker_cotton_weight')
    //         .where('uid', '==', userId)
    //         .get();
    //     backup.picker_cotton_weight = picker_cotton_weightSnapshot.docs.map(
    //         doc => ({ id: doc.id, ...doc.data() }),
    //     );

    //     // Backup labours_data collection
    //     const labours_dataSnapshot = await firestore()
    //         .collection('labours_data')
    //         .where('uid', '==', userId)
    //         .get();

    //     backup.labours_data = await Promise.all(
    //         labours_dataSnapshot.docs.map(async doc => {
    //             const [leaveSnapshot, expenseSnapshot, workSnapshot] =
    //                 await Promise.all([
    //                     firestore()
    //                         .collection('labours_data')
    //                         .doc(doc.id)
    //                         .collection('labour_leave')
    //                         .get(),
    //                     firestore()
    //                         .collection('labours_data')
    //                         .doc(doc.id)
    //                         .collection('labour_expense')
    //                         .get(),
    //                     firestore()
    //                         .collection('labours_data')
    //                         .doc(doc.id)
    //                         .collection('labour_work')
    //                         .get(),
    //                 ]);

    //             const leaveData = leaveSnapshot.docs.map(leaveDoc => ({
    //                 id: leaveDoc.id,
    //                 ...leaveDoc.data(),
    //             }));

    //             const expenseData = expenseSnapshot.docs.map(expenseDoc => ({
    //                 id: expenseDoc.id,
    //                 ...expenseDoc.data(),
    //             }));

    //             const workData = workSnapshot.docs.map(workDoc => ({
    //                 id: workDoc.id,
    //                 ...workDoc.data(),
    //             }));

    //             return {
    //                 id: doc.id,
    //                 ...doc.data(),
    //                 labour_leave: leaveData,
    //                 labour_expense: expenseData,
    //                 labour_work: workData,
    //             };
    //         }),
    //     );

    //     // Backup aadhat_data collection
    //     const aadhat_dataSnapshot = await firestore()
    //         .collection('aadhat_data')
    //         .where('uid', '==', userId)
    //         .get();

    //     backup.aadhat_data = await Promise.all(
    //         aadhat_dataSnapshot.docs.map(async doc => {
    //             const [transactionsSnapshot] = await Promise.all([
    //                 firestore()
    //                     .collection('aadhat_data')
    //                     .doc(doc.id)
    //                     .collection('transactions')
    //                     .get(),
    //             ]);

    //             const transData = transactionsSnapshot.docs.map(transDoc => ({
    //                 id: transDoc.id,
    //                 ...transDoc.data(),
    //             }));

    //             return {
    //                 id: doc.id,
    //                 ...doc.data(),
    //                 transactions: transData,
    //             };
    //         }),
    //     );

    //     // Backup crops_data collection
    //     const crops_dataSnapshot = await firestore()
    //         .collection('crops_data')
    //         .where('uid', '==', userId)
    //         .get();

    //     backup.crop_tracker = await Promise.all(
    //         crops_dataSnapshot.docs.map(async doc => {
    //             const [eventsSnapshot] = await Promise.all([
    //                 firestore()
    //                     .collection('crops_data')
    //                     .doc(doc.id)
    //                     .collection('events')
    //                     .get(),
    //             ]);

    //             const transData = eventsSnapshot.docs.map(transDoc => ({
    //                 id: transDoc.id,
    //                 ...transDoc.data(),
    //             }));

    //             return {
    //                 id: doc.id,
    //                 ...doc.data(),
    //                 events: transData,
    //             };
    //         }),
    //     );

    //     // Save backup to file
    //     // Convert backup to JSON string
    //     const backupJson = JSON.stringify(backup, null, 2);

    //     const key = await generateKey(userId, 'proFarmer', 5000, 256);

    //     const { cipher, iv } = await encryptData(backupJson, key);

    //     const finalData = {
    //         name: userName,
    //         phone: auth().currentUser?.phoneNumber,
    //         email: auth().currentUser?.email,
    //         data: cipher,
    //         helper: iv,
    //     };

    //     const finalDataJson = JSON.stringify(finalData, null, 2);

    //     // Define file path
    //     const filePath = `${isIOS ? RNFS.DocumentDirectoryPath : RNFS.DownloadDirectoryPath
    //         }/${userName}-backup${Date.now()}.json`;

    //     // Write backup to file
    //     await RNFS.writeFile(filePath, finalDataJson, 'utf8')
    //         .then(success => {
    //             ToastSuccess(filePath, 'Data backup completed!!', 3000);
    //         })
    //         .catch(err => {
    //             console.log(err.message);
    //             ToastError(err.message);
    //         });
    // } catch (error) {
    //     console.log(error.message);
    //     ToastError(error?.message, 'Error backing up data');
    // }
};

const migrateLabourData = async () => {
    try {
        const labourSnapshot = await firestore().collection('labour').get();
        const batch = firestore().batch();
        console.log('----migrate-----labour data');
        // Migrate labour collection data
        for (const doc of labourSnapshot.docs) {
            const { labour, is_regulare, uid, count, detail, date, rate } = doc.data();

            const newLabourRef = firestore().collection('labours_data').doc(doc.id);

            // Set labour document with new structure
            batch.set(
                newLabourRef,
                sanitizeData({
                    name: labour,
                    is_regular: is_regulare,
                    start_date: date,
                    uid,
                }),
            );

            // Create labour_work subcollection document
            const newWorkRef = newLabourRef.collection('labour_work').doc();
            batch.set(
                newWorkRef,
                sanitizeData({
                    count: count,
                    detail: detail,
                    date: date,
                    rate: rate,
                }),
            );

            // Migrate labour_expense subcollection data
            const expenseSnapshot = await firestore()
                .collection('labour')
                .doc(uid)
                .collection('labour_expense')
                .get();
            expenseSnapshot.forEach(expenseDoc => {
                const newExpenseRef = newLabourRef.collection('labour_expense').doc();
                batch.set(newExpenseRef, sanitizeData(expenseDoc.data()));
            });

            // Migrate labour_leave subcollection data
            const leaveSnapshot = await firestore()
                .collection('labour')
                .doc(uid)
                .collection('labour_leave')
                .get();
            leaveSnapshot.forEach(leaveDoc => {
                const newLeaveRef = newLabourRef.collection('labour_leave').doc();
                batch.set(newLeaveRef, sanitizeData(leaveDoc.data()));
            });
        }

        // Commit the batch write to Firestore
        await batch.commit();
        console.log('Data migration complete');

        // Delete old labour collection
        await deleteCollection('labour');
        // await deleteCollection('labour_expense');
        // await deleteCollection('labour_leave');
        console.log('Old labour collection deleted');
    } catch (error) {
        console.error('Error migrating data:', error);
    }
};

const deleteCollection = async collectionName => {
    const collectionRef = firestore().collection(collectionName);
    const querySnapshot = await collectionRef.get();

    const batch = firestore().batch();

    querySnapshot.forEach(doc => {
        batch.delete(doc.id);
    });

    await batch.commit();
    console.log(`Collection ${collectionName} deleted`);
};

// migrateLabourData();

const cleanUpDuplicates = async () => {
    try {
        let userId = auth().currentUser?.uid;
        const labourDataSnapshot = await firestore()
            .collection('labours_data')
            .where('uid', '==', userId)
            .get();
        const batch = firestore().batch();

        for (const doc of labourDataSnapshot.docs) {
            const newLabourRef = firestore().collection('labours_data').doc(doc.id);

            // // Step 1: Remove duplicates in labour_work subcollection
            const labourWorkSnapshot = await newLabourRef
                .collection('labour_work')
                .get();
            const uniqueLabourWork = new Set(); // Set to track unique records (by date, amount, or full object)

            labourWorkSnapshot.forEach(workDoc => {
                const workData = workDoc.data();
                const { date, amount } = workData;

                // Convert the full object to a string to compare the entire document
                const uniqueIdentifier = JSON.stringify({ date, amount, ...workData });

                if (uniqueLabourWork.has(uniqueIdentifier)) {
                    // If this combination of date, amount, or full object is already in the set, delete the duplicate
                    batch.delete(workDoc.ref);
                    console.log(
                        `Deleted duplicate labour_work record for labour: ${doc.id}`,
                    );
                } else {
                    // Add the unique combination of date, amount, or full object to the set
                    uniqueLabourWork.add(uniqueIdentifier);
                }
            });

            // Step 2: Remove duplicates in labour_expense subcollection
            const labourExpenseSnapshot = await newLabourRef
                .collection('labour_expense')
                .get();
            const uniqueLabourExpenseByDate = new Map();

            labourExpenseSnapshot.forEach(expenseDoc => {
                const expenseData = expenseDoc.data();
                const { date, amount } = expenseData;
                // console.log({ expenseData })
                if (uniqueLabourExpenseByDate.has(date + amount)) {
                    batch.delete(expenseDoc.ref);
                    console.log(
                        `Deleted duplicate labour_expense record with date: ${date} for labour: ${doc.id}`,
                    );
                } else {
                    uniqueLabourExpenseByDate.set(date + amount, expenseDoc.id);
                }
            });

            // Step 3: Remove duplicates in labour_leave subcollection
            const labourLeaveSnapshot = await newLabourRef
                .collection('labour_leave')
                .get();
            const uniqueLabourLeaveByDate = new Map();

            labourLeaveSnapshot.forEach(leaveDoc => {
                const leaveData = leaveDoc.data();
                const { date, count } = leaveData;

                if (uniqueLabourLeaveByDate.has(date + count)) {
                    batch.delete(leaveDoc.ref);
                    console.log(
                        `Deleted duplicate labour_leave record with date: ${JSON.stringify(
                            leaveData,
                        )} for labour: ${doc.id}`,
                    );
                } else {
                    uniqueLabourLeaveByDate.set(date + count, leaveDoc.id);
                }
            });
        }

        // // Commit the batch delete operation to Firestore
        await batch.commit();
        console.log('Duplicate records removed successfully.');
    } catch (error) {
        console.error('Error cleaning up duplicates:', error);
    }
};
