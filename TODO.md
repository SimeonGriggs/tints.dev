# TODO

## Get the project stable:

- [ ] Set up comprehensive testing infrastructure

  - Add Vitest for unit testing
  - Add React Testing Library for component testing
  - Set up test coverage reporting
  - Write initial test suite for core color generation logic

- [ ] Implement proper error handling and logging

  - Implement proper error states for all user interactions

- [ ] Improve code quality and maintainability

  - Add ESLint rules for consistent code style
  - Set up GitHub Actions for linting and formatting any PRs, committing the updates to the PR
  - Review and optimize bundle size

- [ ] Performance optimization

  - Implement proper memoization for expensive calculations
  - Optimize color calculations and state management

- [ ] Accessibility improvements

  - Add proper ARIA labels and roles
  - Ensure keyboard navigation works
  - Add high contrast mode support
  - Test with screen readers
  - Add proper focus management

- [ ] Documentation
  - Add inline code documentation
  - Document color generation algorithm

## Then add new features:

- [ ] Add color picker to every swatch in a palette, so the user can change the color of any swatch to update the entire palette
- [ ] Write the current state of the palette to a KV storage so it's shareable
- [ ] Click between swatches to add a new one in between
