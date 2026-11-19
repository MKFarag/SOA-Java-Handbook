public class AbstractShapeDemo {

    public static abstract class Shape {
        protected final String color;

        public Shape(String color) {
            this.color = color;
        }

        // Abstract method: no implementation; must be overridden by concrete subclass
        public abstract double calculateArea();
        public abstract double calculatePerimeter();

        // Concrete method in abstract class
        public void displayInfo() {
            System.out.printf("Shape Color: %-6s | Area: %6.2f | Perimeter: %6.2f%n",
                    color, calculateArea(), calculatePerimeter());
        }
    }

    public static class Circle extends Shape {
        private final double radius;

        public Circle(String color, double radius) {
            super(color);
            this.radius = radius;
        }

        @Override
        public double calculateArea() {
            return Math.PI * radius * radius;
        }

        @Override
        public double calculatePerimeter() {
            return 2 * Math.PI * radius;
        }
    }

    public static class Rectangle extends Shape {
        private final double width;
        private final double height;

        public Rectangle(String color, double width, double height) {
            super(color);
            this.width = width;
            this.height = height;
        }

        @Override
        public double calculateArea() {
            return width * height;
        }

        @Override
        public double calculatePerimeter() {
            return 2 * (width + height);
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Abstract Class & Concrete Subclasses ===");
        Shape c = new Circle("Red", 5.0);
        Shape r = new Rectangle("Blue", 4.0, 6.0);

        c.displayInfo();
        r.displayInfo();
    }
}
