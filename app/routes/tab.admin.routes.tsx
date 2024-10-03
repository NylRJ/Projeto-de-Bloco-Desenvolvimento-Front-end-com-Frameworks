import React from 'react';
import GerenciarFornecedoresScreen from '../screens/administrador/GerenciarFornecedoresScreen';
import AdminRequisicoesScreen from '../screens/administrador/AdminRequisicoesScreen';
import GerenciarProdutosScreen from '../screens/administrador/GerenciarProdutosScreen';
import GerenciarUsuariosScreen from '../screens/administrador/GerenciarUsuariosScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';


const Tab = createBottomTabNavigator();

const AdminRoutes: React.FC = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }}
            />
            <Tab.Screen
                name="GerenciarFornecedoresScreen"
                component={GerenciarFornecedoresScreen}
                options={{ title: 'Gerenciar Fornecedores' }}
            />

            <Tab.Screen
                name="GerenciarProdutosScreen"
                component={GerenciarProdutosScreen}
                options={{ title: 'Gerenciar Produtos' }}
            />

            <Tab.Screen
                name="GerenciarUsuariosScreen"
                component={GerenciarUsuariosScreen}
                options={{ title: 'Gerenciar Usuários' }}
            />



            <Tab.Screen
                name="AdminRequisicoesScreen"
                component={AdminRequisicoesScreen}
                options={{ title: 'Requisições' }}
            />



        </Tab.Navigator>
    );
};

export default AdminRoutes;
