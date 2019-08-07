### Version 1.3.7
- Dispatch `fulfill` even if worker was cancelled.
- Update docs

### Version 1.3.6
Update dependencies

### Version 1.3.5
Dispatch `start` with passed action. So now you can use yours `action` in the starts reducer.
For example to change the `loading` state.

[Example](https://github.com/shapkarin/shapkarin.me/blob/59fffc2ded9bd5d3f0b4242fa03e00c8ff2ecc84/src/Pages/Projects/reducers.js#L55)

### Version 1.3.4
remove default action for the `fulfill`

### Version 1.3.3
add `fulfill` and `cancel`

