import './style.css';
import tasks from './tasks.js';
import Display from './display.js';

const display = new Display();

tasks.restoreData();
display.populatePage();