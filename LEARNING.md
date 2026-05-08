## Phase 3 — User Service

### What I built

Authentication microservice with register and login endpoints,
JWT issued via httpOnly cookie, MongoDB via Mongoose, full test suite.

### What I learned

**Three-layer architecture**
The strict separation between Route, Controller, Service, and Model
is harder to maintain than it sounds. The instinct is to put logic
where it is convenient — I had to consciously move things back to
the right layer several times. The rule "service layer never touches
req or res" is the clearest boundary.

**env.ts with Zod**
Validating environment variables at startup with Zod is a pattern
I will use in every service from now on. The fail-fast behaviour
caught missing variables immediately instead of failing silently
at runtime. The key detail: env.ts must be the first import in
index.ts — module execution follows import order.

**app.ts vs index.ts separation**
The reason for separating these files only became clear when writing
integration tests. Supertest imports app.ts directly without starting
a real server. If app.ts called app.listen(), every test file would
try to bind to a port and conflict. The separation is entirely for
testability.

**toJSON transform**
Without this, passwordHash appears in every API response. Easy to
miss and dangerous to forget. Adding it to the schema options means
you never have to remember to strip fields manually in controllers —
it happens automatically on every serialisation.

**Error handler registration order**
Spent time debugging why errors were not reaching the error handler.
The cause: errorHandler was registered before the routes in app.ts.
Express processes middleware in registration order — the error handler
must always be the last app.use() call.

**Mongoose toJSON TypeScript error**
The delete operator requires optional properties in strict mode.
Fixed by casting ret to Record<string, unknown> in the transform.
A TypeScript gotcha specific to extending built-in classes and
Mongoose's type system.

**tsconfig.json include and exclude conflict**
Had tests in both include and exclude simultaneously. Exclude wins —
TypeScript never saw the test files, which caused Jest globals
like describe and beforeAll to be unrecognised. Fix: remove tests
from exclude, use tests/\*_/_ in include.

**Unit vs integration tests**
Unit tests mock Mongoose and bcrypt — they test the logic in
complete isolation and run in milliseconds. Integration tests use
the real stack with mongodb-memory-server — they test that every
layer connects correctly. Both are necessary. Neither replaces
the other.

**jwt.sign TypeScript overload error**
The expiresIn option expects StringValue from the ms package, not
a plain string. Fixed by importing SignOptions and casting with
SignOptions["expiresIn"]. Using as any would have silenced the
error without understanding it.

### What confused me

- Why process.exit(1) works better than throw in env.ts —
  TypeScript recognises it as never which narrows the type after
  the block
- Why instanceof AppError checks can fail when extending built-in
  classes — fixed with Object.setPrototypeOf in the constructor
- The difference between mockResolvedValue and mockRejectedValue
  in Jest — resolved simulates a successful async result,
  rejected simulates a thrown error

### What I would do differently

- Write the toJSON transform before any other schema option —
  it is too easy to forget
- Set up jest.config.ts and tsconfig types before writing a
  single test file — the configuration errors waste time
- Write the error handler as a standalone file from the beginning
  instead of inline in app.ts

### Bugs I fixed along the way

- errorHandler registered before routes — errors never reached it
- export default on router instead of named export
- validate middleware missing return after res.status(400) —
  next() was being called after sending the response
- tsconfig include/exclude conflict — Jest globals unrecognised
- z.email() used instead of z.string().email()
- expiresIn typed as any instead of SignOptions["expiresIn"]
