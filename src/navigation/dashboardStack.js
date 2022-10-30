

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashBoard from "src/screens/dashboard";

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DashBoard" component={DashBoard} options={{ headerShown: false }} />
            {/* <Stack.Screen name="AddForm" component={AddForm} options={{ headerShown: false }} /> */}
        </Stack.Navigator>
    )
}


