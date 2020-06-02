import { DependencyContainer, container, instanceCachingFactory, FactoryProvider } from "tsyringe";

export function lazyCachingFactory<T>(factory: (dependencyContainer: DependencyContainer) => T): FactoryProvider<T> {
  return {
    useFactory: instanceCachingFactory(container => factory(container))
  };
}