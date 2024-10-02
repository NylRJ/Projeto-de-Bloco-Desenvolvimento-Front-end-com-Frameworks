// Definindo tipos para as rotas de navegação
export type RootStackParamList = {
    HomeScreen: undefined;
    LoginScreen: undefined;
    SignupScreen: undefined;
    AuthContext: undefined;
    BlockedScreen: undefined;
    AdicionarProdutoScreen: undefined;
    AddFornecedor: undefined;
    FornecedorListScreen: undefined;
    GerenciarFornecedoresScreen: undefined;
    GerenciarProdutosScreen: undefined;
    GerenciarUsuariosScreen: undefined;
    AdminRequisicoesScreen: undefined;
    CriarRequisicaoScreen: undefined;
    CreateAdministradorScreen: undefined;
    MinhasRequisicoesScreen: undefined;
    FornecedoresScreen: undefined;
    EditFornecedorScreen: { id: string };
    ProfileScreen: { userId: string };
    EditProdutoScreen: { id: string };
    EditProduto: { id: string };
    EditFornecedor: { id: string };
    AssociateProdutoScreen: { fornecedorId: string };
    DetalhesRequisicaoScreen: { colaboradorId: string, requisicaoId: string };
    CotacaoScreen: { requisicaoId: string, colaboradorId: string };




};

export type AuthStackParamList = {
    Home: undefined;
    Login: undefined;
    Signup: undefined;
    Register: undefined;
    Profile: { userId: string };
};

// Definindo tipos para um usuário (usando no AuthContext)
export interface Usuario {
    uid: string;
    nome: string;
    email: string;
    papel: string; // Exemplo: 'Administrador' ou 'Colaborador'
    status: 'Liberado' | 'Bloqueado';
}



export type Fornecedor = {
    id: string;
    nome: string;
    cnpj_cpf: string;
    endereco: string;
    email: string;
    status: string;
    tipo: string;
};

export interface Contato {
    nome: string;
    email: string;
    telefone: string;
}

export interface AddProduto {
    nome: string;
    fotoUrl?: string;  // Foto pode ser opcional se ainda não estiver sendo usada
    especificacao: string;
    descricao?: string;
    categoriaId: string;
    subcategoriaId?: string;  // Subcategoria opcional
}




export type ProdutoBase = {
    id: string;
    nome: string;
    categoriaNome: string;
    especificacao: string;
    descricao: string;
    categoriaId: string;
    subcategoriaId: string;
    fotoUrl?: string;
};
export type ProdutoFornecedor = {
    id: string;
    quantidade: number;
    valor: number;
};

/*export type ProdutoFornecedor = {
    id: string;
    produtoId: string;
    quantidade: number;
    valor: number;
    fornecedorId: string;
}; */

/*export interface RequisicaoCompras {
    id_colaborador: string;   // ID do colaborador que criou a requisição
    descricao: string;        // Descrição da requisição
    comentario?: string;      // Comentário adicional
    produtos: {
        id: string;           // ID do produto
        quantidade: number;   // Quantidade solicitada
        valor: number;        // Valor do produto
    }[];                      // Lista de produtos selecionados
    status: 'Aberta' | 'Em Cotação' | 'Fechada';  // Status da requisição
    data: Date;               // Data de criação da requisição
}
 */


export type ProdutoParaFornecedor = {
    id: string;
    nome: string;
    especificacao: string;
    categoriaId: string;
    subcategoriaId: string;
    fotoUrl?: string;
    valor: number;
    quantidade: number
};


// ProdutoParaSalvar - usado para salvar produtos no Firestore
export type ProdutoParaSalvar = Omit<ProdutoBase, 'id'>;  // Removemos o 'id' porque ele será gerado pelo Firebase


// Fornecedor - Definindo um fornecedor básico
export type FornecedorBase = {
    id: string;
    nome: string;
    produtos?: ProdutoParaFornecedor[];
};


export interface Categoria {
    id: string;
    nome: string;
}

export interface Subcategoria {
    id: string;
    nome: string;
    categoriaId: string; // Relaciona a subcategoria à categoria pai
}



export interface Cotacao {
    id_fornecedor: string;
    valor: number;
    status: string; // Em Cotação, Fechada
}



// Tipos para um formulário de login
export interface LoginFormValues {
    email: string;
    password: string;
}


export interface RequisicaoCompras {
    id_colaborador: string;
    produtoId: string;
    produtoNome: string;
    quantidade: number;
    motivo?: string;
    status: 'Aberta' | 'Em Cotação' | 'Fechada';  // Status da requisição
    data: Date;               // Data de criação da requisição
}


export interface AuthContextType {
    user: Usuario | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, nome: string, papel?: string) => Promise<void>;
    logout: () => Promise<void>;
    getAdminToken: () => Promise<string | null>;
}
