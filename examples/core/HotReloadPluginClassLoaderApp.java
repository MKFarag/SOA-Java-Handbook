import java.io.ByteArrayOutputStream;
import java.io.InputStream;

public class HotReloadPluginClassLoaderApp {
    // Custom ClassLoader for plugin isolation
    static class IsolatedPluginClassLoader extends ClassLoader {
        private final String pluginName;

        public IsolatedPluginClassLoader(String pluginName, ClassLoader parent) {
            super(parent);
            this.pluginName = pluginName;
        }

        @Override
        protected Class<?> findClass(String name) throws ClassNotFoundException {
            // In a production server, this reads bytes from an encrypted JAR, network, or DB
            String resourcePath = name.replace('.', '/') + ".class";
            try (InputStream is = getResourceAsStream(resourcePath)) {
                if (is == null) {
                    throw new ClassNotFoundException("Plugin resource not found: " + resourcePath);
                }
                ByteArrayOutputStream buffer = new ByteArrayOutputStream();
                byte[] chunk = new byte[1024];
                int bytesRead;
                while ((bytesRead = is.read(chunk)) != -1) {
                    buffer.write(chunk, 0, bytesRead);
                }
                byte[] classBytes = buffer.toByteArray();
                return defineClass(name, classBytes, 0, classBytes.length);
            } catch (Exception e) {
                throw new ClassNotFoundException("Failed to load plugin class: " + name, e);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("Starting Dynamic Plugin ClassLoader App...");

        IsolatedPluginClassLoader pluginLoader1 = new IsolatedPluginClassLoader("Billing-v1", null);
        IsolatedPluginClassLoader pluginLoader2 = new IsolatedPluginClassLoader("Billing-v2", null);

        System.out.println("Plugin Loader 1 Parent: " + pluginLoader1.getParent());
        System.out.println("Plugin Loader 2 Parent: " + pluginLoader2.getParent());
        System.out.println("ClassLoader Isolation:  " + (pluginLoader1 != pluginLoader2));
        System.out.println("Dynamic ClassLoader initialised successfully.");
    }
}
