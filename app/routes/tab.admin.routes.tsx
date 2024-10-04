import React from 'react';
import GerenciarFornecedoresScreen from '../screens/administrador/GerenciarFornecedoresScreen';
import AdminRequisicoesScreen from '../screens/administrador/AdminRequisicoesScreen';
import GerenciarProdutosScreen from '../screens/administrador/GerenciarProdutosScreen';
import GerenciarUsuariosScreen from '../screens/administrador/GerenciarUsuariosScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import TabBarIcon from '../components/TabBarIcon';


const Tab = createBottomTabNavigator();

const selectedColor = '#005780';
const defaultColor = '#8e8e93';

const AdminRoutes: React.FC = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={focused ? selectedColor : defaultColor} />
                    ),
                }}

            />
            <Tab.Screen
                name="GerenciarFornecedoresScreen"
                component={GerenciarFornecedoresScreen}
                options={{
                    title: 'Gerenciar Fornecedores',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name={focused ? 'people' : 'people-outline'} color={focused ? selectedColor : defaultColor} />
                    ),
                }}
            />
            <Tab.Screen
                name="GerenciarProdutosScreen"
                component={GerenciarProdutosScreen}
                options={{
                    title: 'Gerenciar Produtos',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={focused ? selectedColor : defaultColor} />
                    ),
                }}
            />
            <Tab.Screen
                name="GerenciarUsuariosScreen"
                component={GerenciarUsuariosScreen}
                options={{
                    title: 'Gerenciar Usuários',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={focused ? selectedColor : defaultColor} />
                    ),
                }}
            />
            <Tab.Screen
                name="AdminRequisicoesScreen"
                component={AdminRequisicoesScreen}
                options={{
                    title: 'Requisições',
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name={focused ? 'file-tray' : 'file-tray-outline'} color={focused ? selectedColor : defaultColor} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default AdminRoutes;
