/**
 * Created by montaque22 on 2/18/15.
 */

//TODO: Merge into One scope
    
var Interface = (function(){
    var InterfaceList={};

    function addIterface(object, interfaceName){
        if(!object.oriented.interfaces){
            object.oriented.interfaces = [];
        }
        if(object.oriented.interfaces.indexOf(interfaceName) === -1){
            object.oriented.interfaces.push(interfaceName)
        }
    }
    return{
        set:function(name, methods) {
            // Protect against bad method calls
            if (arguments.length != 2) {
                throw new Error("Interface constructor called with " + arguments.length + "arguments, but expected exactly 2.");
            }

            // Protect against wrong input types
            else if(typeof name !== 'string' && methods.constructor !== Array){
                throw new Error("This method takes a string as the first parameter and an array of strings as the second parameter");
            }

            // Protect from bad interface and method names
            else if(name.length === 0 || methods.length === 0){
                throw new Error("Ensure that the first parameter is a valid non-empty string and the method contains values");
            }

            // Protect from being overwritten
            else if(InterfaceList[name] && InterfaceList[name].length > 0){
                throw new Error("Interface "+name+" has already been created. You cannot overwrite an interface after its creation");
            }

            InterfaceList[name] = [];

            for(var i = 0;i<methods.length;i++){
                var methodName = methods[i];

                // Protect from bad method types and names
                if(!methodName || typeof methodName !== 'string'){
                    InterfaceList[name] = null;
                    throw new Error(methodName+ " is an invalid method name. Expecting a string ");
                }else{
                    InterfaceList[name].push(methodName);
                }
            }
        },
        get:function(interfaceName){
        if (!interfaceName || typeof interfaceName !== 'string') {
            throw new Error("Function Interface.get called with " + arguments.length + "arguments, but expected 2 arguments.");
            }
            return InterfaceList[interfaceName];
        },
        implements:function(object, interfaceName) {
            // If Abstract, log all the classes the object wants to implement and then leave.
            if(!object.oriented){
                object.oriented = {};
            }
            if(object.oriented && object.oriented.isAbstract){
                return addIterface(object, interfaceName);
            }
            if (typeof interfaceName !== 'string'){
                throw new Error("Expected the second argument to be a string");
            }else if(!object || typeof object !== 'object'){
                throw new Error("Expected the first argument to be an object");
            }
            var methods = InterfaceList[interfaceName];

            for (var i = 0, len = methods.length; i < len; i++) {
                var methodName = methods[i];
                if(!object[methodName] || !(typeof object[methodName] === 'function' || typeof object[methodName] === 'string')){
                    throw new Error("Object "+ object.constructor.name +
                    " does not implement the "+ interfaceName +
                    " interface. Method/Property " + methodName + " was not found.");
                }
            }
            addIterface(object, interfaceName)
            //TODO: allow multiple interfaces to be defined from this method and lock them
        }
    }
})();
Object.preventExtensions(Interface);

Function.prototype.extends = function(superClass, args){

    return Abstract.extends(this, superClass,args);
}


Function.prototype.defineAbstractMethod = function () {
    for(var i = 0; i < arguments.length; i++){
        var methodName = arguments[i];
        if(typeof methodName !== 'string' || !methodName){
            throw new Error('The array given to method defineAbstractMethod does not contain all valid strings')
        }
        this.prototype[methodName] = function(){
            throw new Error("Please Override this method: "+methodName);
        }
    }
};


var Abstract = (function(){
    // Will captur... err ummm protect abstract classes
    var protectedFunctions = {};

    // Private method to store a given abstract class under the name passed
    function protectClass(name, myClass){


        if(protectedFunctions[name]){
            throw new Error('You already created an abstract class named '+ name);
        }

        else{
            Object.defineProperty(myClass.prototype,'oriented',{
                enumerable:false,
                configurable:false,
                writable:true,
                value:{isAbstract:true}
            })
            protectedFunctions[name] = myClass;
            return name;
        }
    }

    // Private method to access the stored abstract class
    function getProtectedClassByObject(wrapper){
        if(wrapper.prototype && wrapper.prototype.id){
            var name = wrapper.prototype.id;
            if(!protectedFunctions[name]){
                throw new Error('This is an invalid abstract class. Perhaps this class was tampered with?');
            }else{
                return protectedFunctions[name];
            }
        }else{
            throw new Error( wrapper.constructor.name + ' is an invalid abstract class');
        }
    }

    // Private method to access the stored abstract class
    function getProtectedClassByName(name){

        if(!protectedFunctions[name]){
            throw new Error('This is an invalid abstract class. Perhaps this class was tampered with?');
        }else{
            return protectedFunctions[name];
        }
    }

     // Recursively merge properties of two objects
    function MergeRecursive(obj1, obj2) {

        for (var p in obj2) {
            try {
                // Property in destination object set; update its value.
                if ( obj2[p].constructor==Object ) {
                    obj1[p] = MergeRecursive(obj1[p], obj2[p]);

                } else {
                    obj1[p] = obj2[p];

                }

            } catch(e) {
                // Property in destination object not set; create it and set its value.
                obj1[p] = obj2[p];

            }
        }

        return obj1;
    }

    return {
        create:function(className, func){

            // Make sure the class name is a valid string
            if(!className || typeof className !== 'string'){
                throw new Error('Invalid input. The first parameter needs to be a valid string');
            }

            // Make sure the function is a valid function
            else if(typeof func !== 'function'){
                throw new Error('Invalid Input. The second parameter needs to be a valid class');
            }

            // Try to protect the class
            protectClass(className, func);

            // return a function to link back the actual function
            var abstractWrapper = function(){
                //Prevent people from instantiating thi
                throw new Error(className + 'is an abstract class. You cannot instantiate an abstract class')
            }

            // Add an id to the mock class
            abstractWrapper.prototype.id = className;

            // Prevent the key from being changed
            Object.freeze(abstractWrapper.prototype);

            return abstractWrapper
        },
        defineAbstractMethod: function(name, args){

            // Make sure the name is valid
            if(typeof name !== 'string' || !name){
                throw new Error('defineAbstractMethod expects the first argument to be an object an abstract object')
            }

            // Make sure the arguments are valid
            else if(!Array.isArray(args)){
                throw new Error('defineAbstractMethod expects the second argument to be an array of strings')
            }

            // Get the protected class
            var protectedClass = getProtectedClassByName(name);

            // Add the methods to the protected class
            for(var i = 0; i < args.length; i++){
                var methodName = args[i];

                // Protect agains bad strings in the array
                if(typeof methodName !== 'string' || !methodName){
                    throw new Error('The array given to method defineAbstractMethod does not contain all valid strings')
                }
                protectedClass.prototype[methodName] = function(){
                    throw new Error("Please Override this method: "+methodName);
                }
            }
        },
        extends:function(subclass, wrappedSuperclass, args){

            // Make sure the parameters are valid
            if(typeof subclass !== 'function' ||
                typeof wrappedSuperclass !== 'function' ||
                !Array.isArray(args)){
                throw new Error('Invalid parameters: The first parameter should be the subclass,'+
                ' the second should be the superclass, and the third the arguments for initialization');
            }

            // get protected class
            var superclass = getProtectedClassByObject(wrappedSuperclass);

            //TODO: Need to use currying to prevent errors from bad initialization;

            // create a temp superclass to gain appropriate scope
            var tempScope = new superclass();

            // Apply proper scope
            superclass.apply(tempScope, args);

            // Generate a Class to mirror the subclass along with the superclass
            var mirror = function(){
                //TODO: When passing arguments apply to the subclass but if the subclass have not arguments then apply to the superclass
                subclass.call(this);
            }

            // Extend
            mirror.prototype = new subclass();

            // Add hidden prototype
            mirror.prototype.oriented = superclass.prototype.oriented;

            // Correct values
            mirror.prototype.oriented.isAbstract = false;
            mirror.prototype.oriented.extendsFrom = wrappedSuperclass.prototype.id;

            // Prevent Prototype from being changed
            Object.freeze(mirror.prototype.oriented);
            Object.defineProperty(mirror.prototype,'oriented',{
                enumerable:false,
                configurable:false,
                writable:false
            });

            // Instantiate new Subclass
            var extendedObject =  new mirror();

            // Merge properties from the superclass
            MergeRecursive(extendedObject, tempScope);

            // Make sure the object conforms to its interface
            if(extendedObject.oriented.interfaces) {
                for(var i = 0; i<extendedObject.oriented.interfaces.length;i++){
                    //TODO Change to allow object to check if it conforms to a given interface
                    Interface.implements(extendedObject, extendedObject.oriented.interfaces[i]);
                }
            }

            return extendedObject;
        }
    }
})()
Object.preventExtensions(Abstract);
