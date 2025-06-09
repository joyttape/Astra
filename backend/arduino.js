const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const pool = require('./db');

const port = new SerialPort('/dev/ttyUSB0', { baudRate: 9600 }); // ajuste a porta
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

parser.on('data', async (rfid) => {
  console.log('RFID recebido:', rfid);

  try {
    // Busca o produto pelo RFID
    const [produtos] = await pool.query('SELECT * FROM produto WHERE rfid_codigo = ?', [rfid]);
    if (produtos.length === 0) {
      console.log('Produto não encontrado para RFID:', rfid);
      return;
    }

    const produto = produtos[0];

    // Usa sempre o carrinho de ID 1 para este exemplo
    const carrinhoId = 1;

    // Verifica se produto já está no carrinho
    const [itens] = await pool.query(
      'SELECT * FROM carrinho_produto WHERE carrinho_id = ? AND produto_id = ?',
      [carrinhoId, produto.id]
    );

    if (itens.length > 0) {
      await pool.query(
        'UPDATE carrinho_produto SET quantidade = quantidade + 1 WHERE id = ?',
        [itens[0].id]
      );
    } else {
      await pool.query(
        'INSERT INTO carrinho_produto (carrinho_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)',
        [carrinhoId, produto.id, 1, produto.preco]
      );
    }

    console.log(`Produto ${produto.nome} adicionado ao carrinho.`);
  } catch (err) {
    console.error('Erro ao processar RFID:', err);
  }
});
