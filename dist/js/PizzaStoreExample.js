/**
 * Created by montaque22 on 2/23/15.
 */

/* Demonstrating a pretty decent Factory Pattern which is made */




/*
Create a class called Pizza that implements iPizza (Defined later)
 */
Oriented('Pizza',function Pizza(name){


    this.name = name;

    this.prepare = function(){console.log('Preparing the '+this.name+' pizza');};
    this.bake = function(){console.log('Baking at 350 degrees');};
    this.cut = function(){console.log('Cutting through the deliciousness');};
    this.package = function(){console.log('Boxing the '+this.name+' pizza');};
    this.deliver = function(){console.log('Delivering our masterpiece');};


})
    .implements('iPizza');



/*
    Defined a class named MiamiPizzaStore that extended (subclassed) the abstract class named PizzaStore (defined later)
 */
Oriented('MiamiPizzaStore', function (){

    var self = this;

    this.createPizza = function (pizzaStyle){
        return new Oriented('Pizza').instantiateWith(pizzaStyle);
    };


    return {orderPizza:self.orderPizza};
})
    .extends('PizzaStore');

/*
 Define an abstract class named PizzaStore that implements iPizzaStore (defined later)
 */
Oriented('PizzaStore',function (){

    var self = this;

    this.orderPizza = function(type){
        var pizza =  self.createPizza(type);
        pizza.prepare();
        pizza.bake();
        pizza.cut();
        pizza.package();
        pizza.deliver();
        return pizza;
    };


})
    .isAbstract()
    .implements('iPizzaStore');

/*
 -Define  the interfaces
 */
Oriented('iPizzaStore').defineInterface('orderPizza');
Oriented('iPizza').defineInterface('prepare','bake','cut','package','deliver');

// instantiate
var miamiPizzaStore = Oriented('MiamiPizzaStore').instantiateWith();

//calling a method that was defined in the superclass
var pizza = miamiPizzaStore.orderPizza('Tropical Style');

console.log('I now have a tasty ' + pizza.name +' pizza');
