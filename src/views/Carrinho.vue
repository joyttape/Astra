eu queria que ficasse tudo no centro da tela, porque não tá?: <template>
  <div class="container">
    <div class="etapas">
      <div class="passo" @click="irParaPagina('carrinho')">
        <img :src="carrinhosIcon" alt="Carrinho" />
        <span>Passo 1:<br />Carrinho</span>
      </div>
      <div class="passo inativo" @click="irParaPagina('pagamento')">
        <img :src="carteiraIcon" alt="Pagamento" />
        <span>Passo 2:<br />Pagamento</span>
      </div>
    </div>

    <div class="conteudo">
      <div class="produtos">
        <h2>Carrinho de compras</h2>
        <table>
          <thead>
            <tr>
              <th>Produto</th> <!-- Corrigi para ter título aqui -->
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Total</th>
              <th></th> <!-- Para o botão de remover -->
            </tr>
          </thead>
          <tbody>
            <tr v-for="(produto, index) in carrinho" :key="produto.id">
              <td>
                <span>{{ produto.nome }}</span>
              </td>
              <td>R$ {{ produto.preco.toFixed(2) }}</td>
              <td>
                <button @click="alterarQtd(index, -1)">-</button>
                {{ produto.quantidade }}
                <button @click="alterarQtd(index, 1)">+</button>
              </td>
              <td>R$ {{ (produto.preco * produto.quantidade).toFixed(2) }}</td>
              <td>
                <button @click="remover(index)" aria-label="Remover produto">✕</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="resumo">
        <div class="sacola" @click="mostrarSacola = !mostrarSacola">
          Sacola <span>{{ mostrarSacola ? '▲' : '▼' }}</span>
        </div>
        <div v-if="mostrarSacola" class="detalhes-sacola">
          <p>Quantidade de Itens: <strong>{{ totalItens }}</strong></p>
          <p>Quantidade de Produtos: <strong>{{ quantidadeProdutos }}</strong></p>
          <p>Valor total: <strong>R$ {{ totalGeral.toFixed(2) }}</strong></p>
        </div>
        <router-link to="/carrinho/pagamento" class="btn-pagamento">
          <span>Ir para pagamento</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Importação das imagens SVG para evitar problemas com caminho
import carrinhosIcon from '@/assets/carrinhos.svg'
import carteiraIcon from '@/assets/carteira.svg'

const router = useRouter()
const mostrarSacola = ref(false)
const carrinho = ref([])

onMounted(async () => {
  await carregarCarrinho()
})

async function carregarCarrinho() {
  try {
    const res = await fetch('http://localhost:3000/api/carrinho')
    const data = await res.json()
    carrinho.value = data
  } catch (err) {
    console.error('Erro ao carregar carrinho:', err)
  }
}

const totalItens = computed(() =>
  carrinho.value.reduce((acc, p) => acc + p.quantidade, 0)
)

const totalGeral = computed(() =>
  carrinho.value.reduce((acc, p) => acc + p.quantidade * p.preco, 0)
)

function alterarQtd(index, delta) {
  const item = carrinho.value[index]
  if (item.quantidade + delta >= 1) {
    item.quantidade += delta
  }
}

function remover(index) {
  carrinho.value.splice(index, 1)
}

function irParaPagina(destino) {
  if (destino === 'carrinho') router.push('/carrinho')
  if (destino === 'pagamento') router.push('/carrinho/pagamento')
}

const quantidadeProdutos = computed(() => carrinho.value.length)
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  font-family: 'Montserrat', sans-serif;
  box-sizing: border-box;
}

.etapas {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
}

.passo {
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 10px;
}

.passo img {
  width: 60px;
  height: 60px;
  border-radius: 20%;
  background-color: #9747ff;
  padding: 10px;
  object-fit: contain;
}

.passo.inativo {
  opacity: 0.5;
}

.conteudo {
  max-width: 1200px;
  width: 100%;
  display: flex;
  gap: 2rem;
  justify-content: center;
}

.produtos {
  flex: 1;
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 10px;
  max-width: 800px;
}

.produtos table {
  width: 100%;
  border-collapse: collapse;
}

.produtos img {
  width: 50px;
  height: auto;
  margin-right: 10px;
  vertical-align: middle;
}

.produtos td,
.produtos th {
  padding: 1.5rem;
  text-align: left;
  vertical-align: middle;
}

.produtos td button {
  margin: 0 5px;
}

.resumo {
  width: 350px;
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: 10px;
  height: fit-content;
}

.sacola {
  background-color: #ddd;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
}

.detalhes-sacola {
  margin-bottom: 2rem;
}

.btn-pagamento {
  display: inline-block;
  text-decoration: none;
  background-color: #05d950;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 1.2rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  width: 100%;
  white-space: nowrap;
}

button {
  background-color: #05d950;
  border: none;
  padding: 0.5rem;
  border-radius: 0.2rem;
  width: 25px;
  color: #f5f5f5;
  cursor: pointer;
}

@media (max-width: 1200px) {
  .conteudo {
    flex-direction: column;
    align-items: center;
  }
  
  .produtos,
  .resumo {
    width: 100%;
    max-width: 100%;
  }
}
</style>