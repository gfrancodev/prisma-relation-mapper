[![codecov](https://codecov.io/gh/gfrancodev/prisma-relation-mapper/graph/badge.svg?token=EHFGVFCPBT)](https://codecov.io/gh/gfrancodev/prisma-relation-mapper)

# Prisma Relation Mapper  

A utility function to simplify and streamline the creation of nested `include` objects in Prisma queries. This tool allows developers to define relationships as strings and automatically maps them to Prisma's `include` structure, making complex queries easier to write and maintain.  

## Features  

- Convert an array of relation strings (e.g., `"user.profile"`, `"posts.comments.author"`) into a nested Prisma `include` object.  
- Automatically handles deep nesting, removing the need to manually chain includes.  
- Cleans, trims, and sorts the relations for consistency.  

## Why Use This?  

Manually building deeply nested `include` structures in Prisma can be repetitive and error-prone. This utility simplifies the process, reduces boilerplate, and makes dynamic queries more manageable.  

## Example Usage  

### Input  

```typescript
import { mapRelations } from '@prisma/utils';

const relations = [
  'profile',
  'posts.comments.author',
];

const includeStructure = mapRelations(relations);
console.log(includeStructure);
```

### Output  

```typescript
{
  profile: true,
  posts: {
    include: {
      comments: {
        include: {
          author: true,
        },
      },
    },
  },
}
```

### Use in Prisma Query  

```typescript
const users = await prisma.user.findMany({
  include: mapRelations(['profile', 'posts.comments.author']),
});
```

## Setup  

1. Clone the repository:  

   ```bash
   git clone https://github.com/gfrancodev/prisma-relation-mapper.git
   ```  

2. Install dependencies:  

   ```bash
   npm install
   ```  

3. Generate Prisma client:

   ```bash
   npm run db:generate
   ```

4. Seed the database:

   ```bash
   npm run db:seed
   ```

5. Run examples:

   ```bash
   npm run example:inner-join
   npm run example:left-join  
   npm run example:outer-join
   ```

6. Run tests:

   ```bash
   npm test
   ```

7. Run tests with coverage:

   ```bash
   npm run test:cov-ci
   ```

## License  

This project is licensed under the MIT License.  
