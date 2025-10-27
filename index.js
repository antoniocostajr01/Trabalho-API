const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let dataBase = {
    areasDeConhecimento: [
        {id: 1, nome: 'Ciências Exatas e da Terra', descricao: 'Área que abrange matemática, física, química, etc.'},
        {id: 2, nome: 'Ciências Humanas', descricao: 'Área focada no estudo da sociedade, cultura e pensamento humano.'}
    ],
    cursos: [],
    disciplinas: [],
    matrizes: [], 
    usuarios: []
};

let nextAreaId = 3;
let nextCursoId = 1;
let nextDisciplinaId = 1;
let nextMatrizId = 1;
let nextUsuarioId = 1;

//CREATE: Cria nova área de conhecimento
app.post('/areas', (req, res) => {
    const {nome, descricao} = req.body;
    if (!nome || !descricao) {
        return res.status(400).json({erro: "Nome e descrição são orbigatórios."})
    }

    const novaArea = {id: nextAreaId++, nome, descricao};
    dataBase.areasDeConhecimento.push(novaArea);
    res.status(201).json(novaArea);
});

//READ(All): Lista todas as áreas de conhecimento
app.get('/areas', (req, res) => {
    res.json(dataBase.areasDeConheciment);
});


//READ(byID): Busca as áreas por ID
app.get('/areas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const area = dataBase.areasDeConhecimento.find(a => a.id === id);
    if (!area) {
        return res.status(404).json({erro: 'Área de conhecimento não encontrada'});
    }

    res.json(area);
})

//UPDATE - Atualiza uma área de conhecimento existente
app.put('/areas/:id', (req, res) => {
    const id = parseInt(req.params.id);

    //Pega o corpo (body) da requisição — ou seja, os dados enviados pelo Postman.
    const { nome, descricao } = req.body;


    const area = dataBase.areasDeConhecimento.find(a => a.id === id);

    if (!area){
        return res.status(404).json({erro: 'Área de conhecimento não encontrada'});
    }

    if (!nome || !descricao){
        return res.status(404).json({erro: 'Nome e descrição são obrigatórios para atualização'});
    }

    area.nome = nome;
    area.descricao = descricao;

    res.json(area);

});

//DELETE: Deletar uma área de conhecimento
app.delete('/areas/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = dataBase.areasDeConhecimento.findIndex(a => a.id === id);

    if (index === -1){
        return res.status(404).json({ erro: 'Área de conhecimento não encontrada.' });
    }

    dataBase.areasDeConhecimento.splice(index, 1)

    //A resposta padrão para sucesso em DELETE é 204 No Content

    res.status(204).send();
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});




