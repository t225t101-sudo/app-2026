document.addEventListener('DOMContentLoaded', () => {
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

        totalCountEl.textContent = total;
        completedCountEl.textContent = completed;
        remainingCountEl.textContent = remaining;
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        
        // 完了したタスクを下に並び替える
        const sortedTodos = [...todos].sort((a, b) => a.completed - b.completed);

        sortedTodos.forEach((todo) => {
            // 元の配列での実際のインデックスを取得（トグル・削除用）
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

    renderTodos();
});
