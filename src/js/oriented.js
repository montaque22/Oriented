/**
 * Created by montaque22 on 2/18/15.
 * Updated on 1/20/16
 *
 *
 * Version 2.0
 */
'use strict';

var Oriented = new (function(){

    var classStrorage = {};
    var listOfInterfaces = {};
    var completedClasses = {};

    function getNakedClassString(GeneralizedClassString){
        return GeneralizedClassString
            .substring(GeneralizedClassString.indexOf('{')+1, GeneralizedClassString.lastIndexOf('}'));
    }

    function removeInterface(GeneralizedClass, onComplete){
        var counter = 0;

        var generalClassString =  GeneralizedClass.toString().replace(/(Interface\s*\.\s*implements\s*\(.*\);*)/,function(val) {

            if(counter > 1){
                throw new Error(GeneralizedClass.constructor.name + ' cannot have multiple interface declarations. If you' +
                    ' need to implement multiple interfaces write them on one line in a single implement function ')
            }

            counter++;

            return (typeof onComplete === 'function') ? onComplete(val) : '';
        });

        return createFunctionFromString(generalClassString);

    }

    function createFunctionFromString(GeneralizedClassString){

        var nakedClassString = getNakedClassString(GeneralizedClassString);

        return new Function(nakedClassString);

    }

    function OrientedJS(name, Class){

        if(typeof name !== "string"){
            throw new Error("Orient needs a valid name as an input")
        }else if(Class && typeof Class !== "function"){
            throw new Error("You passed in an invalid function with " + name)
        }

        if(Class){
            if(!classStrorage[name]){
                Object.defineProperty(Class.prototype,'oriented',{
                    enumerable:false,
                    configurable:false,
                    writable:false,
                    value:{extends:'', implements: [], isAbstract:false}
                });
                classStrorage[name] = Class;
            }else{
                throw new Error("The class " + name + " already exists")
            }
        }


        function implementable(){
            var args = Array.prototype.slice.call(arguments);

            // cycle through all the method names and save them to the class
            args.every(function(method) {
                if (typeof method === 'string') {
                    if(!Class.prototype.oriented.implements[method]){
                        Class.prototype.oriented.implements.push(method);
                    }
                    return true;
                }
                throw new Error(method + " is an invalid interface");
            });

            return returnOptions();
        }


        function extendable(abstractClassName){
            if(typeof abstractClassName !== 'string'){
                throw new Error(abstractClassName + " is not a valid input for an abstract" +
                    " class");
            }

            Class.prototype.oriented.extends = abstractClassName;

            return returnOptions();
        }

        function abstractable(){
            Class.prototype.oriented.isAbstract = true;

            return returnOptions();
        }

        function initialize(){
            // Variables
            var args                   = Array.prototype.slice.call(arguments);
            var Class                  = classStrorage[name];
            var finalClassProperties   = [];
            var finalClass             = function(){};
            var extendedClassName;
            var doesImplements;
            var extendedClass;


            // Protect against bad class name or instantiating abstract classes
            // Will immediately return the initialize class if found in cache
            if(!Class){
                throw new Error("Cannot instantiate "+ name+ " because it doesn't exist")
            }else if(Class.prototype.oriented.isAbstract){
                throw new Error("Cannot instantiate "+ name+ " because it is an abstract class")
            }else if(completedClasses[name]){
                return new completedClasses[name](args);
            }

            // Find the class it extends
            extendedClassName  = Class.prototype.oriented.extends;
            extendedClass      = classStrorage[extendedClassName];


            if(extendedClassName){
                // make sure the abstract class requested exists and is abstract
                if(!extendedClass){
                    throw new Error("Cannot extend "+ extendedClassName+ " because it does not exists")
                }else if(!extendedClass.prototype.oriented.isAbstract){
                    throw new Error("Cannot extend "+ extendedClassName+ " because it is not an abstract class")
                }

                // construct a new final class
                finalClass = function(args){
                    extendedClass.apply(this, args);
                    var hasReturn = Class.apply(this, args);

                    if(hasReturn){
                        if(typeof hasReturn === 'object'){

                            Object.defineProperty(hasReturn,'oriented',{
                                enumerable:false,
                                configurable:false,
                                writable:false,
                                value:{extends:extendedClassName, implements: Class.prototype.oriented.implements, isAbstract:false}
                            });
                            Object.freeze(hasReturn.constructor.prototype.oriented);
                        }
                        return hasReturn;
                    }

                };

                // set the prototype to the class requested
                finalClass.prototype = Object.create(Class.prototype);
                // merge the interfaces of both the subclass and superclass
                finalClass.prototype.oriented.implements = Class.prototype.oriented.implements.concat(extendedClass.prototype.oriented.implements);
                // set the constructor to the subclass
                finalClass.constructor = Class;
            }

            // Protect against the final class not needing to be extended
            if(!finalClass.prototype.oriented){
                finalClass = function(args){
                    var hasReturn = Class.apply(this, args);

                    if(hasReturn){
                        if(typeof hasReturn === 'object'){

                            Object.defineProperty(hasReturn,'oriented',{
                                enumerable:false,
                                configurable:false,
                                writable:false,
                                value:{extends:'', implements: Class.prototype.oriented.implements, isAbstract:false}
                            });
                            Object.freeze(hasReturn.constructor.prototype.oriented);
                        }
                        return hasReturn;
                    }
                };
                // set the prototype to the class requested
                finalClass.prototype = Object.create(Class.prototype);

                // set the constructor to the subclass
                finalClass.constructor = Class;
            }

            // get all the interfaces
            doesImplements = finalClass.prototype.oriented.implements;

            if(doesImplements.length){
                // get all the properties for the final class
                finalClassProperties = Object.keys(new finalClass(args));

                // cycle through all the interface names
                doesImplements.forEach(function(iFace){
                    // grab the methods names described for the interfaces
                    var methods = listOfInterfaces[iFace];

                    // protect against bad interface names
                    if(!methods){
                        throw new Error(name + " implements "+ iFace + " but we cannot find its definition")
                    }

                    // make sure each method is present for the final class by comparing the method names in the interface
                    // list with the names of the properties of the final class
                    methods.forEach(function(method){
                        if(finalClassProperties.indexOf(method) === -1){
                            throw new Error(name + " has an incomplete implementation of " + iFace+". It is missing" +
                                " the method " + method);
                        }
                    })
                })
            }

            Object.freeze(finalClass.prototype.oriented);

            completedClasses[name] = finalClass;

            return new finalClass(args);
        }

        function defineInterface(){
            var methods = Array.prototype.slice.apply(arguments);

            if(listOfInterfaces[name]){
                throw new Error(name + " interface has already been defined")
            }

            if(methods.length >= 2){
                methods.forEach(function(method){
                    if(typeof method !== "string"){
                        throw new Error(method + " is not a valid type for an interface name")
                    }
                })
            }
            listOfInterfaces[name] = methods;
        }

        function returnOptions() {
            var methods;
            function fullOptions() {
                return {
                    implements: implementable,
                    extends: extendable,
                    isAbstract: abstractable
                }
            }

            function partialOptions() {
                return {
                    implements: implementable
                }
            }

            if(!Class){
                methods = {
                    instantiateWith:initialize,
                    defineInterface: defineInterface
                }
            }else{
                methods = (Class.prototype.oriented.isAbstract || Class.prototype.oriented.extends) ? partialOptions(): fullOptions();
            }

            Object.preventExtensions(methods);
            Object.freeze(methods);
            return methods;
        }
        return returnOptions();

    }

    return OrientedJS;

})();

if(typeof module !== 'undefined' && this.module !== module && module.exports)
    module.exports = Oriented;
