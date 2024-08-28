import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;
const WINDOW_SIZE = 10;
let numberWindow = [];

app.get('/numbers/:numberid', async (req, res) => {
  const numberId = req.params.numberid;
  if(!numberId) {
    res.status(400).json({ error: 'Number ID is required' });
  }
  
  if(numberId==='e'){
    numberId="even"
  }
  if(numberId==='f'){
    numberId="fibo"
  }
  if(numberId==='p'){
    numberId="prime"
  }
    if(numberId==='r'){
        numberId="rand"
    }

  const testServerUrl = `https://20.244.56.144/test/${numberId}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 500);

  try {
    const response = await fetch(testServerUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const numbers = await response.json();
    const uniqueNumbers = [...new Set(numbers)];
    const prevState = [...numberWindow];

    uniqueNumbers.forEach(num => {
      if (!numberWindow.includes(num)) {
        if (numberWindow.length >= WINDOW_SIZE) {
          numberWindow.shift();
        }
        numberWindow.push(num);
      }
    });

    const avg = numberWindow.reduce((acc, num) => acc + num, 0) / numberWindow.length;

    res.json({
      numbers: uniqueNumbers,
      windowPrevState: prevState,
      windowCurrState: numberWindow,
      avg: avg.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch numbers from test server' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});