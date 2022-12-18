import AsyncStorage from '@react-native-async-storage/async-storage';

export const keys = {
  events: 'events',
  notes: 'notes',
  tasks: 'tasks',
  completedTask: 'completedTask',
  khrachData: 'khrachData',
  user: 'user',
  categories: 'categories',
  theme: 'theme',
};
const setAsyncStorage = async (key, item) => {
  try {
    await AsyncStorage.setItem(key, item);
  } catch (error) {
    console.log(error);
  }
};

const getAsyncStorage = async key => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return value;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const clearAsyncStorage = async key => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

export {setAsyncStorage, getAsyncStorage, clearAsyncStorage};
