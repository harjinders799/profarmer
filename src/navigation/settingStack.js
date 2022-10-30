

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Setting from "../screens/settings";

const Stack = createNativeStackNavigator();

export default function SettingStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
            {/* <Stack.Screen name="AddForm" component={AddForm} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
    )
}


