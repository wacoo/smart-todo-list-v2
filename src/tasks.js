class Tasks {
  constructor() {
    this.index = 0;
    this.taskCollection = [];
  }

  addTask(task) {
    this.taskCollection.push(task);
    this.index += 1;
    this.storeData();
  }

  removeTask(idx) {
    this.taskCollection = this.taskCollection.filter((tsk) => tsk.index !== idx);
    this.index = 0;
    for (let j = 0; j < this.taskCollection.length; j += 1) {
      this.taskCollection[j].index = j;
      this.index += 1;
    }
    this.storeData();
  }

  storeData() {
    const strData = JSON.stringify(this.taskCollection);
    localStorage.setItem('data', strData);
  }

  restoreData() {
    const strData = localStorage.getItem('data');
    if (strData) {
      this.taskCollection = JSON.parse(strData);
    }
  }
}

export default new Tasks();
