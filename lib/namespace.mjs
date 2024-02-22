import { GUID } from '../registry.mjs';
const REGEX_FULL_NAMESPACE = /^(@?[a-zA-Z]\w*(?:\.@?[a-zA-Z]\w*)*)$/;
const privateBag = new WeakMap();
export class Namespace {
    /**
     * @param { String } namespace
     * @returns { Namespace }
    */
    constructor(namespace) {
        const targetClass = new.target;
        if (targetClass !== Namespace) {
            throw new Error(`${Namespace.name} is a sealed class`);
        }
        Object.freeze(this);
        REGEX_FULL_NAMESPACE.lastIndex = 0;
        let match = REGEX_FULL_NAMESPACE.exec(namespace);
        if (match) {
            const Id = new GUID({ namespace });
            if (privateBag.has(Id)) {
                return privateBag.get(Id);
            } else {
                privateBag.set(Id, this);
            }
            privateBag.set(this, Id);
        } else {
            throw new Error('Invalid namespace format: The namespace argument must adhere to typical naming conventions, which include optional "@" prefixes and multiple segments separated by dots. Example: "@example.namespace.segment"');
        }
    }
    /**
     * @returns { GUID }
    */
    get Id() {
        return privateBag.get(this);
    }
    toString() {
        return this.Id.toString();
    }
}