import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Define action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_MY_LANDS: 'SET_MY_LANDS',
  SET_MY_CROPS: 'SET_MY_CROPS',
  SET_PUBLIC_CROPS: 'SET_PUBLIC_CROPS',
  SELECT_LAND: 'SELECT_LAND',
  SELECT_LAND_CROP: 'SELECT_LAND_CROP',
  SELECT_CROP: 'SELECT_CROP',
  SET_EVENTS: 'SET_EVENTS',
};

const initialState = {
  loading: false,
  error: null,
  myLands: [],
  myCrops: [],
  publicCrops: [],
  landCrops: [],
  selectedLand: null,
  selectedCrop: null,
};

const CropTrackerContext = createContext();

const cropTrackerReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {...state, loading: action.payload};
    case ActionTypes.SET_ERROR:
      return {...state, error: action.payload, loading: false};
    case ActionTypes.SET_MY_LANDS:
      return {...state, myLands: action.payload, loading: false};
    case ActionTypes.SET_MY_CROPS:
      return {...state, myCrops: action.payload, loading: false};
    case ActionTypes.SET_PUBLIC_CROPS:
      return {...state, publicCrops: action.payload, loading: false};
    case ActionTypes.SELECT_LAND:
      return {...state, selectedLand: action.payload};
    case ActionTypes.SELECT_LAND_CROP:
      return {...state, landCrops: action.payload, loading: false};
    case ActionTypes.SELECT_CROP:
      return {...state, selectedCrop: action.payload, loading: false};
    case ActionTypes.SET_EVENTS:
      return {...state, events: action.payload, loading: false};
    default:
      return state;
  }
};

export const CropTrackerProvider = ({children}) => {
  const [state, dispatch] = useReducer(cropTrackerReducer, initialState);

  const getMyLands = useCallback(async () => {
    try {
      console.log('---getting my lands---');
      dispatch({type: ActionTypes.SET_LOADING, payload: true});
      if (!auth().currentUser?.uid) {
        console.error('User not authenticated');
        return;
      }

      firestore()
        .collection('lands_data')
        .where('uid', '==', auth().currentUser?.uid)
        .get()
        .then(querySnapshot => {
          console.log('---got my lands---');
          const documents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          console.log({documents});
          // Dispatch the data to the context state
          dispatch({type: ActionTypes.SET_MY_LANDS, payload: documents});
        })
        .catch(error => {
          // Handle errors
          console.error('Error fetching myCrops data:', error.message);
          dispatch({type: ActionTypes.SET_ERROR, payload: error.message});
        });
      return;
    } catch (error) {
      console.log('---error getting my lands---');
      dispatch({type: ActionTypes.SET_ERROR, payload: error.message});
      return () => {};
    }
  }, []);

  const getMyCrops = useCallback(() => {
    try {
      // dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      if (!auth().currentUser?.uid) {
        console.error('User not authenticated');
        return;
      }

      firestore()
        .collection('crops_data')
        .where('uid', '==', auth().currentUser.uid)
        // .where('uid', '==', 'qKFH3iYrE1aRPv3p5YYxVYDDchf1')
        .get()
        .then(querySnapshot => {
          const documents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));

          // Dispatch the data to the context state
          dispatch({type: ActionTypes.SET_MY_CROPS, payload: documents});
        })
        .catch(error => {
          // Handle errors
          console.error('Error fetching myCrops data:', error.message);
          dispatch({type: ActionTypes.SET_ERROR, payload: error.message});
        });

      return;
    } catch (error) {
      dispatch({type: ActionTypes.SET_ERROR, payload: error.message});
      return () => {};
    }
  }, []);

  const setSelectedLand = land => {
    dispatch({
      type: ActionTypes.SELECT_LAND,
      payload: land,
    });
    dispatch({type: ActionTypes.SET_LOADING, payload: true});
    if (!auth().currentUser?.uid) {
      console.error('User not authenticated');
      return;
    }
    if (land?.id)
      firestore()
        .collection('crops_data')
        .where('lid', '==', land?.id)
        .get()
        .then(querySnapshot => {
          const documents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          // Dispatch the data to the context state
          dispatch({type: ActionTypes.SELECT_LAND_CROP, payload: documents});
        })
        .catch(error => {
          // Handle errors
          console.error('Error fetching publicCrops data:', error.message);
          dispatch({type: ActionTypes.SET_ERROR, payload: error.message});
        });
    return;
  };

  const setSelectedCrop = crop => {
    try {
      dispatch({
        type: ActionTypes.SELECT_CROP,
        payload: crop,
      });
      dispatch({type: ActionTypes.SET_LOADING, payload: true});
      if (!auth().currentUser?.uid) {
        console.error('User not authenticated');
        return;
      }
      firestore()
        .collection('crops_data')
        .doc(crop?.id)
        .collection('events')
        .orderBy('date', 'desc')
        .get()
        .then(querySnapshot => {
          const documents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          // Dispatch the data to the context state
          dispatch({
            type: ActionTypes.SET_EVENTS,
            payload: documents,
          });
        })
        .catch(error => {
          console.error('Error fetching publicCrops data:', error.message);
          dispatch({type: ActionTypes.SET_ERROR, payload: error.message});
        });
      return;
    } catch (error) {
      dispatch({type: ActionTypes.SET_ERROR, payload: error.message});
      return () => {};
    }
  };

  const getPublicCrops = useCallback(async () => {
    try {
      dispatch({type: ActionTypes.SET_LOADING, payload: true});
      if (!auth().currentUser?.uid) {
        console.error('User not authenticated');
        return;
      }
      firestore()
        .collection('crops_data')
        .where('isPublic', '==', 'public')
        .get()
        .then(querySnapshot => {
          const documents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          console.log({documents});
          // Dispatch the data to the context state
          dispatch({type: ActionTypes.SET_PUBLIC_CROPS, payload: documents});
        })
        .catch(error => {
          // Handle errors
          console.error('Error fetching publicCrops data:', error.message);
          dispatch({type: ActionTypes.SET_ERROR, payload: error.message});
        });
      return;
    } catch (error) {
      dispatch({type: ActionTypes.SET_ERROR, payload: error.message});
      return () => {};
    }
  }, []);

  const refreshCrop = crop => {
    try {
      dispatch({type: ActionTypes.SET_LOADING, payload: true});
      if (!auth().currentUser?.uid) {
        console.error('User not authenticated');
        return;
      }
      console.log('----refreshing-----');
      firestore()
        .collection('crops_data')
        .where('id', '==', crop?.id)
        .get()
        .then(querySnapshot => {
          const documents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
          console.log('----updating crops data-----');

          // Dispatch the data to the context state
          dispatch({
            type: ActionTypes.SELECT_CROP,
            payload: documents[0],
          });
          let arr = [...state.landCrops];
          const index = arr.findIndex(obj => obj.id === crop.id);

          if (index !== -1) {
            arr[index] = {...arr[index], ...documents[0]}; // Merge the updated fields into the object
          }
          console.log('----updating land crops data-----');

          dispatch({type: ActionTypes.SELECT_LAND_CROP, payload: arr});
        })
        .catch(error => {
          // Handle errors
          console.error('Error fetching publicCrops data:', error.message);
          dispatch({type: ActionTypes.SET_ERROR, payload: error.message});
        });
      return;
    } catch (error) {
      dispatch({type: ActionTypes.SET_ERROR, payload: error.message});
      return () => {};
    }
  };

  const value = useMemo(
    () => ({
      ...state,
      setSelectedLand,
      setSelectedCrop,
      getMyLands,
      getMyCrops,
      getPublicCrops,
      refreshCrop,
    }),
    [
      state,
      getMyLands,
      setSelectedCrop,
      setSelectedLand,
      getMyCrops,
      getPublicCrops,
      refreshCrop,
    ],
  );

  return (
    <CropTrackerContext.Provider value={value}>
      {children}
    </CropTrackerContext.Provider>
  );
};

// Custom hook to use context
export const useCropTracker = () => {
  const context = useContext(CropTrackerContext);
  if (!context) {
    throw new Error('useCropTracker must be used within a CropTrackerProvider');
  }
  return context;
};
