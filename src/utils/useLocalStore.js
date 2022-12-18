import {useState, useEffect} from 'react';
import {getAsyncStorage, setAsyncStorage} from 'src/network/AsyncStorage';

const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    let currentValue;

    try {
      currentValue = JSON.parse(getAsyncStorage(key) || String(defaultValue));
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  useEffect(() => {
    // setAsyncStorage(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue];
};

export default useLocalStorage;
