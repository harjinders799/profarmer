import React, { useReducer, useCallback, useMemo, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

// Define action types
const ActionTypes = {
  SET_MY_CROPS: 'SET_MY_CROPS',
  SET_PUBLIC_CROPS: 'SET_PUBLIC_CROPS',
  SELECT_CROP: 'SELECT_CROPS',
};

const initialState = {
  myCrops: [],
  publicCrops: [],
  selectedCrop: undefined
};

const CropTrackerContext = React.createContext();

const cropTrackerReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_MY_CROPS:
      return {
        ...state,
        myCrops: action.myCrops,
      };
    case ActionTypes.SET_PUBLIC_CROPS:
      return {
        ...state,
        publicCrops: action.publicCrops,
      };
    case ActionTypes.SELECT_CROP:
      return {
        ...state,
        selectedCrop: action.selectedCrop,
      };
    default:
      return state;
  }
};

export const CropTrackerProvider = (props) => {
  const [state, dispatch] = useReducer(cropTrackerReducer, initialState);

  // Memoize getMyCrops to prevent unnecessary re-renders
  const getMyCrops = useCallback(() => {
    if (!auth().currentUser?.uid) {
      console.error('User not authenticated');
      return;
    }

    const unsubscribe = firestore()
      .collection('crops_data')
      .where('uid', '==', auth().currentUser?.uid)
      .onSnapshot(
        querySnapshot => {
          const documents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));

          // Dispatch the data to the context state
          dispatch({ type: ActionTypes.SET_MY_CROPS, myCrops: documents });
        },
        error => {
          // Handle errors
          console.error('Error fetching myCrops data:', error.message);
        }
      );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return unsubscribe;
  }, []);
  // Memoize getMyCrops to prevent unnecessary re-renders
  const getPublicCrops = useCallback(() => {
    if (!auth().currentUser?.uid) {
      console.error('User not authenticated');
      return;
    }
    const unsubscribe = firestore()
      .collection('crops_data')
      .where('isPublic', '==', 'public')
      .onSnapshot(
        querySnapshot => {
          const documents = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));

          // Dispatch the data to the context state
          dispatch({ type: ActionTypes.SET_PUBLIC_CROPS, publicCrops: documents });
        },
        error => {
          // Handle errors
          console.error('Error fetching publicCrops data:', error.message);
        }
      );

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return unsubscribe;
  }, [auth().currentUser]);

  // Listen for auth state changes and handle cleanup
  useEffect(() => {
    let unsubscribe;
    let unsubscribePublic;
    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (user) {
        // Fetch crops data if user is authenticated
        unsubscribe = getMyCrops();
        unsubscribePublic = getPublicCrops();

        // Cleanup on logout
        return () => {
          if (unsubscribe) unsubscribe();
          if (unsubscribePublic) unsubscribePublic();
        };
      } else {
        return () => {
          if (unsubscribe) unsubscribe();
          if (unsubscribePublic) unsubscribePublic();
        };
      }
    });

    // Cleanup auth listener on unmount
    return () => unsubscribeAuth();
  }, [getMyCrops, getPublicCrops]);

  // Memoize value to prevent unnecessary re-renders of children
  const value = useMemo(() => ({
    ...state,
    setSelectedCrop: (crop) => dispatch({ type: ActionTypes.SELECT_CROP, selectedCrop: crop }),
    getMyCrops,
    getPublicCrops
  }), [state, getMyCrops, getPublicCrops]);

  return (
    <CropTrackerContext.Provider value={value}>
      {props.children}
    </CropTrackerContext.Provider>
  );
};

// Custom hook to use context
export const useCropTracker = () => {
  const context = React.useContext(CropTrackerContext);
  if (!context) {
    throw new Error('useCropTracker must be used within a CropTrackerProvider');
  }
  return context;
};
