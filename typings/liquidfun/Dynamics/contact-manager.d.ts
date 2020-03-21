/**
 * Delegate of b2World.
 */
declare class ContactManager {
  broadPhase: BroadPhase;
  contactList: Contact;
  contactCount: number;
  contactFilter: ContactFilter;
  contactListener: ContactListener;
  allocator: BlockAllocator;

  constructor();

  // Broad-phase callback.
  AddPair(proxyUserDataA: void, proxyUserDataB: void): void;

  FindNewContacts(): void;

  Destroy(c: Contact): void;

  Collide(): void;
}
