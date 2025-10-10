const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar se usuário está autenticado
 */
exports.verificarAuth = (req, res, next) => {
    try {
        // Pegar token do header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token não fornecido'
            });
        }

        // Formato: "Bearer TOKEN"
        const parts = authHeader.split(' ');

        if (parts.length !== 2) {
            return res.status(401).json({
                success: false,
                message: 'Token mal formatado'
            });
        }

        const [scheme, token] = parts;

        if (!/^Bearer$/i.test(scheme)) {
            return res.status(401).json({
                success: false,
                message: 'Token mal formatado'
            });
        }

        // Verificar e decodificar token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido ou expirado'
                });
            }

            // Adicionar dados do usuário na requisição
            req.usuario = decoded;

            // Seguir para a próxima função
            next();
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Erro ao verificar autenticação',
            error: error.message
        });
    }
};