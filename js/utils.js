/**
 * Native JavaScript utilities to replace lodash methods
 * These functions provide equivalent functionality to commonly used lodash methods
 */

window.FlipletDSProviderUtils = {
  /**
   * Safely get a nested property from an object
   * Replacement for _.get()
   * @param {Object} obj - The object to query
   * @param {string|Array} path - The path to the property (dot notation string or array of keys)
   * @param {*} [defaultValue] - The value returned if the path is not found
   * @returns {*} The resolved value or defaultValue
   */
  get: function(obj, path, defaultValue) {
    if (!obj || typeof obj !== 'object') {
      return defaultValue;
    }
    
    const keys = Array.isArray(path) ? path : path.split('.');
    let result = obj;
    
    for (let i = 0; i < keys.length; i++) {
      if (result == null || typeof result !== 'object') {
        return defaultValue;
      }
      result = result[keys[i]];
    }
    
    return result === undefined ? defaultValue : result;
  },

  /**
   * Find first element matching predicate
   * Replacement for _.find()
   * @param {Array} array - The array to search
   * @param {Function|Object|*} predicate - The function, object, or value to test each element
   * @returns {*} The first matching element or undefined
   */
  find: function(array, predicate) {
    if (typeof predicate === 'function') {
      return array.find(predicate);
    }
    if (Array.isArray(predicate)) {
      // Handle _.find(array, ['id', value]) case
      const [key, value] = predicate;
      return array.find(item => item[key] === value);
    }
    if (typeof predicate === 'object') {
      return array.find(item => {
        for (let key in predicate) {
          if (predicate.hasOwnProperty(key) && item[key] !== predicate[key]) {
            return false;
          }
        }
        return true;
      });
    }
    return array.find(item => item === predicate);
  },

  /**
   * Check if array contains value
   * Replacement for _.includes()
   * @param {Array} array - The array to check
   * @param {*} value - The value to search for
   * @returns {boolean} True if the value is found, false otherwise
   */
  includes: function(array, value) {
    return array.includes(value);
  },

  /**
   * Get array difference
   * Replacement for _.difference()
   * @param {Array} array - The array to filter
   * @param {...Array} values - The values to exclude
   * @returns {Array} A new array with excluded values removed
   */
  difference: function(array, ...values) {
    const excludeSet = new Set(values.flat());
    return array.filter(item => !excludeSet.has(item));
  },

  /**
   * Deep clone object with support for circular references and special types
   * Replacement for _.cloneDeep()
   * @param {*} obj - The value to clone
   * @param {WeakMap} [visited] - Internal parameter for circular reference detection
   * @returns {*} A deep clone of the value
   */
  cloneDeep: function(obj, visited) {
    // Initialize visited WeakMap for circular reference detection
    if (!visited) {
      visited = new WeakMap();
    }
    
    // Handle primitive values and null/undefined
    if (obj == null || typeof obj !== 'object') {
      return obj;
    }
    
    // Handle circular references
    if (visited.has(obj)) {
      return visited.get(obj);
    }
    
    // Handle Date objects
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    
    // Handle RegExp objects
    if (obj instanceof RegExp) {
      return new RegExp(obj.source, obj.flags);
    }
    
    // Handle Arrays
    if (Array.isArray(obj)) {
      const clonedArray = [];
      visited.set(obj, clonedArray);
      for (let i = 0; i < obj.length; i++) {
        clonedArray[i] = this.cloneDeep(obj[i], visited);
      }
      return clonedArray;
    }
    
    // Handle Functions (return reference - cannot be truly cloned)
    if (typeof obj === 'function') {
      return obj;
    }
    
    // Handle DOM elements (return reference - should not be cloned)
    if (obj.nodeType && typeof obj.cloneNode === 'function') {
      return obj;
    }
    
    // Handle plain objects
    const clonedObj = {};
    visited.set(obj, clonedObj);
    
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = this.cloneDeep(obj[key], visited);
      }
    }
    
    return clonedObj;
  },

  /**
   * Map array to new array
   * Replacement for _.map()
   * @param {Array} array - The array to map
   * @param {Function|string} iteratee - The function to call for each element or property path
   * @returns {Array} A new mapped array
   */
  map: function(array, iteratee) {
    if (!array || !Array.isArray(array)) {
      return [];
    }
    if (typeof iteratee === 'string') {
      return array.map(function(item) {
        return this.get(item, iteratee);
      }.bind(this));
    }
    if (typeof iteratee !== 'function') {
      throw new Error('FlipletDSProviderUtils.map: iteratee must be a function or string, got ' + typeof iteratee);
    }
    return array.map(iteratee);
  },

  /**
   * Iterate over collection
   * Replacement for _.forEach()
   * @param {Array|Object} collection - The collection to iterate over
   * @param {Function} iteratee - The function to call for each element
   * @returns {void}
   */
  forEach: function(collection, iteratee) {
    if (Array.isArray(collection)) {
      collection.forEach(iteratee);
    } else if (collection && typeof collection === 'object') {
      Object.keys(collection).forEach(key => iteratee(collection[key], key));
    }
  },

  /**
   * Get unique values from array
   * Replacement for _.uniq()
   * @param {Array} array - The array to process
   * @returns {Array} A new array with unique values
   */
  uniq: function(array) {
    return [...new Set(array)];
  }
}; 