public class CloudStorageService {

    public interface BlobStorageProvider {
        String DEFAULT_REGION = "us-east-1"; // public static final by default

        void upload(String bucket, String key, byte[] content);
        byte[] download(String bucket, String key);
        boolean delete(String bucket, String key);

        default void copy(String srcBucket, String srcKey, String destBucket, String destKey) {
            byte[] data = download(srcBucket, srcKey);
            upload(destBucket, destKey, data);
            System.out.printf("Copied %s/%s -> %s/%s%n", srcBucket, srcKey, destBucket, destKey);
        }
    }

    public static class AwsS3Provider implements BlobStorageProvider {
        @Override
        public void upload(String bucket, String key, byte[] content) {
            System.out.printf("[AWS S3 (%s)] Uploaded %d bytes to %s/%s%n",
                    DEFAULT_REGION, content.length, bucket, key);
        }

        @Override
        public byte[] download(String bucket, String key) {
            System.out.printf("[AWS S3] Downloaded content from %s/%s%n", bucket, key);
            return "Sample Object Payload".getBytes();
        }

        @Override
        public boolean delete(String bucket, String key) {
            System.out.printf("[AWS S3] Deleted %s/%s%n", bucket, key);
            return true;
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Multi-Cloud Storage Adapter Pattern ===");
        BlobStorageProvider storage = new AwsS3Provider();

        storage.upload("production-backups", "db_dump.sql", new byte[1024]);
        storage.copy("production-backups", "db_dump.sql", "archive-backups", "db_dump_archived.sql");
    }
}
