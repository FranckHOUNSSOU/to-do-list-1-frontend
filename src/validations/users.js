import * as yup from 'yup';

export const emailValidator = yup
.string()
.email("mauvais format d'email")
.required("l'email est requis");

export const nomValidator = yup
.string()
.required("le nom est requis");

export const prenomValidator = yup
.string()
.required("le prénom est requis");

export const telephoneValidator = yup
.string()
.required("le téléphone est requis");

export const mot_de_passeValidator = yup
.string()
.required("le mot de passe est requis");
