# Introdução às Tabelas de Complexidade do MPS

### Cada pedido possui:
- priorityScore (0–100): nível de urgência do pedido. 
- dispatchWindow (minutos restantes): tempo até o prazo de expedição expirar. 
- sizeCategory (P, M, G): impacto no espaço disponível na doca de embalagem.

### Para exibir os pedidos na ordem ótima, minimizando atrasos e custos, o MPS utiliza um Max-Heap, permitindo:
- Inserção rápida de novos pedidos.
- Expedição eficiente do pedido de maior prioridade.
- Atualização dinâmica de pedidos existentes.
As tabelas a seguir detalham complexidade temporal, complexidade espacial e escalabilidade, fornecendo uma visão clara do desempenho esperado do MPS em cenários de grande volume de pedidos.

| Operação                | Complexidade        | Observações                                      |
|-------------------------|------------------|-------------------------------------------------|
| Inserção                | O(log n)         | Inserir um novo pedido no heap                  |
| Expedição (pop)         | O(log n)         | Remover o elemento de maior prioridade         |
| Atualização             | O(log n)         | Com *index map* é possível ajustar posição     |
| Reconstrução completa   | O(n log n)       | Recriar o heap do zero no pior caso            |

| Estrutura       | Complexidade | Observações                               |
|----------------|-------------|-------------------------------------------|
| Heap           | O(n)        | Armazena todos os pedidos                  |
| Index Map      | O(n)        | Auxiliar para localizar rapidamente pedidos|
| Total          | O(n)        | Memória adicional linear                  |

| Métrica                  | Valor                 | Observações                                  |
|---------------------------|---------------------|---------------------------------------------|
| Nº de pedidos simultâneos | 10.000              | Cenário típico de fila grande               |
| Comparações por operação  | ~13 (log₂ 10.000)    | Cada operação percorre cerca de 13 níveis  |
| Latência estimada         | < 1 ms              | Considerando CPU moderna                     |
