const jwt = require('jsonwebtoken');

// Usuário fixo (hardcoded) - SEM BANCO!
const USUARIO_ADMIN = {
    id: 1,
    nome: 'Administrador',
    email: 'admin@escola.com',
    senha: 'admin123'  // Senha em texto plano (apenas para teste!)
};

/**
 * Login simples
 */
exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Validar campos
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios'
            });
        }

        // Verificar credenciais (comparação direta)
        if (email !== USUARIO_ADMIN.email || senha !== USUARIO_ADMIN.senha) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha inválidos'
            });
        }

        // Gerar token JWT
        const token = jwt.sign(
            {
                id: USUARIO_ADMIN.id,
                email: USUARIO_ADMIN.email,
                nome: USUARIO_ADMIN.nome
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Retornar token e dados do usuário
        res.json({
            success: true,
            message: 'Login realizado com sucesso',
            data: {
                token,
                usuario: {
                    id: USUARIO_ADMIN.id,
                    nome: USUARIO_ADMIN.nome,
                    email: USUARIO_ADMIN.email
                }
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao realizar login'
        });
    }
};

/**
 * Logout
 */
exports.logout = async (req, res) => {
    res.json({
        success: true,
        message: 'Logout realizado com sucesso'
    });
};