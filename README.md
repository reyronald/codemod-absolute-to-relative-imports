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

### Running locally

1. Clone this repo locally
1. Make necessary changes, run `npm run build`
1. Navigate to the directory where you want to run the codemod

    ```sh
    codemod <codemod-absolute-to-relative-imports-path> -t .
    ```