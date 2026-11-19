import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

/**
 * Topic 51: Executor Framework & Thread Pools - Realistic Application
 * Demonstrates a parallel batch processor executing CPU tasks across a fixed thread pool
 * and collecting Future results.
 */
public class ParallelImageBatchProcessorApp {

    public record ImageTask(String imageName, int pixelWidth, int pixelHeight) {}

    public record ProcessedResult(String imageName, long compressedBytes, long durationMs) {}

    public static class ImageCompressionWorker implements Callable<ProcessedResult> {
        private final ImageTask task;

        public ImageCompressionWorker(ImageTask task) {
            this.task = task;
        }

        @Override
        public ProcessedResult call() throws Exception {
            long start = System.currentTimeMillis();
            // Simulate compression compute time based on pixel dimensions
            long simulatedWorkMs = (task.pixelWidth() * task.pixelHeight()) / 100_000L + 20L;
            Thread.sleep(simulatedWorkMs);
            long compressedSize = (task.pixelWidth() * task.pixelHeight() * 3L) / 10L; // 70% compression
            long duration = System.currentTimeMillis() - start;
            return new ProcessedResult(task.imageName(), compressedSize, duration);
        }
    }

    public static void main(String[] args) throws InterruptedException, ExecutionException {
        List<ImageTask> batch = List.of(
                new ImageTask("hero_banner.png", 1920, 1080),
                new ImageTask("profile_avatar.jpg", 400, 400),
                new ImageTask("thumbnail_preview.png", 200, 200),
                new ImageTask("product_diagram.svg", 1200, 800)
        );

        ExecutorService pool = Executors.newFixedThreadPool(2);
        List<Future<ProcessedResult>> futures = new ArrayList<>();

        System.out.println("Submitting batch of " + batch.size() + " images to fixed pool (size 2)...");
        for (ImageTask task : batch) {
            futures.add(pool.submit(new ImageCompressionWorker(task)));
        }

        System.out.println("\nGathering processing results:");
        for (Future<ProcessedResult> future : futures) {
            ProcessedResult res = future.get(); // Blocks until specific task completes
            System.out.printf("  Processed %-22s -> %,d bytes (Took %dms)%n",
                    res.imageName(), res.compressedBytes(), res.durationMs());
        }

        pool.shutdown();
        pool.awaitTermination(3, TimeUnit.SECONDS);
        System.out.println("Batch processing successfully completed.");
    }
}
