type EventListener<TEventArgs extends unknown[]> = (...args: TEventArgs) => void;
type ListenerId = number & { readonly _: unique symbol };

export class EventHandler<TEventArgs extends unknown[] = []> {
  private listeners: Map<ListenerId, EventListener<TEventArgs>> = new Map();

  addListener(listener: EventListener<TEventArgs>) {
    const id = this.listeners.size as ListenerId;
    this.listeners.set(id, listener);
  }

  removeListener(id: ListenerId) {
    this.listeners.delete(id);
  }

  notify(...args: TEventArgs) {
    for (const l of this.listeners.values()) {
      l(...args);
    }
  }

  removeAllListeners() {
    this.listeners.clear();
  }
}
