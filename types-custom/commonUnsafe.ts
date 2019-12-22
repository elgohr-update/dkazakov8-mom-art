import { StoreRoot, StoreConstructorParams } from 'stores/StoreRoot';

export type ActionFirstParams = { store: StoreRoot } & StoreConstructorParams;

export type ConnectedProps = { store?: StoreRoot };
