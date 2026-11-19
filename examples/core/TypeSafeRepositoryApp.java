import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Topic 33: Generics Fundamentals - Realistic Application
 * Demonstrates a generic repository architecture enforcing compile-time type safety.
 */
public class TypeSafeRepositoryApp {

    public interface Identifiable<ID> {
        ID getId();
    }

    public static class Repository<T extends Identifiable<ID>, ID> {
        private final List<T> storage = new ArrayList<>();

        public void save(T entity) {
            storage.removeIf(item -> item.getId().equals(entity.getId()));
            storage.add(entity);
        }

        public Optional<T> findById(ID id) {
            for (T item : storage) {
                if (item.getId().equals(id)) {
                    return Optional.of(item);
                }
            }
            return Optional.empty();
        }

        public List<T> findAll() {
            return new ArrayList<>(storage);
        }

        public int count() {
            return storage.size();
        }
    }

    public static class CustomerAccount implements Identifiable<Long> {
        private final Long accountId;
        private final String customerName;
        private final double balance;

        public CustomerAccount(Long accountId, String customerName, double balance) {
            this.accountId = accountId;
            this.customerName = customerName;
            this.balance = balance;
        }

        @Override
        public Long getId() {
            return accountId;
        }

        public String getCustomerName() {
            return customerName;
        }

        public double getBalance() {
            return balance;
        }

        @Override
        public String toString() {
            return "Customer[id=" + accountId + ", name=" + customerName + ", balance=$" + String.format("%.2f", balance) + "]";
        }
    }

    public static void main(String[] args) {
        Repository<CustomerAccount, Long> accountRepo = new Repository<>();

        accountRepo.save(new CustomerAccount(101L, "Alice Morgan", 1450.50));
        accountRepo.save(new CustomerAccount(102L, "David Chen", 3200.75));

        System.out.println("Repository Count: " + accountRepo.count());

        Optional<CustomerAccount> found = accountRepo.findById(101L);
        found.ifPresent(account -> System.out.println("Retrieved Account: " + account));

        Optional<CustomerAccount> missing = accountRepo.findById(999L);
        System.out.println("Missing Account Found: " + missing.isPresent());
    }
}
