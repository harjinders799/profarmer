

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DashBoard from "src/screens/dashboard";
import AddForm from "src/screens/dashboard/addForm";
import Detail from "src/screens/dashboard/detail";
import AddCrop from "../screens/dashboard/addCrop";

const Stack = createNativeStackNavigator();

export default function CottonStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Cotton" component={DashBoard} options={{ headerShown: false }} />
            <Stack.Screen name="AddForm" component={AddForm} options={{ headerShown: false }} />
            <Stack.Screen name="AddCrop" component={AddCrop} options={{ headerShown: false }} />
            <Stack.Screen name="Detail" component={Detail} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}


