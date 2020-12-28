declare namespace LiquidFun {
  export class PolygonContact extends Contact {
    static Create(
      fixtureA: Fixture,
      indexA: number,
      fixtureB: Fixture,
      indexB: number,
      allocator: BlockAllocator,
    ): Contact;

    /**
     * @todo
     * TypeScript will complain if we don't duplicate
     * all overloads from a base class (Contact) methods.
     * Check if there is a way to only include the methods
     * that we want to override, based on the signature?
     */
    static Destroy(
      contact: Contact,
      typeA: Shape.Type,
      typeB: Shape.Type,
      allocator: BlockAllocator,
    ): void;

    static Destroy(contact: Contact, allocator: BlockAllocator): void;

    constructor(fixtureA: Fixture, fixtureB: Fixture);

    Evaluate(manifold: Manifold, xfA: Transform, xfB: Transform): void;
  }
}
