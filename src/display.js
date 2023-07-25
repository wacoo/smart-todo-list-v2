import OneTask from './one_task.js';
import tasks from './tasks.js';

const root = document.getElementById('parent');

class Display {
  createElement = (type, cls, id) => {
    const element = document.createElement(type);

    if (cls) {
      for (let i = 0; i < cls.length; i += 1) {
        element.classList.add(cls[i]);
      }
    }
    if (id) {
      element.id = id;
    }
    return element;
  };

  appendElement = (child, parent) => {
    parent.appendChild(child);
  };

  populatePage() {
    root.innerHTML = '';
    const h3 = this.createElement('h3', null, null);
    const head = this.createElement('div', ['head'], null);
    const ul = this.createElement('ul', null, null);
    const refresh = this.createElement(
      'i',
      ['refresh', 'fa', 'fa-refresh'],
      null,
    );
    const divInput = this.createElement('div', ['div_input'], null);
    const input = this.createElement('input', ['input'], 'input');
    const enter = this.createElement('span', ['enter'], 'enter');
    const divClearAll = this.createElement('div', ['div_clear_all'], null);
    const btnClear = this.createElement('button', 'clear', 'clear');

    h3.innerHTML = "Today's Todo";
    input.setAttribute('placeholder', 'Add your list...');
    enter.innerHTML = '&crarr;';

    this.appendElement(h3, head);
    this.appendElement(refresh, head);
    this.appendElement(input, divInput);
    this.appendElement(enter, divInput);
    this.appendElement(head, root);
    this.appendElement(divInput, root);

    for (let i = 0; i < tasks.taskCollection.length; i += 1) {
      const li = this.createElement('li', null, null);
      const chk = this.createElement('input', ['chk'], 'chk');
      const task = this.createElement('input', ['desc'], 'desc');
      const elipse = this.createElement(
        'i',
        ['elipse', 'fa', 'fa-ellipsis-v'],
        'elipse',
      );
      const can = this.createElement('i', ['can', 'fa', 'fa-trash'], `${i}`);

      chk.type = 'checkbox';
      chk.checked = tasks.taskCollection[i].completed;
      task.type = 'text';
      task.disabled = true;
      task.value = tasks.taskCollection[i].description;
      if (chk.checked) {
        task.classList.add('strike');
      } else {
        task.classList.remove('strike');
      }
      can.setAttribute('aria-hidden', 'true');
      this.appendElement(chk, li);
      this.appendElement(task, li);
      this.appendElement(elipse, li);
      this.appendElement(can, li);

      this.appendElement(li, ul);
      this.updateTask(task);
      this.addEnterListener(task);

      this.addCheckEventListener(chk, task, i);
    }
    this.appendElement(ul, root);
    btnClear.innerHTML = 'Clear all completed';
    this.appendElement(btnClear, divClearAll);
    this.appendElement(divClearAll, root);

    this.addEnterListener(input);
    this.clearButtonListener(btnClear);
    this.addEnterBtnClickListener(input);
  }

  addCheckEventListener(chk, tsk, idx) {
    chk.addEventListener('change', () => {
      if (chk.checked) {
        tasks.taskCollection[idx].completed = true;
        tsk.classList.add('strike');
        this.populatePage();
        tasks.storeData();
      } else {
        tasks.taskCollection[idx].completed = false;
        tsk.classList.remove('strike');
        this.populatePage();
        tasks.storeData();
      }
    });
  }

  addEnterBtnClickListener(tsk) {
    const btnEnter = document.getElementById('enter');
    btnEnter.addEventListener('click', () => {
      this.enterOrClickAction(tsk);
    });
  }

  addEnterListener(tsk) {
    tsk.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.enterOrClickAction(tsk);
      }
    });
  }

  enterOrClickAction(tsk) {
    if (tsk.value) {
      let input = null;
      let id = null;
      if (tsk.id !== 'desc') {
        input = document.getElementById('input');
      } else {
        id = this.returnSiblingwithClass(tsk, 'can').id;
      }
      if (tsk.id !== 'desc') {
        const task = new OneTask();
        task.description = input.value;
        task.completed = false;
        task.index = tasks.index;
        tasks.addTask(task);
      } else {
        tasks.taskCollection[id].description = tsk.value;
      }
      tasks.storeData();
      this.populatePage();
    }
  }

  updateTask(input) {
    const can = this.returnSiblingwithClass(input, 'can');
    const elipse = this.returnSiblingwithClass(input, 'elipse');
    const tsk = this.returnSiblingwithClass(input, 'desc');
    elipse.addEventListener('click', () => {
      tsk.disabled = false;
      can.style.display = 'block';
      elipse.style.display = 'none';
    });

    can.addEventListener('click', () => {
      tasks.removeTask(parseInt(can.id, 10));
      this.populatePage();
    });
  }

  returnSiblingwithClass = (elt, att = '') => {
    const parent = elt.parentNode;
    const children = parent.childNodes;

    for (let i = 0; i < children.length; i += 1) {
      if (children[i].classList.contains(att)) {
        return children[i];
      }
      if (children[i].id === att) {
        return children[i];
      }
    }
    return null;
  };

  removeAllCompleted = () => {
    for (let i = 0; i < tasks.taskCollection.length; i += 1) {
      const tsk = tasks.taskCollection[i];
      if (tsk.completed) {
        tasks.removeTask(i);
        i -= 1;
      }
    }
  };

  clearButtonListener(btnClear) {
    btnClear.addEventListener('click', () => {
      this.removeAllCompleted();
      this.populatePage();
    });
  }
}

export default Display;
