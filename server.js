const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost/supermercado', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB...'))
    .catch(err => console.error('Não foi possível conectar ao MongoDB...', err));

// Schema para Categoria
const categoriaSchema = new mongoose.Schema({
    nome: String
});
const Categoria = mongoose.model('Categoria', categoriaSchema);

// Schema para Produto
const produtoSchema = new mongoose.Schema({
    nome: String,
    preco: Number,
    quantidade: Number,
    categoria: { type: mongoose.Schema.Types.ObjectId, ref: 'Categoria' }
});
const Produto = mongoose.model('Produto', produtoSchema);

// CRUD para Categorias
app.post('/categorias', async (req, res) => {
    try {
        const categoria = new Categoria(req.body);
        await categoria.save();
        res.status(201).send(categoria);
    } catch (error) {
        res.status(400).send('Erro ao adicionar a categoria: ' + error.message);
    }
});

app.get('/categorias', async (req, res) => {
    const categorias = await Categoria.find();
    res.send(categorias);
});

// CRUD para Produtos
app.post('/produtos', async (req, res) => {
    try {
        const produto = new Produto(req.body);
        await produto.save();
        res.status(201).send(produto);
    } catch (error) {
        res.status(400).send('Erro ao adicionar o produto: ' + error.message);
    }
});

app.get('/produtos', async (req, res) => {
    const produtos = await Produto.find().populate('categoria');
    res.send(produtos);
});

app.get('/produtos/:id', async (req, res) => {
    const produto = await Produto.findById(req.params.id).populate('categoria');
    res.send(produto);
});

app.put('/produtos/:id', async (req, res) => {
    const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.send(produto);
});

app.delete('/produtos/:id', async (req, res) => {
    await Produto.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// Iniciar o servidor
app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
