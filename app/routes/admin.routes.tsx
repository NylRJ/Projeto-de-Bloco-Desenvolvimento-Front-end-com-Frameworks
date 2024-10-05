import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GerenciarFornecedoresScreen from '../screens/administrador/GerenciarFornecedoresScreen';
import AdminRequisicoesScreen from '../screens/administrador/AdminRequisicoesScreen';
import EditFornecedorScreen from '../screens/administrador/EditFornecedorScreen';
import AddFornecedorScreen from '../screens/administrador/AddFornecedorScreen';
import GerenciarProdutosScreen from '../screens/administrador/GerenciarProdutosScreen';
import GerenciarUsuariosScreen from '../screens/administrador/GerenciarUsuariosScreen';
import CreateAdministradorScreen from '../screens/administrador/CreateAdministradorScreen';
import EditProduto from '../screens/administrador/EditProdutoScreen';
import BlockedScreen from '../screens/BlockedScreen';
import DetalhesRequisicaoScreen from '../screens/DetalhesRequisicaoScreen';
import AddProdutoScreen from '../screens/administrador/AddProdutoScreen';
import CotacaoScreen from '../screens/administrador/CotacaoScreen';
import AssociateProdutoFornecedorScreen from '../screens/administrador/AssociateProdutoFornecedorScreen';
import AdminTabs from '../routes/tab.admin.routes'
import HomeScreen from '../screens/HomeScreen';
import PasswordRecoveryScreen from '../screens/login/forgotPasswordScreen';
import ProfileScreen from '../screens/ProfileScreen';


const AdminStack = createNativeStackNavigator();


const AdminRoutes: React.FC = () => {
    return (
        <AdminStack.Navigator>
            <AdminStack.Screen
                name="AdminTabs"
                component={AdminTabs}
                options={{ headerShown: false }}
            />
            <AdminStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home - Administrador' }}
            />
            <AdminStack.Screen
                name="GerenciarFornecedoresScreen"
                component={GerenciarFornecedoresScreen}
                options={{ title: 'Gerenciar Fornecedores' }}
            />

            <AdminStack.Screen
                name="AddFornecedor"
                component={AddFornecedorScreen}
                options={{ title: 'Adicionar Fornecedor' }}
            />
            <AdminStack.Screen
                name="EditFornecedor"
                component={EditFornecedorScreen}
                options={{ title: 'Editar Fornecedor' }}
            />
            <AdminStack.Screen
                name="GerenciarProdutosScreen"
                component={GerenciarProdutosScreen}
                options={{ title: 'Gerenciar Produtos' }}
            />

            <AdminStack.Screen
                name="GerenciarUsuariosScreen"
                component={GerenciarUsuariosScreen}
                options={{ title: 'Gerenciar Usuários' }}
            />
            <AdminStack.Screen
                name="AdicionarProdutoScreen"
                component={AddProdutoScreen}
                options={{ title: 'Adicionar Produto' }}
            />
            <AdminStack.Screen
                name="EditProduto"
                component={EditProduto}
                options={{ title: 'Editar Produto' }}
            />
            <AdminStack.Screen
                name="CreateAdministradorScreen"
                component={CreateAdministradorScreen}
                options={{ title: 'Cria Administrador' }}
            />
            <AdminStack.Screen
                name="AssociateProdutoScreen"
                component={AssociateProdutoFornecedorScreen}
                options={{ title: 'Associar Produto ao Fornecedor' }}
            />
            <AdminStack.Screen
                name="AdminRequisicoesScreen"
                component={AdminRequisicoesScreen}
                options={{ title: 'Requisições' }}
            />
            <AdminStack.Screen
                name="CotacaoScreen"
                component={CotacaoScreen}
                options={{ title: 'Cotação' }}
            />
            <AdminStack.Screen
                name="BlockedScreen"
                component={BlockedScreen}
                options={{ title: 'Bloqueado' }}
            />
            <AdminStack.Screen
                name="DetalhesRequisicaoScreen"
                component={DetalhesRequisicaoScreen}
                options={{ title: 'Detalhes' }}
            />
            <AdminStack.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ title: 'Perfil' }}
            />
            <AdminStack.Screen
                name="PasswordRecoveryScreen"
                component={PasswordRecoveryScreen}
                options={{ title: 'Senha' }}
            />


        </AdminStack.Navigator>
    );
};

export default AdminRoutes;
