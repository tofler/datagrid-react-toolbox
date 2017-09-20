const path = require('path');
module.exports = {
    "extends": "airbnb",
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "env": {
        "browser": true,
        "node": true
    },
    "globals": {
        "google": true
    },
    "rules": {
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "indent": ["error", 4, {"SwitchCase": 1}],
        "jsx-a11y/no-autofocus": 0,
        "react/prop-types": [0],
        "react/require-default-props": 0,
        "react/no-array-index-key": 0,
        "no-console": ["error", {"allow": ["error"]}],
        "no-underscore-dangle": 0
    },
    "settings": {
        "import/resolver": {
            "webpack": {}
        },
    },
    "parser": "babel-eslint"
};