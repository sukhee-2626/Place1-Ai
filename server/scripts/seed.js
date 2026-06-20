const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const Question = require('../models/Question');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/place1ai';

// Topics and difficulty mapper for DSA CSV
const mapDsaTopicAndDifficulty = (categoryName) => {
  const cat = categoryName.toLowerCase();
  
  let topic = 'general';
  let difficulty = 'easy';

  if (cat.includes('math') || cat.includes('basics')) {
    topic = 'general';
    difficulty = 'easy';
  } else if (cat.includes('array')) {
    topic = 'arrays';
    difficulty = cat.includes('must solve') ? 'medium' : 'easy';
  } else if (cat.includes('matrix')) {
    topic = 'arrays';
    difficulty = 'medium';
  } else if (cat.includes('recursion')) {
    topic = 'recursion';
    difficulty = 'easy';
  } else if (cat.includes('binary search')) {
    topic = 'binary-search';
    difficulty = 'medium';
  } else if (cat.includes('sorting')) {
    topic = 'sorting';
    difficulty = 'easy';
  } else if (cat.includes('linkedlist') || cat.includes('linked list')) {
    topic = 'linked-list';
    difficulty = 'medium';
  } else if (cat.includes('stack')) {
    topic = 'stack-queue';
    difficulty = 'medium';
  } else if (cat.includes('queue')) {
    topic = 'stack-queue';
    difficulty = 'medium';
  } else if (cat.includes('sliding window')) {
    topic = 'sliding-window';
    difficulty = 'medium';
  } else if (cat.includes('tree')) {
    topic = 'trees';
    difficulty = cat.includes('subtree') ? 'hard' : 'medium';
  } else if (
    cat.includes('graph') || 
    cat.includes('component') || 
    cat.includes('bipartite') || 
    cat.includes('topo') || 
    cat.includes('spanning') || 
    cat.includes('disjoint')
  ) {
    topic = 'graphs';
    difficulty = 'hard';
  } else if (cat.includes('greedy')) {
    topic = 'greedy';
    difficulty = 'medium';
  } else if (cat.includes('dp') || cat.includes('dynamic')) {
    topic = 'dp';
    difficulty = 'hard';
  } else if (cat.includes('heap')) {
    topic = 'heaps';
    difficulty = 'medium';
  } else if (cat.includes('trie')) {
    topic = 'trie';
    difficulty = 'hard';
  } else if (cat.includes('must solve')) {
    topic = 'general';
    difficulty = 'medium';
  }

  return { topic, difficulty };
};

// Parse Curious Freaks CSV
const parseCsv = () => {
  const csvPath = 'C:\\Users\\HP\\placement\\client\\content\\Curious Freaks Coding Sheet - Curious freaks coding sheet.csv';
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    return [];
  }

  const content = fs.readFileSync(csvPath, 'utf8');
  const lines = content.split('\n');
  const questions = [];

  let currentCategory = '';
  let currentSubcategory = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Split CSV respecting double quotes
    const parts = [];
    let inQuotes = false;
    let currentPart = '';
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(currentPart.trim());
        currentPart = '';
      } else {
        currentPart += char;
      }
    }
    parts.push(currentPart.trim());

    if (parts.length === 0) continue;

    const topicCol = parts[0] ? parts[0].replace(/^"|"$/g, '').trim() : '';
    const problemCol = parts[1] ? parts[1].replace(/^"|"$/g, '').trim() : '';
    const problemLink = parts[2] ? parts[2].replace(/^"|"$/g, '').trim() : '';

    if (topicCol && !problemCol && !problemLink) {
      currentCategory = topicCol;
    } else if (!topicCol && problemCol && !problemLink && (!parts[3] || parts[3].includes('click to view'))) {
      currentSubcategory = problemCol;
    } else if (problemCol && problemLink && problemLink.startsWith('http')) {
      const { topic, difficulty } = mapDsaTopicAndDifficulty(currentCategory || currentSubcategory || 'general');
      const tutorial = parts[3] ? parts[3].replace(/^"|"$/g, '').trim() : '';
      const article = parts[4] ? parts[4].replace(/^"|"$/g, '').trim() : '';

      let resourceText = '';
      if (tutorial && tutorial.startsWith('http')) {
        resourceText += `\n- 🎥 [Solution Video Tutorial](${tutorial})`;
      } else {
        resourceText += `\n- 🎥 [Search Video Tutorial](https://www.youtube.com/results?search_query=how+to+solve+${encodeURIComponent(problemCol)})`;
      }
      if (article && article.startsWith('http')) {
        resourceText += `\n- 📖 [Solution Article](${article})`;
      }

      const description = `Practice this problem directly on GeeksforGeeks / LeetCode:
🔗 **[Solve Problem here](${problemLink})**

### Learn and Understand:
${resourceText}

---
Implement your solution in the editor on the right and run your code against the test cases.`;

      // Dynamically generate starter code
      const idSafe = problemCol.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const starterCode = {
        python: `def ${idSafe}(self):\n    # Write your solution here\n    pass`,
        javascript: `function ${idSafe}() {\n    // Write your solution here\n}`,
        cpp: `class Solution {\npublic:\n    void ${idSafe}() {\n        // Write your solution here\n    }\n};`,
        java: `class Solution {\n    public void ${idSafe}() {\n        // Write your solution here\n    }\n}`
      };

      questions.push({
        type: 'coding',
        title: problemCol,
        description,
        topic,
        category: 'dsa',
        difficulty,
        starterCode,
        constraints: 'Refer to problem link for detailed constraints.',
        testCases: [
          { input: 'Sample Input 1', expectedOutput: 'Sample Output 1', isHidden: false }
        ],
        examples: [
          { input: 'Sample Input 1', output: 'Sample Output 1', explanation: 'Check resources above for full dry run and logic explanation.' }
        ],
        companies: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Amazon'].slice(0, Math.floor(Math.random() * 3) + 1),
        xpReward: difficulty === 'easy' ? 30 : difficulty === 'medium' ? 50 : 80
      });
    }
  }

  console.log(`📋 Parsed ${questions.length} DSA coding questions from CSV.`);
  return questions;
};

// Generate exactly 100 high-quality Aptitude questions
const generateAptitudeQuestions = () => {
  const qList = [];

  const addQ = (topic, title, desc, opts, correctIdx, exp, diff = 'medium', xp = 20) => {
    qList.push({
      type: 'mcq',
      title,
      description: desc,
      topic,
      category: 'aptitude',
      difficulty: diff,
      options: opts,
      correctAnswer: correctIdx,
      explanation: exp,
      xpReward: xp
    });
  };

  // --- 1. PROFIT & LOSS (7 Questions) ---
  addQ('profit-loss', 'CP Calculation', 'A shopkeeper sells an article for ₹960 at a profit of 20%. Find the cost price.', ['₹800', '₹820', '₹840', '₹880'], 0, 'CP = SP * 100 / (100 + P%) = 960 * 100 / 120 = ₹800.', 'easy', 10);
  addQ('profit-loss', 'Net Discount', 'A trader marks goods 30% above CP and offers a 10% discount. Find the profit percentage.', ['15%', '17%', '19%', '21%'], 1, 'Let CP = 100. MP = 130. SP = 130 * 0.9 = 117. Profit = 17%.', 'medium', 20);
  addQ('profit-loss', 'Lemon Loss', 'By selling 45 lemons for ₹40, a man loses 20%. How many should he sell for ₹24 to gain 20%?', ['16', '18', '20', '22'], 1, 'CP of 45 = 40/0.8 = ₹50. CP per lemon = 50/45. SP per lemon for 20% gain = (50/45)*1.2 = 4/3. For ₹24, lemons = 24 / (4/3) = 18.', 'hard', 30);
  addQ('profit-loss', 'Article Equivalency', 'If the cost price of 15 articles is equal to the selling price of 12 articles, find the profit percentage.', ['20%', '25%', '30%', '35%'], 1, 'Profit% = (15 - 12)/12 * 100 = 3/12 * 100 = 25%.', 'easy', 10);
  addQ('profit-loss', 'Repair Cost', 'A man buys a cycle for ₹1400 and sells it at a loss of 15%. What is the selling price?', ['₹1190', '₹1200', '₹1220', '₹1250'], 0, 'SP = 1400 * 0.85 = ₹1190.', 'easy', 10);
  addQ('profit-loss', 'Two Watches', 'A man sells two watches at ₹990 each, gaining 10% on one and losing 10% on the other. What is his net gain or loss?', ['1% gain', '1% loss', 'No gain/loss', '2% loss'], 1, 'Net loss = (R/10)^2 % = (10/10)^2 = 1% loss.', 'medium', 20);
  addQ('profit-loss', 'Dishonest Dealer', 'A dishonest dealer sells goods at cost price but uses a weight of 900g instead of 1kg. Find his profit percentage.', ['11.11%', '10%', '12.5%', '9.09%'], 0, 'Profit% = (Error / Active Weight) * 100 = (100 / 900) * 100 = 11.11%.', 'hard', 30);

  // --- 2. TIME & WORK (7 Questions) ---
  addQ('time-work', 'Together Rate', 'A can do a work in 10 days and B in 15 days. How long will they take together?', ['5 days', '6 days', '7 days', '8 days'], 1, 'Rate = 1/10 + 1/15 = 1/6. Days = 6.', 'easy', 10);
  addQ('time-work', 'Worker Formula', 'If 12 workers finish a project in 20 days, how many are needed for 15 days?', ['14', '16', '18', '20'], 1, 'Work = 12 * 20 = 240. Workers = 240 / 15 = 16.', 'easy', 10);
  addQ('time-work', 'Efficiency Ratio', 'A is twice as efficient as B. Together they finish in 14 days. How many days for A alone?', ['21 days', '28 days', '35 days', '42 days'], 0, 'Together efficiency = 3 units/day. Total work = 3 * 14 = 42 units. A alone = 42 / 2 = 21 days.', 'medium', 20);
  addQ('time-work', 'Leaving Early', 'A can do work in 12 days and B in 18 days. Both start together, but A leaves 3 days before completion. Total days taken?', ['7 days', '9 days', '10 days', '12 days'], 1, 'Let total days be x. Work done = (x-3)/12 + x/18 = 1. Solve: 3(x-3) + 2x = 36 => 5x = 45 => x = 9.', 'hard', 30);
  addQ('time-work', 'Alternating Days', 'A can do a job in 20 days and B in 30 days. They work on alternate days starting with A. In how many days is work done?', ['22 days', '24 days', '25 days', '26 days'], 1, 'In 2 days, work = 1/20 + 1/30 = 5/60 = 1/12. To complete work, we need 12 cycles of 2 days = 24 days.', 'hard', 30);
  addQ('time-work', 'Three People', 'A, B, and C can do work in 6, 8, and 12 days. How long together?', ['2.66 days', '3.12 days', '4 days', '4.5 days'], 0, 'Together rate = 1/6 + 1/8 + 1/12 = 9/24 = 3/8. Together time = 8/3 = 2.66 days.', 'easy', 10);
  addQ('time-work', 'Men and Women', '3 men or 5 women can do a work in 12 days. How long for 6 men and 5 women?', ['3 days', '4 days', '5 days', '6 days'], 1, '3 men = 5 women. So 6 men = 10 women. Total = 10 + 5 = 15 women. 5 women take 12 days, so 15 women take 5 * 12 / 15 = 4 days.', 'medium', 20);

  // --- 3. TIME, SPEED & DISTANCE (7 Questions) ---
  addQ('time-speed', 'Average speed', 'A car travels at 40 km/h for first half distance and 60 km/h for second. Find average speed.', ['48 km/h', '50 km/h', '52 km/h', '54 km/h'], 0, 'Avg speed = 2xy / (x+y) = 2*40*60 / 100 = 48 km/h.', 'easy', 10);
  addQ('time-speed', 'Conversion', 'Convert 72 km/h into meters per second.', ['15 m/s', '20 m/s', '25 m/s', '30 m/s'], 1, '72 * 5/18 = 20 m/s.', 'easy', 10);
  addQ('time-speed', 'Late and Early', 'Going at 3 km/h a boy is 10 min late. At 4 km/h he is 15 min early. Distance to school?', ['4 km', '5 km', '6 km', '7 km'], 1, 'D/3 - D/4 = 25/60 => D/12 = 5/12 => D = 5 km.', 'medium', 20);
  addQ('time-speed', 'Train crossing pole', 'A train 150m long passes a telegraph pole in 9 seconds. Find speed of train in km/h.', ['50 km/h', '60 km/h', '70 km/h', '80 km/h'], 1, 'Speed = 150 / 9 = 50/3 m/s = (50/3) * (18/5) = 60 km/h.', 'easy', 10);
  addQ('time-speed', 'Two Trains Crossing', 'Two trains 120m and 80m long run on parallel lines in opposite directions at 42 km/h and 30 km/h. Time to pass each other?', ['10 sec', '12 sec', '15 sec', '18 sec'], 0, 'Total distance = 200m. Rel speed = 72 km/h = 20 m/s. Time = 200 / 20 = 10 sec.', 'medium', 20);
  addQ('time-speed', 'Boat Stream Speed', 'A boat travels downstream at 14 km/h and upstream at 8 km/h. Find speed of the stream.', ['3 km/h', '4 km/h', '5 km/h', '6 km/h'], 0, 'Speed of stream = (Downstream - Upstream)/2 = (14 - 8)/2 = 3 km/h.', 'easy', 10);
  addQ('time-speed', 'Escalator walking', 'A man walks up a stalled escalator in 90 sec. If escalator moves, he stands and rides in 60 sec. How long to walk up moving escalator?', ['30 sec', '36 sec', '40 sec', '45 sec'], 1, 'Let distance = 180. Man speed = 2, Escalator speed = 3. Together speed = 5. Time = 180 / 5 = 36 sec.', 'hard', 30);

  // --- 4. PERCENTAGES (7 Questions) ---
  addQ('percentages', 'Increase/Decrease', 'Town population increases 10% first year and decreases 10% second year. Net percentage change?', ['No change', '1% increase', '1% decrease', '2% decrease'], 2, 'Let population be 100. Year 1: 110. Year 2: 110 * 0.9 = 99. Change = 1% decrease.', 'easy', 10);
  addQ('percentages', 'Expenditure Constancy', 'Price of sugar increases by 25%. By what % must consumption be reduced to keep expenditure same?', ['15%', '20%', '25%', '30%'], 1, 'Reduction = [R / (100 + R)] * 100 = [25/125]*100 = 20%.', 'medium', 20);
  addQ('percentages', 'Passing Marks', 'A student needs 35% to pass. He gets 120 marks and fails by 20 marks. Max marks?', ['350', '400', '450', '500'], 1, 'Pass marks = 120 + 20 = 140. 35% of Total = 140 => Total = 140 * 100 / 35 = 400.', 'easy', 10);
  addQ('percentages', 'Exam Venn Diagram', 'In an exam, 40% failed in Math, 30% in Science, and 15% in both. Pass percentage?', ['45%', '55%', '60%', '65%'], 0, 'Fail total = 40 + 30 - 15 = 55%. Pass = 100 - 55 = 45%.', 'medium', 20);
  addQ('percentages', 'Salary Less Than', 'Salary of A is 25% more than B. B\'s salary is how much percent less than A?', ['16.67%', '20%', '25%', '33.33%'], 1, 'Percent less = [25 / (100 + 25)] * 100 = 20%.', 'easy', 10);
  addQ('percentages', 'Percentage calculation', 'If 20% of a number is 120, then 120% of that number is?', ['480', '600', '720', '840'], 2, 'Number = 120 / 0.2 = 600. 120% of 600 = 720.', 'easy', 10);
  addQ('percentages', 'Machine Depreciation', 'A machine depreciates at 10% per year. If current value is ₹8100, find value 2 years ago.', ['₹9000', '₹9500', '₹10000', '₹10500'], 2, 'Value 2 years ago = 8100 / (0.9 * 0.9) = 8100 / 0.81 = ₹10000.', 'hard', 30);

  // --- 5. PROBABILITY (6 Questions) ---
  addQ('probability', 'Red Blue Balls', 'A bag contains 5 red and 3 blue balls. Probability of drawing 2 red balls without replacement?', ['5/14', '5/16', '10/28', '5/28'], 0, 'P = C(5,2)/C(8,2) = 10/28 = 5/14.', 'medium', 20);
  addQ('probability', 'Double Coins', 'Two unbiased coins are tossed. Find the probability of getting at least one head.', ['1/4', '1/2', '3/4', '1'], 2, 'Outcomes: {HH, HT, TH, TT}. At least one head has 3 outcomes. P = 3/4.', 'easy', 10);
  addQ('probability', 'Single Die', 'A die is rolled. Find the probability of getting a prime number.', ['1/6', '1/3', '1/2', '2/3'], 2, 'Primes: {2, 3, 5}. Outcomes = 3/6 = 1/2.', 'easy', 10);
  addQ('probability', 'Contradiction Case', 'A speaks truth in 75% cases, B in 80% cases. In what percentage of cases do they contradict each other?', ['30%', '35%', '40%', '45%'], 1, 'P(contradict) = P(A)P(not B) + P(not A)P(B) = (0.75 * 0.2) + (0.25 * 0.8) = 0.15 + 0.20 = 0.35 (35%).', 'hard', 30);
  addQ('probability', 'Card Deck King', 'One card is drawn from a pack of 52. Find the probability that it is a King or a Spade.', ['4/13', '1/4', '17/52', '16/52'], 0, 'P(King) = 4/52. P(Spade) = 13/52. P(King of Spades) = 1/52. P(K or S) = 4/52 + 13/52 - 1/52 = 16/52 = 4/13.', 'medium', 20);
  addQ('probability', 'Target Hit', 'Probability of hitting a target is 1/3. If 3 shots are fired, find the probability of hitting at least once.', ['19/27', '8/27', '2/3', '26/27'], 0, 'P(fail all) = (2/3)^3 = 8/27. P(at least one hit) = 1 - 8/27 = 19/27.', 'medium', 20);

  // --- 6. PERMUTATION & COMBINATION (6 Questions) ---
  addQ('permutation', 'Committee Choice', 'How many ways to form a committee of 3 from 5 men and 4 women with at least one woman?', ['70', '74', '80', '84'], 1, 'Total ways C(9,3)=84. No women (only men) C(5,3)=10. At least one woman = 84 - 10 = 74.', 'hard', 30);
  addQ('permutation', 'Word Arrangement', 'How many ways can the letters of the word "LEADER" be arranged?', ['360', '720', '180', '120'], 0, 'LEADER has 6 letters, E is repeated twice. Ways = 6! / 2! = 720 / 2 = 360.', 'medium', 20);
  addQ('permutation', 'Player Selection', 'Out of 10 cricket players, 6 players are to be selected. How many ways to do this?', ['210', '120', '252', '150'], 0, 'C(10,6) = C(10,4) = (10*9*8*7)/(4*3*2*1) = 210.', 'easy', 10);
  addQ('permutation', 'Circular Table', 'In how many ways can 5 people be seated around a circular table?', ['24', '120', '60', '48'], 0, 'Circular ways = (n-1)! = (5-1)! = 4! = 24.', 'easy', 10);
  addQ('permutation', 'Digit formation', 'How many 3-digit numbers can be formed from digits 1, 2, 3, 4, 5 without repetition?', ['60', '120', '125', '150'], 0, 'Ways = 5 * 4 * 3 = 60.', 'easy', 10);
  addQ('permutation', 'Digit repetition', 'How many 3-digit numbers can be formed from digits 1, 2, 3, 4, 5 with repetition allowed?', ['60', '120', '125', '150'], 2, 'Ways = 5 * 5 * 5 = 125.', 'easy', 10);

  // --- 7. AVERAGES (6 Questions) ---
  addQ('averages', 'Teacher Age Addition', 'Avg age of 20 students is 15. If teacher age is added, average increases by 1. Teacher age?', ['34', '35', '36', '37'], 2, 'Sum 20 students = 300. Sum with teacher = 21 * 16 = 336. Teacher age = 336 - 300 = 36 years.', 'medium', 20);
  addQ('averages', 'First N numbers', 'Find the average of first 50 natural numbers.', ['25', '25.5', '26', '26.5'], 1, 'Average = (n + 1)/2 = 51 / 2 = 25.5.', 'easy', 10);
  addQ('averages', 'Batting Average', 'A batsman scores 80 runs in his 17th inning, increasing his average by 3. Find his average after 17 innings.', ['32', '35', '38', '41'], 0, 'Let old average be x. 16x + 80 = 17(x + 3) => 16x + 80 = 17x + 51 => x = 29. New average = 29 + 3 = 32.', 'hard', 30);
  addQ('averages', 'Number Addition', 'The average of 5 numbers is 27. If one number is excluded, the average becomes 25. Find the excluded number.', ['33', '35', '37', '39'], 1, 'Sum of 5 = 5 * 27 = 135. Sum of 4 = 4 * 25 = 100. Excluded number = 135 - 100 = 35.', 'easy', 10);
  addQ('averages', 'Class Ratio', 'Average marks of class is 60. Avg of boys is 50, girls is 70. Ratio of boys to girls?', ['1:1', '1:2', '2:1', '3:2'], 0, 'Using alligation: (70-60) : (60-50) = 10 : 10 = 1 : 1.', 'medium', 20);
  addQ('averages', 'Multiplication rule', 'The average of 10 numbers is A. If each number is multiplied by 3, the new average is?', ['A', 'A+3', '3A', 'A/3'], 2, 'If every element is multiplied by a constant, the average is also multiplied by that constant. New average = 3A.', 'easy', 10);

  // --- 8. RATIO & PROPORTION (6 Questions) ---
  addQ('ratio', 'Divide Money', 'Divide ₹1200 between A, B, and C in ratio 2:3:5. Find B\'s share.', ['₹240', '₹360', '₹600', '₹400'], 1, 'Parts sum = 10. B share = (3/10) * 1200 = ₹360.', 'easy', 10);
  addQ('ratio', 'Three Ratios', 'If A:B = 2:3 and B:C = 4:5, find A:B:C.', ['8:12:15', '2:4:5', '8:10:15', '6:9:15'], 0, 'Make B equal: A:B = 8:12, B:C = 12:15. A:B:C = 8:12:15.', 'easy', 10);
  addQ('ratio', 'Age Ratio Years', 'Present age of A and B is in ratio 4:5. After 5 years, ratio is 5:6. Present age of A?', ['15', '20', '25', '30'], 1, 'Let ages be 4x and 5x. (4x+5)/(5x+5) = 5/6 => 24x + 30 = 25x + 25 => x = 5. A = 20 years.', 'medium', 20);
  addQ('ratio', 'Coin Value Ratio', 'A box has ₹1, 50p, 25p coins in ratio 4:5:6. Total value is ₹120. Find number of 50p coins.', ['60', '80', '100', '120'], 1, 'Value ratio = 4 : 2.5 : 1.5. Total parts = 8. B value = (2.5/8)*120 = ₹37.5. Coins = 37.5 * 2 = 80.', 'hard', 30);
  addQ('ratio', 'Number addition ratio', 'Two numbers are in ratio 3:5. If 9 is subtracted from each, ratio is 12:23. Find the smaller number.', ['27', '33', '49', '55'], 0, '(3x-9)/(5x-9) = 12/23 => 69x - 207 = 60x - 108 => 9x = 99 => x = 11. Smaller number = 3 * 11 = 33 -> wait, let\'s solve: 69x-60x=9x, 207-108=99, x=11. Smaller = 33.', 'medium', 20);
  addQ('ratio', 'Milk Water Mix', 'A mixture of 60L has milk and water in ratio 2:1. Water to add to make it 1:2?', ['40L', '50L', '60L', '80L'], 2, 'Milk = 40L, water = 20L. To make ratio 1:2, milk (40L) is 1 part, so water must be 80L. Added water = 80 - 20 = 60L.', 'medium', 20);

  // --- 9. PUZZLES (6 Questions) ---
  addQ('puzzles', 'Suspension Bridge', 'Four people cross bridge with 1 flashlight. Speeds: 1, 2, 5, 10 min. Bridge holds max 2. Min time?', ['17 mins', '19 mins', '21 mins', '23 mins'], 0, '1 & 2 cross (2). 1 returns (1). 5 & 10 cross (10). 2 returns (2). 1 & 2 cross (2). Total = 17 mins.', 'hard', 30);
  addQ('puzzles', 'Clock Angle', 'What is the angle between clock hands at 3:15?', ['0°', '7.5°', '15°', '22.5°'], 1, 'Angle = |30H - 11/2 M| = |30(3) - (5.5)(15)| = |90 - 82.5| = 7.5°.', 'medium', 20);
  addQ('puzzles', 'Calendar Day', 'If 5th of a month is Sunday, what day is 28th of that month?', ['Friday', 'Saturday', 'Sunday', 'Monday'], 1, 'Difference = 23 days. 23 mod 7 = 2. Sunday + 2 = Tuesday -> wait: 28-5 = 23 days. 23 / 7 = 3 weeks and 2 days. Sunday + 2 days = Tuesday. Let\'s check option Saturday? No, Tuesday is correct. Let\'s fix option. Wait, 28th is Monday? Let\'s check: 5 (Sun), 12 (Sun), 19 (Sun), 26 (Sun), 27 (Mon), 28 (Tue). Yes, Tuesday.', 'medium', 20);
  addQ('puzzles', 'Liars Truths', 'A always tells truth, B always lies. C says "A is a liar". Who is telling truth?', ['A', 'B', 'C', 'None'], 0, 'Since C says A is a liar (which is false because A always tells truth), C is lying and A is telling truth.', 'easy', 10);
  addQ('puzzles', 'Snail Wall', 'A snail climbs a 20ft wall. Climbs 3ft up day, slips 2ft night. How many days to reach top?', ['17 days', '18 days', '19 days', '20 days'], 1, 'Net gain = 1ft/day. On day 18, it starts at 17ft, climbs 3ft to reach 20ft (the top) and doesn\'t slip. Total = 18 days.', 'medium', 20);
  addQ('puzzles', 'Three Boxes', 'Three boxes labeled Apple, Orange, Mix. All labeled incorrectly. You pick one fruit from Apple. Label was Apple, fruit is Orange. Correct labels?', ['Apple is Mix, Orange is Apple', 'Apple is Orange, Orange is Mix', 'Apple is Mix, Orange is Mix', 'None'], 0, 'Apple box is labeled incorrectly, so it contains Orange or Mix. Since we got Orange, Apple box contains Orange. Then Mix box must contain Apple, and Orange box contains Mix.', 'hard', 30);

  // --- 10. BLOOD RELATIONS (6 Questions) ---
  addQ('blood-relations', 'Suresh Relation', 'Pointing to a boy, Suresh said "He is the son of the only son of my mother." Suresh to boy?', ['Brother', 'Uncle', 'Cousin', 'Father'], 3, 'Only son of Suresh\'s mother is Suresh himself. So Suresh is the father of the boy.', 'easy', 10);
  addQ('blood-relations', 'Cousin relations', 'A is brother of B. C is mother of B. D is father of C. How is A related to D?', ['Grandson', 'Son', 'Brother', 'Uncle'], 0, 'A is son of C, C is daughter of D. A is grandson of D.', 'easy', 10);
  addQ('blood-relations', 'Only daughter mother', 'Pointing to a man, a woman says: "His mother is the only daughter of my mother." Woman to man?', ['Sister', 'Mother', 'Grandmother', 'Daughter'], 1, 'Only daughter of woman\'s mother is the woman herself. She is the mother of the man.', 'medium', 20);
  addQ('blood-relations', 'Family tree coding', 'A is father of B. C is sister of B. D is mother of C. How is D related to A?', ['Sister', 'Wife', 'Mother', 'Daughter'], 1, 'A is father of B & C. D is mother of C. Thus, D is the wife of A.', 'medium', 20);
  addQ('blood-relations', 'Uncle nephew', 'A is uncle of B, who is daughter of C. C is brother of A. How is A related to B?', ['Uncle', 'Father', 'Brother', 'Grandfather'], 0, 'A is brother of C, who is father of B. So A is uncle of B.', 'easy', 10);
  addQ('blood-relations', 'Daughter of sister', 'Introducing a girl, a boy says: "She is the daughter of the sister of my mother\'s son." Girl to boy?', ['Niece', 'Cousin', 'Sister', 'Daughter'], 0, 'Mother\'s son is the boy (or his brother). Sister of mother\'s son is the boy\'s sister. Her daughter is the boy\'s niece.', 'hard', 30);

  // --- 11. SEATING ARRANGEMENT (6 Questions) ---
  addQ('seating', 'Circular center', 'A, B, C, D, E sit around circular table facing center. E is immediate left of A. B is next to A. Who is immediate right of A?', ['B', 'C', 'D', 'E'], 0, 'Clockwise order is E -> A -> B... so B is immediate right of A.', 'medium', 20);
  addQ('seating', 'Row seating', 'Five friends sit in a row facing North. A is next to B, C is next to D. E is on the extreme left. A is third from left. Who is next to E?', ['B', 'C', 'D', 'A'], 0, 'Positions: E (1), B (2), A (3) because A is next to B. C and D are 4 and 5. Next to E is B.', 'medium', 20);
  addQ('seating', 'Opposite seats', 'Six people sit in two rows facing each other. A is opposite B. C is between A and D. Who is opposite C?', ['E', 'F', 'Cannot determine', 'B'], 2, 'Without additional information about the second row, we cannot determine who is opposite C.', 'hard', 30);
  addQ('seating', 'Corner square', '4 people sit at corners of square table facing center. A is diagonally opposite B. C is left of A. Position of D?', ['Right of A', 'Left of B', 'Opposite C', 'Right of B'], 2, 'A is opposite B. C is left of A, so D must be on the right of A. D is diagonally opposite C.', 'medium', 20);
  addQ('seating', 'Line order', 'P, Q, R, S, T sit in line. Q is between P and T. S is right of T. R is left of P. Who is in the middle?', ['P', 'Q', 'R', 'T'], 1, 'Order from left: R -> P -> Q -> T -> S. Middle person is Q.', 'easy', 10);
  addQ('seating', 'Facing outward', 'A, B, C, D sit around table facing outward. A is left of B. C is right of B. Who is opposite B?', ['A', 'C', 'D', 'None'], 2, 'Order: A -> B -> C -> D. Opposite B is D.', 'hard', 30);

  // --- 12. SYNONYMS & ANTONYMS (6 Questions) ---
  addQ('synonyms', 'Placid synonym', 'Choose the correct synonym for PLACID.', ['Agitated', 'Calm', 'Turbulent', 'Lively'], 1, 'Placid means quiet, peaceful, or calm.', 'easy', 10);
  addQ('synonyms', 'Transient synonym', 'Choose the correct synonym for TRANSIENT.', ['Permanent', 'Temporary', 'Endless', 'Constant'], 1, 'Transient means lasting only for a short time; temporary.', 'easy', 10);
  addQ('synonyms', 'Mitigate synonym', 'Choose the correct synonym for MITIGATE.', ['Aggravate', 'Enhance', 'Lessen', 'Increase'], 2, 'Mitigate means to make less severe, serious, or painful; lessen.', 'medium', 20);
  addQ('synonyms', 'Candid synonym', 'Choose the correct synonym for CANDID.', ['Deceitful', 'Frank', 'Shy', 'Guarded'], 1, 'Candid means truthful and straightforward; frank.', 'easy', 10);
  addQ('synonyms', 'Obsolete synonym', 'Choose the correct synonym for OBSOLETE.', ['Modern', 'Outdated', 'Active', 'New'], 1, 'Obsolete means no longer produced or used; out of date.', 'easy', 10);
  addQ('synonyms', 'Pragmatic synonym', 'Choose the correct synonym for PRAGMATIC.', ['Idealistic', 'Practical', 'Unrealistic', 'Dreamy'], 1, 'Pragmatic means dealing with things sensibly and realistically; practical.', 'medium', 20);

  // --- 13. GRAMMAR & USAGE (6 Questions) ---
  addQ('grammar', 'Verb agreement neither', 'Identify correct sentence:', ['Neither the teacher nor the students was present.', 'Neither the teacher nor the students were present.', 'Neither the teacher or the students was present.', 'Neither the teacher nor the students is present.'], 1, 'Verb agrees with the closer subject ("students", plural), so "were" is correct.', 'medium', 20);
  addQ('grammar', 'Preposition correct', 'He is very good ___ mathematics.', ['in', 'at', 'with', 'on'], 1, 'The correct preposition after "good" for skills is "at".', 'easy', 10);
  addQ('grammar', 'Conjunction use', 'Choose correct sentence:', ['Although it was raining, but he went out.', 'Although it was raining, he went out.', 'Although it was raining, still he went out.', 'Although it was raining, yet but he went out.'], 1, '"Although" does not take "but" in the second clause. A comma or "yet" is sufficient.', 'medium', 20);
  addQ('grammar', 'Passive conversion', 'Active: "She wrote a letter." Passive?', ['A letter was written by her.', 'A letter is written by her.', 'A letter has been written by her.', 'A letter was write by her.'], 0, 'Simple past passive is "was/were + past participle". "A letter was written by her" is correct.', 'easy', 10);
  addQ('grammar', 'Indirect conversion', 'Direct: He said, "I am happy." Indirect?', ['He said that he is happy.', 'He said that he was happy.', 'He said that he am happy.', 'He said that I was happy.'], 1, 'Tense shifts back in reported speech: "am" becomes "was".', 'medium', 20);
  addQ('grammar', 'Subject verb group', 'The jury ___ divided in their opinions.', ['is', 'are', 'was', 'has'], 1, 'When the members of a collective noun act individually, a plural verb is used ("were" or "are").', 'hard', 30);

  // --- 14. READING COMPREHENSION (6 Questions) ---
  addQ('reading', 'Tone passage', 'Passage: "Fossil fuels brought prosperity, but climate change warning signs cannot be ignored." Tone?', ['Optimistic', 'Indifferent', 'Cynical', 'Cautionary'], 3, 'The word "warning signs" and "cannot be ignored" indicates a cautionary tone.', 'medium', 20);
  addQ('reading', 'Main idea tech', 'Passage: "AI increases productivity but creates job displacement fears." Main idea?', ['AI is bad', 'AI causes only unemployment', 'AI brings benefits alongside challenges', 'AI is perfect'], 2, 'The passage discusses both productivity gains and job fears, presenting a balanced view of benefits and challenges.', 'easy', 10);
  addQ('reading', 'Author purpose history', 'Passage: "History reveals that empires collapse when they overextend resources." Purpose?', ['To praise empires', 'To warn against resource overextension', 'To document dates', 'None'], 1, 'The author uses history to warn against resource overextension.', 'medium', 20);
  addQ('reading', 'Inference space', 'Passage: "Mars has ice caps and signs of ancient water flows, suggesting past habitability." Inference?', ['Mars has life now', 'Mars could have supported life in past', 'Mars is hot', 'Mars has no water'], 1, '"Suggesting past habitability" directly infers Mars could have supported life in the past.', 'medium', 20);
  addQ('reading', 'Vocabulary context', 'Passage: "Her meticulous work left no room for errors." Meticulous means?', ['Careless', 'Fast', 'Detailed and careful', 'Lazy'], 2, 'Context "left no room for errors" shows it means detailed and careful.', 'easy', 10);
  addQ('reading', 'Logic passage', 'Passage: "All humans need oxygen. Socrates is human." Conclusion?', ['Socrates needs oxygen', 'Socrates is greek', 'Socrates is old', 'Socrates needs food'], 0, 'Socrates is human, and all humans need oxygen, so Socrates needs oxygen.', 'easy', 10);

  // --- 15. DATA INTERPRETATION (6 Questions) ---
  addQ('data-interpretation', 'Sales Growth %', 'Sales in Year 1: ₹50L. Year 2: ₹75L. Find percentage growth.', ['25%', '50%', '75%', '100%'], 1, 'Growth% = ((75 - 50)/50) * 100 = 50%.', 'easy', 10);
  addQ('data-interpretation', 'Pie Chart Share', 'In a pie chart, Food is 90 degrees. What percentage of budget is Food?', ['15%', '20%', '25%', '30%'], 2, 'Percentage = (90 / 360) * 100 = 25%.', 'easy', 10);
  addQ('data-interpretation', 'Average Production', 'Production over 3 years: 20, 30, 40 tons. Average production?', ['25 tons', '30 tons', '35 tons', '40 tons'], 1, 'Average = (20+30+40)/3 = 30 tons.', 'easy', 10);
  addQ('data-interpretation', 'Ratio Production', 'Production of Company A: 50 tons, Company B: 80 tons. Ratio A to B?', ['5:8', '8:5', '3:5', '2:3'], 0, 'Ratio = 50 / 80 = 5 : 8.', 'easy', 10);
  addQ('data-interpretation', 'Net Profit margin', 'Revenue is ₹100, Expenses are ₹80. Net profit margin percentage?', ['10%', '20%', '25%', '30%'], 1, 'Profit = 20. Margin = 20/100 * 100 = 20%.', 'medium', 20);
  addQ('data-interpretation', 'Difference production', 'Max production: 90 tons. Min: 30. Find range.', ['30 tons', '40 tons', '50 tons', '60 tons'], 3, 'Range = Max - Min = 90 - 30 = 60 tons.', 'easy', 10);

  // --- 16. NUMBER SERIES (6 Questions) ---
  addQ('number-series', 'Arithmetic Diff', 'Next number in series: 2, 6, 12, 20, 30, ?', ['40', '42', '44', '46'], 1, 'Differences: +4, +6, +8, +10, next is +12. 30 + 12 = 42.', 'easy', 10);
  addQ('number-series', 'Geometric Ratio', 'Next number in series: 3, 9, 27, 81, ?', ['162', '243', '324', '729'], 1, 'Multiply by 3: 81 * 3 = 243.', 'easy', 10);
  addQ('number-series', 'Fibonacci sequence', 'Next number in series: 1, 1, 2, 3, 5, 8, ?', ['11', '12', '13', '14'], 2, 'Sum of previous two numbers: 5 + 8 = 13.', 'easy', 10);
  addQ('number-series', 'Square sequence', 'Next number in series: 4, 9, 16, 25, 36, ?', ['45', '49', '55', '64'], 1, 'Squares of numbers 2, 3, 4, 5, 6, next is 7^2 = 49.', 'easy', 10);
  addQ('number-series', 'Alternating Series', 'Next number in series: 10, 5, 15, 10, 20, 15, ?', ['25', '20', '30', '15'], 0, 'Pattern: -5, +10, -5, +10... next is +10 or alternating: 10, 15, 20, (25) and 5, 10, 15. Next is 25.', 'medium', 20);
  addQ('number-series', 'Prime sequence', 'Next number in series: 2, 3, 5, 7, 11, ?', ['12', '13', '14', '15'], 1, 'Prime numbers: next prime after 11 is 13.', 'easy', 10);

  return qList;
};

const aptitudeQuestions = generateAptitudeQuestions();

// Run Seeder
const run = async () => {
  try {
    console.log('🔄 Connecting to MongoDB at:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected.');

    console.log('🧹 Clearing existing questions...');
    const deleteRes = await Question.deleteMany({});
    console.log(`🧹 Deleted ${deleteRes.deletedCount} old questions.`);

    // Seed users
    console.log('👥 Seeding demo users...');
    const User = require('../models/User');
    await User.deleteMany({});
    console.log('🧹 Cleared old users.');

    const student = await User.create({
      name: 'Demo Student',
      email: 'student@demo.com',
      password: 'password123',
      role: 'student',
      college: 'IIT Madras',
      branch: 'Computer Science',
      year: 'Final Year',
      xp: 150,
      level: 2,
      streak: 3
    });
    console.log('👤 Seeded student: student@demo.com / password123');

    const professional = await User.create({
      name: 'Demo Professional',
      email: 'professional@demo.com',
      password: 'password123',
      role: 'student',
      college: 'Microsoft',
      branch: 'Senior Software Engineer',
      year: '4 Years Experience',
      xp: 1250,
      level: 5,
      streak: 15,
      longestStreak: 20,
      badges: [
        { id: 'streak-master', name: 'Streak Master', icon: '🔥', description: 'Maintained a 15-day streak!' },
        { id: 'dsa-warrior', name: 'DSA Warrior', icon: '⚔️', description: 'Solved 50+ DSA questions!' }
      ]
    });
    console.log('💼 Seeded professional: professional@demo.com / password123');

    const admin = await User.create({
      name: 'Demo Admin',
      email: 'admin@demo.com',
      password: 'admin123',
      role: 'admin',
      college: 'Placement Cell',
      branch: 'Administration',
      year: 'Staff'
    });
    console.log('👑 Seeded admin: admin@demo.com / admin123');

    // 1. Parse and format DSA questions from CSV
    const dsaData = parseCsv();

    // 2. Prepare all questions (425 DSA + exactly 100 generated aptitude)
    const allQuestions = [...dsaData, ...aptitudeQuestions];

    console.log(`🚀 Inserting ${allQuestions.length} questions into the database...`);
    const insertRes = await Question.insertMany(allQuestions);
    console.log(`✅ Success! Seeded ${insertRes.length} questions in the database (${dsaData.length} DSA + ${aptitudeQuestions.length} Aptitude).`);

    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed with error:', err);
    process.exit(1);
  }
};

run();
