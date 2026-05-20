document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const categorySelect = document.getElementById('category-select');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'すべて';

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        
        const filteredTodos = todos.filter(todo => {
            if (currentFilter === 'すべて') return true;
            return todo.category === currentFilter;
        });

        filteredTodos.forEach((todo) => {
            // 元の配列でのインデックスを探す（削除・トグル用）
            const originalIndex = todos.indexOf(todo);
            
            const li = document.createElement('li');
            
            const span = document.createElement('span');
            span.textContent = todo.text;
            span.className = `todo-text ${todo.completed ? 'completed' : ''}`;
            span.addEventListener('click', () => toggleTodo(originalIndex));

            const badge = document.createElement('span');
            badge.textContent = todo.category || 'その他';
            badge.className = `category-badge ${todo.category || 'その他'}`;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '削除';
            deleteBtn.className = 'delete-btn';
            deleteBtn.addEventListener('click', () => deleteTodo(originalIndex));

            li.appendChild(span);
            li.appendChild(badge);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
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

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter');
            renderTodos();
        });
    });

    renderTodos();
});
