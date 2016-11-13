
    Explain the difference between the == operator and the === operator.
      == is equal to and === is equal to and equal type. the identity (===) behaves
      identically to the equality (==) operator. Except no type conversion is done.
      The types must be the same to be considered equal.
      --> if two values are not the same type === will simply return false.
    Explain what a closure is. (Note that JavaScript programs use closures very often.)
      * a closure is one way of supporting first class functions. it is an
      expression that can reference to variables within its scope.
      * a closure can be allocated to a function when it starts its execution
      and not freed after the function returns.

      In Javascript if you use the function keyword inside another function, you are
      creating a closure. () is used.

    Explain what higher order functions are.
      If we take a look at the literature provided, chapter 5 argues that higher
      order functions are more likely too contain a bug (more likely to be correct)
      The solution is expressed in vocabulary that corresponds to the problem being
      solved. I think if the functions contains simpler concepts than the program
      as a whole, the functions are of "higher order".

    Explain what a query selector is and give an example line of JavaScript that uses a query selector.
      The querySelector method returns the first element that matches a specified
      CSS selector in the document. If matches more than once --> first element
      is returned

      <h2>A h2 element</h2>

      document.querySelector("h2").style.backgroundColor = "red";

      h2 element is selected. Will add a background color to the first h2 element
      in the document (source: w3schools.com)
