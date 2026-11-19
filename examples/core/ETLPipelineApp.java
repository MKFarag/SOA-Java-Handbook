import java.util.ArrayList;
import java.util.List;

public class ETLPipelineApp {

    // Template Method Pattern via Abstract Class
    public static abstract class AbstractDataPipeline {
        private final String pipelineName;

        public AbstractDataPipeline(String name) {
            this.pipelineName = name;
        }

        // The Template Method: Final to prevent subclasses from altering the pipeline execution sequence
        public final void runPipeline() {
            System.out.println("\n--- Starting Pipeline: " + pipelineName + " ---");
            List<String> rawData = extract();
            List<String> transformedData = transform(rawData);
            load(transformedData);
            System.out.println("Pipeline " + pipelineName + " completed successfully.");
        }

        protected abstract List<String> extract();
        protected abstract List<String> transform(List<String> raw);
        protected abstract void load(List<String> transformed);
    }

    public static class CsvUserPipeline extends AbstractDataPipeline {
        public CsvUserPipeline() {
            super("CSV-User-Ingest");
        }

        @Override
        protected List<String> extract() {
            System.out.println("Extracting raw lines from CSV storage...");
            return List.of("101,john_doe,ACTIVE", "102,jane_smith,SUSPENDED");
        }

        @Override
        protected List<String> transform(List<String> raw) {
            System.out.println("Normalizing user records to uppercase JSON...");
            List<String> result = new ArrayList<>();
            for (String line : raw) {
                String[] parts = line.split(",");
                result.add(String.format("{\"id\":%s,\"user\":\"%s\",\"status\":\"%s\"}",
                        parts[0], parts[1].toUpperCase(), parts[2]));
            }
            return result;
        }

        @Override
        protected void load(List<String> transformed) {
            System.out.println("Loading records into Data Warehouse:");
            for (String item : transformed) {
                System.out.println("  INSERT -> " + item);
            }
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Abstract ETL Data Pipeline Framework ===");
        AbstractDataPipeline pipeline = new CsvUserPipeline();
        pipeline.runPipeline();
    }
}
