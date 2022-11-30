

import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "src/screens/auth/login";
import Splash from "src/screens/auth/splash";
import { themeLight } from "src/utils/themes";
import Setting from "src/screens/settings";
// import AdBanner from "src/components/adBanner";
import { useLang } from "src/context/langContext";
import { navigationRef } from "./ref";
import DashBoard from "src/screens/dashboard";
import AddForm from "src/screens/dashboard/addForm";
import Detail from "src/screens/dashboard/detail";
import { Auth } from "src/service/setup";
import Loader from "src/components/loader";
import Tabs from "./tab";

const Stack = createNativeStackNavigator();

export default function Navigation() {
    const { getLang } = useLang();

    useEffect(() => {
        getLang();
    }, []);

    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }
    useEffect(() => {
        const subscriber = Auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber; // unsubscribe on unmount
    }, []);

    if (initializing) return <Loader visible={initializing} />;

    return (
        <NavigationContainer
            theme={themeLight}
            ref={navigationRef}
        >
            <Stack.Navigator>
                {!user ? <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} /> :
                    <>
                        <Stack.Screen name="Main" component={Tabs} options={{ headerShown: false }} />
                        <Stack.Screen name="Setting" component={Setting} options={{ headerShown: false }} />
                        <Stack.Screen name="AddForm" component={AddForm} options={{ headerShown: false }} />
                        <Stack.Screen name="Detail" component={Detail} options={{ headerShown: false }} />
                    </>
                }
            </Stack.Navigator>
            {/* <AdBanner /> */}
        </NavigationContainer>
    )
}


