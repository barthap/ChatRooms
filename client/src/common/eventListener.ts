type EventListener<TEventArgs extends unknown[]> = (...args: TEventArgs) => void;
type ListenerId = number & { readonly _: unique symbol };

export class EventHandler<TEventArgs extends unknown[] = []> {
  private listeners: Map<ListenerId, EventListener<TEventArgs>> = new Map();

  addListener(listener: EventListener<TEventArgs>): ListenerId {
    const id = this.listeners.size as ListenerId;
    this.listeners.set(id, listener);
    return id;
  }

  removeListener(id: ListenerId) {
    this.listeners.delete(id);
  }

  notifyAllListeners(...args: TEventArgs) {
    for (const handler of this.listeners.values()) {
      handler(...args);
    }
  }

  removeAllListeners() {
    this.listeners.clear();
  }
}
