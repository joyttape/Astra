// backend/routes/carrinho.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Retorna os itens do carrinho
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT cp.id, p.nome, cp.quantidade, cp.preco_unitario, cp.subtotal
      FROM carrinho_produto cp
      JOIN produto p ON cp.produto_id = p.id
      WHERE cp.carrinho_id = 1
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar carrinho');
  }
});

// Adiciona um item ao carrinho (por RFID)
router.post('/adicionar', async (req, res) => {
  const { rfid_codigo } = req.body;

  try {
    const [produtoRows] = await db.execute(
      'SELECT * FROM produto WHERE rfid_codigo = ?',
      [rfid_codigo]
    );

    if (produtoRows.length === 0) {
      return res.status(404).json({ erro: 'Produto não encontrado' });
    }

    const produto = produtoRows[0];
    const carrinhoId = 1; // fixo para exemplo

    // Verifica se já existe no carrinho
    const [existenteRows] = await db.execute(
      'SELECT * FROM carrinho_produto WHERE carrinho_id = ? AND produto_id = ?',
      [carrinhoId, produto.id]
    );

    if (existenteRows.length > 0) {
      // Atualiza quantidade
      await db.execute(
        'UPDATE carrinho_produto SET quantidade = quantidade + 1 WHERE carrinho_id = ? AND produto_id = ?',
        [carrinhoId, produto.id]
      );
    } else {
      // Insere novo item
      await db.execute(
        `INSERT INTO carrinho_produto (carrinho_id, produto_id, quantidade, preco_unitario)
         VALUES (?, ?, 1, ?)`,
        [carrinhoId, produto.id, produto.preco]
      );
    }

    res.status(200).json({ mensagem: 'Produto adicionado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao adicionar produto ao carrinho');
  }
});

module.exports = router;
