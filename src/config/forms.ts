import { ROOT_URL } from "./constants";

export const FORMS = {
    Redirects: {
        login: ROOT_URL + '/auth/login',
        register: ROOT_URL + '/auth/register',
        forgotPassword: ROOT_URL + '/auth/forgot-password',
        resetPassword: ROOT_URL + '/auth/reset',
    },
    Inputs: {
        text: {
            type: 'text',
            label: '',
        },
        password: {
            type: 'password',
            label: 'Password',
        },
        email: {
            type: 'email',
            label: 'E-Mail',
        },
        number: {
            type: 'number',
            label: 'number',
        },
    },
    Buttons: {
        submit: {
            type: 'submit',
            label: 'Submit',
        },
        login: {
            type: 'submit',
            label: 'Login',
        },
        register: {
            type: 'submit',
            label: 'Sign-in',
        },
    },
    Selects: {},
    Textareas: {},
    Checkboxes: {},
    Radios: {},
    File: {
        type: 'file',
        label: 'File',
    },
    Links: {
        createAccount: {
            label: 'Create an account',
            href: '/auth/register',
        },
        forgotPassword: {
            label: 'Forgot your password?',
            href: '/auth/forgot-password',
        },
    },
};

console.log(FORMS);