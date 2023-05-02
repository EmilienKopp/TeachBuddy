export const FORMS = {
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
            label: 'Register',
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
            href: '/forgot-password',
        },
    },
};