import { $mobx, IObservable } from 'mobx';

export function getObservablePath(obs: any) {
  return (obs as IObservable)[$mobx]?.name_.replace(/@.+\./g, '.');
}
