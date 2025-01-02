## Example

```
npx codemod @reyronald/codemod-absolute-to-relative-imports
```

### Before

```ts
import Component from "../../Component";
```

### After

```ts
import Component from "client/src/Component";
```

- Ronald Rey
