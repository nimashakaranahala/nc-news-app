# NC News Seeding

## Setting Up Environment Variables

To run this project locally, you need to create environment variable files to specify database connections.

### Step 1: Create `.env` Files
Create two files in the root directory:
- `.env.development`
- `.env.test`

Ensure your `.gitignore` file includes `.env.*` to prevent these files from being pushed to GitHub.

### Step 2: Add Database Configuration
Inside each `.env` file, define the database name as follows:

#### `.env.development`
```
PGDATABASE=nc_news
```

#### `.env.test`
```
PGDATABASE=nc_news_test
```

## Creating the Databases

This project requires two databases:
- A **development** database (for realistic data).
- A **test** database (with simpler test data).

### Step 1: Run the Setup Script
To create both databases, run:
```sh
npm run setup-dbs
```
This will execute the `setup-dbs.sql` file and create both the development and test databases.

### Step 2: Verify Your Setup
Run the following scripts and check the console logs:

#### Test Database Seed Verification
```sh
npm run test-seed
```
This runs tests for your seed function. No tests will pass yet (which is expected), but you should see logs confirming you are connected to your test database.

#### Development Database Seed Verification
```sh
npm run seed-dev
```
This runs the `run-seed` script, which calls your seed function with development data. You may see errors at this stage, but the logs should confirm that you are connected to the development database.

## Understanding the Project Structure

### `db` Folder
The `db` folder contains everything you need to start creating the seed function.

#### `data` Folder
This contains subfolders for:
- **test** data
- **development** data

Each of these folders contains an `index.js` file that serves as a single entry point for all data in the folder. Instead of requiring each data file individually, you can import everything from the index file.

**Example:** The index file should export an object with the following keys:
- `articleData`
- `commentData`
- `topicData`
- `userData`

#### `seeds` Folder
This contains scripts for seeding the databases, as well as utility functions needed for data manipulation.

#### `connection.js` File
The database connection is already set up in `connection.js` and is required by `seed.js` and its corresponding test suite.

By following these steps, you will have a properly set up local environment to work on the NC News project!