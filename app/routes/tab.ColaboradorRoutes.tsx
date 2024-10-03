import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SelecionarProdutosScreen from '../screens/colaborador/CriarRequisicaoScreen';
import MinhasRequisicoesScreen from '../screens/colaborador/MinhasRequisicoesScreen';
import BlockedScreen from '../screens/BlockedScreen';
import DetalhesRequisicaoScreen from '../screens/DetalhesRequisicaoScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



const Tab = createBottomTabNavigator();


const ColaboradorStack = createNativeStackNavigator();

const ColaboradorRoutes: React.FC = () => (
    <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home Colaborador' }} />
        <Tab.Screen name="CriarRequisicaoScreen" component={SelecionarProdutosScreen} options={{ title: 'Criar Requisicao' }} />
        <Tab.Screen name="MinhasRequisicoesScreen" component={MinhasRequisicoesScreen} options={{ title: 'Minhas Requisicoes' }} />
        <Tab.Screen name="BlockedScreen" component={BlockedScreen} options={{ title: 'Bloqueado' }} />
        <Tab.Screen name="DetalhesRequisicaoScreen" component={DetalhesRequisicaoScreen} options={{ title: 'Detalhes' }} />
    </Tab.Navigator>
);

export default ColaboradorRoutes;
