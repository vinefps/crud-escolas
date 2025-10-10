import { useEffect, useState } from 'react';
import BotaoDeletarTudo from './components/BotaoDeletarTudo';
import FormularioEscola from './components/FormularioEscola';
import ListaEscolas from './components/ListaEscolas';
import Login from './components/Login';
import UploadCSV from './components/UploadCSV';
import { escolasAPI } from './services/api';
import { getUser, isAuthenticated, logout } from './services/auth';

function App() {
  const [autenticado, setAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [escolas, setEscolas] = useState([]);
  const [escolaSelecionada, setEscolaSelecionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [paginacao, setPaginacao] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [termoBusca, setTermoBusca] = useState('');  // ← ADICIONADO

  // Verificar autenticação ao carregar
  useEffect(() => {
    if (isAuthenticated()) {
      setAutenticado(true);
      setUsuario(getUser());
    }
  }, []);

  // Carregar escolas quando autenticado
  useEffect(() => {
    if (autenticado) {
      carregarEscolas();
    }
  }, [autenticado, paginacao.page]);

  // ← NOVO useEffect para busca
  useEffect(() => {
    if (autenticado) {
      const timer = setTimeout(() => {
        setPaginacao({ ...paginacao, page: 1 });
        carregarEscolas();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [termoBusca]);

  // Callback de login bem-sucedido
  const handleLoginSuccess = (userData) => {
    setAutenticado(true);
    setUsuario(userData);
  };

  // Fazer logout
  const handleLogout = () => {
    logout();
    setAutenticado(false);
    setUsuario(null);
    setEscolas([]);
  };

  // Carregar escolas
  const carregarEscolas = async () => {
    try {
      setCarregando(true);
      const resposta = await escolasAPI.listarTodas({
        page: paginacao.page,
        limit: paginacao.limit,
        search: termoBusca  // ← ADICIONADO
      });

      if (resposta.success) {
        setEscolas(resposta.data);
        if (resposta.pagination) {
          setPaginacao({
            ...paginacao,
            ...resposta.pagination
          });
        }
      }
    } catch (erro) {
      console.error('Erro ao carregar escolas:', erro);
      alert('Erro ao carregar escolas');
    } finally {
      setCarregando(false);
    }
  };

  // Salvar escola
  const handleSalvar = async (dadosEscola) => {
    try {
      if (escolaSelecionada) {
        const resposta = await escolasAPI.atualizar(escolaSelecionada.id, dadosEscola);
        if (resposta.success) {
          alert('Escola atualizada com sucesso!');
        }
      } else {
        const resposta = await escolasAPI.criar(dadosEscola);
        if (resposta.success) {
          alert('Escola cadastrada com sucesso!');
        }
      }

      carregarEscolas();
      setMostrarFormulario(false);
      setEscolaSelecionada(null);
    } catch (erro) {
      console.error('Erro ao salvar escola:', erro);
      const mensagem = erro.response?.data?.message || 'Erro ao salvar escola';
      alert(mensagem);
    }
  };

  // Editar escola
  const handleEditar = (escola) => {
    setEscolaSelecionada(escola);
    setMostrarFormulario(true);
  };

  // Deletar escola
  const handleDeletar = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta escola?')) {
      try {
        const resposta = await escolasAPI.deletar(id);
        if (resposta.success) {
          alert('Escola deletada com sucesso!');
          carregarEscolas();
        }
      } catch (erro) {
        console.error('Erro ao deletar escola:', erro);
        alert('Erro ao deletar escola');
      }
    }
  };

  // Cancelar formulário
  const handleCancelar = () => {
    setMostrarFormulario(false);
    setEscolaSelecionada(null);
  };

  // Nova escola
  const handleNovaEscola = () => {
    setEscolaSelecionada(null);
    setMostrarFormulario(true);
  };

  // Paginação
  const handlePaginaAnterior = () => {
    if (paginacao.page > 1) {
      setPaginacao({ ...paginacao, page: paginacao.page - 1 });
    }
  };

  const handleProximaPagina = () => {
    if (paginacao.page < paginacao.totalPages) {
      setPaginacao({ ...paginacao, page: paginacao.page + 1 });
    }
  };

  // Se não estiver autenticado, mostrar tela de login
  if (!autenticado) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Interface principal (quando autenticado)
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">CRUD de Escolas - São Paulo</h1>
            <p className="text-blue-100">Sistema de Gerenciamento de Escolas</p>
          </div>

          {/* Informações do Usuário e Logout */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-blue-100">Bem-vindo,</p>
              <p className="font-bold">{usuario?.nome}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
               Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto p-6">
        {carregando && (
          <div className="text-center py-4">
            <p className="text-gray-600">Carregando...</p>
          </div>
        )}

        {/* Botões de ação */}
        {!mostrarFormulario && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleNovaEscola}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded shadow"
              >
                + Nova Escola
              </button>

              <div className="text-gray-600">
                Total: <strong>{paginacao.total}</strong> escolas
              </div>
            </div>

            {/* ← CAMPO DE BUSCA ADICIONADO */}
            <div className="mb-4">
              <input
                type="text"
                placeholder=" Buscar escola por nome ou código..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        )}

        {/* Formulário ou Lista */}
        {mostrarFormulario ? (
          <FormularioEscola
            escolaSelecionada={escolaSelecionada}
            onSalvar={handleSalvar}
            onCancelar={handleCancelar}
          />
        ) : (
          <>
            {/* Upload CSV */}
            <div className="mb-6">
              <UploadCSV onUploadCompleto={carregarEscolas} />
            </div>

            {/* Botão Deletar Tudo */}
            <BotaoDeletarTudo onDeletarCompleto={carregarEscolas} />

            {/* Lista de Escolas */}
            <ListaEscolas
              escolas={escolas}
              onEditar={handleEditar}
              onDeletar={handleDeletar}
            />

            {/* Paginação */}
            {paginacao.totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center gap-4">
                <button
                  onClick={handlePaginaAnterior}
                  disabled={paginacao.page === 1}
                  className={`px-4 py-2 rounded font-bold ${paginacao.page === 1
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                  ← Anterior
                </button>

                <span className="text-gray-700">
                  Página <strong>{paginacao.page}</strong> de <strong>{paginacao.totalPages}</strong>
                </span>

                <button
                  onClick={handleProximaPagina}
                  disabled={paginacao.page === paginacao.totalPages}
                  className={`px-4 py-2 rounded font-bold ${paginacao.page === paginacao.totalPages
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                >
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-800 text-white text-center p-4 mt-8">
        <p>© 2025 - CRUD de Escolas - Desenvolvido com React e Tailwind CSS</p>
      </footer>
    </div>
  );
}

export default App;