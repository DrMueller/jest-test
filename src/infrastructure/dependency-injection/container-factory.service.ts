import { Container } from 'inversify';

export function createContainer(): Container {
  return new Container({ autoBindInjectable: true, defaultScope: 'Singleton' });
}
