function render({ model, el }) {
    function renderBoard() {
        const columns = model.get("columns") || [];
        const cards = model.get("cards") || [];

        el.innerHTML = '';

        const board = document.createElement('div');
        board.style.display = 'flex';
        board.style.gap = '20px';
        board.style.padding = '20px';
        board.style.background = '#f5f5f5';
        board.style.borderRadius = '8px';
        board.style.minHeight = '400px';

        columns.forEach(col => {
            const columnEl = document.createElement('div');
            columnEl.style.flex = '1';
            columnEl.style.background = '#e8e8e8';
            columnEl.style.borderRadius = '8px';
            columnEl.style.padding = '12px';
            columnEl.style.minHeight = '300px';
            columnEl.dataset.columnId = col.id;

            const header = document.createElement('h3');
            header.textContent = col.title;
            header.style.margin = '0 0 12px 0';
            header.style.color = '#333';
            header.style.fontFamily = 'Arial, sans-serif';
            columnEl.appendChild(header);

            const cardContainer = document.createElement('div');
            cardContainer.style.display = 'flex';
            cardContainer.style.flexDirection = 'column';
            cardContainer.style.gap = '8px';
            cardContainer.dataset.columnId = col.id;

            const colCards = cards.filter(card => card.column === col.id);

            if (colCards.length === 0) {
                const empty = document.createElement('div');
                // empty.textContent = '✧ No tasks';
                empty.style.color = '#999';
                empty.style.textAlign = 'center';
                empty.style.padding = '20px';
                empty.style.fontStyle = 'italic';
                cardContainer.appendChild(empty);
            } else {
                colCards.forEach(card => {
                    const cardEl = createCardElement(card);
                    cardContainer.appendChild(cardEl);
                });
            }

            cardContainer.addEventListener('dragover', handleDragOver);
            cardContainer.addEventListener('drop', handleDrop);

            columnEl.appendChild(cardContainer);
            board.appendChild(columnEl);
        });

        el.appendChild(board);
    }

    function createCardElement(card) {
        const cardEl = document.createElement('div');
        cardEl.draggable = true;
        cardEl.dataset.cardId = card.id;
        cardEl.style.background = 'white';
        cardEl.style.padding = '12px';
        cardEl.style.borderRadius = '6px';
        cardEl.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        cardEl.style.cursor = 'grab';
        cardEl.style.border = '1px solid #ddd';
        cardEl.style.transition = 'all 0.2s';

        const title = document.createElement('div');
        title.textContent = card.title;
        title.style.fontWeight = 'bold';
        title.style.color = '#333';
        title.style.fontFamily = 'Arial, sans-serif';
        cardEl.appendChild(title);

        if (card.desc) {
            const desc = document.createElement('div');
            desc.textContent = card.desc;
            desc.style.fontSize = '0.9em';
            desc.style.color = '#666';
            desc.style.marginTop = '4px';
            cardEl.appendChild(desc);
        }

        if (card.tags && Array.isArray(card.tags) && card.tags.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.style.display = 'flex';
            tagsContainer.style.flexWrap = 'wrap';
            tagsContainer.style.gap = '4px';
            tagsContainer.style.marginTop = '6px';

            card.tags.forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.textContent = tag;
                tagEl.style.fontSize = '0.75em';
                tagEl.style.color = '#333';
                tagEl.style.background = '#e8f0fe';
                tagEl.style.padding = '2px 8px';
                tagEl.style.borderRadius = '12px';
                tagEl.style.display = 'inline-block';
                tagEl.style.border = '1px solid rgba(0,0,0,0.05)';
                tagsContainer.appendChild(tagEl);
            });

            cardEl.appendChild(tagsContainer);
        }

        cardEl.addEventListener('dragstart', handleDragStart);
        cardEl.addEventListener('dragend', handleDragEnd);

        return cardEl;
    }

    let draggedCardId = null;

    function handleDragStart(e) {
        const cardEl = e.target.closest('[draggable="true"]');
        if (!cardEl) return;

        draggedCardId = cardEl.dataset.cardId;
        e.dataTransfer.setData('text/plain', draggedCardId);
        e.dataTransfer.effectAllowed = 'move';

        cardEl.style.opacity = '0.4';
        cardEl.style.transform = 'scale(0.95)';
    }

    function handleDragEnd(e) {
        const cardEl = e.target.closest('[draggable="true"]');
        if (cardEl) {
            cardEl.style.opacity = '1';
            cardEl.style.transform = 'scale(1)';
        }

        document.querySelectorAll('[data-column-id]').forEach(el => {
            el.style.background = '';
        });
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        const container = e.target.closest('[data-column-id]');
        if (container) {
            container.style.background = '#d4e8f7';
        }
    }

    function handleDrop(e) {
        e.preventDefault();

        const container = e.target.closest('[data-column-id]');
        if (!container) return;

        container.style.background = '';

        const cardId = e.dataTransfer.getData('text/plain');
        if (!cardId) return;

        const newColumnId = container.dataset.columnId;

        const cards = model.get('cards') || [];

        const updatedCards = cards.map(card => {
            if (card.id === cardId) {
                return { ...card, column: newColumnId };
            }
            return card;
        });

        model.set('cards', updatedCards);
        model.save_changes();
    }

    model.on('change:cards', renderBoard);
    model.on('change:columns', renderBoard);

    renderBoard();
}
export default { render };
