/* eslint no-unused-vars: 0 */

const Benchmark = require('benchmark');
const native = require('./src/native.js');
const addon = require('./build/Release/addon.node');
const wasm = require('./wasm.js');

const randomInRange = (max, min = 0) => Math.floor(Math.random() * (((max - min) + 1) + min));

const generateString = (length) => {
  const text = [];
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text.push(possible.charAt(randomInRange(possible.length)));
  }
  return text.join('');
};

function generateRegressionData(slope, intercept, length, isTyped) {
  const y = isTyped ? new Float64Array(length) : new Array(length);
  const x = isTyped ? new Float64Array(length) : new Array(length);
  for (let i = 0; i < length; i++) {
    x[i] = Math.floor((Math.random() * 100));
    y[i] = intercept + (slope * x[i]) + Math.random();
  }
  return [y, x];
}

const stringsArray = (() => {
  const result = [];
  let i = 0;
  while (i < 100) {
    result.push(generateString(randomInRange(40)));
    i++;
  }
  return result;
})();

const levensteinSuite = new Benchmark.Suite('Levenstein Distance:');
levensteinSuite.add('Native', () => {
  const result = native.levenstein(stringsArray[randomInRange(99)],
    stringsArray[randomInRange(99)]);
})
  .add('N-API Addon', () => {
    const result = addon.levenstein(stringsArray[randomInRange(99)],
      stringsArray[randomInRange(99)]);
  })
  .add('Web Assembly', () => {
    const result = wasm.levenstein(stringsArray[randomInRange(99)],
      stringsArray[randomInRange(99)]);
  })
  .on('start', (event) => {
    console.log(event.currentTarget.name);
  })
  .on('cycle', (event) => {
    console.log(`   ${String(event.target)}`);
  })
  .on('complete', (event) => {
    console.log(` Fastest is ${event.currentTarget.filter('fastest').map('name')}`);
    console.log('');
  });

const fibonacciSuite = new Benchmark.Suite('Fibonacci:');
fibonacciSuite.add('Native', () => {
  const result = native.fibonacci(randomInRange(45, 30));
})
  .add('N-API Addon', () => {
    const result = addon.fibonacci(randomInRange(45, 30));
  })
  .add('Web Assembly', () => {
    const result = wasm.fibonacci(randomInRange(45, 30));
  })
  .on('start', (event) => {
    console.log(event.currentTarget.name);
  })
  .on('cycle', (event) => {
    console.log(`   ${String(event.target)}`);
  })
  .on('complete', (event) => {
    console.log(` Fastest is ${event.currentTarget.filter('fastest').map('name')}`);
    console.log('');
  });

const fermatSuite = new Benchmark.Suite('Fermat Primality Test:');
fermatSuite.add('Native', () => {
  const result = native.fermat(randomInRange(1000000), 3);
})
  .add('N-API Addon', () => {
    const result = addon.fermat(randomInRange(1000000), 3);
  })
  .add('Web Assembly', () => {
    const result = wasm.fermat(randomInRange(1000000), 3);
  })
  .on('start', (event) => {
    console.log(event.currentTarget.name);
  })
  .on('cycle', (event) => {
    console.log(`   ${String(event.target)}`);
  })
  .on('complete', (event) => {
    console.log(` Fastest is ${event.currentTarget.filter('fastest').map('name')}`);
    console.log('');
  });

const regressionSuite = new Benchmark.Suite('Simple Linear Regression:');
regressionSuite.add('Native', () => {
  const result = native.regression(...generateRegressionData(5.5, 7.8, 1000));
})
  .add('N-API Addon', () => {
    const result = addon.regression(...generateRegressionData(5.5, 7.8, 1000));
  })
  .add('N-API Addon using TypedArrays', () => {
    const result = addon.regression(...generateRegressionData(5.5, 7.8, 1000, true));
  })
  .add('Web Assembly', () => {
    const result = wasm.regression(...generateRegressionData(5.5, 7.8, 1000));
  })
  .on('start', (event) => {
    console.log(event.currentTarget.name);
  })
  .on('cycle', (event) => {
    console.log(`   ${String(event.target)}`);
  })
  .on('complete', (event) => {
    console.log(` Fastest is ${event.currentTarget.filter('fastest').map('name')}`);
    console.log('');
  });

const sha256Suite = new Benchmark.Suite('SHA256:');
sha256Suite.add('Native', () => {
  const result = native.sha256(generateString(1000));
})
  .add('N-API Addon', () => {
    const result = addon.sha256(generateString(1000));
  })
  .add('Web Assembly', () => {
    const result = wasm.sha256(generateString(1000));
  })
  .on('start', (event) => {
    console.log(event.currentTarget.name);
  })
  .on('cycle', (event) => {
    console.log(`   ${String(event.target)}`);
  })
  .on('complete', (event) => {
    console.log(` Fastest is ${event.currentTarget.filter('fastest').map('name')}`);
    console.log('');
  });

wasm.onRuntimeInitialized = () => {
  levensteinSuite.run();
  fibonacciSuite.run();
  fermatSuite.run();
  regressionSuite.run();
  sha256Suite.run();
};
