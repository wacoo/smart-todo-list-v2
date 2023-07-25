class OneTask {
  constructor(description, completed, index) {
    this.description = description;
    this.completed = completed;
    this.index = index;
  }

  updateDescription(newDesc) {
    this.description = newDesc;
  }
}

export default OneTask;