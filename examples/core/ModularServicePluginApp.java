import java.util.ArrayList;
import java.util.List;
import java.util.ServiceLoader;

public class ModularServicePluginApp {
    public interface PaymentCodec {
        String format();
        String encode(String payload);
    }

    public static class JsonPaymentCodec implements PaymentCodec {
        @Override
        public String format() { return "JSON"; }
        @Override
        public String encode(String payload) { return "{\"data\": \"" + payload + "\"}"; }
    }

    public static class XmlPaymentCodec implements PaymentCodec {
        @Override
        public String format() { return "XML"; }
        @Override
        public String encode(String payload) { return "<data>" + payload + "</data>"; }
    }

    public static void main(String[] args) {
        System.out.println("Starting Modular Service Discovery App...");

        // Direct registration simulation for environments without META-INF/services packaging
        List<PaymentCodec> registeredCodecs = List.of(
                new JsonPaymentCodec(),
                new XmlPaymentCodec()
        );

        System.out.println("Discovered Codec Plugins: " + registeredCodecs.size());
        for (PaymentCodec codec : registeredCodecs) {
            String encoded = codec.encode("TXN-3001");
            System.out.printf("  Codec [%s] output: %s%n", codec.format(), encoded);
        }

        // Demonstrate ServiceLoader API class presence
        ServiceLoader<PaymentCodec> loader = ServiceLoader.load(PaymentCodec.class);
        System.out.println("ServiceLoader instantiated: " + loader.getClass().getSimpleName());
        System.out.println("Modular Service Plugin App completed successfully.");
    }
}
