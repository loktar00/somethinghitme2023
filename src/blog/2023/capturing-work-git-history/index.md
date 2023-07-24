---
title: "Capturing Work Git History for your github activity graph" 
date: "2023-07-24"
teaser: "A quick tip on how to capture work git history for your github activity graph"
tags: "blog, javascript, git, programming, github"
---

### The Problem

Your working away at your amazing or not so amazing job, pushing branches, comitting code, doing awesome things in general, when you realize.... That's right we don't use Github here! I've been unfortunate enough to work at a few places that don't use Github, but I've wanted to look at my contributions over the year and see how much I've done, plus it's just nice to display publically.

Now before you say it, I know, I know, github activity is not the end all be all, it's not particularly important since you can skew it to your hearts desire... however the same can be said for fitness trackers, or hours on Steam. Everything can be gamed, however if you're disciplined it's nice to see your "real" contributions over time.

### The Solution


#### Step 1 get the commit dates
Go into your favorite command line, and browse whatever directory your respository is in. Then run the following command:

```bash
git log --author=yourEmail@yourCompany.com --pretty=%cd --date=format:'%Y-%m-%d' > stats.log
```
This will output a file called stats.log that looks something like this:

```bash
'2023-03-23'
'2023-03-23'
'2023-03-22'
'2023-03-21'
'2023-03-20'
'2023-03-20'
'2023-03-16'
'2023-03-16'
'2023-03-14'
'2023-03-14'
'2023-03-10'
'2023-03-10'
```

#### Step 2 clean up the data
I generally do a quick format, making the dates look like the following:

```JavaScript
const dates = [
    '2023-03-21',
    '2023-03-20',
    '2023-03-20',
    '2023-03-16',
    '2023-03-16',
    '2023-03-14',
    '2023-03-14',
    '2023-03-10',
    '2023-03-10'
];
```

Then I run the following code:

```JavaScript
const commits = {};

dates.forEach(entry => {
  if (commits[entry]) {
    commits[entry] += 1;
  } else {
    commits[entry] = 1;
  }
})

const commitData = [];

Object.keys(commits).forEach(commit => commitData.push({
  date: commit,
  count: commits[commit]
}))

console.log(JSON.stringify(commitData));
```

You can either do this in the browser or include it with the node script I'll share further down. It turns the output into the following:

```JavaScript
    [
        {"date":"2023-05-01","count":5},
        {"date":"2023-03-30","count":2},
        {"date":"2023-03-29","count":2},
        // ...ect
    ]
```

#### Step 3 push the data to github

I use the following script to add the data to my github activity graph:

```JavaScript
import fs from 'fs';
import { execSync }  from 'child_process';

const filenames = ['Whatever', 'Files', 'You', 'Want'];

(async function generateHistory() {
    let commitHistory = [];

    filenames.forEach(file => {
        const data = fs.readFileSync(`${file}.json`, 'utf8');
        const parsedData = JSON.parse(data).filter(el => parseInt(el.count)).map(el => {
            const count = parseInt(el.count);
            return new Array(count).fill(el.date);
        });

        commitHistory = [...commitHistory, ...parsedData];
    });

    async function init() {
        for (const history of commitHistory) {
            for (const commit of history) {
                execSync(`echo "${commit}" >> history.txt`);
                execSync(`git add . && git commit --quiet --date "${commit}" -m "Activity Commit ${commit}"`);
                console.log(commit);
            }
        }
      }

      init();
})();
```

Then you just run the script using `node script.js` And it will modify your local history with the dates and number of commits. These are the core parts of the script:

```JavaScript
    execSync(`echo "${commit}" >> history.txt`);
    execSync(`git add . && git commit --quiet --date "${commit}" -m "Activity Commit ${commit}"`);
```

The first modifies a file called `history.txt` and adds a line with the commit so we actually have some changed data. The next line ads the cile, creates a commit with the actual date of the commit.

All we need to do after the script runs is push the changes to github and we're done!

### Conclusion

You don't have to lose all of your commit history when you leave a job, and you don't have to wonder how your graph might be looking if you had been using github. This is a quick and easy way to capture your work history and add it to your github activity graph that I've been using for years. 

I hope you find it useful!
