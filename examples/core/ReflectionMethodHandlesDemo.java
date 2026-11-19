import java.lang.invoke.MethodHandle;
import java.lang.invoke.MethodHandles;
import java.lang.invoke.MethodType;
import java.lang.reflect.Field;
import java.lang.reflect.Method;

public class ReflectionMethodHandlesDemo {
    static class AccountSecurityToken {
        private String secretKey = "VAULT_9941";

        private String generateDigest(String salt) {
            return "DIGEST[" + secretKey + ":" + salt + "]";
        }
    }

    public static void main(String[] args) throws Throwable {
        System.out.println("=== 1. Classic Reflection API ===");
        AccountSecurityToken token = new AccountSecurityToken();
        Class<?> clazz = token.getClass();

        // Inspect and modify private field
        Field secretField = clazz.getDeclaredField("secretKey");
        secretField.setAccessible(true);
        System.out.println("Original Private Field: " + secretField.get(token));
        secretField.set(token, "VAULT_8800_UPDATED");
        System.out.println("Modified Private Field: " + secretField.get(token));

        // Invoke private method via Reflection
        Method privateMethod = clazz.getDeclaredMethod("generateDigest", String.class);
        privateMethod.setAccessible(true);
        String reflectionResult = (String) privateMethod.invoke(token, "SALT-44");
        System.out.println("Reflection Method Invocation: " + reflectionResult);

        System.out.println("\n=== 2. java.lang.invoke.MethodHandles (Modern JIT Invocation) ===");
        MethodHandles.Lookup lookup = MethodHandles.lookup();
        MethodType methodType = MethodType.methodType(String.class, String.class);
        MethodHandle handle = lookup.findVirtual(AccountSecurityToken.class, "generateDigest", methodType);

        String handleResult = (String) handle.invokeExact(token, "SALT-99");
        System.out.println("MethodHandle invokeExact:    " + handleResult);
    }
}
