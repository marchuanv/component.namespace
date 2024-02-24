import { GUID } from '../registry.mjs';
const REGEX_FULL_NAMESPACE = /^(@?[a-zA-Z]\w*(?:\.@?[a-zA-Z]\w*)*)$/;
export class Namespace extends GUID {
    /**
     * @param { String | Array<String> } namespace
     * @returns { Namespace }
    */
    constructor(namespace) {
        const targetClass = new.target;
        if (targetClass === Namespace) {
            throw new Error(`${Namespace.name} is an abstract class`);
        }
        // Validate namespace argument
        if (namespace === undefined || namespace === null || (typeof namespace !== 'string' && !Array.isArray(namespace))) {
            throw new Error('The namespace argument is null, undefined, or not a valid type');
        }
        // If namespace is not an array, convert it to an array of one element
        const segments = (Array.isArray(namespace) ? namespace : [String(namespace)]);
        // Construct namespace string
        const namespaceStr = segments.join('.').toLowerCase();
        // Check if namespace format is valid
        REGEX_FULL_NAMESPACE.lastIndex = 0;
        if (!REGEX_FULL_NAMESPACE.test(namespaceStr)) {
            throw new Error('Invalid namespace format: The namespace argument must adhere to typical naming conventions, which include optional "@" prefixes and multiple segments separated by dots. Example: "@example.namespace.segment"');
        }
        // Set namespace string as GUID value
        super({ namespace });
        super.set({ type: Namespace }, namespaceStr);
        // Freeze the instance
        Object.freeze(this);
    }
    /**
     * @returns { String }
    */
    toString() {
        const IdStr = super.toString();
        const namespace = super.get({ type: Namespace });
        return JSON.stringify({
            Id: IdStr,
            namespace
        });
    }
}