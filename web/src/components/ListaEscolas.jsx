
function ListaEscolas({ escolas, onEditar, onDeletar }) {
  if (escolas.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500">Nenhuma escola cadastrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-gray-700 font-bold">Código</th>
            <th className="px-4 py-3 text-left text-gray-700 font-bold">Nome</th>
            <th className="px-4 py-3 text-left text-gray-700 font-bold">Rede</th>
            <th className="px-4 py-3 text-left text-gray-700 font-bold">Município</th>
            <th className="px-4 py-3 text-left text-gray-700 font-bold">Diretoria</th>
            <th className="px-4 py-3 text-center text-gray-700 font-bold">Salas</th>
            <th className="px-4 py-3 text-center text-gray-700 font-bold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {escolas.map((escola) => (
            <tr key={escola.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-3 text-sm">{escola.codigo}</td>
              <td className="px-4 py-3 font-medium">{escola.nome}</td>
              <td className="px-4 py-3 text-sm">{escola.rede_ensino}</td>
              <td className="px-4 py-3 text-sm">{escola.municipio}</td>
              <td className="px-4 py-3 text-sm">{escola.diretoria}</td>
              <td className="px-4 py-3 text-center text-sm">{escola.salas_aula || 0}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onEditar(escola)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2 text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDeletar(escola.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaEscolas;