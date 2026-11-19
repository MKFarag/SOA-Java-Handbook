public class PolymorphismMechanics {

    public static class Animal {
        public void makeSound() {
            System.out.println("Generic animal vocalization");
        }
    }

    public static class Dog extends Animal {
        @Override
        public void makeSound() {
            System.out.println("Dog barks: Woof Woof!");
        }

        public void fetch() {
            System.out.println("Dog fetches the tennis ball.");
        }
    }

    public static class Cat extends Animal {
        @Override
        public void makeSound() {
            System.out.println("Cat meows: Purr Meow!");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== 1. Upcasting & Dynamic Method Dispatch ===");
        // Heterogeneous polymorphic array
        Animal[] animals = { new Dog(), new Cat(), new Animal() };

        for (Animal a : animals) {
            // JVM executes vtable lookup at runtime: invokes child override!
            a.makeSound();
        }

        System.out.println("\n=== 2. Java 16+ Pattern Matching for instanceof ===");
        for (Animal a : animals) {
            // Modern pattern matching binds variable automatically without explicit cast!
            if (a instanceof Dog d) {
                System.out.println("Identified Dog! Triggering action:");
                d.fetch();
            } else if (a instanceof Cat c) {
                System.out.println("Identified Cat! Ready for nap.");
            } else {
                System.out.println("Identified Unknown Animal type.");
            }
        }
    }
}
