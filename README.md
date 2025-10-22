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

### Estrutura do Repositório
```
  - pseudocodigo.md // pseudocódigo do algoritmo de priorização de pedidos.
  - complexidade.md // tabela detalhando a complexidade temporal, espacial e escalabilidade da solução.
```

### Justificativa
- **Heap com score** garante que todo pedido será processado eventualmente, com **latência estável no P99**, mesmo que o P50 seja mais rápido.  
- Facilita **debugging e troubleshooting** por manter uma única estrutura centralizada.  
- Nossa solução foi **recomendada para produção real**, prevenindo **starvation** e garantindo O(log n) previsível.  
- Permite comportamento **previsível em cenários de alta variância** e simplicidade em cargas baixas e uniformes.  
- Garante **não haver degradação em picos intensos**, tornando o desempenho previsível sob estresse e otimizando o tempo do desenvolvedor.  

### Próximos Passos
- Otimização de Pesos via ML: Treinar modelo supervisionado com histórico de pedidos para ajustar P₁, P₂, P₃ dinamicamente por região/horário.
- Integração de Constraints: Adicionar camada pós-heap para validar capacidade de dock e agrupar pedidos por rota (bin packing aproximado).
- Re-priorização Inteligente: Implementar trigger events (novo pedido VIP, mudança de trânsito) para recalcular apenas subconjunto afetado do heap.
- Dashboard de Acessibilidade: Interface com contraste alto (WCAG AAA), leitores de tela e indicadores visuais para operadores com daltonismo.
- Aprendizagem Online: Score adaptativo que aprende com feedback de atrasos reais (reinforcement learning leve).
