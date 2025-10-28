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
    res.json(dataBase.areasDeConhecimento);
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

app.post('/cursos', (req, res) => {
    const { nome, descricao, areaDeConhecimentoId, cargaHoraria, semestres, modalidade } = req.body;

   
    if (!nome || !descricao || !areaDeConhecimentoId || !cargaHoraria || !semestres || !modalidade) {
        return res.status(400).json({ erro: "Todos os campos são obrigatórios: nome, descricao, areaDeConhecimentoId, cargaHoraria, semestres, modalidade." });
    }

    const area = dataBase.areasDeConhecimento.find(a => a.id === parseInt(areaDeConhecimentoId));
    if (!area) {
        return res.status(400).json({ erro: "A Área de Conhecimento especificada não existe." });
    }

    const novoCurso = {
        id: nextCursoId++,
        nome,
        descricao,
        areaDeConhecimentoId: parseInt(areaDeConhecimentoId),
        cargaHoraria,
        semestres,
        modalidade
    };

    dataBase.cursos.push(novoCurso);
    res.status(201).json(novoCurso);
});

// R - READ (All): Lista todos os cursos
app.get('/cursos', (req, res) => {
    res.json(dataBase.cursos);
});

// R - READ (by ID): Busca um curso pelo ID
app.get('/cursos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const curso = dataBase.cursos.find(c => c.id === id);
    if (!curso) {
        return res.status(404).json({ erro: 'Curso não encontrado.' });
    }
    res.json(curso);
});

// U - UPDATE: Atualiza um curso existente
app.put('/cursos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, descricao, areaDeConhecimentoId, cargaHoraria, semestres, modalidade } = req.body;
    
    const curso = dataBase.cursos.find(c => c.id === id);
    if (!curso) {
        return res.status(404).json({ erro: 'Curso não encontrado.' });
    }
    
    const area = dataBase.areasDeConhecimento.find(a => a.id === parseInt(areaDeConhecimentoId));
    if (!area) {
        return res.status(400).json({ erro: "A Área de Conhecimento especificada não existe." });
    }

    curso.nome = nome;
    curso.descricao = descricao;
    curso.areaDeConhecimentoId = parseInt(areaDeConhecimentoId);
    curso.cargaHoraria = cargaHoraria;
    curso.semestres = semestres;
    curso.modalidade = modalidade;

    res.json(curso);
});

// D - DELETE: Deleta um curso
app.delete('/cursos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = dataBase.cursos.findIndex(c => c.id === id);
    
    if (index === -1) {
        return res.status(404).json({ erro: 'Curso não encontrado.' });
    }

    dataBase.cursos.splice(index, 1);
    res.status(204).send();
});

// ------------------------------------------
//         ROTAS DE DISCIPLINA (CRUD + REGRA DE NEGÓCIO)
// ------------------------------------------

// C - CREATE: Cria uma nova disciplina
app.post('/disciplinas', (req, res) => {
    const { nome, descricao, cargaHoraria, semestre, cursoId } = req.body;

    // 1. Validação dos campos obrigatórios
    if (!nome || !descricao || !cargaHoraria || !semestre || !cursoId) {
        return res.status(400).json({ erro: "Campos obrigatórios: nome, descricao, cargaHoraria, semestre, cursoId." });
    }

    // 2. Validação de relacionamento: Verifica se o Curso existe
    const curso = dataBase.cursos.find(c => c.id === parseInt(cursoId));
    if (!curso) {
        return res.status(400).json({ erro: "O curso especificado não existe." });
    }

    // 3. IMPLEMENTAÇÃO DA REGRA DE NEGÓCIO (RN)
    if (parseInt(semestre) > curso.semestres) {
        return res.status(400).json({ 
            erro: `Regra de Negócio violada: O semestre (${semestre}) não pode ser maior que a quantidade de semestres do curso (${curso.semestres}).` 
        });
    }

    const novaDisciplina = {
        id: nextDisciplinaId++,
        nome,
        descricao,
        cargaHoraria,
        semestre: parseInt(semestre),
        cursoId: parseInt(cursoId)
    };

    dataBase.disciplinas.push(novaDisciplina);
    res.status(201).json(novaDisciplina);
});

// R - READ (All): Lista todas as disciplinas
app.get('/disciplinas', (req, res) => {
    res.json(dataBase.disciplinas);
});

// R - READ (by ID): Busca uma disciplina pelo ID
app.get('/disciplinas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const disciplina = dataBase.disciplinas.find(d => d.id === id);
    if (!disciplina) {
        return res.status(404).json({ erro: 'Disciplina não encontrada.' });
    }
    res.json(disciplina);
});

// U - UPDATE: Atualiza uma disciplina existente
app.put('/disciplinas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { nome, descricao, cargaHoraria, semestre, cursoId } = req.body;

    const disciplina = dataBase.disciplinas.find(d => d.id === id);
    if (!disciplina) {
        return res.status(404).json({ erro: 'Disciplina não encontrada.' });
    }

    const curso = dataBase.cursos.find(c => c.id === parseInt(cursoId));
    if (!curso) {
        return res.status(400).json({ erro: "O curso especificado não existe." });
    }

    // A MESMA REGRA DE NEGÓCIO SE APLICA AQUI
    if (parseInt(semestre) > curso.semestres) {
        return res.status(400).json({ 
            erro: `Regra de Negócio violada: O semestre (${semestre}) não pode ser maior que a quantidade de semestres do curso (${curso.semestres}).` 
        });
    }
    
    // Atualiza os dados
    disciplina.nome = nome;
    disciplina.descricao = descricao;
    disciplina.cargaHoraria = cargaHoraria;
    disciplina.semestre = parseInt(semestre);
    disciplina.cursoId = parseInt(cursoId);

    res.json(disciplina);
});

// D - DELETE: Deleta uma disciplina
app.delete('/disciplinas/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = dataBase.disciplinas.findIndex(d => d.id === id);
    
    if (index === -1) {
        return res.status(404).json({ erro: 'Disciplina não encontrada.' });
    }

    dataBase.disciplinas.splice(index, 1);
    res.status(204).send();
});



app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
});
