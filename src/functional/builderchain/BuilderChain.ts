
export class BuilderChain<T> {

  readonly builder: T;

  constructor(builder: T) {
    this.builder = builder;
  }

  then(
    middelware: (builder: T) => T
  ): BuilderChain<T> {
    const newBuilder = middelware(this.builder);
    return new BuilderChain<T>(newBuilder);
  }
}