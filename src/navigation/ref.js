
import { createNavigationContainerRef, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
    navigationRef.navigate(name, params);
}

export function replace(name, params) {
    navigationRef.current?.dispatch(StackActions.replace(name, params));
}

export function goBack() {
    if (navigationRef.canGoBack()) navigationRef.goBack();
}


