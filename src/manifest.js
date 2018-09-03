/**
 * @see {@link https://developer.chrome.com/extensions/manifest}
 */
module.exports = {
    name: 'Treasure',
    description: 'Tron Browser Extension Wallet',
    author: 'TronWallet',
    version: '1.0.2',
    icons: {
        '16': 'icons/16.png',
        '32': 'icons/32.png',
        '48': 'icons/48.png',
        '128': 'icons/128.png'
    },
    /**
     * @see {@link https://developer.chrome.com/extensions/declare_permissions}
     */
    permissions: [
        'storage',
        'tabs'
    ],
    content_scripts: [
        {
            "matches" : ["<all_urls>"],
            "js": ["content.js"],
            "all_frames": true,
            "run_at": "document_start"

        }
    ],
    background: {
        "persistent": true,
        "scripts": [
            "background.js"
        ]
    },
    browser_action: {
        default_title: 'TronWallet',
        default_popup: 'popup.html'
    },
    manifest_version: 2,
    content_security_policy: "script-src 'self' 'unsafe-eval'; object-src 'self'"
}
