import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/login/LoginScreen';
import SignupScreen from '../screens/login/SignupScreen';
import BlockedScreen from '../screens/BlockedScreen';



const AuthStack = createNativeStackNavigator();

const AuthRoutes: React.FC = () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <AuthStack.Screen
                name="Signup"
                component={SignupScreen}
                options={{ headerShown: false }}
            />
            <AuthStack.Screen
                name="BlockedScreen"
                component={BlockedScreen}
                options={{ headerShown: false }}
            />

        </AuthStack.Navigator>
    );
};

export default AuthRoutes;
