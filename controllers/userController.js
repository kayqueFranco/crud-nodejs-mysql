const db = require('../db/connection');
const bcrypt = require('bcrypt')
// CREATE
exports.createUser = (req, res) => {
    const { nome_usuario, email_usuario, senha_usuario } = req.body; // Desestruturação das variáveis do corpo da requisição

    bcrypt.hash(senha_usuario, 10, (err, result) => {
        if (err) return res.status(500).send(err); 

        const sql = 'INSERT INTO usuarios (nome_usuario, email_usuario, senha_usuario) VALUES(?, ?, ?)';
        
        db.query(sql, [nome_usuario, email_usuario, result], (err, result) => {
            if (err) return res.status(500).send(err); // Retorna erro se a inserção falhar
            
            // Retorna o id, nome e email do usuário, mas **não** a senha
            res.status(201).json({ id: result.insertId, nome_usuario, email_usuario });
        });
    });
};
// READ
exports.getUsers = (req, res) => {
 db.query('SELECT nome_usuario, email_usuario FROM usuarios', (err, results) => {
 if (err) return res.status(500).send(err);
 res.json(results);
 });
};
// UPDATE
exports.updateUser = (req, res) => {
 const { id } = req.params;
 const { nome_usuario, email_usuario, senha_usuario } = req.body;
 const sql = 'UPDATE usuarios SET nome_usuario = ?, email_usuario = ? WHERE id= ?'
 db.query(sql, [nome_usuario, email_usuario, id], (err) => {
 if (err) return res.status(500).send(err);
 res.json({ id, nome_usuario, email_usuario });
 });
};
// DELETE
exports.deleteUser = (req, res) => {
 const { id } = req.params;
 const sql = 'DELETE FROM usuarios WHERE id = ?';
 db.query(sql, [id], (err) => {
 if (err) return res.status(500).send(err);
 res.json({ message: `Usuário com ID ${id} deletado` });
 });
}; 




exports.loginUser=(req,res)=>{
   
    db.query("select * from usuarios where nome_usuario=?",req.body.nome_usuario,(error,result)=>{
        if(error){
            return res.status(500).send({msg:`Erro ao tentativa de login ${error}`})
        }else if(result[0]==null){
            return res.status(400).send({msg:`Erro ao fazer login. Talvez o usuario ou senha não existe`})
        }else{
            bcrypt.compare(req.body.senha_usuario,result[0].senha_usuario).then((igual)=>{
                if(!igual){
                    return res.status(400).send({msg:`Erro ao fazer login. Talvez o usuario ou a senha estejam incorretos`})
                }
                else{
                    res.status(200).send({msg:`Usuario Logado`});
                };
            }).catch((error)=> res.status(500).send({msg:`Usuario ou senha`}));
        };
    });
};