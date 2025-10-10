import { useEffect, useState } from 'react';
import { referenciasAPI } from '../services/api';

function FormularioEscola({ escolaSelecionada, onSalvar, onCancelar }) {
  const [formData, setFormData] = useState({
    codigo: '',
    nome: '',
    rede_ensino_id: '',
    diretoria_id: '',
    municipio_id: '',
    distrito_id: '',
    tipo_escola_id: '',
    situacao_id: '',
    salas_aula: 0,
    biblioteca: 0,
    quadra_coberta: 0,
    lab_info: 0,
  });

  // Estados para os selects (dropdowns)
  const [municipios, setMunicipios] = useState([]);
  const [diretorias, setDiretorias] = useState([]);
  const [distritos, setDistritos] = useState([]);
  const [redesEnsino, setRedesEnsino] = useState([]);
  const [tiposEscola, setTiposEscola] = useState([]);
  const [situacoes, setSituacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Carregar dados das referências ao montar o componente
  useEffect(() => {
    carregarReferencias();
  }, []);

  // Se houver escola selecionada, preencher o formulário
  useEffect(() => {
    if (escolaSelecionada) {
      setFormData({
        codigo: escolaSelecionada.codigo || '',
        nome: escolaSelecionada.nome || '',
        rede_ensino_id: escolaSelecionada.rede_ensino_id || '',
        diretoria_id: escolaSelecionada.diretoria_id || '',
        municipio_id: escolaSelecionada.municipio_id || '',
        distrito_id: escolaSelecionada.distrito_id || '',
        tipo_escola_id: escolaSelecionada.tipo_escola_id || '',
        situacao_id: escolaSelecionada.situacao_id || '',
        salas_aula: escolaSelecionada.salas_aula || 0,
        biblioteca: escolaSelecionada.biblioteca || 0,
        quadra_coberta: escolaSelecionada.quadra_coberta || 0,
        lab_info: escolaSelecionada.lab_info || 0,
      });
    }
  }, [escolaSelecionada]);

  // Função para carregar todas as referências
  const carregarReferencias = async () => {
    try {
      setCarregando(true);
      const [mun, dir, dist, redes, tipos, sit] = await Promise.all([
        referenciasAPI.listarMunicipios(),
        referenciasAPI.listarDiretorias(),
        referenciasAPI.listarDistritos(),
        referenciasAPI.listarRedesEnsino(),
        referenciasAPI.listarTiposEscola(),
        referenciasAPI.listarSituacoes(),
      ]);

      setMunicipios(mun.data || []);
      setDiretorias(dir.data || []);
      setDistritos(dist.data || []);
      setRedesEnsino(redes.data || []);
      setTiposEscola(tipos.data || []);
      setSituacoes(sit.data || []);
    } catch (erro) {
      console.error('Erro ao carregar referências:', erro);
      alert('Erro ao carregar dados. Verifique se o backend está rodando.');
    } finally {
      setCarregando(false);
    }
  };

  // Atualizar campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Enviar formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    onSalvar(formData);
  };

  if (carregando) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p>Carregando formulário...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md relative">
      {/* Botão X para fechar */}
      <button
        onClick={onCancelar}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
      >
        ✕
      </button>

      <h2 className="text-2xl font-bold mb-4">
        {escolaSelecionada ? 'Editar Escola' : 'Nova Escola'}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Código */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Código *
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
              disabled={escolaSelecionada} // Não permitir editar código
            />
          </div>

          {/* Nome */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Nome da Escola *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Rede de Ensino */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Rede de Ensino *
            </label>
            <select
              name="rede_ensino_id"
              value={formData.rede_ensino_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Selecione...</option>
              {redesEnsino.map((rede) => (
                <option key={rede.id} value={rede.id}>
                  {rede.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Diretoria */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Diretoria *
            </label>
            <select
              name="diretoria_id"
              value={formData.diretoria_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Selecione...</option>
              {diretorias.map((dir) => (
                <option key={dir.id} value={dir.id}>
                  {dir.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Município */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Município *
            </label>
            <select
              name="municipio_id"
              value={formData.municipio_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Selecione...</option>
              {municipios.map((mun) => (
                <option key={mun.id} value={mun.id}>
                  {mun.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Distrito */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Distrito *
            </label>
            <select
              name="distrito_id"
              value={formData.distrito_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Selecione...</option>
              {distritos.map((dist) => (
                <option key={dist.id} value={dist.id}>
                  {dist.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Escola */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Tipo de Escola *
            </label>
            <select
              name="tipo_escola_id"
              value={formData.tipo_escola_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Selecione...</option>
              {tiposEscola.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.descricao}
                </option>
              ))}
            </select>
          </div>

          {/* Situação */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Situação *
            </label>
            <select
              name="situacao_id"
              value={formData.situacao_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            >
              <option value="">Selecione...</option>
              {situacoes.map((sit) => (
                <option key={sit.id} value={sit.id}>
                  Código {sit.codigo}
                </option>
              ))}
            </select>
          </div>

          {/* Salas de Aula */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Salas de Aula
            </label>
            <input
              type="number"
              name="salas_aula"
              value={formData.salas_aula}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              min="0"
            />
          </div>

          {/* Biblioteca */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Biblioteca
            </label>
            <input
              type="number"
              name="biblioteca"
              value={formData.biblioteca}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              min="0"
            />
          </div>

          {/* Quadra Coberta */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Quadra Coberta
            </label>
            <input
              type="number"
              name="quadra_coberta"
              value={formData.quadra_coberta}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              min="0"
            />
          </div>

          {/* Laboratório de Informática */}
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Lab. Informática
            </label>
            <input
              type="number"
              name="lab_info"
              value={formData.lab_info}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              min="0"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {escolaSelecionada ? 'Atualizar' : 'Cadastrar'}
          </button>

          <button
            type="button"
            onClick={onCancelar}
            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormularioEscola;