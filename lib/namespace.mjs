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
        const isNamespaceValidArg = (
            namespace !== undefined &&
            namespace !== null &&
            (
                (Array.isArray(namespace) && namespace.length > 0) ||
                (typeof namespace === 'string' && (namespace.replace(/\s/g, '')).length > 0)
            )
        );
        if (!isNamespaceValidArg) {
            throw new Error('The namespace argument is null, undefined or empty');
        }
        const segments = (Array.isArray(namespace) ? namespace : [namespace]);
        REGEX_FULL_NAMESPACE.lastIndex = 0;
        const firstSegment = segments.shift();
        let namespaceStr = segments.reduce((ns, segment) => `${ns}.${segment}`, firstSegment);
        namespaceStr = namespaceStr.toLowerCase();
        let match = REGEX_FULL_NAMESPACE.exec(namespaceStr);
        if (match) {
            super({ namespaceStr });
            super.value = namespaceStr;
            Object.freeze(this);
        } else {
            throw new Error('Invalid namespace format: The namespace argument must adhere to typical naming conventions, which include optional "@" prefixes and multiple segments separated by dots. Example: "@example.namespace.segment"');
        }
    }
}