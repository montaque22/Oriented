/*
    This is a test class to show how oriented.js works.

     This will demonstrate the following
        - How to create an Interface
        - How to declare that a class implements an Interface
        - How to declare a class as Abstract
        - How to extend an Abstract class
        - How to define an abstract method

 */


/*
 --- HOW TO DEFINE AN INTERFACE---
 The first argument is the name of the interface
 while the second parameter is an array of
 methods/properties that the interface contains
 */

Interface.set('iPerson',["talk","work"]);

/*
 --- HOW TO DEFINE AN ABSTRACT CLASS---
 This method takes a string as the name of the abstract class
 and the function that will be the superclass
 As a result, it will pass a mock class that will be used
 when the user want to create a class that extends it

 NOTE: The passed in class will be prevented to instantiate (newed) itself.
 */
var Person = Abstract.create('Person',function(name){

    /*
         --- HOW TO DEFINE AN ABSTRACT METHOD---
         Injects abstract methods into Person Class.
         If the subclass does not override this method it will throw an error when it is accessed.
         NOTE: Alternatively you can just create an empty method (this.methodName = function(){};
         however, with the method below, it will apply an error when the empty function is called.
     */

    Abstract.defineAbstractMethod('Person', ['play']);

    // Just an ordinary property
    this.name = name;

    // just an ordinary method, however...
    // this method is required by the iPerson interface, which is called at the end of this constructor
    this.move = function(){
        console.log('I can walk, run, swim, crawl, jump, and climb');
    };

    /*
        --- HOW TO DECLARE THAT A CLASS IMPLEMENTS AN INTERFACE ---
        Ensures that this object (Person) implements iPerson
        If this class is abstract then it will check its
        subclasses to ensure that they implement iPerson
    */
    Interface.implements(this, 'iPerson');
})


// Test Class (Soon to be Subclass)
function Engineer(){
    this.work = function(){
        console.log('I do math stuff');
    };
    this.talk = function(){
        console.log('I am an engineer');
    };
}

/*
    --- HOW TO EXTEND AN ABSTRACT CLASS ---
     Will only extend the class if the superclass (Person) is declared as Abstract
     This will merge all the properties of Person into Engineer
     and if Person implements an interface, it will make sure Engineer conforms to its contract.
     ----------- NOTE --------
     This method takes in the Abstract Class - Person -
     and an array of arguments to be passed into the Constructor during initialization
 */
var man = Engineer.extends(Person, ['Krillin']);


