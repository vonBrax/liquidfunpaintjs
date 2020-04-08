declare interface TOIInput {
  proxyA: DistanceProxy;
  proxyB: DistanceProxy;
  sweepA: Sweep;
  sweepB: Sweep;
  tMax: number; // defines sweep interval [0, tMax]
}

declare namespace TOIOutput {
  enum State {
    unknown,
    failed,
    overlapped,
    touching,
    separated,
  }
}
declare interface TOIOutput {
  state: TOIOutput.State;
  t: number;
}

declare function TimeOfImput(output: TOIOutput, input: TOIInput): void;
