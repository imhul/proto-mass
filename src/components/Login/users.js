const users = [
    {
        isAdmin: true,
        login: "imhul",
        pass: "12121212",
        remember: true,
        id: "c308c2d2-173a-5a67-9deb-7bc0366ee17d",
        avatar: "data:image/png;base64,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"
    }
];

export default users;