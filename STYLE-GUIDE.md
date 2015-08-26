# Style guide

## General guidelines

### Code density

* Conserve line quantity by minimizing the number lines you write in. The more concisely your code is written, the more context can be seen in one screen.
* Conserve line length by minimizing the amount of complexity you put on each line. Long lines are difficult to read. Rather than a character count limit, I recommend limiting the amount of complexity you put on a single line. Try to make it easily read in one glance. This goal is in conflict with the line quantity goal, so you must do your best to balance them.

### Comments

* Provide comments any time you are confident it will make reading your code easier.
* Be aware that comments come at some cost. They make a file longer and can drift out of sync with the code they annotate.
* Comment on what code is attempting to do, not how it will achieve it.
* A good comment is often less effective than a good variable name.

## Indentation

When writing any block of code that is logically subordinate to the line immediately before and after it, that block should be indented two spaces more than the surrounding lines

* Do not put any tab characters anywhere in your code. You would do best to stop pressing the tab key entirely.
* Increase the indent level for all blocks by two extra spaces
  * When a line opens a block, the next line starts 2 spaces further in than the line that opened

    ```javascript
    // good:
    if (condition) {
      action();
    }

    // bad:
    if (condition) {
    action();
    }
    ```

  * When a line closes a block, that line starts at the same level as the line that opened the block
    ```javascript
    // good:
    if (condition) {
      action();
    }

    // bad:
    if (condition) {
      action();
      }
    ```

  * No two lines should ever have more or less than 2 spaces difference in their indentation. Any number of mistakes in the above rules could lead to this, but one example would be:

    ```javascript
    // bad:
    transmogrify({
      a: {
      b: function() {
      }
    }});
    ```

  * use sublime's arrow collapsing as a guide. do the collapsing lines seem like they should be 'contained' by the line with an arrow on it?

## Variables

### Variable declaration

* Always use let statements to declare variables.
* Use a new let statement for each line you declare a variable on.
* Do not break variable declarations onto mutiple lines.
* Use a new line for each variable declaration.
* See http://benalman.com/news/2012/05/multiple-var-statements-javascript/ for more details.

  ```javascript
  // good:
  let ape;
  let bat;

  // bad:
  let cat,
    dog

  // use sparingly:
  let eel, fly;
  ```

### Variable names

* A single descriptive word is best.

  ```javascript
  // good:
  let animals = ['cat', 'dog', 'fish'];

  // bad:
  let targetInputs = ['cat', 'dog', 'fish'];
  ```

* Collections such as arrays and maps should have plural noun variable names.

  ```javascript
  // good:
  let animals = ['cat', 'dog', 'fish'];

  // bad:
  let animalList = ['cat', 'dog', 'fish'];

  // bad:
  let animal = ['cat', 'dog', 'fish'];
  ```

* Name your variables after their purpose, not their structure

  ```javascript
  // good:
  let animals = ['cat', 'dog', 'fish'];

  // bad:
  let array = ['cat', 'dog', 'fish'];
  ```

#### Capital letters in variable names

* Only capitalize the first letter of a variable name if it is a pseudoclassical constructor that requires the `new` keyword.
* Exception: when library conventions capitalize first letter of variables
* Do not use all-caps for any variables. Some people use this pattern to indicate an intended "constant" variable, but the language does not offer true constants, only mutable variables.

## Literals

### Strings

* Prefer single quotes around JavaScript strings, rather than double quotes. Single quotes allow for easy embedding of HTML, which prefers double quotes around tag attributes. If a single quote is used within the string, delimit the string with double quotes.

  ```javascript
  // good:
  let dog = 'dog';
  let cat = 'cat';

  // good:
  let he = "can't";
  let she = "won't";

  // bad:
  let dog = "dog";
  let cat = "cat";

  // bad:
  let he = 'can\'t';
  let she = 'won\'t';
  ```

### Objects and arrays

* For lists, put commas at the end of each newline, not at the beginning of each item in a list

  ```javascript
  // good:
  let animals = [
    'ape',
    'bat',
    'cat'
  ];

  // bad:
  let animals = [
    'ape'
    , 'bat'
    , 'cat'
  ];
  ```

## Language constructs

* Do not use `for...in` statements with the intent of iterating over a list of numeric keys. Use a for-with-semicolons statement in stead.

  ```javascript
  // good:
  let list = ['a', 'b', 'c']
  for (let i = 0; i < list.length; i++) {
  alert(list[i]);
  }

  // bad:
  let list = ['a', 'b', 'c']
  for (let i in list) {
  alert(list[i]);
  }
  ```

* Never omit braces for statement blocks (although they are technically optional).
  ```javascript
  // good:
  for (key in object) {
    alert(key);
  }

  // bad:
  for (key in object)
    alert(key);
  ```

* Always use `===` and `!==`, since `==` and `!=` will automatically convert types in ways you're unlikely to expect.

  ```javascript
  // good:

  // this comparison evaluates to false, because the number zero is not the same as the empty string.
  if (0 === '') {
    alert("looks like they're equal");
  }

  // bad:

  // This comparison evaluates to true, because after type coercion, zero and the empty string are equal.
  if (0 == '') {
    alert("looks like they're equal");
  }
  ```

* Prefer function expressions wherever possible. Don't use function declarations unless absolutely necessary.
* Prefer arrow functions to the function keyword.

  ```javascript
  // good:
  let go = () => {...};

  // not preferred:
  function stop() {...};
  ```

### Opening or closing too many blocks at once

* The more blocks you open on a single line, the more your reader needs to remember about the context of what they are reading. Try to resolve your blocks early, and refactor. A good rule is to avoid closing more than two blocks on a single line--three in a pinch.

  ```javascript
  // avoid:
  _.ajax(url, {success: () => {
    // ...
  }});

  // prefer:
  _.ajax(url, {
    success: () => {
    // ...
    }
  });
  ```

## Padding and whitespace

* Don't align two similar lines. This pattern leads to unnecessary edits of many lines in your code every time you change a variable name.

  ```javascript
  // bad:
  let firstItem  = getFirst ();
  let secondItem = getSecond();
  ```

* Don't add whitespace after opening brackets or before closing brackets.

  ```javascript
  // bad:
  alert( 'I chose to put visual padding around this string' );
  alert( 'I only put visual padding on one side of this string');
  ```

* Use whitespace after keywords and before blocks.
* Put `else` and `else if` statements on the same line as the ending curly brace for the preceding `if` block
  ```javascript
  // good:
  if (condition) {
    response();
  } else {
    otherResponse();
  }

  // bad:
  if (condition) {
    response();
  }
  else {
    otherResponse();
  }
  ```
* Use padding after commas and around infix operators.

## Semicolons

* Don't forget semicolons at the end of lines

  ```javascript
  // good:
  alert('hi');

  // bad:
  alert('hi')
  ```

* Semicolons are not required at the end of statements that include a block--i.e. `if`, `for`, `while`, etc.

  ```javascript
  // good:
  if (condition) {
    response();
  }

  // bad:
  if (condition) {
    response();
  };
  ```

* Misleadingly, a function may be used at the end of a normal assignment statement, and would require a semicolon (even though it looks rather like the end of some statement block).

  ```javascript
  // good:
  let greet = () => {
    alert('hi');
  };

  // bad:
  let greet = () => {
    alert('hi');
  }
  ```

## Files

* Always end a file with a newline character.
* Always end lines with \n and never with \r\n.
* See http://adaptivepatchwork.com/2012/03/01/mind-the-end-of-your-line/ for more details.

## HTML

* Prefer using class for HTML elements, id when appropriate

  ```html
  <!-- good -->
  <img class="lucy" />

  <!-- only when appropriate -->
  <img id="lucy" />
  ```

* Do not include a `type=text/javascript"` or `type="text/css"` attribute on script tags

  ```html
  <!-- good -->
  <script src="a.js"></script>

  <!-- good -->
  <link href="style.css" rel="stylesheet">

  <!-- bad -->
  <script src="a.js" type="text/javascript"></script>

  <!-- bad -->
  <link href="styles.css" rel="stylesheet" type="text/css"/>
  ```

## CSS

* Use a whitespace after a selector
* Don't add empty new lines inside your css
* Open new blocks on the same line as the selector
* Close blocks on a separate line
* Always end rules with a semicolon

```css
/* good */
.classname {
  background: url('image.jpg');
}
```
