import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

public class OrmEntityValidatorApp {
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    @interface NotEmpty {
        String message() default "Field must not be empty";
    }

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    @interface Range {
        double min();
        double max();
        String message() default "Value out of valid range";
    }

    static class ProductEntity {
        @NotEmpty(message = "Product SKU cannot be blank")
        private final String sku;

        @Range(min = 0.01, max = 10000.0, message = "Price must be between $0.01 and $10,000.00")
        private final double price;

        ProductEntity(String sku, double price) {
            this.sku = sku;
            this.price = price;
        }
    }

    static class ValidationEngine {
        public static List<String> validate(Object entity) throws Exception {
            List<String> violations = new ArrayList<>();
            Class<?> clazz = entity.getClass();

            for (Field field : clazz.getDeclaredFields()) {
                field.setAccessible(true);
                Object val = field.get(entity);

                if (field.isAnnotationPresent(NotEmpty.class) && (val == null || val.toString().trim().isEmpty())) {
                    violations.add(field.getAnnotation(NotEmpty.class).message());
                }

                if (field.isAnnotationPresent(Range.class) && val instanceof Number num) {
                    Range range = field.getAnnotation(Range.class);
                    double d = num.doubleValue();
                    if (d < range.min() || d > range.max()) {
                        violations.add(range.message() + " (Actual: " + d + ")");
                    }
                }
            }
            return violations;
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("Starting ORM Entity Validation Engine...");

        ProductEntity validProduct = new ProductEntity("PROD-882", 149.50);
        ProductEntity invalidProduct = new ProductEntity("", -12.00);

        List<String> errors1 = ValidationEngine.validate(validProduct);
        System.out.println("Valid Product Violations:   " + errors1.size());

        List<String> errors2 = ValidationEngine.validate(invalidProduct);
        System.out.println("Invalid Product Violations: " + errors2.size());
        for (String err : errors2) {
            System.out.println("  - Violation: " + err);
        }
        System.out.println("Entity validation completed successfully.");
    }
}
