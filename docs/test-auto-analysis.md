# Test Auto-Analysis Workflow

## Overview
The `Test Auto-Analysis (Intentional Failure)` workflow is designed to simulate various types of build failures to test the auto-analysis system that creates issue reports when workflows fail.

## Important Note
**This workflow is supposed to fail!** The failures are intentional and do not indicate real problems with the codebase.

## Failure Types

### 1. Compilation Error (`compilation_error`)
- Creates a temporary TypeScript file with syntax errors
- Attempts to compile it using `tsc --noEmit`
- Cleans up the temporary file after testing
- **Does not modify any real source files**

### 2. Test Failure (`test_failure`)
- Creates a temporary test file with failing assertions
- Runs the test using Vitest
- Cleans up the temporary test file
- **Does not affect existing tests**

### 3. Dependency Issue (`dependency_issue`)
- Attempts to install a non-existent package
- Simulates package resolution failures
- Creates only temporary package.json if needed

### 4. Transient Network Error (`transient_network`)
- Simulates network connectivity issues
- Randomly fails ~80% of the time to mimic real transient issues
- No files are created or modified

### 5. Linting Error (`linting_error`)
- Creates a temporary file with linting violations
- Runs ESLint on the temporary file
- Cleans up the temporary file
- **Does not modify any real source files**

## Safety Features

### Repository Protection
- All simulations use temporary files prefixed with `temp-`
- Automatic cleanup step runs regardless of step success/failure
- Final verification ensures repository remains clean
- No permanent modifications to source code

### Cleanup Process
1. Each simulation step cleans up its own temporary files
2. Global cleanup step removes any remaining temporary files
3. Repository status verification confirms no pollution occurred

## Usage
Run manually via GitHub Actions:
1. Go to Actions tab
2. Select "Test Auto-Analysis (Intentional Failure)"
3. Choose "Run workflow"
4. Select the desired failure type
5. The workflow will fail intentionally to trigger auto-analysis

## Previous Issues
The original implementation modified source files directly (e.g., appending syntax errors to `api/src/index.ts`), which could pollute the repository state and cause issues for subsequent workflows. This improved version uses temporary files to avoid these problems.