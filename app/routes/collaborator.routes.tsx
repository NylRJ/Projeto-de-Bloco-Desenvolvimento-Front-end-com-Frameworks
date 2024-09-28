import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SelecionarProdutosScreen from '../screens/colaborador/CriarRequisicaoScreen';
import MinhasRequisicoesScreen from '../screens/colaborador/MinhasRequisicoesScreen';
import BlockedScreen from '../screens/BlockedScreen';
import DetalhesRequisicaoScreen from '../screens/DetalhesRequisicaoScreen';


const ColaboradorStack = createNativeStackNavigator();

const ColaboradorRoutes: React.FC = () => (
    <ColaboradorStack.Navigator>
        <ColaboradorStack.Screen name="Home" component={HomeScreen} options={{ title: 'Home Colaborador' }} />
        <ColaboradorStack.Screen name="CriarRequisicaoScreen" component={SelecionarProdutosScreen} options={{ title: 'Criar Requisicao' }} />
        <ColaboradorStack.Screen name="MinhasRequisicoesScreen" component={MinhasRequisicoesScreen} options={{ title: 'Minhas Requisicoes' }} />
        <ColaboradorStack.Screen name="BlockedScreen" component={BlockedScreen} options={{ title: 'Bloqueado' }} />
        <ColaboradorStack.Screen name="DetalhesRequisicaoScreen" component={DetalhesRequisicaoScreen} options={{ title: 'Detalhes' }} />
    </ColaboradorStack.Navigator>
);

export default ColaboradorRoutes;
