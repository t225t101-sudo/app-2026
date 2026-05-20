document.addEventListener('DOMContentLoaded', () => {
    // --- Todo Logic ---
    const todoInput = document.getElementById('todo-input');
    const categorySelect = document.getElementById('category-select');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    
    const totalCountEl = document.getElementById('total-count');
    const completedCountEl = document.getElementById('completed-count');
    const remainingCountEl = document.getElementById('remaining-count');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const updateStats = () => {
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const remaining = total - completed;

        if (totalCountEl) totalCountEl.textContent = total;
        if (completedCountEl) completedCountEl.textContent = completed;
        if (remainingCountEl) remainingCountEl.textContent = remaining;
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        const sortedTodos = [...todos].sort((a, b) => a.completed - b.completed);

        sortedTodos.forEach((todo) => {
            const originalIndex = todos.findIndex(t => t === todo);
            const li = document.createElement('li');
            
            const span = document.createElement('span');
            span.textContent = todo.text;
            span.className = `todo-text ${todo.completed ? 'completed' : ''}`;
            span.addEventListener('click', () => toggleTodo(originalIndex));

            const badge = document.createElement('span');
            badge.textContent = todo.category;
            badge.className = `category-badge ${todo.category}`;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '削除';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteTodo(originalIndex));

            li.appendChild(span);
            li.appendChild(badge);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });

        updateStats();
    };

    const addTodo = () => {
        const text = todoInput.value.trim();
        const category = categorySelect.value;
        if (text) {
            todos.push({ text, category, completed: false });
            todoInput.value = '';
            saveTodos();
            renderTodos();
        }
    };

    const toggleTodo = (index) => {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    };

    const deleteTodo = (index) => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    };

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    // --- Diary Logic ---
    const diaryInput = document.getElementById('diary-input');
    const saveDiaryBtn = document.getElementById('save-diary-btn');
    const diaryList = document.getElementById('diary-list');

    let diaries = JSON.parse(localStorage.getItem('diaries')) || [];

    const saveDiaries = () => {
        localStorage.setItem('diaries', JSON.stringify(diaries));
    };

    const renderDiaries = () => {
        diaryList.innerHTML = '';
        
        if (diaries.length === 0) return;

        // 日付ごとにグループ化
        const groups = {};
        diaries.forEach((diary, index) => {
            const datePart = diary.date.split(' ')[0]; // YYYY/MM/DD
            if (!groups[datePart]) {
                groups[datePart] = [];
            }
            groups[datePart].push({ ...diary, originalIndex: index });
        });

        // 日付の降順（新しい順）でグループを処理
        const sortedDates = Object.keys(groups).sort().reverse();

        sortedDates.forEach(date => {
            const dateGroup = document.createElement('div');
            dateGroup.className = 'date-group';

            const header = document.createElement('div');
            header.className = 'date-group-header';
            
            const title = document.createElement('span');
            title.className = 'date-group-title';
            title.textContent = date;
            
            header.appendChild(title);
            dateGroup.appendChild(header);

            // 同じ日の中では新しい順に表示
            const sortedEntries = groups[date].reverse();

            sortedEntries.forEach(diary => {
                const card = document.createElement('div');
                card.className = 'diary-card';

                const cardHeader = document.createElement('div');
                cardHeader.className = 'diary-header';

                const timeSpan = document.createElement('span');
                timeSpan.className = 'diary-time';
                timeSpan.textContent = diary.date.split(' ')[1]; // HH:mm

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-diary-btn';
                deleteBtn.textContent = '削除';
                deleteBtn.addEventListener('click', () => deleteDiary(diary.originalIndex));

                const headerLeft = document.createElement('div');
                headerLeft.appendChild(timeSpan);

                cardHeader.appendChild(headerLeft);
                cardHeader.appendChild(deleteBtn);

                const content = document.createElement('div');
                content.className = 'diary-content';
                content.textContent = diary.content;

                card.appendChild(cardHeader);
                card.appendChild(content);
                dateGroup.appendChild(card);
            });

            diaryList.appendChild(dateGroup);
        });
    };

    const saveDiary = () => {
        const content = diaryInput.value.trim();
        if (content) {
            const now = new Date();
            const dateStr = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            
            diaries.push({
                content,
                date: dateStr
            });
            
            diaryInput.value = '';
            saveDiaries();
            renderDiaries();
        }
    };

    const deleteDiary = (index) => {
        if (confirm('この日記を削除してもよろしいですか？')) {
            diaries.splice(index, 1);
            saveDiaries();
            renderDiaries();
        }
    };

    saveDiaryBtn.addEventListener('click', saveDiary);

    // Initial Render
    renderTodos();
    renderDiaries();
});
