# Contributing

Gunakan kemampuan sebagai team dengan melibatkan komunikasi, gunakan fitur `discussion` sebagai media diskusi teknis yang berkaitan dengan UI/UX, Issue, Functional, Non-Functional, dsb.

---
bentuk kontribusi *project*.
- Submitting bug reports
- Submitting feature request
- Providing feedback

# Contribution guidelines

- GIT Branch & Commit Convention
- Installation
---

## GIT Branch & Commit Convention

- **Branch** : [[Branch & Commit Convention#Branch Convention]]
- Commit : [[Branch & Commit Convention#Commit Convention]]
- References: [[Branch & Commit Convention#References]]

### Branch Convention
#### Long living branches

##### master/main
this is where stable production ready code lands. No direct commits are allowed.

##### Develop/staging
this is a construction area. All new features are merged to it. This branch should be buildable all the time

#### Special braches

#####  **Feature branch**
- branches off from **develop**  
- merges to **develop **[[Branch & Commit Convention#Develope/staging]]
- A git branch should start with a category. Pick one of these `feature`, `bugfix`, `hotfix`, or `test` :
	- `feature` is for adding, refactoring or removing a feature
	- `bugfix` is for fixing a bug
	- `hotfix` is for changing code with a temporary solution and/or without following the usual process (usually because of an emergency)
	- `test` is for experimenting outside of an issue/ticket
	![[Pasted image 20230909163954.png]]

Exemple
````
git branch <category/reference/description-in-kebab-case>
````

`git branch feature/issue-42/create-new-button-component`
`git branch test/no-ref/refactor-components-with-atomic-design`
##### **Release branch**
- branches off from **develop**
- merges to **master** and **develop**  
- naming: **release**, **rc**

##### **Hotfix branch**
 branches off from **master**  
- merges to **master** and **develop** or **release** (if exists)  
- naming: **hotfix**

![[Pasted image 20230909163933.png]]


### Commit Convention

#### Category
A commit message should start with a category of change. You can pretty much use the following 4 categories for everything: `feat`, `fix`, `refactor`, and `chore`. 

- `feat` is for adding a new feature
- `fix` is for fixing a bug
- `refactor` is for changing code for peformance or convenience purpose (e.g. readibility)
- `chore` is for everything else (writing documentation, formatting, adding tests, cleaning useless code etc.)

#### **Statement(s)**
After the colon, the commit description should consist in short statements describing the changes.  
  
Each statement should start with a verb conjugated in an imperative way. Statements should be seperated from themselves with a "`;`".

```
git commit -m "<category: do something; do some other things>"
```

#### **Examples**
- `git commit -m 'feat: add new button component; add new button components to templates'`
- `git commit -m 'fix: add the stop directive to button component to prevent propagation'`
- `git commit -m 'refactor: rewrite button component in TypeScript'`
- `git commit -m 'chore: write button documentation'`


### References
- https://dev.to/varbsan/a-simplified-convention-for-naming-branches-and-commits-in-git-il4
- https://medium.com/android-news/gitflow-with-github-c675aa4f606a


## Local project setup

### requirement

- nodejs > v20.1
- PGSql
- AWS S3 Bucket
- nextjs app router v14
- see on package.json file

### Getting Started

**Clone project**
`git clone https://github.com/Pijaraya-Team/identpix-app.git ; cd identpix-app`
*clone and enter the project*
---

**environment file**
``` env.development.local
# Created by Vercel CLI
NX_DAEMON=""
POSTGRES_DATABASE=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_PRISMA_URL=
POSTGRES_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_URL_NO_SSL=
POSTGRES_USER=
TURBO_REMOTE_ONLY=

# S3 Bucket instance
SPACE_SECRET=
SPACE_KEY=

NEXTAUTH_SECRET=lJzKd1hAC/JAGIVY2rW+lGaD84/F+cCHEOCL0uExUUg=
NEXTAUTH_URL=http://localhost:3000/

GOOGLE_CLIENT_ID=880001496867-bhv2g0pn67qctqg5fkn2at7te0ruumjd.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

```
---

**Run the development server:**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.


