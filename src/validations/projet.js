import * as yup from 'yup';


export const intituleProjetValidator = yup
.string()
.required("Tapez l'intitulé de votre projet");

export const descriptionProjetValidator = yup
.string()
.required("Décrivez votre projet");

export const date_de_debutProjetValidator = yup
.string()
.required("la date de début de votre projet est requis");

export const date_de_finProjetValidator = yup
.string()
.required("la date de fin de votre projet est requis");

export const intituleTaskProjetValidator = yup
.string()
.required("l'intitulé de la tâche est requis");

export const descriptionTaskProjetValidator = yup
.string()
.required("Décrivez votre tâche");
