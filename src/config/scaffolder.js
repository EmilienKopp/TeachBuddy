


export const Scaffolder = {

    AppRail: {
        Tiles: [
            {
                name: 'home',
                icon: 'house-door-fill',
                href: '/app/dashboard',
                label: 'ホーム'
            },
            // {
            //     name: 'Flashcards',
            //     icon: 'card-heading',
            //     href: '/app/flashcards',
            //     label: 'flashcards'
            // },
            {
                name: 'generator',
                icon: 'robot',
                href: '/app/generator',
                label: '長文生成'
            },
            {
                name: 'study',
                icon: 'book',
                href: '/app/library',
                label: '勉強',
            },
            {
                name: 'library',
                icon: 'bookshelf',
                href: '/app/library',
                label: '図書室',
                disabled: true,
            },
            {
                name: 'bugs',
                icon: 'bug-fill',
                href: '/app/bugs',
                label: 'バグ報告',
                disabled: true,
            },
            {
                name: 'friends',
                icon: 'emoji-smile-fill',
                href: '/app/friends',
                label: 'フレンド',
            },
            {
                name: 'account',
                icon: 'person-fill',
                href: '/app/account',
                label: 'アカウント'
            },
            {
                name: 'feedback',
                icon: 'envelope',
                href: '/app/feedback/message',
                label: 'フィードバック送信',
            },
            {
                name: 'settings',
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