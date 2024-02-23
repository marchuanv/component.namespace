import { Namespace } from '../registry.mjs';
class NamespaceA extends Namespace {
    constructor(segments = []) {
        segments.push('SegmentA');
        return super(segments);
    }
}
class NamespaceB extends NamespaceA {
    constructor(segments = []) {
        segments.push('SegmentB');
        return super(segments);
    }
}
class InvalidNamespace extends NamespaceB {
    constructor() {
        return super(['$##@.%#$%']);
    }
}
describe('when creating a valid namespace', () => {
    it('should have equality between two of the same namespaces', () => {
        const id = new NamespaceA();
        const id2 = new NamespaceA();
        expect(id).toBeDefined();
        expect(id).not.toBeNull();
        expect(id2).toBeDefined();
        expect(id2).not.toBeNull();
        expect(id).toBe(id2);
        expect(id).toEqual(id2);
        expect(id.value).toBe(id2.value);
    });
    it('should not have equality between two different namespaces', () => {
        const id = new NamespaceB();
        const id2 = new NamespaceA();
        expect(id).toBeDefined();
        expect(id).not.toBeNull();
        expect(id2).toBeDefined();
        expect(id2).not.toBeNull();
        expect(id).not.toBe(id2);
        expect(id).not.toEqual(id2);
        expect(id.value).not.toBe(id2.value);
    });
});
describe('when creating an invalid namespace given a namespace of "part.$##@.%#$%"', () => {
    let error = null;
    beforeAll(() => {
        try {
            new InvalidNamespace();
        } catch (err) {
            error = err;
        }
    });
    it('should raise an error', () => {
        expect(error).toBeDefined();
        expect(error).not.toBeNull();
        expect(error.message).toBe('Invalid namespace format: The namespace argument must adhere to typical naming conventions, which include optional "@" prefixes and multiple segments separated by dots. Example: "@example.namespace.segment"')
    });
});