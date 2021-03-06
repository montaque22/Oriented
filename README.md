# ![alt tag](/orientedjs_title.png)

Oriented JS or Ojs is meant to make javascript a little more structured like traditional Java.
Ojs gives developers the ability to declare interfaces and abstract classes as well as implement 
 and extend them respectively. Hopefully this will help make code more readable and allow developers to 
 implement design patterns in traditional ways. 
 
 Please understand that Javascript doesn't lend itself to this kind of structure so I am sure there are ways to 
 circumvent my methods and structure, but it this is an attempt to introduce something familiar.
 
 So drink up and try Ojs :) 



## Quick start

bower install --save oriented


## Features

* Create and Declare Interfaces
* Create and extend Abstract Classes
* Define "Abstract methods"

## Caveats
* If a class implements an interface, all the needed methods need to be public. 
This plugin cannot detect whether or not a class implemented a method internally. 


## Documentation

Look at the comments in [main.js](src/js/main.js). It should be very self explanatory.




## Licence
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
