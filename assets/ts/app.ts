import '../styles/app.scss';
import { ItemManager } from './classes/ItemManager';
import * as fun from './fun';
import { Pagination } from './interfaces/Pagination';
require('@fortawesome/fontawesome-free/css/all.min.css');
require('@fortawesome/fontawesome-free/js/all.js');

declare global {
    interface Window { fun: any, itemManager: ItemManager, pagination: Pagination}
}

window.fun = fun
fun.buildThemeMenu()