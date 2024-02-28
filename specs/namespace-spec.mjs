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
describe('when creating two valid namespaces', () => {
    it('should have equality between the same namespaces', () => {
        const nsA = new NamespaceA();
        const nsB = new NamespaceA();
        expect(nsA).toBe(nsB);
        expect(nsA).toEqual(nsB);
        expect(`${nsA}`).toBe(`${nsB}`);
    });
    it('should not have equality between different namespaces', () => {
        const nsA = new NamespaceA();
        const nsB = new NamespaceB();
        expect(nsA).not.toBe(nsB);
        expect(nsA).not.toEqual(nsB);
        expect(`${nsA}`).not.toBe(`${nsB}`);
    });
});
describe('when creating a valid namespaces given accessing guid store outside of the security context', () => {
    let error = null;
    beforeAll(() => {
        try {
            const ns = new NamespaceA();
            ns.get({ type: Namespace });
        } catch (err) {
            error = err;
        }
    });
    it('should raise an error', () => {
        expect(error).toBeDefined();
        expect(error).not.toBeNull();
        expect(error.message).toBe('Secure Context Error: failed to get value');
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