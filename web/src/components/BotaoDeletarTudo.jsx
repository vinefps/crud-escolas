import { useState } from 'react';
import { adminAPI } from '../services/api';

function BotaoDeletarTudo({ onDeletarCompleto }) {
    const [deletando, setDeletando] = useState(false);

    const handleDeletar = async () => {
        const confirmar = window.confirm('Tem certeza que deseja deletar todos os dados?');

        if (!confirmar) return;

        try {
            setDeletando(true);
            const response = await adminAPI.deletarTodosDados();

            if (response.success) {
                alert('Todos os dados foram deletados!');
                if (onDeletarCompleto) {
                    onDeletarCompleto();
                }
            }
        } catch (erro) {
            console.error('Erro ao deletar dados:', erro);
            alert('Erro ao deletar dados.');
        } finally {
            setDeletando(false);
        }
    };

    return (
        <div className="mb-6">
            <button
                onClick={handleDeletar}
                disabled={deletando}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded"
            >
                {deletando ? 'Deletando...' : 'Deletar Tudo'}
            </button>
        </div>
    );
}

export default BotaoDeletarTudo;