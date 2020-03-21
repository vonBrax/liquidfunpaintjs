/**
 *  * b2IntrusiveListNode is used to implement an intrusive doubly-linked
 * list.
 *
 * For example:
 *
 * class MyClass {
 * public:
 *  MyClass(const char *msg) : m_msg(msg) {}
 *  const char* GetMessage() const { return m_msg; }
 *  B2_INTRUSIVE_LIST_GET_NODE(m_node);
 *  B2_INTRUSIVE_LIST_NODE_GET_CLASS(MyClass, m_node);
 * private:
 *  b2IntrusiveListNode m_node;
 *  const char *m_msg;
 * };
 *
 * int main(int argc, char *argv[]) {
 *  b2IntrusiveListNode list; // NOTE: type is NOT MyClass
 *  MyClass a("this");
 *  MyClass b("is");
 *  MyClass c("a");
 *  MyClass d("test");
 *  list.InsertBefore(a.GetListNode());
 *  list.InsertBefore(b.GetListNode());
 *  list.InsertBefore(c.GetListNode());
 *  list.InsertBefore(d.GetListNode());
 *  for (b2IntrusiveListNode* node = list.GetNext();
 *    node != list.GetTerminator(); node = node->GetNext()) {
 *    MyClass *cls = MyClass::GetInstanceFromListNode(node);
 *    printf("%s\n", cls->GetMessage());
 *  }
 *  return 0;
 * }
 */
declare class IntrusiveListNode {
  // The previous node in the list.
  private prev: IntrusiveListNode;

  // The next node in the list.
  private next: IntrusiveListNode;

  constructor();

  /**
   * Insert this node after the specified node.
   * @param node
   */
  InsertAfter(node: IntrusiveListNode): void;

  /**
   * Insert this node before the specified node.
   * @param node
   */
  InsertBefore(node: IntrusiveListNode): void;

  /**
   * Get the terminator of the list.
   */
  GetTerminator(): IntrusiveListNode;

  /**
   * Remove this node from the list it's currently in.
   */
  Remove(): IntrusiveListNode;

  /**
   * Determine whether this list is empty or the node isn't in a list.
   */
  IsEmpty(): boolean;

  /**
   * Determine whether this node is in a list or the list contains nodes.
   */
  InList(): boolean;

  /**
   * Calculate the length of the list.
   */
  GetLength(): number;

  /**
   * Get the next node in the list.
   */
  GetNext(): IntrusiveListNode;

  /**
   * Get the previous node in the list.
   */
  GetPrevious(): IntrusiveListNode;

  /**
   * If B2_INTRUSIVE_LIST_VALIDATE is 1 perform a very rough validation
   * of all nodes in the list.
   */
  ValidateList(): boolean;

  /**
   * Determine whether the specified node is present in this list.
   * @param nodeToFind
   */
  FindNodeInList(nodeToFind: IntrusiveListNode): boolean;

  /**
   * Initialize the list node.
   */
  private Initialize(): void;
}

/**
 * b2TypedIntrusiveListNode which supports inserting an object into a single
 * doubly linked list.  For objects that need to be inserted in multiple
 * doubly linked lists, use b2IntrusiveListNode.
 *
 * For example:
 *
 * class IntegerItem : public b2TypedIntrusiveListNode<IntegerItem>
 * {
 * public:
 * IntegerItem(int32 value) : m_value(value) { }
 * ~IntegerItem() { }
 * int32 GetValue() const { return m_value; }
 * private:
 * int32 m_value;
 * };
 *
 * int main(int argc, const char *arvg[]) {
 * b2TypedIntrusiveListNode<IntegerItem> list;
 * IntegerItem a(1);
 * IntegerItem b(2);
 * IntegerItem c(3);
 * list.InsertBefore(&a);
 * list.InsertBefore(&b);
 * list.InsertBefore(&c);
 * for (IntegerItem* item = list.GetNext();
 *   item != list.GetTerminator(); item = item->GetNext())
 * {
 *   printf("%d\n", item->GetValue());
 * }
 * }
 */
declare class TypedIntrusiveListNode<T> {
  // Node within an intrusive list.
  private node: IntrusiveListNode;

  constructor();

  /**
   * Insert this object after the specified object.
   * @param obj
   */
  InsertAfter(obj: T): void;

  /**
   * Insert this object before the specified object.
   * @param obj
   */
  InsertBefore(obj: T): void;

  /**
   * Get the next object in the list.
   * Check against GetTerminator() before deferencing the object.
   */
  GetNext(): T;

  /**
   * Get the previous object in the list.
   * Check against GetTerminator() before deferencing the object.
   */
  GetPrevious(): T;

  /**
   * Get the terminator of the list.
   * This should not be dereferenced as it is a pointer to
   * b2TypedIntrusiveListNode<T> *not* T.
   */
  GetTerminator(): T;

  /**
   *  Remove this object from the list it's currently in.
   */
  Remove(): T;

  /**
   * Determine whether this object is in a list.
   */
  InList(): boolean;

  /**
   * Determine whether this list is empty.
   */
  IsEmpty(): boolean;

  /**
   * Calculate the length of the list.
   */
  GetLength(): number;

  /**
   * Get a pointer to the instance of T that contains "node".
   * @param node
   */
  public static GetInstanceFromListNode<T>(node: IntrusiveListNode): T;

  /**
   * Get the offset of m_node within this class.
   * @param node
   */
  private static GetNodeOffset(node: IntrusiveListNode): number;
}
