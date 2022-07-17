![img](./logo.svg)

## renames

A good helper for batch renaming files.

## Install

```sh
$ npm i -g renames
```

## Usage 

```shell
$ renames <beforePatten> <afterPatten> --dir <dir> # preview
$ renames <beforePatten> <afterPatten> --dir <dir>  --write # write to disk
```

**example 1:**

Suppose you now have the following directory structure:

```shell
├─ components
│  ├─ ListPost.tsx
│  ├─ NavBar.tsx
│  ├─ ToggleTheme.tsx
```

Just run `renames` and it will rename all files in the directory to match the new file name.


```shell
renames "([A-Z])([a-z]*)([A-Z])([a-z]*).tsx" "([a-z])([a-z]*)-([a-z])([a-z]*).tsx" --dir ./components --write
```

```shell
├─ components
│  ├─ list-post.tsx
│  ├─ nav-bar.tsx
│  ├─ toggle-theme.tsx
```

**example 2:**

```shell
├─ src
│  ├─ sort_test.js
│  ├─ match_test.js
│  ├─ index_test.js
```

```shell
renames "([a-z]*)_([a-z]*).js" "([a-z]*).([a-z]*).ts" --dir ./src --write
```

```shell
├─ src
│  ├─ sort.test.ts
│  ├─ match.test.ts
│  ├─ index.test.ts
```

## Base patten rule

| patten | description |
| -- | -- | 
| `()` | match an expression |
| `[a-z]` | match a lowercase letter |
| `[A-Z]` | match an uppercase letter |
| `*` | match any number of characters |

## More 

developing... 