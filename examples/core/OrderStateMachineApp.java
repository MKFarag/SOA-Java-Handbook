import java.util.EnumSet;
import java.util.Set;

public class OrderStateMachineApp {

    public enum OrderState {
        CREATED {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.of(PAID, CANCELLED);
            }
        },
        PAID {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.of(SHIPPED, REFUNDED);
            }
        },
        SHIPPED {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.of(DELIVERED);
            }
        },
        DELIVERED {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.noneOf(OrderState.class); // Terminal state
            }
        },
        CANCELLED {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.noneOf(OrderState.class); // Terminal state
            }
        },
        REFUNDED {
            @Override
            public Set<OrderState> nextValidStates() {
                return EnumSet.noneOf(OrderState.class); // Terminal state
            }
        };

        // Abstract method implemented per constant
        public abstract Set<OrderState> nextValidStates();

        public boolean canTransitionTo(OrderState target) {
            return nextValidStates().contains(target);
        }
    }

    public static class Order {
        private final String orderId;
        private OrderState state;

        public Order(String orderId) {
            this.orderId = orderId;
            this.state = OrderState.CREATED;
        }

        public boolean transition(OrderState nextState) {
            if (state.canTransitionTo(nextState)) {
                System.out.printf("[Order %s] Valid Transition: %s -> %s%n", orderId, state, nextState);
                this.state = nextState;
                return true;
            } else {
                System.out.printf("[Order %s] ILLEGAL Transition Attempt: %s -> %s (Rejected)%n",
                        orderId, state, nextState);
                return false;
            }
        }

        public OrderState getState() { return state; }
    }

    public static void main(String[] args) {
        System.out.println("=== Order State Machine Simulation ===");
        Order order = new Order("ORD-9901");

        // Valid transition
        order.transition(OrderState.PAID);

        // Invalid transition: Cannot jump straight from PAID to DELIVERED without SHIPPED
        order.transition(OrderState.DELIVERED);

        // Valid transition
        order.transition(OrderState.SHIPPED);
        order.transition(OrderState.DELIVERED);

        // Attempting to transition from terminal state
        order.transition(OrderState.CANCELLED);
    }
}
