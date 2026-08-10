const { Client } = require('pg');

const SUPABASE_URL = 'postgresql://postgres:sukhee26262@db.wfrlscmeuaenaiezggtu.supabase.co:5432/postgres';

const sqlQuestions = [
  {
    title: "Combine Two Tables",
    description: "Write an SQL query to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead.",
    topic: "Joins",
    subtopic: "Left Join",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/combine-two-tables/"
  },
  {
    title: "Second Highest Salary",
    description: "Write an SQL query to report the second highest salary from the Employee table. If there is no second highest salary, the query should report null.",
    topic: "Basic Select",
    subtopic: "Order By & Limit",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/second-highest-salary/"
  },
  {
    title: "Nth Highest Salary",
    description: "Write an SQL query to report the nth highest salary from the Employee table. If there is no nth highest salary, the query should report null.",
    topic: "Functions",
    subtopic: "Window Functions",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/nth-highest-salary/"
  },
  {
    title: "Rank Scores",
    description: "Write an SQL query to rank the scores. The ranking should be calculated according to the following rules: The scores should be ranked from the highest to the lowest. If there is a tie between two scores, both should have the same ranking.",
    topic: "Window Functions",
    subtopic: "DENSE_RANK",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/rank-scores/"
  },
  {
    title: "Consecutive Numbers",
    description: "Write an SQL query to find all numbers that appear at least three times consecutively.",
    topic: "Self Join",
    subtopic: "Consecutive Records",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/consecutive-numbers/"
  },
  {
    title: "Employees Earning More Than Their Managers",
    description: "Write an SQL query to find the employees who earn more than their managers.",
    topic: "Self Join",
    subtopic: "Comparisons",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/employees-earning-more-than-their-managers/"
  },
  {
    title: "Duplicate Emails",
    description: "Write an SQL query to report all the duplicate emails. Note that it's guaranteed that the email field is not NULL.",
    topic: "Group By",
    subtopic: "Having",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/duplicate-emails/"
  },
  {
    title: "Customers Who Never Order",
    description: "Write an SQL query to report all customers who never order anything.",
    topic: "Subqueries",
    subtopic: "NOT IN",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/customers-who-never-order/"
  },
  {
    title: "Department Highest Salary",
    description: "Write an SQL query to find employees who have the highest salary in each of the departments.",
    topic: "Window Functions",
    subtopic: "Partition By",
    difficulty: "Medium",
    link: "https://leetcode.com/problems/department-highest-salary/"
  },
  {
    title: "Department Top Three Salaries",
    description: "Write an SQL query to find the employees who are high earners in each of the departments. A high earner in a department is an employee who has a salary in the top three unique salaries for that department.",
    topic: "Window Functions",
    subtopic: "DENSE_RANK Partition",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/department-top-three-salaries/"
  },
  {
    title: "Delete Duplicate Emails",
    description: "Write an SQL query to delete all the duplicate emails, keeping only one unique email with the smallest id.",
    topic: "Delete",
    subtopic: "Join Delete",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/delete-duplicate-emails/"
  },
  {
    title: "Rising Temperature",
    description: "Write an SQL query to find all dates' Id with higher temperatures compared to its previous dates (yesterday).",
    topic: "Joins",
    subtopic: "Date Functions",
    difficulty: "Easy",
    link: "https://leetcode.com/problems/rising-temperature/"
  },
  {
    title: "Trips and Users",
    description: "Write an SQL query to find the cancellation rate of requests with unbanned users (both client and driver must not be banned) each day between '2013-10-01' and '2013-10-03'.",
    topic: "Complex Queries",
    subtopic: "Case When & Group By",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/trips-and-users/"
  },
  {
    title: "Human Traffic of Stadium",
    description: "Write an SQL query to display the records with three or more rows with consecutive id's, and the number of people is greater than or equal to 100 for each.",
    topic: "Window Functions",
    subtopic: "Advanced Grouping",
    difficulty: "Hard",
    link: "https://leetcode.com/problems/human-traffic-of-stadium/"
  }
];

async function seedSQL() {
  console.log('Connecting to PostgreSQL (Supabase)...');
  const pgClient = new Client({
    connectionString: SUPABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await pgClient.connect();

  let count = 0;
  console.log('Inserting SQL questions...');
  
  for (const q of sqlQuestions) {
    const res = await pgClient.query('SELECT id FROM questions WHERE link = $1', [q.link]);
    if (res.rows.length === 0) {
      await pgClient.query(
        'INSERT INTO questions (title, description, topic, subtopic, category, difficulty, link) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [q.title, q.description, q.topic, q.subtopic, 'sql', q.difficulty, q.link]
      );
      count++;
    }
  }

  console.log(`Successfully added ${count} SQL questions to Supabase!`);

  await pgClient.end();
}

seedSQL().catch(console.error);
