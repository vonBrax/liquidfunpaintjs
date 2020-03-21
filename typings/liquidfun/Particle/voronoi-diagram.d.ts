/// A field representing the nearest generator from each point.
declare class VoronoiDiagram {
  constructor(allocator: StackAllocator, generatorCapacity: number);

  /// Add a generator.
  /// @param the position of the generator.
  /// @param a tag used to identify the generator in callback functions.
  /// @param whether to callback for nodes associated with the generator.
  AddGenerator(center: Vec2, tag: number, necessary: boolean): void;

  /// Generate the Voronoi diagram. It is rasterized with a given interval
  /// in the same range as the necessary generators exist.
  /// @param the interval of the diagram.
  /// @param margin for which the range of the diagram is extended.
  Generate(radius: number, margin: number): void;

  /// Enumerate all nodes that contain at least one necessary generator.
  /// @param a callback function object called for each node.
  GetNodes(callback: VoronoiDiagram.NodeCallback): void;

  allocator: StackAllocator;
  generatorBuffer: GeneratorFunction;
  generatorCapacity: number;
  generatorCount: number;
  countX: number;
  countY: number;
  diagram: GeneratorFunction;
}

declare namespace VoronoiDiagram {
  // Callback used by GetNodes().
  export class NodeCallback {
    /// Receive tags for generators associated with a node.
    // virtual void operator()(int32 a, int32 b, int32 c) = 0;
  }

  export interface Generator {
    center: Vec2;
    tag: number;
    necessary: boolean;
  }

  export class VoronoiDiagramTask {
    x: number;
    y: number;
    i: number;

    //  Generator* m_generator;
    generator: GeneratorFunction;

    constructor();
    constructor(x: number, y: number, i: number, g: GeneratorFunction);
  }
}
