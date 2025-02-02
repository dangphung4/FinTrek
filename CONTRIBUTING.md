# Contributing to FinTrek

Thank you for your interest in contributing to FinTrek! This guide will walk you through the process of setting up your development environment, creating a new branch, making changes, and submitting a pull request.

## Prerequisites

- Git installed on your local machine
- A GitHub account

## Setting Up Your Development Environment

1. Fork the FinTrek repository on GitHub by clicking the "Fork" button in the top-right corner of the repository page.

2. Clone your forked repository to your local machine:

   ```bash
   git clone https://github.com/your-username/fintrek.git
   cd fintrek
   ```

3. Add the original repository as a remote named "upstream":

   ```bash
   git remote add upstream https://github.com/dangphung4/fintrek.git
   ```

4. Verify that you have two remotes: "origin" pointing to your fork and "upstream" pointing to the original repository:

   ```bash
   git remote -v
   ```

## Creating a New Branch

1. Before starting work on a new feature or bug fix, make sure your local repository is up to date with the latest changes from the upstream repository:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. Create a new branch for your feature or bug fix using the naming convention `name/feature-name`:

   ```bash
   git checkout -b your-name/feature-name
   ```

## Making Changes

1. Make your changes in the new branch, following the project's coding conventions and best practices.

2. Commit your changes with a descriptive commit message:

   ```bash
   git add .
   git commit -m "Add feature XYZ"
   ```

3. Push your changes to your forked repository:

   ```bash
   git push origin your-name/feature-name
   ```

## Submitting a Pull Request

1. Go to your forked repository on GitHub and click the "Compare & pull request" button for your branch.

2. Write a detailed description of your changes in the pull request, including any relevant information for the reviewers.

3. Click the "Create pull request" button to submit your changes for review.

4. The project maintainers will review your pull request and provide feedback. If any changes are requested, make the necessary updates and push them to your branch.

5. Once your pull request is approved, it will be merged into the main branch of the FinTrek repository.

## Keeping Your Fork Up to Date

1. Periodically, you should sync your fork with the upstream repository to keep it up to date:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   git push origin main
   ```

## Additional Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Help](https://help.github.com/)
- [FinTrek Coding Conventions](link-to-coding-conventions)

If you have any questions or need further assistance, feel free to reach out to the project maintainers or open an issue on the FinTrek repository.

Happy contributing!
