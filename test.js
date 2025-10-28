const express = require('express');

const app = express();

const port = 3000;


//Por padrão, o Express não entende automaticamente o corpo (body) das requisições POST.
//Preciso adicionar um “middleware” (ou tradutor) que permite isso.
//Ela faz o Express entender dados enviados no formato JSON pelo Postman.
app.use(express.json());


///ENDPOINTS:


//GET
//Define uma rota (endpoint) principal do tipo GET
app.get('/', (req, res) => {
    res.send("Servidor ta funcionando")
});

// Rota para listar usuários
app.get('/users', (req, res) => {
    const users = [
        {id: 1, nome: 'Maria'},
        {id: 2, nome: 'João'},
        {id: 3, nome: 'Ana'}
    ];


    //Diferente do res.send(), o res.json() envia a resposta no formato JSON
    //(o padrão de comunicação entre APIs e clientes).

    res.json(users);
})



//POST
app.post('/users', (req, res) => {

    // /Pega o corpo (body) da requisição — ou seja, os dados enviados pelo Postman.
    const newUser = req.body;

    console.log(`Usuário recebido: ${JSON.stringify(newUser)}`);

    //Envia uma resposta em JSON com uma mensagem e os dados recebidos.
    res.status(201).json({
        message: 'User registered',
        user: newUser
    });
});


///SERVER INITIALIZER

// Inicia o servidor e o faz "escutar" na porta definida
app.listen(port, () => {
    console.log("Servidor rodando na porta 3000")
});

