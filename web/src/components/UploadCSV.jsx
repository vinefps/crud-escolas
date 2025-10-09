import { useState } from 'react';

function UploadCSV({ onUploadCompleto }) {
    const [arquivo, setArquivo] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [resultado, setResultado] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.name.endsWith('.csv')) {
            setArquivo(file);
            setResultado(null);
        } else {
            alert('Por favor, selecione um arquivo CSV válido');
            e.target.value = '';
        }
    };

    const handleUpload = async () => {
        if (!arquivo) {
            alert('Por favor, selecione um arquivo CSV');
            return;
        }

        try {
            setUploading(true);
            setResultado(null);

            const formData = new FormData();
            formData.append('file', arquivo);

            const response = await fetch('http://localhost:3000/api/escolas/upload-csv', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setResultado(data.resultado);
                setArquivo(null);
                document.getElementById('file-input').value = '';

                // Notificar componente pai
                if (onUploadCompleto) {
                    onUploadCompleto();
                }
            } else {
                alert(`Erro: ${data.message}`);
            }
        } catch (erro) {
            console.error('Erro ao fazer upload:', erro);
            alert('Erro ao fazer upload do arquivo. Verifique se o backend está rodando.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-xl font-bold mb-4">📊 Importar Escolas via CSV</h3>

            <div className="mb-4">
                <input
                    id="file-input"
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50 disabled:cursor-not-allowed"
                />
            </div>

            {arquivo && (
                <div className="mb-4 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-gray-700">
                        <strong>Arquivo selecionado:</strong> {arquivo.name}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                        Tamanho: {(arquivo.size / 1024).toFixed(2)} KB
                    </p>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={!arquivo || uploading}
                className={`w-full font-bold py-3 px-4 rounded transition-colors ${arquivo && !uploading
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
            >
                {uploading ? '⏳ Processando...' : '📤 Fazer Upload'}
            </button>

            {/* Resultado do Upload */}
            {resultado && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
                    <h4 className="font-bold text-green-800 mb-2">✅ Upload Concluído!</h4>
                    <div className="text-sm space-y-1">
                        <p><strong>Total de linhas:</strong> {resultado.total}</p>
                        <p className="text-green-700"><strong>Importadas com sucesso:</strong> {resultado.sucesso}</p>
                        {resultado.erros > 0 && (
                            <p className="text-orange-600"><strong>Erros:</strong> {resultado.erros}</p>
                        )}
                    </div>

                    {resultado.detalhesErros && resultado.detalhesErros.length > 0 && (
                        <details className="mt-3">
                            <summary className="cursor-pointer text-sm font-bold text-orange-700">
                                Ver detalhes dos erros
                            </summary>
                            <div className="mt-2 max-h-40 overflow-y-auto">
                                {resultado.detalhesErros.map((erro, index) => (
                                    <p key={index} className="text-xs text-gray-600">
                                        Linha {erro.linha} (Código: {erro.codigo}): {erro.erro}
                                    </p>
                                ))}
                            </div>
                        </details>
                    )}
                </div>
            )}

            {/* Instruções */}
            <div className="mt-4 p-3 bg-gray-50 rounded">
                <p className="text-xs text-gray-600 font-bold mb-2">📋 Formato esperado do CSV:</p>
                <p className="text-xs text-gray-600 font-mono">
                    CODESC;NOMESC;NOMEDEP;DE;MUN;DISTR;TIPOESC;TIPOESC_DESC;CODSIT;SALAS_AULA;BIBLIOTECA;QUADRA_COBERTA;LAB_INFO
                </p>
                <p className="text-xs text-gray-500 mt-2">
                    ⚠️ Use ponto-e-vírgula (;) como separador
                </p>
            </div>
        </div>
    );
}

export default UploadCSV;