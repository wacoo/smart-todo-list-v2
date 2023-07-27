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
    const elemList = {
      h3: ['h3', null, null, 'head'],
      head: ['div', ['head'], null],
      ul: ['ul', null, null],
      refresh: ['i', ['refresh', 'fa', 'fa-refresh'], null],
      divInput: ['div', ['div_input'], null],
      input: ['input', ['input'], 'input'],
      enter: ['span', ['enter'], 'enter'],
      divClearAll: ['div', ['div_clear_all'], null],
      btnClear: ['button', 'clear', 'clear'],
    };

    const elem = this.batchCreateElements(elemList);
    elem.h3.innerHTML = "Today's Todo";
    elem.input.setAttribute('placeholder', 'Add your list...');
    elem.enter.innerHTML = '&crarr;';

    const appendablesList = [
      { child: elem.h3, parent: elem.head },
      { child: elem.refresh, parent: elem.head },
      { child: elem.input, parent: elem.divInput },
      { child: elem.enter, parent: elem.divInput },
      { child: elem.head, parent: root },
      { child: elem.divInput, parent: root },
      { child: elem.ul, parent: root },
      { child: elem.btnClear, parent: elem.divClearAll },
      { child: elem.divClearAll, parent: root },
    ];
    this.batchAppend(appendablesList);

    this.addEnterListener(elem.input);
    this.clearButtonListener(elem.btnClear);
    this.addEnterBtnClickListener(elem.input);

    for (let i = 0; i < tasks.taskCollection.length; i += 1) {
      const elemListTask = {
        li: ['li', null, null],
        chk: ['input', ['chk'], 'chk'],
        task: ['input', ['desc'], 'desc'],
        elipse: ['i', ['elipse', 'fa', 'fa-ellipsis-v'], 'elipse'],
        can: ['i', ['can', 'fa', 'fa-trash'], `${i}`],
      };

      const elemTask = this.batchCreateElements(elemListTask);

      elemTask.chk.type = 'checkbox';
      elemTask.chk.checked = tasks.taskCollection[i].completed;
      elemTask.task.type = 'text';
      elemTask.task.disabled = true;
      elemTask.task.value = tasks.taskCollection[i].description;
      if (elemTask.chk.checked) {
        elemTask.task.classList.add('strike');
      } else {
        elemTask.task.classList.remove('strike');
      }
      elemTask.can.setAttribute('aria-hidden', 'true');
      const appendablesListTask = [
        { child: elemTask.chk, parent: elemTask.li },
        { child: elemTask.task, parent: elemTask.li },
        { child: elemTask.elipse, parent: elemTask.li },
        { child: elemTask.elipse, parent: elemTask.li },
        { child: elemTask.can, parent: elemTask.li },
        { child: elemTask.li, parent: elem.ul },

      ];

      this.batchAppend(appendablesListTask);

      this.updateTask(elemTask.task);
      this.addEnterListener(elemTask.task);
      this.addCheckEventListener(elemTask.chk, elemTask.task, i);
    }

    elem.btnClear.innerHTML = 'Clear all completed';
  }

  batchCreateElements(elemList) {
    const elem = {};
    const kvp = Object.entries(elemList);
    kvp.forEach(([key, val]) => {
      elem[key] = this.createElement(...val);
    });
    return elem;
  }

  batchAppend(appendablesList) {
    appendablesList.forEach((item) => {
      this.appendElement(item.child, item.parent);
    });
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