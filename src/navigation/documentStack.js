import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Documents from '../screens/documents';


const Stack = createNativeStackNavigator();

export default function DocumentStack() {
    return (
        <Stack.Navigator>

            <Stack.Screen name="Documents"
                component={Documents}
                options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}