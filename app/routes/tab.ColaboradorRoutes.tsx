import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SelecionarProdutosScreen from '../screens/colaborador/CriarRequisicaoScreen';
import MinhasRequisicoesScreen from '../screens/colaborador/MinhasRequisicoesScreen';
import BlockedScreen from '../screens/BlockedScreen';
import DetalhesRequisicaoScreen from '../screens/DetalhesRequisicaoScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';



const Tab = createBottomTabNavigator();
const selectedColor = '#005780';
const defaultColor = '#8e8e93';

const ColaboradorStack = createNativeStackNavigator();

const ColaboradorRoutes: React.FC = () => (
    <Tab.Navigator>
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
                title: 'Home',
                tabBarIcon: ({ focused }) => (
                    <TabBarIcon name={focused ? 'home' : 'home-outline'} color={focused ? selectedColor : defaultColor} />
                ),
            }}
        />
        <Tab.Screen
            name="CriarRequisicaoScreen"
            component={SelecionarProdutosScreen}
            options={{
                title: 'Criar Requisicao',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'add-circle' : 'add-circle-outline'} color={focused ? selectedColor : defaultColor} />
                ),
            }}
        />
        <Tab.Screen
            name="MinhasRequisicoesScreen"
            component={MinhasRequisicoesScreen}
            options={{
                title: 'Minhas Requisicoes',
                tabBarIcon: ({ color, focused }) => (
                    <TabBarIcon name={focused ? 'list-circle' : 'list-circle-outline'} color={focused ? selectedColor : defaultColor} />
                ),
            }}
        />


    </Tab.Navigator>
);

export default ColaboradorRoutes;
