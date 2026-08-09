# Agent Instructions

## Project Structure

```
knowledge-base/
├── .husky/                           # Git hooks (pre-commit)
├── src/                              # Main source code
│   ├── articles/                     # Markdown article files (UUIDv7 prefixed)
│   ├── common/                       # Shared types and Zod schemas
│   ├── css/                          # Compiled CSS output
│   ├── js/                           # Client-side JavaScript
│   ├── renderers/                    # HTML/page rendering functions
│   ├── scss/                         # SCSS source files
│   ├── utils/                        # Utility functions
│   ├── build.ts                      # Main build orchestrator
│   └── utils.ts                      # General utilities
├── tools/                            # CLI utility scripts
├── .dockerignore / .eslintrc.cjs / .stylelintrc.json  # Config files
├── docker-compose.yml / Dockerfile*  # Docker configuration
├── package.json / package-lock.json  # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── jest.config.ts                    # Jest test configuration
├── nodemon.json                      # Nodemon configuration
└── lint-staged.config.js             # Lint-staged configuration
```

## Build Process

The build is orchestrated by `src/build.ts`:

1. Reads all `.md` files from `src/articles/`
2. Parses YAML frontmatter metadata (including tags)
3. Renders Markdown to HTML with syntax highlighting
4. Compiles Sass to CSS
5. Copies JavaScript files
6. Generates HTML pages with metadata

## Important Conventions

### Article Structure

All articles must have YAML frontmatter with required fields:

```yaml
---
title: Article Title
date: 04-04-2026
tags:
  - tag1
  - tag2
---
```

Date format is **DD-MM-YYYY** (e.g., `31-12-2026`)

## File Naming and ID Generation

### Articles

Articles in `src/articles/` use **UUIDv7** prefixes for globally unique, time-sortable identification.

**Pattern:** `<uuidv7>-<slug>.md`

**Example:** `019d58a0-faf7-7179-b3f5-77466168c724-arch-install.md`

**Generate IDs:**

```bash
node tools/get-uuid-v7.js
```

### ESLint Rules

- **No destructuring required**: `prefer-destructuring` is disabled
- **Restricted destructuring**: Cannot use object/array destructuring except for rest patterns
  - ✓ `const { name, ...restProps } = user;`
  - ✓ `const x = props.name;` (direct access)
  - ✗ `const { name } = user;` (ERROR)
  - ✗ `const { ...otherProps } = user;` (rest prefix must be "rest", ERROR)

### Logging

- Use `tslog` for logging instead of `console.log`
- Example: `import { Logger } from 'tslog'; const log = new Logger(); log.info('message');`

## Tools

The `tools/` directory contains utility scripts for development workflows:

### `get-uuid-v7.js`

Generates and outputs a UUIDv7 to stdout. Useful for scripting or manual UUID generation.

**Usage:**

```bash
node tools/get-uuid-v7.js
```

## Scripts

### Development

```bash
npm run dev          # Start dev server with hot reload (builds, watches, and serves)
npm start            # Run the main entry point (src/index.ts)
```

### Build

```bash
npm run build        # Build the project (runs src/build.ts)
```

### Testing

```bash
npm test             # Run Jest tests
npm run test:cov     # Run tests with coverage report
npm run test:watch   # Run tests in watch mode
```

### Code Quality

```bash
npm run lint:check    # Check ESLint, Stylelint, and Prettier
npm run lint:fix      # Fix ESLint, Stylelint, and Prettier issues

# Individual check/fix commands:
npm run eslint:check             # Check ESLint issues
npm run eslint:fix               # Fix ESLint issues
npm run stylelint:check          # Check Stylelint issues
npm run stylelint:fix            # Fix Stylelint issues
npm run prettier:check           # Check Prettier formatting
npm run prettier:fix             # Fix Prettier formatting
npm run typecheck                # Run TypeScript type checking without emitting files
```

### Utilities

```bash
npx tsx <file>       # Execute any TypeScript/JavaScript file
```

### Git Hooks

```bash
npm run prepare      # Set up Husky git hooks
npm run lint-staged  # Run lint-staged on staged files
```

## Code Quality

- **Linter**:
  - **ESLint** with TypeScript and Airbnb config
  - **Stylelint** with standard SCSS config and BEM naming support
  - Patterns: `eslint . --ext .ts`, `stylelint src/**/*.{scss,css}`
- **Formatter**: Prettier with patterns `**/*.{ts,js,json,md,css,scss}`
- **Type Checking**: TypeScript strict mode
- **Validation**: Zod for runtime schema validation (e.g., ArticleMeta)
- **Testing**: Jest
- **Hooks**: Husky with lint-staged for pre-commit checks
- **Logging**: tslog (not console.log)

## Article Metadata

Articles use Zod-validated metadata extracted from YAML frontmatter:

```typescript
// src/common/article-meta.ts
const articleMetaSchema = z.object({
  title: z.string(),
  date: z.string().regex(/^\d{2}-\d{2}-\d{4}$/), // DD-MM-YYYY format
  tags: z.array(z.string()),
});

type ArticleMeta = z.infer<typeof articleMetaSchema>;
```

**Required fields**: `title`, `date` (DD-MM-YYYY format), `tags` array
**Optional fields**: Any other YAML frontmatter properties

Date and tags are automatically rendered as HTML on the article page during build.

## Common Tasks

### Add a new article

1. Create `.md` file in `src/articles/`
2. Add YAML frontmatter with:
   - `title`: Article title
   - `date`: Publication date in DD-MM-YYYY format
   - `tags`: Array of relevant tags
3. Write content in Markdown
4. Run `npm run dev` to preview

### Run formatter/linter

```bash
npm run lint:check    # Check all standards
npm run lint:fix      # Fix all standards

# Individual commands:
npm run eslint:fix              # Fix ESLint issues
npm run stylelint:fix           # Fix Stylelint issues
npm run prettier:fix            # Fix formatting
```

### Generate UUIDs for articles

```bash
npx tsx tools/add-uuid-prefix.ts
```

### Check all lint rules

```bash
npm run lint:check
# or individually:
npm run eslint:check
npm run stylelint:check
npm run prettier:check
```

## When Code Changes Are Needed

- **Build logic**: Edit `src/build.ts` (uses ArticleMeta type)
- **Page rendering**: Edit `src/renderers/`
- **Types/interfaces**: Edit `src/common/`
- **Utilities**: Edit `src/utils/`
- **Styles**: Edit `src/scss/` (compiled to CSS)

## Git Commit Conventions

Always use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<task-id>|<scope>): <description>
```

- **Types**: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`
- **Task ID**: Extract the timestamp ID from the task filename (e.g. for `task-20260420125902-integrate-markdown-it-deps.md`, use `20260420125902`)

**Examples:**

```
feat(20260420125902): add markdown-it-anchor plugin
fix(20260420125914): resolve anchor heading collision
chore(deps): update markdown-it-table-of-contents
```

## Best Practices

1. Keep functions focused and single-purpose
2. Use descriptive variable names (avoid destructuring without `rest` prefix)
3. Add JSDoc comments to exported functions
4. Import/export using ES modules
5. Follow ESLint and Prettier rules
6. Add appropriate tags to all articles
7. Test changes with `npm run dev` before committing
