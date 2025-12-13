# Contributing to Daraja SDK

Thank you for your interest in contributing to the Daraja SDK! This document provides guidelines for contributing to the project.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/yourusername/daraja.git
   cd daraja
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

## Project Structure

```
daraja/
├── src/
│   ├── index.ts      # Main SDK class with environment accessors
│   ├── client.ts     # DarajaClient with API implementation
│   └── types.ts      # TypeScript type definitions
├── examples/         # Usage examples
├── dist/            # Compiled output (generated)
└── docs/            # Documentation
```

## Development Workflow

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Follow the existing code style
   - Add types for all new features
   - Update documentation as needed

3. **Build and Test**
   ```bash
   npm run build
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Adding New Features

When adding new Daraja API features (e.g., B2C, B2B, C2B):

### 1. Add Types (src/types.ts)

```typescript
export interface NewFeaturePayload {
  param1: string;
  param2: number;
  // ... other parameters
}

export interface NewFeatureResponse {
  ResponseCode: string;
  ResponseDescription: string;
  // ... other response fields
}
```

### 2. Implement Method (src/client.ts)

```typescript
public async newFeature(payload: NewFeaturePayload): Promise<NewFeatureResponse> {
  const token = await this.getAccessToken();
  
  const requestBody = {
    // Map payload to API format
  };

  try {
    const response = await this.client.post<NewFeatureResponse>(
      '/mpesa/endpoint',
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      `Feature failed: ${error.response?.data?.errorMessage || error.message}`
    );
  }
}
```

### 3. Add Documentation

- Update [README.md](README.md) with usage examples
- Add JSDoc comments to your methods
- Create example in `examples/` directory

### 4. Test Your Changes

```bash
# Build to check for TypeScript errors
npm run build

# Test in your own project
npm link
cd /path/to/test/project
npm link @safaricom/daraja-sdk
```

## Code Style Guidelines

- Use TypeScript for all code
- Follow existing naming conventions
- Add JSDoc comments for public APIs
- Use meaningful variable and function names
- Keep functions focused and small

## Type Safety

- All public APIs must have proper TypeScript types
- Export types for consumer use
- Avoid using `any` unless absolutely necessary
- Use strict mode TypeScript settings

## Documentation

- Update README.md for new features
- Add JSDoc comments for all public methods
- Create examples for complex features
- Update ARCHITECTURE.md for structural changes

## Commit Message Format

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add B2C payment support
fix: correct timestamp format in STK push
docs: update README with B2C examples
refactor: improve error handling in client
```

## Testing

Currently, the project uses manual testing. We welcome contributions to add:

- Unit tests with Jest
- Integration tests for sandbox environment
- Type tests
- E2E tests

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues before creating new ones
- Tag maintainers in issues/PRs for attention

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to make Daraja SDK better! 🚀
