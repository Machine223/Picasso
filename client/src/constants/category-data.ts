import {Category} from '../class/category';
import { FILES, TOOLS, WELCOME } from './subject-data';

export const TOOLS_C: Category = new Category('Outils', TOOLS);
export const FILES_C: Category = new Category('Fichier', FILES);
export const WELCOME_C: Category = new Category('Bienvenue', WELCOME);
export const categoriesArray: Category[] = [WELCOME_C, TOOLS_C , FILES_C];
