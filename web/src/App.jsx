import { useEffect, useState } from 'react';
import FormularioEscola from './components/FormularioEscola';
import ListaEscolas from './components/ListaEscolas';
import { escolasAPI } from './services/api';
import UploadCSV from './components/uploadCSV';


function App() {
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

  // Carregar escolas ao iniciar
  useEffect(() => {
    carregarEscolas();
  }, [paginacao.page]);

  // Função para carregar todas as escolas
  const carregarEscolas = async () => {
    try {
      setCarregando(true);
      const resposta = await escolasAPI.listarTodas({
        page: paginacao.page,
        limit: paginacao.limit
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
      alert('Erro ao carregar escolas. Verifique se o backend está rodando na porta 3000.');
    } finally {
      setCarregando(false);
    }
  };

  // Função para salvar (criar ou atualizar) escola
  const handleSalvar = async (dadosEscola) => {
    try {
      if (escolaSelecionada) {
        // Atualizar escola existente
        const resposta = await escolasAPI.atualizar(escolaSelecionada.id, dadosEscola);
        if (resposta.success) {
          alert('Escola atualizada com sucesso!');
        }
      } else {
        // Criar nova escola
        const resposta = await escolasAPI.criar(dadosEscola);
        if (resposta.success) {
          alert('Escola cadastrada com sucesso!');
        }
      }

      // Recarregar lista e fechar formulário
      carregarEscolas();
      setMostrarFormulario(false);
      setEscolaSelecionada(null);
    } catch (erro) {
      console.error('Erro ao salvar escola:', erro);
      const mensagem = erro.response?.data?.message || 'Erro ao salvar escola. Tente novamente.';
      alert(mensagem);
    }
  };

  // Função para editar escola
  const handleEditar = (escola) => {
    setEscolaSelecionada(escola);
    setMostrarFormulario(true);
  };

  // Função para deletar escola
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
        alert('Erro ao deletar escola. Tente novamente.');
      }
    }
  };

  // Função para cancelar e voltar
  const handleCancelar = () => {
    setMostrarFormulario(false);
    setEscolaSelecionada(null);
  };

  // Função para abrir formulário de nova escola
  const handleNovaEscola = () => {
    setEscolaSelecionada(null);
    setMostrarFormulario(true);
  };

  // Funções de paginação
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cabeçalho */}
      <header className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">CRUD de Escolas - São Paulo</h1>
          <p className="text-blue-100">Sistema de Gerenciamento de Escolas</p>
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
          <div className="mb-6 flex justify-between items-center">
            <button
              onClick={handleNovaEscola}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded shadow"
            >
              + Nova Escola
            </button>

            {/* Info de paginação */}
            <div className="text-gray-600">
              Total: <strong>{paginacao.total}</strong> escolas
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