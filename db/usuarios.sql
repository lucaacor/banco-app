USE gestion_bancaria;

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(100) NOT NULL,
    rol ENUM('admin', 'consulta') NOT NULL DEFAULT 'consulta',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);