package com.handbook.spring;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Topic 95: Spring Data JPA Architecture, Repository Hierarchy & JpaRepository
 * 
 * Demonstrates:
 * 1. The Repository Interface Hierarchy: Repository -> CrudRepository -> PagingAndSortingRepository -> JpaRepository.
 * 2. Dynamic Runtime Proxy Generation via JdkDynamicAopProxy simulating Spring Data JPA repository factories.
 * 3. JPA EntityManager Lifecycle States: TRANSIENT, MANAGED, DETACHED, and REMOVED.
 * 4. Dirty-checking mechanism, flush behavior, and transactional persistence context emulation.
 */
public class SpringDataJpaRepositoryDemo {

    // --- 1. Entity Definition & Lifecycle State ---
    public enum EntityState { TRANSIENT, MANAGED, DETACHED, REMOVED }

    public static class Account {
        private Long id;
        private String ownerName;
        private double balance;
        private EntityState state = EntityState.TRANSIENT;

        public Account(Long id, String ownerName, double balance) {
            this.id = id;
            this.ownerName = ownerName;
            this.balance = balance;
            this.state = EntityState.TRANSIENT;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getOwnerName() { return ownerName; }
        public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
        public double getBalance() { return balance; }
        public void setBalance(double balance) { this.balance = balance; }
        public EntityState getState() { return state; }
        public void setState(EntityState state) { this.state = state; }

        @Override
        public String toString() {
            return String.format("Account[id=%d, owner='%s', balance=$%.2f, state=%s]",
                    id, ownerName, balance, state);
        }
    }

    // --- 2. Spring Data Repository Interface Hierarchy ---
    public interface Repository<T, ID> {}

    public interface CrudRepository<T, ID> extends Repository<T, ID> {
        T save(T entity);
        Optional<T> findById(ID id);
        Iterable<T> findAll();
        long count();
        void deleteById(ID id);
    }

    public interface PagingAndSortingRepository<T, ID> extends Repository<T, ID> {
        Iterable<T> findAllSorted(String sortBy, boolean ascending);
        List<T> findPaged(int pageNumber, int pageSize);
    }

    public interface JpaRepository<T, ID> extends CrudRepository<T, ID>, PagingAndSortingRepository<T, ID> {
        void flush();
        <S extends T> List<S> saveAll(Iterable<S> entities);
        T getReferenceById(ID id);
    }

    // Custom Application Repository
    public interface AccountRepository extends JpaRepository<Account, Long> {
        Optional<Account> findByOwnerName(String name);
    }

    // --- 3. SimpleJpaRepository Implementation & Invocation Proxy ---
    public static class SimpleJpaRepository<T, ID> implements JpaRepository<T, ID> {
        private final Map<ID, T> persistenceContext = new ConcurrentHashMap<>();
        private final Map<ID, T> snapshotContext = new ConcurrentHashMap<>();

        @Override
        public T save(T entity) {
            if (entity instanceof Account acc) {
                if (acc.getId() == null) {
                    acc.setId(System.nanoTime() % 100000);
                }
                acc.setState(EntityState.MANAGED);
                persistenceContext.put((ID) acc.getId(), (T) acc);
                // Snapshot for dirty checking
                Account snapshot = new Account(acc.getId(), acc.getOwnerName(), acc.getBalance());
                snapshot.setState(EntityState.MANAGED);
                snapshotContext.put((ID) acc.getId(), (T) snapshot);
                return (T) acc;
            }
            return entity;
        }

        @Override
        public Optional<T> findById(ID id) {
            T found = persistenceContext.get(id);
            if (found instanceof Account acc && acc.getState() == EntityState.MANAGED) {
                return Optional.of(found);
            }
            return Optional.empty();
        }

        @Override
        public Iterable<T> findAll() {
            return new ArrayList<>(persistenceContext.values());
        }

        @Override
        public long count() {
            return persistenceContext.size();
        }

        @Override
        public void deleteById(ID id) {
            T removed = persistenceContext.remove(id);
            if (removed instanceof Account acc) {
                acc.setState(EntityState.REMOVED);
            }
            snapshotContext.remove(id);
        }

        @Override
        public Iterable<T> findAllSorted(String sortBy, boolean ascending) {
            List<T> list = new ArrayList<>(persistenceContext.values());
            if ("balance".equalsIgnoreCase(sortBy)) {
                list.sort((a, b) -> {
                    double b1 = ((Account) a).getBalance();
                    double b2 = ((Account) b).getBalance();
                    return ascending ? Double.compare(b1, b2) : Double.compare(b2, b1);
                });
            }
            return list;
        }

        @Override
        public List<T> findPaged(int pageNumber, int pageSize) {
            List<T> all = new ArrayList<>(persistenceContext.values());
            int from = Math.min(pageNumber * pageSize, all.size());
            int to = Math.min(from + pageSize, all.size());
            return all.subList(from, to);
        }

        @Override
        public void flush() {
            int dirtyCount = 0;
            for (Map.Entry<ID, T> entry : persistenceContext.entrySet()) {
                Account curr = (Account) entry.getValue();
                Account snap = (Account) snapshotContext.get(entry.getKey());
                if (snap != null && (curr.getBalance() != snap.getBalance() || !curr.getOwnerName().equals(snap.getOwnerName()))) {
                    dirtyCount++;
                    // synchronize snapshot
                    snap.setBalance(curr.getBalance());
                    snap.setOwnerName(curr.getOwnerName());
                }
            }
            System.out.printf("  [JpaFlush] Flushed changes to persistent store (%d dirty entities synchronized).\n", dirtyCount);
        }

        @Override
        public <S extends T> List<S> saveAll(Iterable<S> entities) {
            List<S> res = new ArrayList<>();
            for (S e : entities) {
                res.add((S) save(e));
            }
            return res;
        }

        @Override
        public T getReferenceById(ID id) {
            T found = persistenceContext.get(id);
            if (found == null) {
                throw new NoSuchElementException("Entity not found for id: " + id);
            }
            return found;
        }
    }

    // --- 4. Dynamic Repository Proxy Factory ---
    public static class RepositoryFactorySupport {
        @SuppressWarnings("unchecked")
        public static <T> T createRepository(Class<T> repositoryInterface) {
            SimpleJpaRepository<Account, Long> target = new SimpleJpaRepository<>();

            return (T) Proxy.newProxyInstance(
                    repositoryInterface.getClassLoader(),
                    new Class<?>[]{repositoryInterface},
                    new InvocationHandler() {
                        @Override
                        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                            String methodName = method.getName();
                            // Check if method exists in SimpleJpaRepository
                            try {
                                Method targetMethod = SimpleJpaRepository.class.getMethod(methodName, method.getParameterTypes());
                                return targetMethod.invoke(target, args);
                            } catch (NoSuchMethodException e) {
                                // Dynamic derived query emulation
                                if ("findByOwnerName".equals(methodName) && args != null && args.length > 0) {
                                    String name = (String) args[0];
                                    for (Account acc : target.persistenceContext.values()) {
                                        if (acc.getOwnerName().equalsIgnoreCase(name)) {
                                            return Optional.of(acc);
                                        }
                                    }
                                    return Optional.empty();
                                }
                                throw new UnsupportedOperationException("Unsupported repository method: " + methodName);
                            }
                        }
                    }
            );
        }
    }

    // --- 5. Main Execution and Assertions ---
    public static void main(String[] args) {
        System.out.println("================================================================================");
        System.out.println("Topic 95: Spring Data JPA Architecture, Repository Hierarchy & JpaRepository");
        System.out.println("================================================================================");

        // 1. Instantiate Repository Proxy via Spring Data Factory
        AccountRepository repository = RepositoryFactorySupport.createRepository(AccountRepository.class);
        System.out.println("1. Created Dynamic JdkDynamicAopProxy for AccountRepository interface.");

        // 2. Lifecycle: Transient to Managed via save()
        Account acc1 = new Account(101L, "Alice Johnson", 4500.0);
        System.out.println("2. Entity before persist: " + acc1);
        assert acc1.getState() == EntityState.TRANSIENT : "Entity must start in TRANSIENT state";

        repository.save(acc1);
        System.out.println("   Entity after repository.save(): " + acc1);
        assert acc1.getState() == EntityState.MANAGED : "Entity must transition to MANAGED state";

        Account acc2 = new Account(102L, "Bob Smith", 12000.50);
        Account acc3 = new Account(103L, "Carol White", 8900.0);
        repository.saveAll(List.of(acc2, acc3));
        assert repository.count() == 3 : "Repository should contain exactly 3 accounts";
        System.out.println("   Total managed accounts in repository: " + repository.count());

        // 3. Derived method query through proxy
        Optional<Account> foundBob = repository.findByOwnerName("Bob Smith");
        assert foundBob.isPresent() && foundBob.get().getId().equals(102L) : "Dynamic derived query failed";
        System.out.println("3. Derived Query findByOwnerName('Bob Smith'): " + foundBob.get());

        // 4. Dirty Checking & Flush simulation
        Account managedAlice = repository.findById(101L).orElseThrow();
        managedAlice.setBalance(5200.00); // mutate in memory
        System.out.println("4. Mutated Alice's balance in memory: " + managedAlice);
        repository.flush(); // triggers dirty check detection

        // 5. Paging and Sorting
        Iterable<Account> sorted = repository.findAllSorted("balance", false);
        System.out.println("5. Sorted accounts by balance descending:");
        double previous = Double.MAX_VALUE;
        for (Account a : sorted) {
            System.out.println("   - " + a);
            assert a.getBalance() <= previous : "Sorting order violation";
            previous = a.getBalance();
        }

        // 6. Delete & State Transition to REMOVED
        repository.deleteById(103L);
        assert acc3.getState() == EntityState.REMOVED : "Entity state must be REMOVED after deletion";
        assert repository.count() == 2 : "Count should be 2 after deletion";
        System.out.println("6. Deleted Account 103: " + acc3);

        System.out.println("\n[SUCCESS] Topic 95 Spring Data JPA Architecture demo executed successfully!");
        System.out.println("================================================================================");
    }
}
