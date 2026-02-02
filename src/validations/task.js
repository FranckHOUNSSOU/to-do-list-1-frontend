import * as yup from 'yup';


export const intituleValidator = yup
.string()
.required("Tapez l'intitulé de votre tâche");

export const descriptionValidator = yup
.string()
.required("Décrivez votre tâche");

export const date_de_debutValidator = yup
.string()
.required("la date de début de votre tâche est requis");

export const date_de_finValidator = yup
.string()
.required("la date de fin de votre tâche est requis");