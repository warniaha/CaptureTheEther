import { render, screen } from '@testing-library/react';
import App from './App';
// const keccak256 = require('keccak256');
import { strict as assert } from 'assert';

function replaceChar(str, chr, pos) {
  return str.substring(0, pos) + chr + str.substring(pos+1);
}

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/call me/i);
//   expect(linkElement).toBeInTheDocument();
// });

test("should verify single character replacements in a string", async () => {
  var testString = "----------";
  for (var index = 0; index < testString.length; index++) {
    var chr='0123456789'[index];
    testString = replaceChar(testString, chr, index);
  }
  assert(testString === "0123456789", `failed replace`);
});
