import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SelecionarProdutosScreen from '../screens/colaborador/CriarRequisicaoScreen';
import MinhasRequisicoesScreen from '../screens/colaborador/MinhasRequisicoesScreen';
import DetalhesRequisicaoScreen from '../screens/DetalhesRequisicaoScreen';
import AdminTabs from '../routes/tab.ColaboradorRoutes';
import BlockedScreen from '../screens/BlockedScreen';


const ColaboradorStack = createNativeStackNavigator();

const ColaboradorRoutes: React.FC = () => (
    <ColaboradorStack.Navigator


    >
        <ColaboradorStack.Screen
            name="AdminTabs"
            component={AdminTabs}
            options={{ headerShown: false }} // Esconde o header, pois será controlado nas Tabs
        />
        <ColaboradorStack.Screen name="Home" component={HomeScreen} options={{ title: 'Home Colaborador' }} />
        <ColaboradorStack.Screen name="CriarRequisicaoScreen" component={SelecionarProdutosScreen} options={{ title: 'Criar Requisicao' }} />
        <ColaboradorStack.Screen name="MinhasRequisicoesScreen" component={MinhasRequisicoesScreen} options={{ title: 'Minhas Requisicoes' }} />
        <ColaboradorStack.Screen name="DetalhesRequisicaoScreen" component={DetalhesRequisicaoScreen} options={{ title: 'Detalhes' }} />
        <ColaboradorStack.Screen name="BlockedScreen" component={BlockedScreen}
            options={{ headerShown: false }}
        />
    </ColaboradorStack.Navigator>
);

export default ColaboradorRoutes;
