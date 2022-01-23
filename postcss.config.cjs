const postcssCustomSelectors = require('postcss-custom-selectors');
const postcssMixins = require('postcss-mixins');
module.exports = {
    syntax: 'postcss-scss',
    plugins: [
        postcssCustomSelectors,
        postcssMixins
    ]
}