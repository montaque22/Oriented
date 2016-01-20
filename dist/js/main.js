/*
 This is a test class to show how oriented.js works.

 This will demonstrate the following
 - How to create an Interface
 - How to declare that a class implements an Interface
 - How to declare a class as Abstract
 - How to extend an Abstract class
 - How to instantiate a previously defined class
 */

/*
 --- HOW TO DEFINE AN INTERFACE---

Oriented has a mutating return method. If you pass in only a name the method will return options to define an
 interface or instantiate a class. In the example below iPerson is going to define an interface.

 The defineInterface allow you to input as many method names as you like. Each will be associated with iPerson
 */


Oriented('iPerson').defineInterface('talk','walk');

/*
 --- HOW TO DEFINE AN ABSTRACT CLASS AND IMPLEMENT AN INTERFACE---

 Passing in a function along with the string name allows you to do 1 of 3 things:
 - Define an abstract class
 - Extend an abstract class
 - Implement an interface.

 In the example below we create a Class and named it Person...
 */
Oriented('Person',function (name){


    // You can implement interfaces in abstract classes. The subclass will be checked against the interfaces instead
    // of the abstract (super) class. This way you can implement some of the code in the super class and the rest in
    // the subclass


    this.name = name;



    this.talk = function(){
        console.log('Hi, my name is ' + this.name);
    };

})
/*

    ... then we call the chained method isAbstract()
     This marks the previously inputted class as abstract

     */
    .isAbstract()


    /*
        We can also implement an interface by calling the implements function and pass in the name of the interface.
        Here we are going to implement iPerson which we defined earlier.

        It should be noted that iPerson does not have to be defined first before telling a class they can implement it.
        As long as the interface is defined before instantiation this micro-plugin will allow it.
     */
    .implements('iPerson');


/*
 --- HOW TO EXTEND AN ABSTRACT CLASS ---

 The pattern should now look familiar. We pass in the name of the class and the function that will represent it...
 */
Oriented('Child', function (){

    /*
     This method extends the current class with Person class.
     You can pass in the arguments as it will run the init function.
     If the init function cannot be found it will do nothing

     NOTE: you must return after calling this method. It does not matter where you call this method (beginning
     or end) as it will make sure all the properties are properly instantiated.
     */


    // Required by iPerson. Without it the class will throw an exception
    this.walk = function(){
        console.log('I can walk anywhere');
    };

    // Required by iPerson. This is overriding the super class's implementation.


    // We can make sure that specific private functions are implemented as well. If the private method is
    // implemented in the super class it will throw an error as it is not accessible to the subclass.
    // without this method the class will throw an exception
    function terrible(){

    }
})
/*
        ... Then we call extends and pass the name of the abstract class we want to subclass
        Here we are extending the Abstract person class.

        It should again be noted that the Abstract person class does not have to be defined at this point in order
         for this class to declare that it is extending it. As long as the Abstract class is defined before
          initialization this micro-plugin will allow it.

         -- The plugin will not allow you to extend non abstract classes.
     */
    .extends('Person');
// Will be subclassing Person


/*
    --- HOW TO INITIALIZE A CLASS ---

    To initialize the class just pass in a name of the class and call the method initializeWith. You can pass in all
     the arguments for the class Child that it needs.

     If you pass in a function along with the child ex: Oriented('Child', function(){}) then the plugin will assume
      you are trying to define a class name Child but since it already exists it will throw an error.

      If an abstract class implements an interface the plugin will look to the subclass for all the implementation
       as it would have the complete list of methods (from both itself and the superClass.

       If you initialize a class that relies on an abstract class or interface that has not been defined yet then it
        will throw an error.

        You can hide methods and properties when you define a class that implements an interface (or extends an
         abstract class that implements an interface) however you must make sure that all the methods of the
          interface must be visible ex:

          // assume this test class implements an interface that requires the methods milk & honey. Then the
          // following class would throw an error even though both methods were defined. Since the TestClass returned
          // an object that only had one of the two methods the plugin will assume the other method does not exist
          // since it is hidden.

          function TestClass(){

          this.honey = function(){}
          this.milk = function(){}
          return {
            milk:self.milk
          }
 */
var child = Oriented('Child').instantiateWith('billy');


child.talk();
child.walk();



// Another class that extends Person
Oriented('Engineer',function Engineer(){

    this.work = function(){
        console.log('Watch me do mathy stuff');
        terrible();
    };

    // overiding the base class again
    this.talk = function(){
        console.log('My name is '+this.name+'. I am an engineer');
    };

    this.walk = function(){
        console.log('I move on my segway')
    };

    function terrible(){
        console.log('I make things better...sometimes')
    }


})
    .extends('Person');


var man = Oriented('Engineer').instantiateWith('Nunoff Yoribiznes');

man.talk();
man.work();
man.walk();
console.log("This is what I contain inside me");
console.log(man);
console.log("I also cleverly hid away something special");
// This would give insight into the class the object came from
console.log(man.oriented);
console.log("it's immutable and un-enumerable so my prototype will not show it");

