import { Auth, firestore, storage } from "src/service/setup";

export const submitLabour = async (data) => {
    return new Promise(async function (resolve, reject) {
        try {
            let id = Auth().currentUser?.uid;
            await firestore()
                .collection('labour')
                .add({ ...data, uid: id });
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};
export const submitLabourExpense = async (data) => {
    return new Promise(async function (resolve, reject) {
        try {
            let id = Auth().currentUser?.uid;
            await firestore()
                .collection('labour_expense')
                .add({ ...data, uid: id });
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};

export const submitLabourLeave = async (data) => {
    return new Promise(async function (resolve, reject) {
        try {
            let id = Auth().currentUser?.uid;
            await firestore()
                .collection('labour_leave')
                .add({ ...data, uid: id });
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};
export const getLabourData = () => {
    return new Promise(async function (resolve, reject) {
        let userId = Auth().currentUser?.uid;
        await firestore()
            .collection('labour')
            .where('uid', '==', userId)
            .get()
            .then(querySnapshot => {
                let arr = [];
                querySnapshot.forEach(documentSnapshot => {
                    arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
                });
                resolve(arr)
            })
            .catch(error => {
                reject(new Error(error));
            })
    })
}

export const getLabourRagular = (name) => {
    return new Promise(async function (resolve, reject) {
        let userId = Auth().currentUser?.uid;
        await firestore()
            .collection('labour')
            .where('uid', '==', userId)
            .where('labour', '==', name)
            .where('is_regulare', '==', true)
            .get()
            .then(querySnapshot => {
                let arr = [];
                querySnapshot.forEach(documentSnapshot => {
                    arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
                });
                resolve(arr)
            })
            .catch(error => {
                reject(new Error(error));
            })
    })
}
export const getLabourByName = (name) => {
    return new Promise(async function (resolve, reject) {
        let userId = Auth().currentUser?.uid;
        await firestore()
            .collection('labour')
            .where('uid', '==', userId)
            .where('labour', '==', name)
            .get()
            .then(querySnapshot => {
                let arr = [];
                querySnapshot.forEach(documentSnapshot => {
                    arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
                });
                resolve(arr)
            })
            .catch(error => {
                reject(new Error(error));
            })
    })
}

export const getLabourExpense = async (name) => {
    return new Promise(async function (resolve, reject) {
        try {
            let userId = Auth().currentUser?.uid;
            await firestore()
                .collection('labour_expense')
                .where('uid', '==', userId)
                .where('labour', '==', name)
                .get()
                .then(querySnapshot => {
                    let arr = [];
                    querySnapshot.forEach(documentSnapshot => {
                        arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
                    });
                    resolve(arr)
                })
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};

export const getLabourLeave = async (name) => {
    return new Promise(async function (resolve, reject) {
        try {
            let userId = Auth().currentUser?.uid;
            await firestore()
                .collection('labour_leave')
                .where('uid', '==', userId)
                .where('labour', '==', name)
                .get()
                .then(querySnapshot => {
                    let arr = [];
                    querySnapshot.forEach(documentSnapshot => {
                        arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
                    });
                    resolve(arr)
                })
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};

export const getAllLabourExpense = async (name) => {
    return new Promise(async function (resolve, reject) {
        try {
            let userId = Auth().currentUser?.uid;
            await firestore()
                .collection('labour_expense')
                .where('uid', '==', userId)
                .get()
                .then(querySnapshot => {
                    let arr = [];
                    querySnapshot.forEach(documentSnapshot => {
                        arr.push({ ...documentSnapshot.data(), id: documentSnapshot.id });
                    });
                    resolve(arr)
                })
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};

export const deleteLabourExpense = async (id) => {
    return new Promise(async function (resolve, reject) {
        try {
            await firestore()
                .collection('labour_expense')
                .doc(id)
                .delete()
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};
export const updateLabour = async (data) => {
    return new Promise(async function (resolve, reject) {
        try {
            await firestore()
                .collection('labour')
                .doc(data?.id)
                .update(data);
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};

export const updateLabourLeave = async (data) => {
    return new Promise(async function (resolve, reject) {
        try {
            await firestore()
                .collection('labour_leave')
                .doc(data?.id)
                .update(data);
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};


export const updateLabourExpense = async (data) => {
    return new Promise(async function (resolve, reject) {
        try {
            await firestore()
                .collection('labour_expense')
                .doc(data?.id)
                .update(data);
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};
export const deleteLabour = async (id) => {
    return new Promise(async function (resolve, reject) {
        try {
            await firestore()
                .collection('labour')
                .doc(id)
                .delete()
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};

export const deleteLabourLeave = async (id) => {
    return new Promise(async function (resolve, reject) {
        try {
            await firestore()
                .collection('labour_leave')
                .doc(id)
                .delete()
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};

export const submitPickerExpense = async (data) => {
    return new Promise(async function (resolve, reject) {
        try {
            let id = Auth().currentUser?.uid;
            await firestore()
                .collection('picker_expense')
                .add({ ...data, uid: id });
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};

export const getPickerExpense = async (name) => {
    return new Promise(async function (resolve, reject) {
        try {
            let userId = Auth().currentUser?.uid;
            await firestore()
                .collection('picker_expense')
                .where('uid', '==', userId)
                .where('picker', '==', name)
                .get()
                .then(querySnapshot => {
                    let arr = [];
                    querySnapshot.forEach(documentSnapshot => {
                        arr.push(documentSnapshot.data());
                    });
                    resolve(arr)
                })
            resolve("success")
        } catch (error) {
            reject(new Error(error));
        }
    })
};



export const getCottonByPicker = (search) => {
    return new Promise(async function (resolve, reject) {
        let userId = Auth().currentUser?.uid;
        await firestore()
            .collection('cotton')
            .where('uid', '==', userId)
            .where('picker', '==', search)
            .get()
            .then(querySnapshot => {
                let arr = [];
                querySnapshot.forEach(documentSnapshot => {
                    arr.push(documentSnapshot.data());
                });
                resolve(arr)
            })
            .catch(error => {
                reject(new Error(error));
            })
    })
}