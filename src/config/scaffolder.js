
export const Scaffolder = {

    AppRail: {
        Tiles: [
            {
                name: 'Home',
                icon: 'house-door-fill',
                href: '/app/dashboard',
                label: 'ホーム'
            },
            {
                name: 'Flashcards',
                icon: 'card-heading',
                href: '/app/flashcards',
                label: 'flashcards'
            },
            {
                name: 'Account',
                icon: 'person-fill',
                href: '/app/account',
                label: 'アカウント'
            },
            {
                name: 'Generator',
                icon: 'robot',
                href: '/app/generator',
                label: '長文生成'
            },
            {
                name: 'Wordbook',
                icon: 'book',
                href: '/app/wordbook',
                label: '単語帳',
            },
            {
                name: 'Library',
                icon: 'bookshelf',
                href: '/app/library',
                label: '図書室'
            },
            {
                name: 'Bugs',
                icon: 'bug-fill',
                href: '/app/bugs',
                label: 'バグ報告',
                disabled: true,
            },
            {
                name: 'Friends',
                icon: 'people-fill',
                href: '/app/friends',
                label: '友達',
            },
            {
                name: 'Feedback',
                icon: 'envelope',
                href: '/app/feedback/message',
                label: 'フィードバック送信',
            },
            {
                name: 'Settings',
                icon: 'gear',
                href: '/app/settings',
                label: '設定',
                disabled: true,
            }
        ],
    },
    OptionsNav: [
        {
            name: 'General',
            icon: 'gear'
        },
        {
            name: 'Vocab Lists',
            icon: 'book'
        }
    ]

};