# Contributing

## General Workflow

1. Fork the repo
1. Cut a feature branch from develop
  - make the branch name descriptive
1. Make commits to your feature branch. Prefix each commit like so:
  - (feat) Add a new feature
  - (fix) Fix inconsistent tests
  - (refactor) ...
  - (test) ...
  - (doc) ...
  - (build) ...
1. When you've finished with your fix or feature, rebase upstream changes from
   the develop branch into your branch. submit a [pull request][] directly to
   develop. Include a description of your changes.
1. Your pull request will be reviewed by another maintainer. The point of code
   reviews is to help keep the codebase clean and of high quality and, equally
   as important, to help you grow as a programmer. If your code reviewer
   requests you make a change you don't understand, ask them why.
1. Fix any issues raised by your code reviewer and rebase if appropriate.
1. Once the pull request has been reviewed, it will be merged by another member
   of the team. Do not merge your own commits.

## Detailed Workflow

### Fork the repo

Use github’s interface to make a fork of the repo, then add that repo as an upstream remote:

```
git remote add upstream https://github.com/the-ninja-turtles/turtle
```

### Cut a feature branch from develop

These commands will help you do this:

``` bash
# Creates your branch and takes you there
git checkout -b `your-branch-name`
```

### Make commits to your feature branch.

Prefix each commit like so
  - (feat) Add a new feature
  - (fix) Fix inconsistent tests
  - (refactor) ...
  - (test) ...
  - (doc) ...
  - (build) ...

Make changes and commits on your branch, and make sure that you
only make changes that are relevant to this branch. If you find
yourself making unrelated changes, make a new branch for those
changes.

#### Commit Message Guidelines

- Commit messages should be written in the present tense; e.g. "Fix continuous
  integration script".
- The first line of your commit message should be a brief summary of what the
  commit changes. Aim for about 70 characters max. Remember: This is a summary,
  not a detailed description of everything that changed.
- If you want to explain the commit in more depth, following the first line should
  be a blank line and then a more detailed description of the commit. This can be
  as detailed as you want, so dig into details here and keep the first line short.

### Rebase upstream changes into your branch

Once you are done making changes, you can begin the process of getting
your code merged into the main repo. Step 1 is to rebase upstream
changes to the develop branch into yours by running this command
from your branch:

```bash
git pull --rebase upstream develop
```

This will start the rebase process. You must commit all of your changes
before doing this. If there are no conflicts, this should just roll all
of your changes back on top of the changes from upstream, leading to a
nice, clean, linear commit history.

If there are conflicting changes, git will pause rebasing to allow you to sort
out the conflicts. You do this the same way you solve merge conflicts,
by checking all of the files git says have been changed in both histories
and picking the versions you want. Be aware that these changes will show
up in your pull request, so try and incorporate upstream changes as much
as possible.

You pick a file by `git add`ing it - you do not make commits during a
rebase.

Once you are done fixing conflicts for a specific commit, run:

```bash
git rebase --continue
```

This will continue the rebasing process. Once you are done fixing all
conflicts you should run all tests including your new tests and make sure
that they all work.

If rebasing broke anything, fix it, then repeat the above process until
you get here again and nothing is broken and all the tests pass.

### Make a pull request

Make a clear pull request from your fork and branch to the upstream develop
branch, detailing exactly what changes you made and what feature this
should add. The clearer your pull request is the faster you can get
your changes incorporated into this repo.

Link all relevant issues to your pull request.
 - Use Closes #0 to close a feature request
 - Use Fixes #0 to close a bug report
 - Use Connects to #0 to indicate that the PR is related to that issue

At least one other person MUST give your changes a code review, and once
they are satisfied they will merge your changes into upstream. Alternatively,
they may have some requested changes. You should make more commits to your
branch to fix these, then follow this process again from rebasing onwards.

Once you get back here, make a comment requesting further review and
someone will look at your code again. If they like it, it will get merged,
else, just repeat again.

Thanks for contributing!

### Guidelines

1. Uphold the current code standard:
    - Keep your code [DRY][].
    - Apply the [boy scout rule][].
    - Follow [STYLE-GUIDE.md](STYLE-GUIDE.md)
1. Run the tests before submitting a pull request.
1. Tests are very, very important. Submit tests if your pull request contains
   new, testable behavior.
1. Your pull request groups related changes into separate commits, [squash][] commits if necessary

## Checklist

This is just to help you organize your process

- [ ] Did I cut my work branch off of develop (don't cut new branches from existing feature branches)?
- [ ] Is my branch name descriptive?
- [ ] Is my branch focused on a single main change?
 - [ ] Do all of my changes directly relate to this change?
- [ ] Did I rebase the upstream develop branch after I finished all my
  work?
- [ ] Did I write a clear pull request message detailing what changes I made?
- [ ] Did I get a code review?
 - [ ] Did I make any requested changes from that code review?

If you follow all of these guidelines and make good changes, you should have
no problem getting your changes merged in.

# Guidelines for maintainers

## Merge pull request into develop

To avoid unnecessary merge commits in our git history, we merge pull requests
manually and push to the `develop` branch. The local `develop` branch is used only
for pulling upstream `develop` branch and for pushing to the upstream `develop`.

``` bash
git checkout develop
git pull upstream develop
git pull --ff-only <git path to contributor’s branch>
git push upstream develop
```

The merge can also be done with a detached HEAD like so:

```bash
git fetch upstream develop
git checkout upstream/develop
git pull --ff-only <git path to contributor’s branch>
git push upstream HEAD:develop
```

## Merge develop branch into master

Once the develop branch is ready for releasing into production, we merge the
develop branch into master.

``` bash
git checkout master
git pull upstream master
git merge --ff-only develop
git push upstream master
```

An alternative process, done with a detached HEAD, is:

```bash
git fetch upstream master
git checkout upstream/master
git pull --ff-only upstream/develop
git push upstream HEAD:master
```


<!-- Links -->
[DRY]: https://en.wikipedia.org/wiki/Don%27t_repeat_yourself
[boy scout rule]: http://c2.com/cgi/wiki?BoyScoutRule
[pull request]: https://help.github.com/articles/using-pull-requests/
[squash]: http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html
