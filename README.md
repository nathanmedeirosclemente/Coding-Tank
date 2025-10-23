# MarketPlace Priority Sorter (MPS)
### Problema
O VelozMart, grande empresa de logística, lançou uma feature que mostra em tempo real uma lista de pedidos aguardando expedição.
O objetivo é exibir os pedidos na ordem ótima para minimizar atrasos e custos logísticos. Cada pedido possui: priorityScore (0–100),
dispatchWindow (minutos restantes até prazo expirar), sizeCategory (P, M, G) que impacta espaço na doca de embalagem.

Cada pedido possui:
- **priorityScore** (0–100): nível de urgência.
- **dispatchWindow** (minutos restantes): tempo até o prazo expirar.
- **sizeCategory** (P, M, G): impacto no espaço na doca.

### Solução - Heap Multi-chave com Score Composto
O algoritmo utiliza uma **fila com Max-Heap**, permitindo inserções rápidas, expedições eficientes e atualizações dinâmicas de pedidos.

### Link Slide
- [Slide da Apresentação](https://www.canva.com/design/DAG2hKkwdes/WYA6WvEpd3yX-v2TeLRarw/view?utm_content=DAG2hKkwdes&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h8a856a9e5b)

### Estrutura do Repositório

- **pseudocodigo.md**: pseudocódigo do algoritmo de priorização de pedidos.
- **complexidade.md**: tabela detalhando a complexidade temporal, espacial e escalabilidade da solução.

### Justificativa
- **Heap com score** garante que todo pedido será processado eventualmente, com **latência estável no P99**, mesmo que o P50 seja mais rápido.  
- Facilita **debugging e troubleshooting** por manter uma única estrutura centralizada.  
- Nossa solução foi **recomendada para produção real**, prevenindo **starvation** e garantindo O(log n) previsível.  
- Permite comportamento **previsível em cenários de alta variância** e simplicidade em cargas baixas e uniformes.  
- Garante **não haver degradação em picos intensos**, tornando o desempenho previsível sob estresse e otimizando o tempo do desenvolvedor.

### Critérios de Ordenação

O MPS utiliza um **score composto dinâmico** baseado em três fatores:

- **priorityScore (0–100):** Prioriza pedidos urgentes, reduzindo atrasos para pedidos críticos.  
- **dispatchWindow (minutos restantes):** Evita expiração de prazos, mantendo P99 latency estável e throughput consistente.  
- **sizeCategory (P, M, G):** Otimiza o uso da doca, prevenindo congestionamentos e garantindo fluxo contínuo.  

**Resumo do efeito:** Equilíbrio entre urgência, prazo e espaço físico, resultando em atraso médio menor, throughput previsível e prevenção de starvation.


### Efeitos sobre Métricas Logísticas

| Métrica                        | Efeito da Ordenação do MPS                                                                                  |
|--------------------------------|-------------------------------------------------------------------------------------------------------------|
| **Atraso médio**               | Reduzido para pedidos urgentes e próximos do prazo; pedidos de baixa prioridade podem ter atraso maior.   |
| **P99 Latency / Máximo atraso** | Estável, pois o dispatchWindow garante que nenhum pedido extremo fique sem atendimento.                     |
| **Throughput por hora**        | Otimizado e previsível; a doca é utilizada eficientemente evitando congestionamentos ou ociosidade.       |
| **Starvation**                 | Prevenido: heap único garante que todo pedido será processado eventualmente, mesmo sob carga alta.       |
| **Variabilidade de latência**  | Reduzida: comportamento previsível em cenários de alta variância e picos de demanda.                       |

### Próximos Passos
- Otimização de Pesos via ML: Treinar modelo supervisionado com histórico de pedidos para ajustar P₁, P₂, P₃ dinamicamente por região/horário.
- Integração de Constraints: Adicionar camada pós-heap para validar capacidade de dock e agrupar pedidos por rota (bin packing aproximado).
- Re-priorização Inteligente: Implementar trigger events (novo pedido VIP, mudança de trânsito) para recalcular apenas subconjunto afetado do heap.
- Aprendizagem Online: Score adaptativo que aprende com feedback de atrasos reais (reinforcement learning leve).

## EXTRA
###  Como Rodar o Projeto HEAPMAX ANIMATION Localmente
<img width="1223" height="824" alt="Screenshot 2025-10-22 at 22 03 05" src="https://github.com/user-attachments/assets/728ff5f3-5454-47e8-a1a9-ca2d3343ea0a" />

**Observação: O código-fonte principal e as configurações do projeto (Vite/React) estão localizados no subdiretório **`heapmax-animation/`**.**

Siga os passos abaixo para instalar as dependências e iniciar o ambiente de desenvolvimento.

1. Acessar o Diretório do Projeto

Você deve navegar para a pasta onde estão os arquivos (subdiretório **`heapmax-animation/`**)

```bash
cd heapmax-animation
```
2. Instalar as Dependências

Usando seu gerenciador de pacotes (neste exemplo, usamos npm), instale as bibliotecas necessárias:

```bash
npm install
# Se você usa yarn, substitua por:
# yarn install
```

3. Iniciar o Servidor de Desenvolvimento

Execute o script de desenvolvimento. O projeto estará acessível no seu navegador, geralmente em http://localhost:3000 ou na porta que o terminal indicar.
```bash
npm run dev
# OU
# yarn dev
```
